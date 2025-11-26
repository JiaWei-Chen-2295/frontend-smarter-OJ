import { useState, useEffect } from 'react';
import { Card, Modal, message, Spin, Tag } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { RootState } from "../../../context/store.ts";
import MarkDownNewEditor from "../../../components/MarkDownNewEditor.tsx";
import { HeartOutlined, HeartFilled, StarOutlined, StarFilled, PlusOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { createPost, thumbPost, favourPost, getMyPosts } from '../../../services/postService';
import type { PostVO } from '../../../../generated/models/PostVO';
import '../Posts/Posts.css';

function OJMain() {
    const navigate = useNavigate();
    const currentUser = useSelector<RootState, OJModel.User | null>(state => state?.User?.currentUser);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<PostVO[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const resp = await getMyPosts({ current: 1, pageSize: 5 });
            if (resp.code === 0 && resp.data) {
                setPosts(resp.data.records || []);
            }
        } catch (error) {
            message.error('获取帖子失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

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
        <>
            <Card
                title={`欢迎来到 Smarter OJ, ${currentUser?.userName === undefined ? "游客朋友" : currentUser.userName}`}
                variant={"outlined"}
                size={"small"}
            >
                开始今天的随机练习
            </Card>

            <div className="max-w-6xl mx-auto px-6 py-6">
                <div className="posts-header">
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>我的帖子</h2>
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
                            <div className="posts-empty-text">暂无帖子，快来发布第一篇吧！</div>
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
        </>
    )
}

export default OJMain;
