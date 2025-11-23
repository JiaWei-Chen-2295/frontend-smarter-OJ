import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../context/store';
import { getCurrentUser } from '../../../features/userSlice';
import {
  Card,
  Row,
  Col,
  Button,
  Avatar,
  Tag,
  Space,
  Typography,
  Descriptions,
  List,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tooltip,
  Badge,
  Spin
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
  LogoutOutlined,
  UserAddOutlined,
  CrownOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
  TeamOutlined,
  CalendarOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { RoomService } from '../../../services/room';
import type { 
  RoomVO, 
  RoomMemberVO, 
  RoomEditRequest, 
  RoomTransferRequest,
  RoomJoinRequest,
  RoomQuitRequest 
} from '../../../../generated';
import './index.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const RoomDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.User.currentUser);
  
  const [room, setRoom] = useState<RoomVO | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 弹窗状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  
  // 表单
  const [editForm] = Form.useForm();
  const [transferForm] = Form.useForm();
  const [joinForm] = Form.useForm();

  // 获取房间详情
  const fetchRoomDetail = useCallback(async () => {
    if (!roomId) return;
    
    setLoading(true);
    try {
      const response = await RoomService.getRoomVOById(roomId);
      if (response.code === 0 && response.data) {
        setRoom(response.data);
        // 设置编辑表单的初始值
        editForm.setFieldsValue({
          name: response.data.name,
          description: response.data.description,
          mateNum: response.data.mateNum,
          status: response.data.status
        });
      }
    } catch (error) {
      console.error('获取房间详情失败:', error);
      message.error('获取房间详情失败');
    } finally {
      setLoading(false);
    }
  }, [roomId, editForm]);

  useEffect(() => {
    fetchRoomDetail();
  }, [fetchRoomDetail]);

  useEffect(() => {
    // 获取当前用户信息
    if (!currentUser) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, currentUser]);

  // 判断当前用户是否是队长
  const isLeader = () => {
    return room?.userId === currentUser?.id;
  };

  // 判断当前用户是否在房间内
  const isMember = () => {
    return room?.members?.some(member => member.userId === currentUser?.id);
  };

  // 判断房间是否已满
  const isFull = () => {
    return (room?.currentNum || 0) >= (room?.mateNum || 0);
  };

  // 编辑房间
  const handleEditRoom = async () => {
    try {
      const values = await editForm.validateFields();
      const params: RoomEditRequest = {
        id: room?.id || 0,
        name: values.name,
        description: values.description,
        mateNum: values.mateNum,
        status: values.status,
        password: values.status === 1 ? values.password : ''
      };
      
      await RoomService.editRoom(params);
      setEditModalVisible(false);
      fetchRoomDetail(); // 刷新数据
    } catch (error) {
      console.error('编辑房间失败:', error);
    }
  };

  // 转让队长
  const handleTransferLeader = async () => {
    try {
      const values = await transferForm.validateFields();
      const params: RoomTransferRequest = {
        roomId: room?.id?.toString() || '0',
        newLeaderUserId: values.newLeaderUserId
      };
      
      await RoomService.transferLeader(params);
      setTransferModalVisible(false);
      transferForm.resetFields();
      fetchRoomDetail(); // 刷新数据
    } catch (error) {
      console.error('转让队长失败:', error);
    }
  };

  // 加入房间
  const handleJoinRoom = async () => {
    if (room?.status === 1) {
      // 私密房间需要密码
      setJoinModalVisible(true);
    } else {
      // 公开房间直接加入
      try {
        const params: RoomJoinRequest = {
          roomId: room?.id?.toString() || '0',
          password: ''
        };
        await RoomService.joinRoom(params);
        fetchRoomDetail(); // 刷新数据
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
        roomId: room?.id?.toString() || '0',
        password: values.password
      };
      
      await RoomService.joinRoom(params);
      setJoinModalVisible(false);
      joinForm.resetFields();
      fetchRoomDetail(); // 刷新数据
    } catch (error) {
      console.error('加入房间失败:', error);
    }
  };

  // 退出房间
  const handleQuitRoom = async () => {
    try {
      const params: RoomQuitRequest = {
        roomId: room?.id || 0
      };
      await RoomService.quitRoom(params);
      navigate('/room'); // 退出后返回房间列表
    } catch (error) {
      console.error('退出房间失败:', error);
    }
  };

  // 解散房间
  const handleDeleteRoom = async () => {
    try {
      await RoomService.deleteRoom(room?.id?.toString() || '0');
      message.success('房间已解散');
      navigate('/room'); // 解散后返回房间列表
    } catch (error) {
      console.error('解散房间失败:', error);
    }
  };

  // 返回房间列表
  const handleBack = () => {
    navigate('/room');
  };

  // 进入聊天室
  const handleEnterChat = () => {
    navigate(`/room/${roomId}/chat`);
  };

  if (loading) {
    return (
      <div className="room-detail-container">
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="room-detail-container">
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Text>房间不存在或已被删除</Text>
          <br />
          <Button type="primary" onClick={handleBack} style={{ marginTop: 16 }}>
            返回房间列表
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="room-detail-container">
      <div className="room-detail-header" style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
        >
          返回房间列表
        </Button>
      </div>

      <Row gutter={[32, 32]}>
        {/* 房间信息 */}
        <Col xs={24} lg={16}>
          <Card className="room-info-card">
            <div className="room-header">
              <div className="room-title-section">
                <Space direction="vertical" size={8}>
                  <Title level={2} style={{ margin: 0 }}>
                    {room.name}
                  </Title>
                  <Space size={8}>
                    {room.status === 1 ? (
                      <Tag color="orange" icon={<LockOutlined />}>私密</Tag>
                    ) : (
                      <Tag color="green" icon={<UnlockOutlined />}>公开</Tag>
                    )}
                    <Badge
                      count={`${room.currentNum || 0}/${room.mateNum || 0}`}
                      style={{ 
                        backgroundColor: isFull() ? '#ff4d4f' : '#228B22',
                        fontSize: 12
                      }}
                    />
                  </Space>
                </Space>
              </div>
              
              <Space className="room-actions" size={12} wrap>
                {isMember() && (
                  <Button
                    type="primary"
                    icon={<MessageOutlined />}
                    onClick={handleEnterChat}
                    size="large"
                  >
                    进入聊天室
                  </Button>
                )}
                
                {isLeader() && (
                  <>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => setEditModalVisible(true)}
                    >
                      编辑房间
                    </Button>
                    <Button
                      icon={<SwapOutlined />}
                      onClick={() => setTransferModalVisible(true)}
                      disabled={(room.members?.length || 0) <= 1}
                    >
                      转让队长
                    </Button>
                    <Popconfirm
                      title="确认解散房间？"
                      description="解散后房间将被永久删除，所有成员都会被移除"
                      onConfirm={handleDeleteRoom}
                      okText="确认"
                      cancelText="取消"
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        解散房间
                      </Button>
                    </Popconfirm>
                  </>
                )}
                
                {isMember() && !isLeader() && (
                  <Popconfirm
                    title="确认退出房间？"
                    onConfirm={handleQuitRoom}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Button icon={<LogoutOutlined />}>
                      退出房间
                    </Button>
                  </Popconfirm>
                )}
                
                {!isMember() && (
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={handleJoinRoom}
                    disabled={isFull()}
                    size="large"
                  >
                    {isFull() ? '房间已满' : '加入房间'}
                  </Button>
                )}
              </Space>
            </div>

            <Descriptions column={2} style={{ marginTop: 40 }} bordered size="middle">
              <Descriptions.Item label="房间描述" span={2}>
                {room.description || '暂无描述'}
              </Descriptions.Item>
              <Descriptions.Item label="队长">
                <Space size={8}>
                  <Avatar
                    src={room.userVO?.userAvatar}
                    icon={<UserOutlined />}
                    size={32}
                  />
                  <Text strong>{room.userVO?.userName || '未知'}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                <Space size={8}>
                  <CalendarOutlined style={{ color: '#8c8c8c' }} />
                  <Text>{room.createTime ? new Date(room.createTime).toLocaleString() : '未知'}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="房间人数">
                <Space size={8}>
                  <TeamOutlined style={{ color: '#8c8c8c' }} />
                  <Text strong>{room.currentNum || 0} / {room.mateNum || 0}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="房间状态">
                {room.status === 1 ? (
                  <Tag color="orange" icon={<LockOutlined />}>私密房间</Tag>
                ) : (
                  <Tag color="green" icon={<UnlockOutlined />}>公开房间</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 成员列表 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space size={8}>
                <TeamOutlined />
                <span>房间成员 ({room.members?.length || 0})</span>
              </Space>
            }
            className="room-members-card"
          >
            <List
              dataSource={room.members || []}
              renderItem={(member: RoomMemberVO) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge
                        dot={member.isLeader}
                        color="gold"
                        offset={[-4, 4]}
                      >
                        <Avatar
                          src={member.userVO?.userAvatar}
                          icon={<UserOutlined />}
                          size={40}
                        />
                      </Badge>
                    }
                    title={
                      <Space size={8}>
                        <Text strong>{member.userVO?.userName || '未知用户'}</Text>
                        {member.isLeader && (
                          <Tooltip title="队长">
                            <CrownOutlined style={{ color: '#faad14', fontSize: 16 }} />
                          </Tooltip>
                        )}
                      </Space>
                    }
                    description={
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        加入时间: {member.joinTime ? 
                          new Date(member.joinTime).toLocaleDateString() : 
                          '未知'
                        }
                      </Text>
                    }
                  />
                </List.Item>
              )}
              locale={{
                emptyText: '暂无成员'
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 编辑房间弹窗 */}
      <Modal
        title="编辑房间"
        open={editModalVisible}
        onOk={handleEditRoom}
        onCancel={() => setEditModalVisible(false)}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="房间名称"
            rules={[
              { required: true, message: '请输入房间名称' },
              { max: 20, message: '房间名称不能超过20个字符' }
            ]}
          >
            <Input placeholder="请输入房间名称" maxLength={20} />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="房间描述"
            rules={[
              { required: true, message: '请输入房间描述' },
              { max: 200, message: '房间描述不能超过200个字符' }
            ]}
          >
            <TextArea rows={3} placeholder="请输入房间描述" maxLength={200} />
          </Form.Item>
          
          <Form.Item
            name="mateNum"
            label="最大人数"
            rules={[
              { required: true, message: '请设置最大人数' },
              { type: 'number', min: room.currentNum || 1, message: `人数不能少于当前人数${room.currentNum}` },
              { type: 'number', max: 20, message: '人数不能超过20' }
            ]}
          >
            <Input type="number" placeholder="请输入最大人数" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="房间类型"
            rules={[{ required: true, message: '请选择房间类型' }]}
          >
            <Select placeholder="请选择房间类型">
              <Option value={0}>公开房间</Option>
              <Option value={1}>私密房间</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 转让队长弹窗 */}
      <Modal
        title="转让队长"
        open={transferModalVisible}
        onOk={handleTransferLeader}
        onCancel={() => {
          setTransferModalVisible(false);
          transferForm.resetFields();
        }}
        destroyOnClose
      >
        <div style={{ marginBottom: 24, padding: '12px 16px', background: '#fff7e6', borderRadius: 6, border: '1px solid #ffd591' }}>
          <Text type="warning">选择要转让队长身份的成员，转让后您将失去队长权限</Text>
        </div>
        <Form form={transferForm} layout="vertical">
          <Form.Item
            name="newLeaderUserId"
            label="选择新队长"
            rules={[{ required: true, message: '请选择新队长' }]}
          >
            <Select placeholder="请选择新队长">
              {room.members?.filter(member => !member.isLeader).map(member => (
                <Option key={member.userId} value={member.userId}>
                  <Space>
                    <Avatar
                      src={member.userVO?.userAvatar}
                      icon={<UserOutlined />}
                      size="small"
                    />
                    {member.userVO?.userName || '未知用户'}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 加入房间弹窗 */}
      <Modal
        title="加入房间"
        open={joinModalVisible}
        onOk={handleJoinConfirm}
        onCancel={() => {
          setJoinModalVisible(false);
          joinForm.resetFields();
        }}
        destroyOnClose
      >
        <Space direction="vertical" size={12} style={{ width: '100%', marginBottom: 24 }}>
          <div><Text strong>房间名称：</Text><Text>{room.name}</Text></div>
          <div><Text strong>房间描述：</Text><Text>{room.description || '暂无描述'}</Text></div>
        </Space>
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

export default RoomDetail;
