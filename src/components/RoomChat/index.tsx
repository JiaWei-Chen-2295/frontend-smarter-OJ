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
  Tooltip
} from 'antd';
import { 
  SendOutlined, 
  ReloadOutlined,
  WifiOutlined,
  DisconnectOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../../context/store';
import { 
  webSocketManager, 
  WebSocketChatService, 
  WebSocketMessage, 
  ConnectionStatus,
  OnlineUser,
  MessageType
} from '../../services/websocket';
import ChatMessage from '../ChatMessage';
import OnlineUserList from '../OnlineUserList';
import './index.css';

const { TextArea } = Input;
const { Text } = Typography;

interface RoomChatProps {
  roomId: string;
  roomLeaderId?: string;
  visible?: boolean;
  onClose?: () => void;
}

const RoomChat: React.FC<RoomChatProps> = ({ 
  roomId, 
  roomLeaderId,
  visible = true,
  onClose 
}) => {
  const currentUser = useSelector((state: RootState) => state.User.currentUser);
  
  // 状态管理
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  
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
      message.error('连接错误，请重试');
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
      wsServiceRef.current.sendChatMessage(
        messageInput.trim(),
        currentUser?.userName || currentUser?.userAccount,
        currentUser?.userAvatar
      );
      setMessageInput('');
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送消息失败');
    } finally {
      setSending(false);
    }
  }, [messageInput, currentUser, sending]);

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
      <Row gutter={16} style={{ height: '100%' }}>
        {/* 聊天区域 */}
        <Col xs={24} lg={16}>
          <Card className="chat-panel" bodyStyle={{ padding: 0, height: '100%' }}>
            {/* 聊天头部 */}
            <div className="chat-header">
              <div className="chat-title">
                <Text strong>房间聊天</Text>
                {getConnectionStatusDisplay()}
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
          </Card>
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
    </div>
  );
};

export default RoomChat;
