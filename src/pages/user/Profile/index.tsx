import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Avatar, message, Upload, Spin, Tag, Modal } from 'antd';
import { UserOutlined, UploadOutlined, ArrowLeftOutlined, HeartOutlined, HeartFilled, StarOutlined, StarFilled, PlusOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { UserControllerService } from '../../../../generated';
import type { UserUpdateMyRequest } from '../../../../generated/models/UserUpdateMyRequest';
import type { LoginUserVO } from '../../../../generated/models/LoginUserVO';
import type { PostVO } from '../../../../generated/models/PostVO';
import { FileControllerService } from '../../../../generated/services/FileControllerService';
import { createPost, thumbPost, favourPost, getMyPosts } from '../../../services/postService';
import MarkDownNewEditor from '../../../components/MarkDownNewEditor';
import './index.css';

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<LoginUserVO | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [posts, setPosts] = useState<PostVO[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUserInfo();
    fetchPosts();
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

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const resp = await getMyPosts({ current: 1, pageSize: 10 });
      if (resp.code === 0 && resp.data) {
        setPosts(resp.data.records || []);
      }
    } catch (error) {
      message.error('获取帖子失败');
    } finally {
      setPostsLoading(false);
    }
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
        setEditMode(false);
      } else {
        message.error(res.message || '更新失败');
      }
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!title.trim()) {
      message.warning('请输入标题');
      return;
    }
    try {
      await createPost({ title, content, tags });
      message.success('发布成功');
      setIsModalOpen(false);
      setTitle('');
      setContent('');
      setTags([]);
      fetchPosts();
    } catch (error) {
      message.error('发布失败');
    }
  };

  const handleThumb = (index: number) => {
    const newPosts = [...posts];
    const post = newPosts[index];
    if (!post.id) return;
    if (post.hasThumb) {
      post.thumbNum = (post.thumbNum || 0) - 1;
      post.hasThumb = false;
    } else {
      post.thumbNum = (post.thumbNum || 0) + 1;
      post.hasThumb = true;
    }
    setPosts(newPosts);
    thumbPost(String(post.id));
  };

  const handleFavour = (index: number) => {
    const newPosts = [...posts];
    const post = newPosts[index];
    if (!post.id) return;
    if (post.hasFavour) {
      post.favourNum = (post.favourNum || 0) - 1;
      post.hasFavour = false;
    } else {
      post.favourNum = (post.favourNum || 0) + 1;
      post.hasFavour = true;
    }
    setPosts(newPosts);
    favourPost(String(post.id));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
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

      <div className="profile-main">
        <div className="profile-sidebar">
          <Card className="profile-info-card">
            <div className="profile-avatar-section">
              <Avatar size={80} src={avatarUrl} icon={<UserOutlined />} />
              {editMode && (
                <Upload
                  showUploadList={false}
                  beforeUpload={handleUpload}
                  accept="image/*"
                >
                  <Button size="small" icon={<UploadOutlined />} className="upload-btn">
                    上传头像
                  </Button>
                </Upload>
              )}
            </div>

            {!editMode ? (
              <div className="profile-info">
                <h2>{userInfo?.userName}</h2>
                <p className="profile-bio">{userInfo?.userProfile || '暂无个人简介'}</p>
                <div className="profile-meta">
                  <div className="meta-item">
                    <span className="meta-label">角色</span>
                    <span className="meta-value">{userInfo?.userRole}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">帖子</span>
                    <span className="meta-value">{posts.length}</span>
                  </div>
                </div>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  onClick={() => setEditMode(true)}
                  block
                >
                  编辑资料
                </Button>
              </div>
            ) : (
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="profile-edit-form"
              >
                <Form.Item
                  label="用户名"
                  name="userName"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input placeholder="请输入用户名" />
                </Form.Item>

                <Form.Item label="个人简介" name="userProfile">
                  <Input.TextArea rows={3} placeholder="请输入个人简介" />
                </Form.Item>

                <div className="edit-actions">
                  <Button onClick={() => setEditMode(false)}>
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    保存
                  </Button>
                </div>
              </Form>
            )}
          </Card>
        </div>

        <div className="profile-content">
          <div className="posts-header">
            <h2>我的帖子</h2>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsModalOpen(true)}
            >
              发布帖子
            </Button>
          </div>

          <div className="posts-list">
            {postsLoading ? (
              <div className="posts-loading">
                <Spin size="large" />
              </div>
            ) : posts.length === 0 ? (
              <div className="posts-empty">
                <div className="posts-empty-icon">📝</div>
                <div className="posts-empty-text">暂无帖子，快来发布第一篇吧！</div>
              </div>
            ) : (
              posts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="post-item"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <h3 className="post-item-title">{post.title}</h3>
                  <div className="post-item-content">{post.content}</div>
                  
                  {post.tagList && post.tagList.length > 0 && (
                    <div className="post-item-tags">
                      {post.tagList.map(tag => (
                        <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                    </div>
                  )}

                  <div className="post-item-footer">
                    <span className="post-item-time">
                      <ClockCircleOutlined /> {new Date(post.createTime || '').toLocaleDateString()}
                    </span>
                    <div className="post-item-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className={`action-icon ${post.hasThumb ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleThumb(index);
                        }}
                      >
                        {post.hasThumb ? <HeartFilled /> : <HeartOutlined />}
                        <span>{post.thumbNum || 0}</span>
                      </button>
                      <button
                        className={`action-icon ${post.hasFavour ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavour(index);
                        }}
                      >
                        {post.hasFavour ? <StarFilled /> : <StarOutlined />}
                        <span>{post.favourNum || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        title="发布新帖子"
        open={isModalOpen}
        onOk={handleCreatePost}
        onCancel={() => setIsModalOpen(false)}
        width={800}
        okText="发布"
        cancelText="取消"
      >
        <div className="create-post-form">
          <input
            className="post-title-input"
            placeholder="输入标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="post-tags-input">
            <input
              placeholder="添加标签（按回车）"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <button onClick={addTag}>添加</button>
          </div>

          {tags.length > 0 && (
            <div className="post-tags">
              {tags.map(tag => (
                <Tag key={tag} closable onClose={() => removeTag(tag)} color="blue">
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          <MarkDownNewEditor
            defaultValue=""
            onValueChange={(val) => setContent(val)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
