import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../context/store';
import { getCurrentUser } from '../../../features/userSlice';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Tag,
  Avatar,
  Space,
  Pagination,
  Modal,
  Form,
  Tooltip,
  Badge
} from 'antd';
import {
  PlusOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
  TeamOutlined,
  EyeOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RoomService } from '../../../services/room';
import type { RoomVO, RoomQueryRequest, RoomJoinRequest } from '../../../../generated';
import './index.css';

const { Search } = Input;
const { Option } = Select;

const RoomList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.User.currentUser);
  const [rooms, setRooms] = useState<RoomVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(12);
  const [searchParams, setSearchParams] = useState<RoomQueryRequest>({
    current: 1,
    pageSize: 12,
    sortField: 'createTime',
    sortOrder: 'desc'
  });

  // 加入房间弹窗
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomVO | null>(null);
  const [joinForm] = Form.useForm();

  // 获取房间列表
  const fetchRooms = useCallback(async (params: RoomQueryRequest = searchParams) => {
    setLoading(true);
    try {
      const response = await RoomService.listRoomVOByPage(params);
      if (response.code === 0 && response.data) {
        setRooms(response.data.records || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('获取房间列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);
  
  useEffect(() => {
    // 获取当前用户信息
    if (!currentUser) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, currentUser]);

  // 搜索处理
  const handleSearch = (value: string) => {
    const newParams = {
      ...searchParams,
      name: value,
      current: 1
    };
    setSearchParams(newParams);
    setCurrent(1);
    fetchRooms(newParams);
  };

  // 状态筛选
  const handleStatusFilter = (status: number | undefined) => {
    const newParams = {
      ...searchParams,
      status,
      current: 1
    };
    setSearchParams(newParams);
    setCurrent(1);
    fetchRooms(newParams);
  };

  // 分页处理
  const handlePageChange = (page: number) => {
    const newParams = {
      ...searchParams,
      current: page
    };
    setSearchParams(newParams);
    setCurrent(page);
    fetchRooms(newParams);
  };

  // 加入房间
  const handleJoinRoom = async (room: RoomVO) => {
    if (room.status === 1) {
      // 需要密码的房间
      setSelectedRoom(room);
      setJoinModalVisible(true);
    } else {
      // 公开房间直接加入
      try {
        const params: RoomJoinRequest = {
          roomId: room.id?.toString() || '0',
          password: ''
        };
        await RoomService.joinRoom(params);
        fetchRooms(); // 刷新列表
      } catch (error) {
        console.error('加入房间失败:', error);
      }
    }
  };

  // 确认加入房间
  const handleJoinConfirm = async () => {
    try {
      const values = await joinForm.validateFields();
      const params: RoomJoinRequest = {
        roomId: selectedRoom?.id?.toString() || '0',
        password: values.password
      };
      await RoomService.joinRoom(params);
      setJoinModalVisible(false);
      joinForm.resetFields();
      setSelectedRoom(null);
      fetchRooms(); // 刷新列表
    } catch (error) {
      console.error('加入房间失败:', error);
    }
  };

  // 查看房间详情
  const handleViewRoom = (roomId: string | number) => {
    navigate(`/room/${roomId}`);
  };

  // 创建房间
  const handleCreateRoom = () => {
    navigate('/room/create');
  };

  // 进入聊天室
  const handleEnterChat = (roomId: string | number) => {
    navigate(`/room/${roomId}/chat`);
  };

  // 检查用户是否已加入房间
  const isUserInRoom = (room: RoomVO) => {
    if (!currentUser?.id) return false;
    return room.members?.some(member => member.userId === currentUser.id) || false;
  };

  // 渲染房间卡片
  const renderRoomCard = (room: RoomVO) => {
    const isPrivate = room.status === 1;
    const isFull = (room.currentNum || 0) >= (room.mateNum || 0);
    const userInRoom = isUserInRoom(room);
    
    return (
      <Col xs={24} sm={12} md={8} lg={6} key={room.id}>
        <Card
          className="room-card"
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
                {isFull && <Tag color="red">已满</Tag>}
              </div>
            </div>
          }
          actions={[
            ...(userInRoom ? [
              <Tooltip title="进入聊天室" key="chat">
                <Button
                  type="text"
                  icon={<MessageOutlined />}
                  onClick={() => handleEnterChat(room.id?.toString() || '0')}
                />
              </Tooltip>
            ] : []),
            <Tooltip title="查看详情" key="view">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleViewRoom(room.id?.toString() || '0')}
              />
            </Tooltip>,
            ...(!userInRoom ? [
              <Tooltip title="加入房间" key="join">
                <Button
                  type="text"
                  icon={<TeamOutlined />}
                  disabled={isFull}
                  onClick={() => handleJoinRoom(room)}
                />
              </Tooltip>
            ] : [])
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
    <div className="room-list-container">
      <div className="room-list-header">
        <div className="room-list-title">
          <h2>房间列表</h2>
          <p>与小伙伴一起刷题，提升编程技能</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateRoom}
        >
          创建房间
        </Button>
      </div>

      <div className="room-list-filters">
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="搜索房间名称"
              allowClear
              onSearch={handleSearch}
              style={{ maxWidth: 300 }}
            />
          </Col>
          <Col>
            <Select
              placeholder="房间状态"
              allowClear
              style={{ width: 120 }}
              onChange={handleStatusFilter}
            >
              <Option value={0}>公开</Option>
              <Option value={1}>私密</Option>
            </Select>
          </Col>
        </Row>
      </div>

      <div className="room-list-content">
        <Row gutter={[16, 16]}>
          {rooms.map(renderRoomCard)}
        </Row>
        
        {rooms.length === 0 && !loading && (
          <div className="empty-state">
            <p>暂无房间，快去创建一个吧！</p>
          </div>
        )}
      </div>

      <div className="room-list-pagination">
        <Pagination
          current={current}
          total={total}
          pageSize={pageSize}
          showSizeChanger={false}
          showQuickJumper
          showTotal={(total, range) =>
            `第 ${range[0]}-${range[1]} 项，共 ${total} 个房间`
          }
          onChange={handlePageChange}
        />
      </div>

      {/* 加入房间弹窗 */}
      <Modal
        title="加入房间"
        open={joinModalVisible}
        onOk={handleJoinConfirm}
        onCancel={() => {
          setJoinModalVisible(false);
          joinForm.resetFields();
          setSelectedRoom(null);
        }}
        destroyOnClose
      >
        <div style={{ marginBottom: 16 }}>
          <p><strong>房间名称：</strong>{selectedRoom?.name}</p>
          <p><strong>房间描述：</strong>{selectedRoom?.description || '暂无描述'}</p>
        </div>
        <Form form={joinForm} layout="vertical">
          <Form.Item
            name="password"
            label="房间密码"
            rules={[{ required: true, message: '请输入房间密码' }]}
          >
            <Input.Password placeholder="请输入房间密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomList;
