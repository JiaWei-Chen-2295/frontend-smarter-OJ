import { useState, useEffect } from 'react';
import { Modal, message, Spin, Tag, Progress } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { RootState } from "../../../context/store.ts";
import MarkDownNewEditor from "../../../components/MarkDownNewEditor.tsx";
import { HeartOutlined, HeartFilled, StarOutlined, StarFilled, PlusOutlined, UserOutlined, ClockCircleOutlined, RightOutlined, FireOutlined, TrophyOutlined, BookOutlined, CodeOutlined } from '@ant-design/icons';
import { createPost, thumbPost, favourPost, getMyPosts } from '../../../services/postService';
import type { PostVO } from '../../../../generated/models/PostVO';
import { Fire, Target, ChartLine, Code, BookOpen } from '@icon-park/react';
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

const FeaturedBanner = ({ title, desc, tag, color }: { title: string; desc: string; tag: string; color: string }) => (
    <div className="featured-banner" onClick={() => {}}>
        <div className="featured-banner-content">
            <div className="featured-banner-tag">{tag}</div>
            <h3 className="featured-banner-title">{title}</h3>
            <p className="featured-banner-desc">{desc}</p>
        </div>
        <div className={`featured-banner-visual ${color}`}>
            <Code theme="outline" size="48" fill="#fff" />
        </div>
    </div>
);

const CompanyCard = ({ name, logoColor, trend }: { name: string; logoColor: string; trend: number }) => (
    <div className="company-card">
        <div className={`company-logo ${logoColor}`}>{name.charAt(0)}</div>
        <div className="company-info">
            <div className="company-name">{name}</div>
            <div className="company-trend">热门指数 {trend} <span className="trend-up">▲</span></div>
        </div>
    </div>
);

const CalendarWidget = () => {
    const days = [
        { day: '周二', date: '03', status: 'past' },
        { day: '周三', date: '04', status: 'past' },
        { day: '周四', date: '05', status: 'today' },
        { day: '周五', date: '06', status: 'future' },
        { day: '周六', date: '07', status: 'future' },
        { day: '周日', date: '08', status: 'future' },
        { day: '周一', date: '09', status: 'future' },
    ];
    return (
        <div className="calendar-widget">
            {days.map((d, i) => (
                <div key={i} className={`calendar-day ${d.status === 'today' ? 'today' : ''}`}>
                    <span className="calendar-day-name">{d.day}</span>
                    <span className="calendar-day-date">{d.date}</span>
                    {d.status === 'today' && <div className="calendar-dot" />}
                </div>
            ))}
        </div>
    );
};

const Heatmap = () => {
    const months = ['8月', '9月', '10月', '11月'];
    return (
        <div className="heatmap-section">
            <div className="heatmap-stats">
                <div className="heatmap-stat"><div className="stat-value">5</div><div className="stat-label">连续提交</div></div>
                <div className="heatmap-stat"><div className="stat-value">12</div><div className="stat-label">本月解决</div></div>
                <div className="heatmap-stat"><div className="stat-value">3</div><div className="stat-label">每日一题</div></div>
            </div>
            <div className="heatmap-grid">
                {Array.from({ length: 75 }).map((_, i) => (
                    <div key={i} className={`heatmap-cell ${Math.random() > 0.7 ? 'active-high' : Math.random() > 0.5 ? 'active-low' : ''}`} />
                ))}
            </div>
            <div className="heatmap-months">{months.map(m => <span key={m}>{m}</span>)}</div>
            <button className="heatmap-btn">进展分析</button>
        </div>
    );
};

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

    useEffect(() => { fetchPosts(); }, []);

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
                <StudyPlanCard title="算法基础" progress={15} total={50} icon={<BookOpen theme="outline" size="24" fill="#fff" />} color="bg-blue" />
                <StudyPlanCard title="面试经典 150 题" progress={32} total={150} icon={<Target theme="outline" size="24" fill="#fff" />} color="bg-green" />
                <StudyPlanCard title="每日一题挑战" progress={7} total={30} icon={<Fire theme="outline" size="24" fill="#fff" />} color="bg-orange" />
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
                        <FeaturedBanner title="滑动窗口和双指针" desc="围绕滑动窗口与双指针进行讲解和练习，帮助你提升算法理解和解题能力。" tag="SmarterOJ" color="bg-blue" />

                        <div className="company-section">
                            <div className="section-header">
                                <div className="section-title"><CodeOutlined /> 名企面试题</div>
                                <span className="section-more">更多 <RightOutlined /></span>
                            </div>
                            <div className="company-grid">
                                <CompanyCard name="字节跳动" logoColor="bg-blue" trend={6359} />
                                <CompanyCard name="Meta" logoColor="bg-indigo" trend={6062} />
                                <CompanyCard name="谷歌" logoColor="bg-red" trend={6051} />
                                <CompanyCard name="华为" logoColor="bg-rose" trend={5971} />
                            </div>
                        </div>

                        <FeaturedBanner title="从 BUG 入手：编程基础修炼" desc="从实际工作场景出发，透视高频 BUG，深度理解编程基础。" tag="SmarterOJ" color="bg-red" />

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
                        <CalendarWidget />
                        <div className="sidebar-divider" />
                        <div className="daily-tasks">
                            <div className="daily-task" onClick={() => navigate('/qs')}>
                                <div><div className="task-label"><Fire theme="outline" size="14" fill="#1890ff" /> 每日 1 题</div><div className="task-title">两数之和</div></div>
                                <div className="task-check" />
                            </div>
                            <div className="daily-task" onClick={() => navigate('/qs')}>
                                <div><div className="task-label"><Target theme="outline" size="14" fill="#52c41a" /> 学习计划</div><div className="task-title">面试经典 150 题</div></div>
                                <div className="task-check" />
                            </div>
                        </div>
                        <div className="sidebar-divider" />
                        <Heatmap />
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
