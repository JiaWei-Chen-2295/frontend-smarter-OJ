import { useState, useEffect } from 'react';
import { Modal, message, Spin, Tag, Progress } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { RootState } from "../../../context/store.ts";
import MarkDownNewEditor from "../../../components/MarkDownNewEditor.tsx";
import { HeartOutlined, HeartFilled, StarOutlined, StarFilled, PlusOutlined, UserOutlined, ClockCircleOutlined, RightOutlined, FireOutlined, TrophyOutlined, BookOutlined, CodeOutlined } from '@ant-design/icons';
import { createPost, thumbPost, favourPost, getMyPosts } from '../../../services/postService';
import { getAllQuestionSets } from '../../../services/questionSetService';
import type { PostVO } from '../../../../generated_new/post';
import type { QuestionSetVO } from '../../../../generated_new/question';
import { Fire, Target, ChartLine, Code, BookOpen } from '@icon-park/react';
import Heatmap from '../../../components/Heatmap';
import '../Posts/Posts.css';
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

    return (
        <div className="main-container">
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
                    <div className="content-tabs">
                        {tabList.map(tab => (
                            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                                {tab}
                                {activeTab === tab && <div className="tab-indicator" />}
                            </button>
                        ))}
                    </div>

                    <div className="content-feed">
                        <div className="posts-section">
                            <div className="section-header">
                                <div className="section-title"><BookOutlined /> 我的帖子</div>
                                <button className="posts-create-btn" onClick={() => setIsModalOpen(true)}><PlusOutlined /> 发布</button>
                            </div>
                            {loading ? <div className="posts-loading"><Spin size="large" /></div> : posts.length === 0 ? (
                                <div className="posts-empty"><div className="posts-empty-icon">📝</div><div className="posts-empty-text">暂无帖子</div></div>
                            ) : posts.map((post, index) => (
                                <div key={post.id} className="post-card">
                                    <div className="post-header">
                                        <h3 className="post-title" onClick={() => navigate(`/post/${post.id}`)}>{post.title}</h3>
                                        <div className="post-meta">
                                            <span><UserOutlined /> {post.user?.userName || '匿名'}</span>
                                            <span><ClockCircleOutlined /> {new Date(post.createTime || '').toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="post-content">{post.content}</div>
                                    {post.tagList && post.tagList.length > 0 && <div className="post-tags">{post.tagList.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}</div>}
                                    <div className="post-actions">
                                        <button className={`post-action-btn ${post.hasThumb ? 'active' : ''}`} onClick={() => handleThumb(index)}>
                                            {post.hasThumb ? <HeartFilled /> : <HeartOutlined />}<span>{post.thumbNum || 0}</span>
                                        </button>
                                        <button className={`post-action-btn ${post.hasFavour ? 'active' : ''}`} onClick={() => handleFavour(index)}>
                                            {post.hasFavour ? <StarFilled /> : <StarOutlined />}<span>{post.favourNum || 0}</span>
                                        </button>
                                    </div>
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
