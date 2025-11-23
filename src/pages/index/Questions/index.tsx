import { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Flex, Input, Tag, Space, Select, Tooltip, Typography, Popover, List, Spin } from 'antd';
import { QuestionControllerService } from '../../../../generated';
import { SearchOutlined, StarOutlined, CheckCircleOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

interface DataType {
    acceptedNum?: number;
    content?: string;
    createTime?: string;
    favourNum?: number;
    id?: number;
    submitNum?: number;
    tags?: Array<string>;
    title?: string;
    userId?: number;
}

const difficultyColors = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'error'
};

const getDifficulty = (tags: string[] | undefined): string => {
    if (!tags) return '';
    return tags.find(tag => ['简单', '中等', '困难'].includes(tag)) || '';
};

function QuestionItem({ question }: { question: DataType }) {
    const difficulty = getDifficulty(question.tags);
    return (
        <Popover
            content={
                <div className="max-w-md">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {question.content || ''}
                    </ReactMarkdown>
                </div>
            }
            title="题目内容"
            trigger="hover"
        >
            <div style={{ padding: 16, marginBottom: 16, border: '1px solid #f0f0f0', borderRadius: 8 }} className="hover:bg-gray-50 transition-colors cursor-pointer">
                <Space direction="vertical" size={8} className="w-full">
                    <Space>
                        <Link to={`/oj/${question.id}`} className="text-base font-medium text-blue-500 hover:text-blue-700">
                            {question.title}
                        </Link>
                        {difficulty && (
                            <Tag 
                                color={difficultyColors[difficulty as keyof typeof difficultyColors]}
                                className="text-sm px-3 py-1 m-0"
                            >
                                {difficulty}
                            </Tag>
                        )}
                    </Space>
                    <Space wrap>
                        {question.tags
                            ?.filter(tag => !['简单', '中等', '困难'].includes(tag))
                            .map((tag, index) => (
                                <Tag 
                                    key={index} 
                                    color="default" 
                                    className="text-sm px-3 py-1 m-0"
                                >
                                    {tag}
                                </Tag>
                            ))}
                    </Space>
                </Space>
                <div className="flex justify-between" style={{ marginTop: 12, fontSize: 13, color: '#8c8c8c' }}>
                    <Space>
                        <Tooltip title={`通过: ${question.acceptedNum || 0} / 提交: ${question.submitNum || 0}`}>
                            <Space size={2}>
                                <CheckCircleOutlined className={
                                    !question.submitNum ? 'text-gray-400' : 
                                    question.submitNum && (question.acceptedNum || 0) / question.submitNum >= 0.5 ? 'text-green-500' : 
                                    (question.acceptedNum || 0) / question.submitNum >= 0.3 ? 'text-yellow-500' : 'text-red-500'
                                } />
                                <span>
                                    {!question.submitNum ? '暂无提交' : 
                                    `${((question.acceptedNum || 0) / question.submitNum * 100).toFixed(1)}%`}
                                </span>
                            </Space>
                        </Tooltip>
                    </Space>
                    <Space>
                        <StarOutlined className="text-pink-500" />
                        <span className="text-pink-500">
                            {question.favourNum || 0}
                        </span>
                    </Space>
                </div>
            </div>
        </Popover>
    );
}

function Questions() {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<DataType[]>([]);
    const [searchText, setSearchText] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
    const [tagFilter, setTagFilter] = useState<string>('all');
    const [current, setCurrent] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [tagExpanded, setTagExpanded] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement>(null);
    // Stable refs to prevent effect churn and race conditions
    const loadingRef = useRef(loading);
    const hasMoreRef = useRef(hasMore);

    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);

    const fetchQuestions = async (pageNum = 1) => {
        setLoading(true);
        try {
            const resp = await QuestionControllerService.listQuestionVoByPageUsingPost({
                current: pageNum,
                pageSize: 10
            });
            if (resp.code === 0 && resp.data) {
                if (pageNum === 1) {
                    setQuestions(resp.data.records || []);
                } else {
                    setQuestions(prev => [...prev, ...(resp.data?.records || [])]);
                }
                
                // 判断是否还有更多数据
                const total = Number(resp.data.total) || 0;
                const size = Number(resp.data.size) || 10;
                const hasMore = pageNum * size < total;
                setHasMore(hasMore);
            }
        } catch (error) {
            console.error('获取题目列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (loadingRef.current || !hasMoreRef.current) return;
        setCurrent((prev) => {
            const nextPage = prev + 1;
            fetchQuestions(nextPage);
            return nextPage;
        });
    };

    useEffect(() => {
        fetchQuestions(1);
    }, []);

    // Create observer once; use refs inside to avoid re-creating and loops
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    // Only load when not already loading and there is more
                    if (!loadingRef.current && hasMoreRef.current) {
                        loadMore();
                    }
                }
            },
            {
                root: null,
                rootMargin: '200px 0px', // prefetch before fully reaching bottom
                threshold: 0,
            }
        );

        const el = loadMoreRef.current;
        if (el) observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, []);

    const filteredQuestions = questions.filter(question => {
        const matchesSearch = !searchText || (question.title?.toLowerCase().includes(searchText.toLowerCase()) ?? false);
        const matchesDifficulty = difficultyFilter === 'all' || 
            (question.tags?.includes(difficultyFilter) ?? false);
        const matchesTag = tagFilter === 'all' || 
            (question.tags?.includes(tagFilter) ?? false);
        return matchesSearch && matchesDifficulty && matchesTag;
    });

    const handleRefresh = () => {
        setCurrent(1);
        setHasMore(true);
        setQuestions([]);
        fetchQuestions(1);
    };

    // 提取所有标签（除了难度标签）
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        questions.forEach(q => {
            q.tags?.forEach(tag => {
                if (!['简单', '中等', '困难'].includes(tag)) {
                    tagSet.add(tag);
                }
            });
        });
        return Array.from(tagSet);
    }, [questions]);

    // 显示的标签数量
    const displayTagCount = tagExpanded ? allTags.length : Math.min(10, allTags.length);
    const hasMoreTags = allTags.length > 10;

    return (
        <div className="max-w-6xl mx-auto px-6">
            <Title level={3} style={{ marginBottom: 24, fontSize: 20, fontWeight: 600 }}>题目列表</Title>
            <Flex align="center" gap="middle" style={{ marginBottom: 24 }} className="flex-wrap">
                <Search
                    placeholder="搜索题目"
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 320 }}
                />
                <Select
                    value={difficultyFilter}
                    style={{ width: 140 }}
                    onChange={setDifficultyFilter}
                    size="large"
                >
                    <Option value="all">全部难度</Option>
                    <Option value="简单">简单</Option>
                    <Option value="中等">中等</Option>
                    <Option value="困难">困难</Option>
                </Select>
                <Button 
                    type="primary" 
                    onClick={handleRefresh} 
                    icon={<ReloadOutlined />} 
                    loading={loading}
                    size="large"
                >
                    刷新
                </Button>
            </Flex>

            {/* 标签筛选区域 */}
            <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                <div className="flex justify-between items-center mb-3">
                    <span style={{ fontSize: 14, color: '#8c8c8c' }}>标签筛选:</span>
                    {hasMoreTags && (
                        <Button 
                            type="link" 
                            size="middle" 
                            onClick={() => setTagExpanded(!tagExpanded)}
                            icon={tagExpanded ? <UpOutlined /> : <DownOutlined />}
                            style={{ padding: '4px 8px' }}
                        >
                            {tagExpanded ? '收起' : '展开'}
                        </Button>
                    )}
                </div>
                <div className={`${tagExpanded ? '' : 'h-10 overflow-hidden'} transition-all duration-300`}>
                    <Space wrap size={[12, 8]}>
                        <Tag 
                            className="cursor-pointer text-sm px-3 py-1 m-0"
                            color={tagFilter === 'all' ? 'blue' : 'default'}
                            onClick={() => setTagFilter('all')}
                        >
                            全部
                        </Tag>
                        {allTags.slice(0, displayTagCount).map(tag => (
                            <Tag 
                                key={tag}
                                className="cursor-pointer text-sm px-3 py-1 m-0"
                                color={tagFilter === tag ? 'blue' : 'default'}
                                onClick={() => setTagFilter(tag)}
                            >
                                {tag}
                            </Tag>
                        ))}
                    </Space>
                </div>
            </div>

            <List
                split={false}
                itemLayout="vertical"
                dataSource={filteredQuestions}
                renderItem={(item) => (
                    <QuestionItem question={item} />
                )}
            />
            {filteredQuestions.length === 0 && !loading && (
                <div className="py-10 text-center text-gray-500">
                    暂无数据
                </div>
            )}
            <div ref={loadMoreRef} style={{ padding: '24px 0', textAlign: 'center' }}>
                {loading && <Spin size="large" tip="加载中..." />}
                {!loading && hasMore && <div style={{ color: '#bfbfbf', fontSize: 14 }}>上滑加载更多</div>}
                {!loading && !hasMore && filteredQuestions.length > 0 && <div style={{ color: '#bfbfbf', fontSize: 14 }}>已经到底啦</div>}
            </div>
        </div>
    );
}

export default Questions;
