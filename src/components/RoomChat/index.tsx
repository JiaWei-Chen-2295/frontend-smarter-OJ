import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Input, 
  Button, 
  Space, 
  Typography, 
  Divider,
  Spin,
  message,
  Card,
  Row,
  Col,
  Tag,
  Tooltip,
  Tabs
} from 'antd';
import { 
  SendOutlined, 
  ReloadOutlined,
  WifiOutlined,
  DisconnectOutlined,
  LoadingOutlined,
  MessageOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../../context/store';
import { 
  webSocketManager, 
  WebSocketChatService, 
  WebSocketMessage, 
  ConnectionStatus,
  OnlineUser,
  MessageStatus,
  MessageType
} from '../../services/websocket';
import ChatMessage from '../ChatMessage';
import OnlineUserList from '../OnlineUserList';
import RoomCodeCollaboration from '../RoomCodeCollaboration';
import './index.css';

const { TextArea } = Input;
const { Text } = Typography;

interface RoomChatProps {
  roomId: string;
  roomLeaderId?: string;
  visible?: boolean;
}

const RoomChat: React.FC<RoomChatProps> = ({ 
  roomId, 
  roomLeaderId,
  visible = true 
}) => {
  const currentUser = useSelector((state: RootState) => state.User.currentUser);
  
  // 状态管理
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  
  // Refs
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const wsServiceRef = useRef<WebSocketChatService | null>(null);
  const isConnectingRef = useRef(false);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // 添加消息
  const addMessage = useCallback((newMessage: WebSocketMessage) => {
    // 过滤 ACK 消息，不显示在聊天窗口中
    if (newMessage.type === 'ack') {
      // 处理 ACK，更新对应消息的状态
      setMessages(prevMessages => {
        const messageId = (newMessage.data as any)?.messageId;
        if (!messageId) return prevMessages;
        
        return prevMessages.map(msg => {
          const msgId = (msg.data as any)?.messageId;
          if (msgId === messageId && msg.status !== MessageStatus.DELIVERED) {
            return { ...msg, status: MessageStatus.DELIVERED };
          }
          return msg;
        });
      });
      return;
    }
    
    // 过滤 SYSTEM 和 NOTIFICATION 消息（如"服务器已收到消息"等干扰提示）
    if (newMessage.type === MessageType.SYSTEM || newMessage.type === MessageType.NOTIFICATION) {
      return;
    }
    
    setMessages(prevMessages => {
      // 避免重复添加相同的消息
      const exists = prevMessages.some(msg => 
        msg.timestamp === newMessage.timestamp && 
        msg.content === newMessage.content &&
        msg.userId === newMessage.userId
      );
      
      if (!exists) {
        const updated = [...prevMessages, newMessage];
        // 限制消息数量，避免内存过大
        return updated.slice(-500);
      }
      return prevMessages;
    });
    
    // 延迟滚动，确保DOM已更新
    setTimeout(scrollToBottom, 50);
  }, [scrollToBottom]);

  // WebSocket 回调函数
  const wsCallbacks = useCallback(() => ({
    onMessage: (message: WebSocketMessage) => {
      addMessage(message);
    },
    onStatusChange: (status: ConnectionStatus) => {
      setConnectionStatus(status);
      
      if (status === ConnectionStatus.CONNECTED) {
        message.success('已连接到聊天室');
      } else if (status === ConnectionStatus.DISCONNECTED) {
        message.warning('已断开连接');
      } else if (status === ConnectionStatus.ERROR) {
        message.error('连接失败');
      }
    },
    onError: (error: Event) => {
      console.error('WebSocket 错误:', error);
      // 只显示错误信息，不要过多干扰用户
      if (error.type && error.type !== 'close') {
        message.error('发生错误，请检查网络连接');
      }
    },
    onOnlineListUpdate: (users: OnlineUser[]) => {
      setOnlineUsers(users);
    }
  }), [addMessage]);

  // 连接 WebSocket
  const connectWebSocket = useCallback(async () => {
    if (!currentUser?.id || !roomId || isConnectingRef.current) {
      return;
    }

    try {
      isConnectingRef.current = true;
      
      // 获取或创建 WebSocket 服务
      const wsService = webSocketManager.getService(roomId, wsCallbacks());
      wsServiceRef.current = wsService;
      
      // 如果已连接且是同一房间，直接返回
      if (wsService.isConnected() && wsService.getCurrentRoomId() === roomId) {
        setConnectionStatus(ConnectionStatus.CONNECTED);
        return;
      }
      
      // 连接到房间
      await wsService.connect(roomId, currentUser.id.toString());
      
    } catch (error) {
      console.error('连接 WebSocket 失败:', error);
      message.error('连接聊天室失败，请重试');
    } finally {
      isConnectingRef.current = false;
    }
  }, [currentUser?.id, roomId, wsCallbacks]);

  // 断开连接
  const disconnectWebSocket = useCallback(() => {
    if (wsServiceRef.current) {
      wsServiceRef.current.disconnect();
      wsServiceRef.current = null;
    }
    webSocketManager.removeService(roomId);
    setConnectionStatus(ConnectionStatus.DISCONNECTED);
    setMessages([]);
    setOnlineUsers([]);
  }, [roomId]);

  // 发送消息
  const sendMessage = useCallback(async () => {
    if (!messageInput.trim() || !wsServiceRef.current || sending) {
      return;
    }

    try {
      setSending(true);
      const messageContent = messageInput.trim();
      const timestamp = Date.now();
      
      // 立即在界面上显示消息，状态为发送中
      const tempMessage: WebSocketMessage = {
        type: MessageType.CHAT,
        content: messageContent,
        userId: currentUser?.id?.toString(),
        userName: currentUser?.userName || currentUser?.userAccount,
        userAvatar: currentUser?.userAvatar,
        timestamp: timestamp,
        status: MessageStatus.SENDING,
        data: {}
      };
      addMessage(tempMessage);
      
      // 发送消息到服务器
      wsServiceRef.current.sendChatMessage(
        messageContent,
        currentUser?.userName || currentUser?.userAccount,
        currentUser?.userAvatar
      );
      
      // 清空输入框
      setMessageInput('');
      
      // 更新消息状态为已发送
      setTimeout(() => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.timestamp === timestamp && msg.status === MessageStatus.SENDING
              ? { ...msg, status: MessageStatus.SENT }
              : msg
          )
        );
      }, 100);
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送消息失败');
    } finally {
      setSending(false);
    }
  }, [messageInput, currentUser, sending, addMessage]);

  // 处理回车发送
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // 重新连接
  const reconnect = useCallback(() => {
    disconnectWebSocket();
    setTimeout(() => {
      connectWebSocket();
    }, 1000);
  }, [disconnectWebSocket, connectWebSocket]);

  // 组件初始化
  useEffect(() => {
    if (visible && currentUser?.id && roomId) {
      connectWebSocket();
    }

    return () => {
      if (!visible) {
        disconnectWebSocket();
      }
    };
  }, [visible, currentUser?.id, roomId, connectWebSocket, disconnectWebSocket]);

  // 组件卸载清理
  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, [disconnectWebSocket]);


  // 获取连接状态显示
  const getConnectionStatusDisplay = () => {
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTED:
        return (
          <Tag icon={<WifiOutlined />} color="success">
            已连接
          </Tag>
        );
      case ConnectionStatus.CONNECTING:
        return (
          <Tag icon={<LoadingOutlined />} color="processing">
            连接中
          </Tag>
        );
      case ConnectionStatus.ERROR:
        return (
          <Tag icon={<DisconnectOutlined />} color="error">
            连接错误
          </Tag>
        );
      default:
        return (
          <Tag icon={<DisconnectOutlined />} color="default">
            未连接
          </Tag>
        );
    }
  };

  if (!visible) {
    return null;
  }

  const isConnected = connectionStatus === ConnectionStatus.CONNECTED;
  const isConnecting = connectionStatus === ConnectionStatus.CONNECTING;

  return (
    <div className="room-chat-container">
      <Card className="main-panel" bodyStyle={{ padding: 0, height: '100%' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="room-tabs"
          items={[
            {
              key: 'chat',
              label: (
                <div className="tab-label">
                  <MessageOutlined />
                  <span>聊天室</span>
                  {getConnectionStatusDisplay()}
                </div>
              ),
              children: (
                <Row gutter={16} style={{ display: 'flex', minHeight: '550px', maxHeight: '550px' }}>
                  {/* 聊天区域 */}
                  <Col xs={24} lg={16}>
                    <div className="chat-panel">
                      {/* 聊天头部 */}
                      <div className="chat-header">
                        <div className="chat-title">
                          <Text strong>房间聊天</Text>
                        </div>
                        
                        <Space>
                          {!isConnected && (
                            <Tooltip title="重新连接">
                              <Button 
                                type="text" 
                                icon={<ReloadOutlined />}
                                onClick={reconnect}
                                loading={isConnecting}
                                size="small"
                              />
                            </Tooltip>
                          )}
                        </Space>
                      </div>

                      <Divider style={{ margin: 0 }} />

                      {/* 消息列表 */}
                      <div className="messages-container" ref={messagesContainerRef}>
                        {!isConnected && messages.length === 0 ? (
                          <div className="chat-placeholder">
                            <Spin spinning={isConnecting}>
                              <div className="placeholder-content">
                                {isConnecting ? (
                                  <Text type="secondary">正在连接聊天室...</Text>
                                ) : (
                                  <div>
                                    <Text type="secondary">聊天室未连接</Text>
                                    <br />
                                    <Button type="link" onClick={reconnect}>
                                      点击重新连接
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </Spin>
                          </div>
                        ) : (
                          <div className="messages-list">
                            {messages.length === 0 ? (
                              <div className="empty-messages">
                                <Text type="secondary">暂无消息，开始聊天吧！</Text>
                              </div>
                            ) : (
                              messages.map((msg, index) => (
                                <ChatMessage
                                  key={`${msg.timestamp}-${index}`}
                                  message={msg}
                                  isOwnMessage={msg.userId === currentUser?.id?.toString()}
                                  currentUserId={currentUser?.id?.toString()}
                                />
                              ))
                            )}
                          </div>
                        )}
                      </div>

                      {/* 消息输入框 */}
                      <div className="message-input-container">
                        <Divider style={{ margin: 0 }} />
                        <div className="message-input">
                          <TextArea
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isConnected ? "输入消息..." : "请先连接到聊天室"}
                            disabled={!isConnected || sending}
                            autoSize={{ minRows: 1, maxRows: 3 }}
                            style={{ resize: 'none' }}
                          />
                          <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={sendMessage}
                            disabled={!isConnected || !messageInput.trim() || sending}
                            loading={sending}
                            style={{ marginLeft: 8 }}
                          >
                            发送
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>

                  {/* 在线用户列表 */}
                  <Col xs={24} lg={8}>
                    <Card className="users-panel" bodyStyle={{ padding: 0 }}>
                      <OnlineUserList
                        users={onlineUsers}
                        currentUserId={currentUser?.id?.toString()}
                        roomLeaderId={roomLeaderId}
                        loading={isConnecting}
                        maxHeight="100%"
                      />
                    </Card>
                  </Col>
                </Row>
              )
            },
            {
              key: 'code',
              label: (
                <div className="tab-label">
                  <CodeOutlined />
                  <span>代码协作</span>
                </div>
              ),
              children: (
                <div style={{ height: '700px', padding: '12px', overflow: 'auto' }}>
                  <RoomCodeCollaboration
                    roomId={roomId}
                    roomLeaderId={roomLeaderId}
                    wsService={wsServiceRef.current || undefined}
                    visible={activeTab === 'code'}
                  />
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default RoomChat;
