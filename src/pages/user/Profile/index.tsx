import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Avatar, message, Upload } from 'antd';
import { UserOutlined, UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { UserControllerService } from '../../../../generated';
import type { UserUpdateMyRequest } from '../../../../generated/models/UserUpdateMyRequest';
import type { LoginUserVO } from '../../../../generated/models/LoginUserVO';
import { FileControllerService } from '../../../../generated/services/FileControllerService';
import './index.css';

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<LoginUserVO | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0 && res.data) {
        setUserInfo(res.data);
        setAvatarUrl(res.data.userAvatar || '');
        form.setFieldsValue({
          userName: res.data.userName,
          userProfile: res.data.userProfile,
        });
      }
    } catch (error) {
      message.error('加载用户信息失败');
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const res = await FileControllerService.uploadFileUsingPost(file);
      if (res.code === 0) {
        setAvatarUrl(res.data || '');
        message.success('头像上传成功');
      } else {
        message.error('头像上传失败');
      }
    } catch (error) {
      message.error('头像上传失败');
    }
    return false;
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const request: UserUpdateMyRequest = {
        userName: values.userName,
        userProfile: values.userProfile,
        userAvatar: avatarUrl,
      };
      const res = await UserControllerService.updateMyUserUsingPost(request);
      if (res.code === 0) {
        message.success('更新成功');
        await loadUserInfo();
      } else {
        message.error(res.message || '更新失败');
      }
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        className="back-btn"
      >
        返回
      </Button>
      <Card className="profile-card">
        <div className="profile-header">
          <Avatar size={100} src={avatarUrl} icon={<UserOutlined />} />
          <Upload
            showUploadList={false}
            beforeUpload={handleUpload}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} className="upload-btn">
              上传头像
            </Button>
          </Upload>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="profile-form"
        >
          <Form.Item
            label="用户名"
            name="userName"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item label="个人简介" name="userProfile">
            <Input.TextArea rows={4} placeholder="请输入个人简介" />
          </Form.Item>

          <Form.Item label="用户角色">
            <Input value={userInfo?.userRole} disabled />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
