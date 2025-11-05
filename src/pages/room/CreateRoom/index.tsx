import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../context/store';
import { getCurrentUser } from '../../../features/userSlice';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Space,
  message,
  Row,
  Col,
  Typography,
  Alert,
  Divider
} from 'antd';
import {
  ArrowLeftOutlined,
  TeamOutlined,
  LockOutlined,
  FileTextOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RoomService } from '../../../services/room';
import type { RoomAddRequest } from '../../../../generated';
import './index.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.User.currentUser);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [canCreate, setCanCreate] = useState(true);
  const [checkingPermission, setCheckingPermission] = useState(true);
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);

  // 获取当前用户信息
  useEffect(() => {
    if (!currentUser) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, currentUser]);

  // 检查是否可以创建房间
  useEffect(() => {
    const checkCreatePermission = async () => {
      if (!currentUser?.id) {
        setCanCreate(false);
        setCheckingPermission(false);
        return;
      }

      try {
        const canCreateRoom = await RoomService.canCreateRoom(currentUser.id);
        setCanCreate(canCreateRoom);
      } catch (error) {
        console.error('检查创建权限失败:', error);
        setCanCreate(true); // 默认允许创建
      } finally {
        setCheckingPermission(false);
      }
    };

    if (currentUser) {
      checkCreatePermission();
    }
  }, [currentUser]);

  // 表单提交
  const onFinish = async (values: {
    name: string;
    description: string;
    mateNum: number;
    isPrivate: boolean;
    password?: string;
  }) => {
    if (!canCreate) {
      message.error('您已创建过房间，每人只能创建一个房间');
      return;
    }

    setLoading(true);
    try {
      const params: RoomAddRequest = {
        name: values.name,
        description: values.description,
        mateNum: values.mateNum,
        status: values.isPrivate ? 1 : 0,
        password: values.isPrivate ? values.password : ''
      };

      const response = await RoomService.addRoom(params);
      if (response.code === 0) {
        message.success('房间创建成功！');
        // 跳转到房间详情页
        navigate(`/room/${response.data}`);
      }
    } catch (error) {
      console.error('创建房间失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 返回房间列表
  const handleBack = () => {
    navigate('/room');
  };

  // 私密房间开关变化
  const handlePrivateChange = (checked: boolean) => {
    setIsPrivateRoom(checked);
    if (!checked) {
      // 如果关闭私密，清空密码
      form.setFieldValue('password', '');
    }
  };

  if (checkingPermission) {
    return (
      <div className="create-room-container">
        <Card loading style={{ maxWidth: 600, margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="create-room-container">
      <div className="create-room-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{ marginBottom: 16 }}
        >
          返回房间列表
        </Button>
      </div>

      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card className="create-room-card">
            <div className="create-room-title">
              <TeamOutlined className="title-icon" />
              <Title level={2}>创建房间</Title>
            </div>

            {!canCreate && (
              <Alert
                message="创建限制"
                description="您已创建过房间，每人只能创建一个房间。如需创建新房间，请先删除现有房间。"
                type="warning"
                showIcon
                style={{ marginBottom: 24 }}
                action={
                  <Button size="small" onClick={() => navigate('/room/my')}>
                    查看我的房间
                  </Button>
                }
              />
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              disabled={!canCreate}
              initialValues={{
                mateNum: 4,
                isPrivate: false
              }}
            >
              <Form.Item
                name="name"
                label="房间名称"
                rules={[
                  { required: true, message: '请输入房间名称' },
                  { max: 20, message: '房间名称不能超过20个字符' }
                ]}
              >
                <Input
                  placeholder="请输入房间名称"
                  prefix={<FileTextOutlined />}
                  maxLength={20}
                  showCount
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="房间描述"
                rules={[
                  { required: true, message: '请输入房间描述' },
                  { max: 200, message: '房间描述不能超过200个字符' }
                ]}
              >
                <TextArea
                  placeholder="请简单描述一下这个房间的用途，比如：Java基础练习、算法竞赛准备等"
                  rows={3}
                  maxLength={200}
                  showCount
                />
              </Form.Item>

              <Form.Item
                name="mateNum"
                label="最大人数"
                rules={[
                  { required: true, message: '请设置最大人数' },
                  { type: 'number', min: 2, max: 20, message: '人数限制在2-20人之间' }
                ]}
                extra="包括您在内的房间最大人数"
              >
                <InputNumber
                  min={2}
                  max={20}
                  style={{ width: '100%' }}
                  placeholder="请输入最大人数"
                  prefix={<TeamOutlined />}
                />
              </Form.Item>

              <Divider />

              <Form.Item
                name="isPrivate"
                label="房间设置"
                valuePropName="checked"
              >
                <div className="room-privacy-setting">
                  <div className="privacy-option">
                    <Switch
                      checkedChildren="私密"
                      unCheckedChildren="公开"
                      onChange={handlePrivateChange}
                    />
                    <div className="privacy-description">
                      <Text strong>
                        {isPrivateRoom ? '私密房间' : '公开房间'}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {isPrivateRoom 
                          ? '需要密码才能加入，适合朋友间使用'
                          : '任何人都可以直接加入'
                        }
                      </Text>
                    </div>
                  </div>
                </div>
              </Form.Item>

              {isPrivateRoom && (
                <Form.Item
                  name="password"
                  label="房间密码"
                  rules={[
                    { required: true, message: '私密房间必须设置密码' },
                    { min: 4, message: '密码至少4位' },
                    { max: 20, message: '密码不能超过20位' }
                  ]}
                >
                  <Input.Password
                    placeholder="请设置房间密码"
                    prefix={<LockOutlined />}
                    maxLength={20}
                  />
                </Form.Item>
              )}

              <div className="create-room-tips">
                <Alert
                  message="温馨提示"
                  description={
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      <li>每人只能创建一个房间</li>
                      <li>作为队长，您可以编辑房间信息和转让队长身份</li>
                      <li>队长退出房间将导致房间解散</li>
                      <li>房间无人时将自动删除</li>
                    </ul>
                  }
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined />}
                />
              </div>

              <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'center' }}>
                  <Button onClick={handleBack}>
                    取消
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={!canCreate}
                    size="large"
                  >
                    创建房间
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateRoom;
