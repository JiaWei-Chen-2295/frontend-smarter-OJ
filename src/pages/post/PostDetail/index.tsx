import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Tag, message, Anchor } from 'antd';
import { ArrowLeftOutlined, HeartOutlined, HeartFilled, StarOutlined, StarFilled, UserOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { PostControllerService } from '../../../../generated/services/PostControllerService';
import { thumbPost, favourPost } from '../../../services/postService';
import type { PostVO } from '../../../../generated/models/PostVO';
import Veditor from '../../../components/Veditor';
import './PostDetail.css';

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<PostVO | null>(null);

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  const fetchPostDetail = async () => {
    setLoading(true);
    try {
      const resp = await PostControllerService.getPostVoByIdUsingGet(postId);
      if (resp.code === 0 && resp.data) {
        setPost(resp.data);
      }
    } catch (error) {
      message.error('获取帖子详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleThumb = () => {
    if (!post || !post.id) return;
    const newPost = { ...post };
    if (newPost.hasThumb) {
      newPost.thumbNum = (newPost.thumbNum || 0) - 1;
      newPost.hasThumb = false;
    } else {
      newPost.thumbNum = (newPost.thumbNum || 0) + 1;
      newPost.hasThumb = true;
    }
    setPost(newPost);
    thumbPost(String(post.id));
  };

  const handleFavour = () => {
    if (!post || !post.id) return;
    const newPost = { ...post };
    if (newPost.hasFavour) {
      newPost.favourNum = (newPost.favourNum || 0) - 1;
      newPost.hasFavour = false;
    } else {
      newPost.favourNum = (newPost.favourNum || 0) + 1;
      newPost.hasFavour = true;
    }
    setPost(newPost);
    favourPost(String(post.id));
  };

  const anchorItems = useMemo(() => {
    if (!post?.content) return [];
    const headings: { key: string; href: string; title: string; level: number }[] = [];
    const lines = post.content.split('\n');
    let headingIndex = 0;
    
    lines.forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const title = match[2].trim();
        const id = `heading-${headingIndex}`;
        headings.push({
          key: id,
          href: `#${id}`,
          title,
          level,
        });
        headingIndex++;
      }
    });
    
    return headings;
  }, [post?.content]);

  if (loading) {
    return (
      <div className="post-detail-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-error">
        <h2>帖子不存在</h2>
        <button onClick={() => navigate('/posts')}>返回帖子列表</button>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <div className="post-detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeftOutlined /> 返回
        </button>
      </div>

      <div className="post-detail-main">
        <div className="post-detail-content">
          <h1 className="post-detail-title">{post.title}</h1>

          <div className="post-detail-meta">
            <div className="post-detail-author">
              <div className="author-avatar">
                {post.user?.userAvatar ? (
                  <img src={post.user.userAvatar} alt={post.user.userName} />
                ) : (
                  <UserOutlined />
                )}
              </div>
              <div className="author-info">
                <div className="author-name">{post.user?.userName || '匿名用户'}</div>
                <div className="post-time">
                  <ClockCircleOutlined /> {new Date(post.createTime || '').toLocaleString()}
                </div>
              </div>
            </div>

            <div className="post-stats">
              <span className="stat-item">
                <EyeOutlined /> {((post.thumbNum || 0) + (post.favourNum || 0)) * 10}
              </span>
            </div>
          </div>

          {post.tagList && post.tagList.length > 0 && (
            <div className="post-detail-tags">
              {post.tagList.map(tag => (
                <Tag key={tag} color="blue">{tag}</Tag>
              ))}
            </div>
          )}

          <div className="post-detail-divider"></div>

          <div className="post-detail-body">
            <Veditor value={post.content || ''} enableAnchor={true} />
          </div>

          <div className="post-detail-divider"></div>

          <div className="post-detail-actions">
            <button 
              className={`action-btn ${post.hasThumb ? 'active-thumb' : ''}`}
              onClick={handleThumb}
            >
              {post.hasThumb ? <HeartFilled /> : <HeartOutlined />}
              <span>点赞 {post.thumbNum || 0}</span>
            </button>
            <button 
              className={`action-btn ${post.hasFavour ? 'active-favour' : ''}`}
              onClick={handleFavour}
            >
              {post.hasFavour ? <StarFilled /> : <StarOutlined />}
              <span>收藏 {post.favourNum || 0}</span>
            </button>
          </div>
        </div>

        <div className="post-detail-sidebar">
          {anchorItems.length > 0 && (
            <div className="sidebar-card">
              <h3>目录</h3>
              <Anchor
                affix={false}
                offsetTop={100}
                targetOffset={120}
                items={anchorItems.map(item => ({
                  key: item.key,
                  href: item.href,
                  title: item.title,
                }))}
                getCurrentAnchor={() => {
                  const scrollTop = window.scrollY;
                  for (let i = anchorItems.length - 1; i >= 0; i--) {
                    const element = document.getElementById(anchorItems[i].href.slice(1));
                    if (element && element.offsetTop - 150 <= scrollTop) {
                      return anchorItems[i].href;
                    }
                  }
                  return '';
                }}
                onClick={(e, link) => {
                  e.preventDefault();
                  const id = link.href.replace('#', '');
                  const element = document.getElementById(id);
                  if (element) {
                    const offsetTop = element.offsetTop - 120;
                    window.scrollTo({
                      top: offsetTop,
                      behavior: 'smooth'
                    });
                  }
                }}
              />
            </div>
          )}
          
          <div className="sidebar-card">
            <h3>作者信息</h3>
            <div className="sidebar-author">
              <div className="sidebar-author-avatar">
                {post.user?.userAvatar ? (
                  <img src={post.user.userAvatar} alt={post.user.userName} />
                ) : (
                  <div className="default-avatar"><UserOutlined /></div>
                )}
              </div>
              <div className="sidebar-author-name">{post.user?.userName || '匿名用户'}</div>
              {post.user?.userProfile && (
                <div className="sidebar-author-bio">{post.user.userProfile}</div>
              )}
            </div>
          </div>

          <div className="sidebar-card">
            <h3>帖子信息</h3>
            <div className="sidebar-info">
              <div className="info-item">
                <span className="info-label">发布时间</span>
                <span className="info-value">{new Date(post.createTime || '').toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">更新时间</span>
                <span className="info-value">{new Date(post.updateTime || '').toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">点赞数</span>
                <span className="info-value">{post.thumbNum || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">收藏数</span>
                <span className="info-value">{post.favourNum || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
