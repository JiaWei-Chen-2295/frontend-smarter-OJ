import { useState, useEffect } from 'react';
import { Modal, message, Spin, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HeartOutlined, HeartFilled, StarOutlined, StarFilled, PlusOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import MarkDownNewEditor from '../../../components/MarkDownNewEditor';
import { createPost, thumbPost, favourPost, getMyPosts, getAllPosts } from '../../../services/postService';
import type { PostVO } from '../../../../generated/models/PostVO';
import './Posts.css';

const Posts: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostVO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [viewMode, setViewMode] = useState<'my' | 'all'>('my');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const resp = viewMode === 'my' 
        ? await getMyPosts({ current: page, pageSize: 10 })
        : await getAllPosts({ current: page, pageSize: 10 });
      
      if (resp.code === 0 && resp.data) {
        setPosts(resp.data.records || []);
        setTotal(Number(resp.data.total) || 0);
      }
    } catch (error) {
      message.error('获取帖子失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [viewMode, currentPage]);

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
      fetchPosts(1);
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
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="posts-header">
        <div className="posts-tabs">
          <button 
            className={`posts-tab ${viewMode === 'my' ? 'active' : ''}`}
            onClick={() => setViewMode('my')}
          >
            我的帖子
          </button>
          <button 
            className={`posts-tab ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            全部帖子
          </button>
        </div>
        <button className="posts-create-btn" onClick={() => setIsModalOpen(true)}>
          <PlusOutlined /> 发布帖子
        </button>
      </div>

      <div className="posts-container">
        {loading ? (
          <div className="posts-loading">
            <Spin size="large" />
          </div>
        ) : posts.length === 0 ? (
          <div className="posts-empty">
            <div className="posts-empty-icon">📝</div>
            <div className="posts-empty-text">暂无帖子</div>
          </div>
        ) : (
          posts.map((post, index) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h3 
                  className="post-title" 
                  onClick={() => navigate(`/post/${post.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {post.title}
                </h3>
                <div className="post-meta">
                  <span className="post-author">
                    <UserOutlined /> {post.user?.userName || '匿名'}
                  </span>
                  <span className="post-time">
                    <ClockCircleOutlined /> {new Date(post.createTime || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="post-content">{post.content}</div>
              
              {post.tagList && post.tagList.length > 0 && (
                <div className="post-tags">
                  {post.tagList.map(tag => (
                    <Tag key={tag} color="blue">{tag}</Tag>
                  ))}
                </div>
              )}
              
              <div className="post-actions">
                <button 
                  className={`post-action-btn ${post.hasThumb ? 'active' : ''}`}
                  onClick={() => handleThumb(index)}
                >
                  {post.hasThumb ? <HeartFilled /> : <HeartOutlined />}
                  <span>{post.thumbNum || 0}</span>
                </button>
                <button 
                  className={`post-action-btn ${post.hasFavour ? 'active' : ''}`}
                  onClick={() => handleFavour(index)}
                >
                  {post.hasFavour ? <StarFilled /> : <StarOutlined />}
                  <span>{post.favourNum || 0}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {total > 10 && (
        <div className="posts-pagination">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            上一页
          </button>
          <span>{currentPage} / {Math.ceil(total / 10)}</span>
          <button 
            disabled={currentPage >= Math.ceil(total / 10)}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            下一页
          </button>
        </div>
      )}

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

export default Posts;
