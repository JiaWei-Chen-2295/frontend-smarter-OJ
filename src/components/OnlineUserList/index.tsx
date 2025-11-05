import React from 'react';
import { 
  List, 
  Avatar, 
  Typography, 
  Badge, 
  Space, 
  Empty,
  Tooltip 
} from 'antd';
import { 
  UserOutlined,
  CrownOutlined,
  WifiOutlined
} from '@ant-design/icons';
import { OnlineUser } from '../../services/websocket';
import './index.css';

const { Text } = Typography;

interface OnlineUserListProps {
  users: OnlineUser[];
  currentUserId?: string;
  roomLeaderId?: string;
  loading?: boolean;
  maxHeight?: string | number;
}

const OnlineUserList: React.FC<OnlineUserListProps> = ({
  users = [],
  currentUserId,
  roomLeaderId,
  loading = false,
  maxHeight = '300px'
}) => {

  // 格式化加入时间
  const formatJoinTime = (joinTime?: string) => {
    if (!joinTime) return '刚刚加入';
    
    const now = Date.now();
    const joinTimestamp = new Date(joinTime).getTime();
    const diff = now - joinTimestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}天前加入`;
    if (hours > 0) return `${hours}小时前加入`;
    if (minutes > 0) return `${minutes}分钟前加入`;
    return '刚刚加入';
  };

  // 排序用户列表：队长在前，然后按加入时间排序
  const sortedUsers = [...users].sort((a, b) => {
    // 队长排在最前面
    if (a.userId === roomLeaderId) return -1;
    if (b.userId === roomLeaderId) return 1;
    
    // 其他用户按加入时间排序
    const aTime = a.joinTime ? new Date(a.joinTime).getTime() : 0;
    const bTime = b.joinTime ? new Date(b.joinTime).getTime() : 0;
    return aTime - bTime;
  });

  const renderUserItem = (user: OnlineUser) => {
    const isCurrentUser = user.userId === currentUserId;
    const isLeader = user.userId === roomLeaderId;
    
    return (
      <List.Item className={`user-list-item ${isCurrentUser ? 'current-user' : ''}`}>
        <div className="user-info">
          <div className="user-avatar-section">
            <Badge 
              dot 
              color="#52c41a"
              offset={[-4, 4]}
            >
              <Avatar
                src={user.userAvatar}
                icon={<UserOutlined />}
                size="small"
              />
            </Badge>
            {isLeader && (
              <Tooltip title="房间队长">
                <CrownOutlined className="leader-crown" />
              </Tooltip>
            )}
          </div>
          
          <div className="user-details">
            <div className="user-name-section">
              <Text strong={isCurrentUser} className="user-name">
                {user.userName || `用户${user.userId}`}
              </Text>
              {isCurrentUser && (
                <Text type="secondary" className="current-user-tag">
                  (我)
                </Text>
              )}
            </div>
            <Text type="secondary" className="join-time">
              {formatJoinTime(user.joinTime)}
            </Text>
          </div>
        </div>
        
        <div className="user-status">
          <Tooltip title="在线">
            <WifiOutlined className="online-indicator" />
          </Tooltip>
        </div>
      </List.Item>
    );
  };

  return (
    <div className="online-user-list">
      <div className="online-header">
        <Space>
          <Badge 
            count={users.length} 
            style={{ backgroundColor: '#52c41a' }}
          >
            <UserOutlined style={{ fontSize: 16, color: '#595959' }} />
          </Badge>
          <Text strong>在线用户</Text>
        </Space>
      </div>
      
      <div className="user-list-container" style={{ maxHeight }}>
        {users.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无在线用户"
            style={{ padding: '20px 0' }}
          />
        ) : (
          <List
            dataSource={sortedUsers}
            renderItem={renderUserItem}
            loading={loading}
            size="small"
            split={false}
          />
        )}
      </div>
    </div>
  );
};

export default OnlineUserList;
