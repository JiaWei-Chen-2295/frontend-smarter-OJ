import { useState, useEffect } from 'react';
import { Avatar, Button, Empty, Input, Modal, Pagination, Spin, Tag, message } from 'antd';
import { Link } from 'react-router-dom';
import { ClockCircleOutlined, FileTextOutlined, HeartFilled, HeartOutlined, PlusOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import MarkdownPreview from '../../../components/MarkdownPreview';
import MarkDownNewEditor from '../../../components/MarkDownNewEditor';
import { createPost, thumbPost, favourPost, getMyPosts, getAllPosts } from '../../../services/postService';
import type { PostVO } from '../../../../generated/models/PostVO';
import '../../../styles/uiuxpro.css';
import './Posts.css';

const Posts: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostVO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
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
    if (creating) return;
    setCreating(true);
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
    } finally {
      setCreating(false);
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

  const stripMarkdown = (value: string) => {
    return value
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`[^`]*`/g, ' ')
      .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
      .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
      .replace(/[#>*_\-|~]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const getReadMinutes = (markdown?: string) => {
    const text = stripMarkdown(markdown || '');
    if (!text) return 1;
    return Math.max(1, Math.round(text.length / 360));
  };

  return (
    <div className="uiux-scope uiux-page uiux-posts-page">
      <div className="uiux-hero">
        <div className="uiux-hero-inner">
          <div>
            <h1 className="uiux-hero-title">帖子</h1>
            <p className="uiux-hero-subtitle">分享刷题经验、复盘思路与学习笔记</p>
          </div>
          <button className="uiux-button-primary uiux-focusable" type="button" onClick={() => setIsModalOpen(true)}>
            <PlusOutlined /> 发布帖子
          </button>
        </div>
      </div>

      <div className="posts-toolbar uiux-card">
        <div className="posts-tabs uiux-tabs" role="tablist" aria-label="帖子视图">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'my'}
            className={`posts-tab uiux-tab ${viewMode === 'my' ? 'active uiux-tab-active' : ''}`}
            onClick={() => setViewMode('my')}
          >
            我的帖子
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'all'}
            className={`posts-tab uiux-tab ${viewMode === 'all' ? 'active uiux-tab-active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            全部帖子
          </button>
        </div>
      </div>

      <div className="posts-container">
        {loading ? (
          <div className="posts-loading uiux-card" aria-busy="true" aria-live="polite">
            <Spin size="large" />
          </div>
        ) : posts.length === 0 ? (
          <div className="posts-empty uiux-card">
            <Empty
              image={<FileTextOutlined style={{ fontSize: 48, color: 'rgba(100, 116, 139, 0.6)' }} />}
              description={<span className="posts-empty-text">暂无帖子</span>}
            />
          </div>
        ) : (
          posts.map((post, index) => (
            <div key={post.id} className="uiux-post-card uiux-card">
              <div className="uiux-post-top">
                <div className="uiux-post-author">
                  <Avatar
                    size={32}
                    src={post.user?.userAvatar}
                    style={{ backgroundColor: 'rgba(240, 253, 244, 1)', color: 'rgba(22, 163, 74, 1)' }}
                  >
                    {(post.user?.userName || '匿').slice(0, 1)}
                  </Avatar>
                  <div className="uiux-post-author-meta">
                    <div className="uiux-post-author-name">{post.user?.userName || '匿名'}</div>
                    <div className="uiux-post-submeta">
                      <span className="uiux-post-submeta-item">
                        <ClockCircleOutlined /> {new Date(post.createTime || '').toLocaleDateString()}
                      </span>
                      <span className="uiux-post-dot">·</span>
                      <span className="uiux-post-submeta-item">{getReadMinutes(post.content)} 分钟阅读</span>
                    </div>
                  </div>
                </div>
                <div className="uiux-post-actions">
                  <button
                    className={`uiux-post-action ${post.hasThumb ? 'active' : ''}`}
                    onClick={() => handleThumb(index)}
                    type="button"
                    aria-label={`点赞，当前 ${post.thumbNum || 0}`}
                    aria-pressed={!!post.hasThumb}
                  >
                    {post.hasThumb ? <HeartFilled /> : <HeartOutlined />}
                    <span>{post.thumbNum || 0}</span>
                  </button>
                  <button
                    className={`uiux-post-action ${post.hasFavour ? 'active' : ''}`}
                    onClick={() => handleFavour(index)}
                    type="button"
                    aria-label={`收藏，当前 ${post.favourNum || 0}`}
                    aria-pressed={!!post.hasFavour}
                  >
                    {post.hasFavour ? <StarFilled /> : <StarOutlined />}
                    <span>{post.favourNum || 0}</span>
                  </button>
                </div>
              </div>

              <Link className="uiux-post-title uiux-focusable" to={`/post/${post.id}`}>
                {post.title}
              </Link>

              <MarkdownPreview value={post.content || ''} />

              {(post.tagList?.length || 0) > 0 && (
                <div className="uiux-post-tags">
                  {post.tagList!.slice(0, 3).map(tag => (
                    <span key={tag} className="uiux-post-tag">
                      {tag}
                    </span>
                  ))}
                  {post.tagList!.length > 3 && (
                    <span className="uiux-post-tag uiux-post-tag-muted">+{post.tagList!.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {total > 10 && (
        <div className="posts-pagination uiux-card">
          <Pagination
            current={currentPage}
            pageSize={10}
            total={total}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
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
        confirmLoading={creating}
        okButtonProps={{ disabled: !title.trim() }}
        className="uiux-scope"
      >
        <div className="create-post-form">
          <Input
            size="large"
            className="post-title-input"
            placeholder="输入标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            showCount
          />
          
          <div className="post-tags-input">
            <Input
              placeholder="添加标签（按回车）"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              maxLength={24}
            />
            <Button type="primary" onClick={addTag} disabled={!tagInput.trim()}>
              添加
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="post-tags">
              {tags.map(tag => (
                <Tag key={tag} closable onClose={() => removeTag(tag)} color="green">
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
