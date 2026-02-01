import React, { useState, useEffect, useCallback } from 'react';
import { 
  Button, 
  Card, 
  Typography, 
  Space,
  Spin,
  Result
} from 'antd';
import { 
  ArrowLeftOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../context/store';
import { getCurrentUser } from '../../../features/userSlice';
import { RoomService } from '../../../services/room';
import RoomChat from '../../../components/RoomChat';
import type { RoomVO } from '../../../../generated';
import '../../../styles/uiuxpro.css';
import './index.css';

const { Title, Text } = Typography;

const RoomChatPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.User.currentUser);
  
  const [room, setRoom] = useState<RoomVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取房间信息
  const fetchRoomInfo = useCallback(async () => {
    if (!roomId) {
      setError('房间ID无效');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await RoomService.getRoomVOById(roomId);
      
      if (response.code === 0 && response.data) {
        setRoom(response.data);
        setError(null);
      } else {
        setError('房间不存在或已被删除');
      }
    } catch (error) {
      console.error('获取房间信息失败:', error);
      setError('获取房间信息失败');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // 检查用户权限
  const checkUserPermission = () => {
    if (!currentUser || !room) return false;
    
    // 检查用户是否是房间成员
    const isMember = room.members?.some(member => 
      member.userId === currentUser.id
    );
    
    return isMember;
  };

  useEffect(() => {
    // 获取当前用户信息
    if (!currentUser) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (roomId) {
      fetchRoomInfo();
    }
  }, [roomId, fetchRoomInfo]);

  // 返回房间详情
  const handleBack = () => {
    navigate(`/room/${roomId}`);
  };

  // 加入房间
  const handleJoinRoom = () => {
    navigate(`/room/${roomId}`);
  };

  if (loading) {
    return (
      <div className="uiux-scope room-chat-page-container">
        <div className="loading-container">
          <Spin size="large" />
          <Text style={{ marginTop: 16, color: '#8c8c8c' }}>
            正在加载房间信息...
          </Text>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="uiux-scope room-chat-page-container">
        <Card className="error-card">
          <Result
            status="error"
            title="加载失败"
            subTitle={error || '房间不存在'}
            extra={[
              <Button key="back" onClick={() => navigate('/room')}>
                返回房间列表
              </Button>,
              <Button key="retry" type="primary" onClick={fetchRoomInfo}>
                重试
              </Button>
            ]}
          />
        </Card>
      </div>
    );
  }

  // 检查用户权限
  if (!currentUser || !checkUserPermission()) {
    return (
      <div className="uiux-scope room-chat-page-container">
        <Card className="permission-card">
          <Result
            status="403"
            title="无访问权限"
            subTitle="您需要先加入房间才能参与聊天"
            extra={[
              <Button key="back" onClick={() => navigate('/room')}>
                返回房间列表
              </Button>,
              <Button key="join" type="primary" onClick={handleJoinRoom}>
                加入房间
              </Button>
            ]}
          />
        </Card>
      </div>
    );
  }

  const isPrivate = room.status === 1;
  const isFull = (room.currentNum || 0) >= (room.mateNum || 0);

  return (
    <div className="uiux-scope room-chat-page-container">
      {/* 页面头部 */}
      <div className="room-chat-header">
        <Card className="room-info-card">
          <div className="room-info-content">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              className="back-button"
            >
              返回房间
            </Button>
            
            <div className="room-basic-info">
              <div className="room-title-section">
                <Title level={4} style={{ margin: 0 }}>
                  <MessageOutlined style={{ marginRight: 8, color: 'var(--uiux-primary)' }} />
                  {room.name}
                </Title>
                <Space>
                  {isPrivate ? (
                    <span className="room-status private">私密房间</span>
                  ) : (
                    <span className="room-status public">公开房间</span>
                  )}
                  <span className={`room-capacity ${isFull ? 'full' : ''}`}>
                    {room.currentNum}/{room.mateNum}人
                  </span>
                </Space>
              </div>
              
              {room.description && (
                <Text type="secondary" className="room-description">
                  {room.description}
                </Text>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* 聊天区域 */}
      <div className="room-chat-main">
        <RoomChat
          roomId={roomId!}
          roomLeaderId={room.userId?.toString()}
          visible={true}
        />
      </div>
    </div>
  );
};

export default RoomChatPage;
