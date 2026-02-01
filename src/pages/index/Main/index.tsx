import { useState, useEffect } from 'react';
import { Avatar, Modal, message, Spin, Tag, Progress } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { RootState } from "../../../context/store.ts";
import MarkDownNewEditor from "../../../components/MarkDownNewEditor.tsx";
import { HeartOutlined, HeartFilled, StarOutlined, StarFilled, PlusOutlined, UserOutlined, ClockCircleOutlined, RightOutlined, FireOutlined, TrophyOutlined, BookOutlined, CodeOutlined } from '@ant-design/icons';
import { createPost, thumbPost, favourPost, getAllPosts } from '../../../services/postService';
import { getAllQuestionSets } from '../../../services/questionSetService';
import type { PostVO } from '../../../../generated_new/post';
import type { QuestionSetVO } from '../../../../generated_new/question';
import { Fire, Target, ChartLine, Code, BookOpen } from '@icon-park/react';
import Heatmap from '../../../components/Heatmap';
import '../Posts/Posts.css';
import MarkdownPreview from '../../../components/MarkdownPreview';
import '../../../styles/uiuxpro.css';
import './Main.css';

const StudyPlanCard = ({ title, progress, total, icon, color }: { title: string; progress: number; total: number; icon: React.ReactNode; color: string }) => (
    <div className="study-plan-card">
        <div className={`study-plan-icon ${color}`}>{icon}</div>
        <div className="study-plan-content">
            <h3 className="study-plan-title">{title}</h3>
            <div className="study-plan-progress-info">
                <span>完成进度</span>
                <span>{progress} / {total}</span>
            </div>
            <Progress percent={Math.round((progress / total) * 100)} showInfo={false} strokeColor="#52c41a" size="small" />
        </div>
    </div>
);

function OJMain() {
    const navigate = useNavigate();
    const currentUser = useSelector<RootState, OJModel.User | null>(state => state?.User?.currentUser);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<PostVO[]>([]);
    const [studyPlans, setStudyPlans] = useState<QuestionSetVO[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [activeTab, setActiveTab] = useState('推荐');
    const tabList = ['推荐', '关注', '热门', '最新'];

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const resp = await getAllPosts({ current: 1, pageSize: 5 });
            if (resp.code === 0 && resp.data) {
                setPosts(resp.data.records || []);
            }
        } catch (error) {
            message.error('获取帖子失败');
        } finally {
            setLoading(false);
        }
    };

    const fetchStudyPlans = async () => {
        try {
            const resp = await getAllQuestionSets({ current: 1, pageSize: 3, sortField: 'createTime', sortOrder: 'descend' });
            if (resp.code === 0 && resp.data) {
                setStudyPlans(resp.data.records || []);
            }
        } catch (error) {
            console.error('Fetch study plans failed', error);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchStudyPlans();
    }, []);

    const handleCreatePost = async () => {
        if (!title.trim()) { message.warning('请输入标题'); return; }
        try {
            await createPost({ title, content, tags });
            message.success('发布成功');
            setIsModalOpen(false);
            setTitle(''); setContent(''); setTags([]);
            fetchPosts();
        } catch { message.error('发布失败'); }
    };

    const handleThumb = (index: number) => {
        const newPosts = [...posts];
        const post = newPosts[index];
        if (!post.id) return;
        post.hasThumb ? (post.thumbNum = (post.thumbNum || 0) - 1, post.hasThumb = false) : (post.thumbNum = (post.thumbNum || 0) + 1, post.hasThumb = true);
        setPosts(newPosts);
        thumbPost(String(post.id));
    };

    const handleFavour = (index: number) => {
        const newPosts = [...posts];
        const post = newPosts[index];
        if (!post.id) return;
        post.hasFavour ? (post.favourNum = (post.favourNum || 0) - 1, post.hasFavour = false) : (post.favourNum = (post.favourNum || 0) + 1, post.hasFavour = true);
        setPosts(newPosts);
        favourPost(String(post.id));
    };

    const addTag = () => { if (tagInput.trim() && !tags.includes(tagInput.trim())) { setTags([...tags, tagInput.trim()]); setTagInput(''); } };
    const removeTag = (tag: string) => { setTags(tags.filter(t => t !== tag)); };

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
        <div className="uiux-scope main-container">
            <div className="welcome-banner">
                <div className="welcome-content">
                    <h1>欢迎回来，{currentUser?.userName || '游客朋友'}</h1>
                    <p>开始今天的编程练习，提升你的算法能力</p>
                </div>
                <div className="welcome-actions">
                    <button className="btn-primary" onClick={() => navigate('/qs')}>
                        <FireOutlined /> 开始刷题
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/room')}>
                        <TrophyOutlined /> 协作房间
                    </button>
                </div>
            </div>

            <div className="study-plans">
                {studyPlans.length > 0 && studyPlans.map((plan, index) => {
                    const icons = [
                        { icon: <BookOpen theme="outline" size="24" fill="#fff" />, color: "bg-blue" },
                        { icon: <Target theme="outline" size="24" fill="#fff" />, color: "bg-green" },
                        { icon: <Fire theme="outline" size="24" fill="#fff" />, color: "bg-orange" }
                    ];
                    const style = icons[index % icons.length];
                    return (
                        <div key={plan.id} onClick={() => navigate(`/question-set/${plan.id}`)} style={{ cursor: 'pointer' }}>
                            <StudyPlanCard
                                title={plan.title || '未命名题单'}
                                progress={0}
                                total={plan.questionNum || 0}
                                icon={style.icon}
                                color={style.color}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="main-grid">
                <div className="main-content">
                    <div className="content-tabs uiux-tabs" role="tablist" aria-label="内容分类">
                        {tabList.map(tab => (
                            <button
                                key={tab}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab}
                                className={`tab-btn uiux-tab ${activeTab === tab ? 'active uiux-tab-active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="content-feed">
                        <div className="posts-section">
                            <div className="section-header">
                                <div className="section-title"><BookOutlined /> 最新帖子</div>
                                <button className="posts-create-btn" onClick={() => setIsModalOpen(true)}><PlusOutlined /> 发布</button>
                            </div>
                            {loading ? <div className="posts-loading"><Spin size="large" /></div> : posts.length === 0 ? (
                                <div className="posts-empty"><div className="posts-empty-icon">📝</div><div className="posts-empty-text">暂无帖子</div></div>
                            ) : posts.map((post, index) => (
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

                                    <button
                                        type="button"
                                        className="uiux-post-title uiux-focusable"
                                        onClick={() => navigate(`/post/${post.id}`)}
                                    >
                                        {post.title}
                                    </button>

                                    <MarkdownPreview value={post.content || ''} />

                                    {(post.tagList?.length || 0) > 0 && (
                                        <div className="uiux-post-tags">
                                            {post.tagList!.slice(0, 3).map(tag => (
                                                <span key={tag} className="uiux-post-tag">{tag}</span>
                                            ))}
                                            {post.tagList!.length > 3 && (
                                                <span className="uiux-post-tag uiux-post-tag-muted">+{post.tagList!.length - 3}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="main-sidebar">
                    <div className="sidebar-card">
                        <div className="sidebar-divider" />
                        <Heatmap range="month" />
                    </div>
                </div>
            </div>

            <Modal title="发布新帖子" open={isModalOpen} onOk={handleCreatePost} onCancel={() => setIsModalOpen(false)} width={800} okText="发布" cancelText="取消">
                <div className="create-post-form">
                    <input className="post-title-input" placeholder="输入标题" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <div className="post-tags-input">
                        <input placeholder="添加标签（按回车）" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTag()} />
                        <button onClick={addTag}>添加</button>
                    </div>
                    {tags.length > 0 && <div className="post-tags">{tags.map(tag => <Tag key={tag} closable onClose={() => removeTag(tag)} color="blue">{tag}</Tag>)}</div>}
                    <MarkDownNewEditor defaultValue="" onValueChange={(val) => setContent(val)} />
                </div>
            </Modal>
        </div>
    );
}

export default OJMain;
