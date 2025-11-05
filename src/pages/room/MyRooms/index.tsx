import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../context/store';
import { getCurrentUser } from '../../../features/userSlice';
import {
  Card,
  Tabs,
  Row,
  Col,
  Button,
  Avatar,
  Space,
  Tag,
  Empty,
  Tooltip,
  Badge,
  Popconfirm,
  message
} from 'antd';
import {
  ArrowLeftOutlined,
  CrownOutlined,
  UserOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
  LockOutlined,
  UnlockOutlined,
  TeamOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RoomService } from '../../../services/room';
import type { RoomVO, RoomQuitRequest } from '../../../../generated';
import './index.css';

const { TabPane } = Tabs;

const MyRooms: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.User.currentUser);
  const [activeTab, setActiveTab] = useState('created');
  const [createdRooms, setCreatedRooms] = useState<RoomVO[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<RoomVO[]>([]);

  // 获取我的房间列表
  const fetchMyRooms = useCallback(async () => {
    try {
      const response = await RoomService.listMyRoomVOByPage({
        current: 1,
        pageSize: 20,
        sortField: 'createTime',
        sortOrder: 'desc'
      });
      
      if (response.code === 0 && response.data?.records && currentUser?.id) {
        const rooms = response.data.records;
        
        // 分离创建的房间和加入的房间
        const created = rooms.filter(room => room.userId === currentUser.id);
        const joined = rooms.filter(room => {
          // 加入的房间：不是自己创建的，但自己是成员
          return room.userId !== currentUser.id && 
                 room.members?.some(member => member.userId === currentUser.id);
        });
        
        setCreatedRooms(created);
        setJoinedRooms(joined);
      }
    } catch (error) {
      console.error('获取我的房间列表失败:', error);
    }
  }, [currentUser]);

  useEffect(() => {
    // 获取当前用户信息
    if (!currentUser) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    // 当用户信息加载完成后获取房间列表
    if (currentUser?.id) {
      fetchMyRooms();
    }
  }, [fetchMyRooms, currentUser]);

  // 查看房间详情
  const handleViewRoom = (roomId: string | number) => {
    navigate(`/room/${roomId}`);
  };

  // 编辑房间
  const handleEditRoom = (roomId: string | number) => {
    navigate(`/room/${roomId}?action=edit`);
  };

  // 进入聊天室
  const handleEnterChat = (roomId: string | number) => {
    navigate(`/room/${roomId}/chat`);
  };

  // 退出房间
  const handleQuitRoom = async (roomId: string | number) => {
    try {
      const params: RoomQuitRequest = {
        roomId
      };
      await RoomService.quitRoom(params);
      fetchMyRooms(); // 刷新列表
    } catch (error) {
      console.error('退出房间失败:', error);
    }
  };

  // 解散房间
  const handleDeleteRoom = async (roomId: string | number) => {
    try {
      await RoomService.deleteRoom(roomId);
      message.success('房间已解散');
      fetchMyRooms(); // 刷新列表
    } catch (error) {
      console.error('解散房间失败:', error);
    }
  };

  // 返回房间列表
  const handleBack = () => {
    navigate('/room');
  };

  // 创建房间
  const handleCreateRoom = () => {
    navigate('/room/create');
  };

  // 渲染房间卡片
  const renderRoomCard = (room: RoomVO, isCreated: boolean = false) => {
    const isPrivate = room.status === 1;
    const isFull = (room.currentNum || 0) >= (room.mateNum || 0);
    
    return (
      <Col xs={24} sm={12} lg={8} xl={6} key={room.id}>
        <Card
          className="my-room-card"
          hoverable
          cover={
            <div className="room-card-header">
              <div className="room-status">
                {isPrivate ? (
                  <Tag color="orange" icon={<LockOutlined />}>
                    私密
                  </Tag>
                ) : (
                  <Tag color="green" icon={<UnlockOutlined />}>
                    公开
                  </Tag>
                )}
                {isCreated && (
                  <Tag color="gold" icon={<CrownOutlined />}>
                    我创建的
                  </Tag>
                )}
                {isFull && <Tag color="red">已满</Tag>}
              </div>
            </div>
          }
          actions={[
            <Tooltip title="进入聊天室" key="chat">
              <Button
                type="text"
                icon={<MessageOutlined />}
                onClick={() => handleEnterChat(room.id?.toString() || '0')}
              />
            </Tooltip>,
            <Tooltip title="查看详情" key="view">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleViewRoom(room.id?.toString() || '0')}
              />
            </Tooltip>,
            ...(isCreated ? [
              <Tooltip title="编辑房间" key="edit">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEditRoom(room.id?.toString() || '0')}
                />
              </Tooltip>,
              <Tooltip title="解散房间" key="delete">
                <Popconfirm
                  title="确认解散房间？"
                  description="解散后房间将被永久删除，所有成员都会被移除"
                  onConfirm={() => handleDeleteRoom(room.id?.toString() || '0')}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </Tooltip>
            ] : [
              <Tooltip title="退出房间" key="quit">
                <Popconfirm
                  title="确认退出房间？"
                  onConfirm={() => handleQuitRoom(room.id?.toString() || '0')}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button
                    type="text"
                    icon={<LogoutOutlined />}
                  />
                </Popconfirm>
              </Tooltip>
            ])
          ]}
        >
          <Card.Meta
            title={
              <div className="room-title">
                <span className="room-name">{room.name}</span>
                <Badge
                  count={`${room.currentNum || 0}/${room.mateNum || 0}`}
                  style={{ backgroundColor: isFull ? '#ff4d4f' : '#52c41a' }}
                />
              </div>
            }
            description={
              <div className="room-description">
                <p className="room-desc-text">{room.description || '暂无描述'}</p>
                <div className="room-info">
                  <Space>
                    <Avatar
                      size="small"
                      src={room.userVO?.userAvatar}
                      icon={<UserOutlined />}
                    />
                    <span className="room-leader">{room.userVO?.userName || '未知'}</span>
                    {isCreated && <CrownOutlined style={{ color: '#faad14', fontSize: 12 }} />}
                  </Space>
                  <span className="room-time">
                    {room.createTime ? new Date(room.createTime).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
            }
          />
        </Card>
      </Col>
    );
  };

  return (
    <div className="my-rooms-container">
      <div className="my-rooms-header">
        <div className="header-left">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            style={{ marginRight: 16 }}
          >
            返回房间列表
          </Button>
          <div className="my-rooms-title">
            <h2>我的房间</h2>
            <p>管理您创建和加入的房间</p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<TeamOutlined />}
          onClick={handleCreateRoom}
          disabled={createdRooms.length > 0} // 已有创建的房间时禁用
        >
          {createdRooms.length > 0 ? '已创建房间' : '创建房间'}
        </Button>
      </div>

      <div className="my-rooms-content">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="my-rooms-tabs"
        >
          <TabPane 
            tab={
              <Space>
                <CrownOutlined />
                我创建的 ({createdRooms.length})
              </Space>
            } 
            key="created"
          >
            <div className="tab-content">
              {createdRooms.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {createdRooms.map(room => renderRoomCard(room, true))}
                </Row>
              ) : (
                <Empty
                  description="您还没有创建任何房间"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" onClick={handleCreateRoom}>
                    创建第一个房间
                  </Button>
                </Empty>
              )}
            </div>
          </TabPane>
          
          <TabPane 
            tab={
              <Space>
                <TeamOutlined />
                我加入的 ({joinedRooms.length})
              </Space>
            } 
            key="joined"
          >
            <div className="tab-content">
              {joinedRooms.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {joinedRooms.map(room => renderRoomCard(room, false))}
                </Row>
              ) : (
                <Empty
                  description="您还没有加入任何房间"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" onClick={handleBack}>
                    去看看其他房间
                  </Button>
                </Empty>
              )}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default MyRooms;
