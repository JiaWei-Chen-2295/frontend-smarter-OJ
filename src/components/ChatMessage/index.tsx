import React from 'react';
import { Avatar, Space, Typography, Tooltip } from 'antd';
import { 
  UserOutlined, 
  RobotOutlined, 
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  LoginOutlined,
  LogoutOutlined,
  CheckOutlined,
  LoadingOutlined,
  CheckCircleFilled
} from '@ant-design/icons';
import { WebSocketMessage, MessageType, MessageStatus } from '../../services/websocket';
import './index.css';

const { Text } = Typography;

interface ChatMessageProps {
  message: WebSocketMessage;
  isOwnMessage?: boolean;
  currentUserId?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isOwnMessage = false, 
  currentUserId 
}) => {
  // 格式化时间
  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 获取消息类型样式
  const getMessageTypeStyle = (type: string) => {
    switch (type) {
      case MessageType.SYSTEM:
        return 'system-message';
      case MessageType.JOIN:
        return 'join-message';
      case MessageType.LEAVE:
        return 'leave-message';
      case MessageType.ERROR:
        return 'error-message';
      case MessageType.NOTIFICATION:
        return 'notification-message';
      default:
        return 'chat-message';
    }
  };

  // 获取消息图标
  const getMessageIcon = (type: string) => {
    switch (type) {
      case MessageType.SYSTEM:
        return <RobotOutlined style={{ color: '#722ed1' }} />;
      case MessageType.JOIN:
        return <LoginOutlined style={{ color: '#52c41a' }} />;
      case MessageType.LEAVE:
        return <LogoutOutlined style={{ color: '#ff7875' }} />;
      case MessageType.ERROR:
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case MessageType.NOTIFICATION:
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      default:
        return null;
    }
  };

  // 系统消息渲染
  if (message.type !== MessageType.CHAT) {
    return (
      <div className={`chat-message-item system-message-item ${getMessageTypeStyle(message.type)}`}>
        <div className="system-message-content">
          <Space>
            {getMessageIcon(message.type)}
            <Text className="system-message-text">{message.content}</Text>
            {message.timestamp && (
              <Text type="secondary" className="message-time">
                {formatTime(message.timestamp)}
              </Text>
            )}
          </Space>
        </div>
      </div>
    );
  }

  // 获取消息状态显示
  const getStatusIcon = () => {
    if (!isOwnMessage || !message.status) return null;
    
    switch (message.status) {
      case MessageStatus.SENDING:
        return (
          <Tooltip title="发送中">
            <LoadingOutlined style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '4px' }} />
          </Tooltip>
        );
      case MessageStatus.SENT:
        return (
          <Tooltip title="已发送">
            <CheckOutlined style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '4px' }} />
          </Tooltip>
        );
      case MessageStatus.DELIVERED:
        return (
          <Tooltip title="发送成功">
            <CheckCircleFilled style={{ fontSize: '12px', color: '#52c41a', marginLeft: '4px' }} />
          </Tooltip>
        );
      default:
        return null;
    }
  };

  // 普通聊天消息渲染
  return (
    <div className={`chat-message-item ${isOwnMessage ? 'own-message' : 'other-message'}`}>
      <div className="message-wrapper">
        {!isOwnMessage && (
          <div className="message-avatar">
            <Avatar 
              src={message.userAvatar} 
              icon={<UserOutlined />}
              size="small"
            />
          </div>
        )}
        
        <div className="message-content">
          {!isOwnMessage && (
            <div className="message-header">
              <Text strong className="message-sender">
                {message.userName || message.userId || '未知用户'}
              </Text>
              {message.timestamp && (
                <Text type="secondary" className="message-time">
                  {formatTime(message.timestamp)}
                </Text>
              )}
            </div>
          )}
          
          <div className={`message-bubble ${isOwnMessage ? 'own-bubble' : 'other-bubble'}`}>
            <Text className="message-text">{message.content}</Text>
            {isOwnMessage && message.timestamp && (
              <div className="message-time-own">
                {formatTime(message.timestamp)}
              </div>
            )}
          </div>
          
          {/* 显示发送状态 */}
          {isOwnMessage && (
            <div className="message-status">
              {getStatusIcon()}
            </div>
          )}
        </div>

        {isOwnMessage && (
          <div className="message-avatar">
            <Avatar 
              src={message.userAvatar} 
              icon={<UserOutlined />}
              size="small"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
