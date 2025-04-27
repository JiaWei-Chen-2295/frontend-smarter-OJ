import React, { useState, useEffect, useRef, useMemo } from 'react';
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
            <div className="py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <Space direction="vertical" size={0} className="w-full">
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
                <div className="flex justify-between mt-2 text-sm text-gray-500">
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
        if (!loading && hasMore) {
            const nextPage = current + 1;
            setCurrent(nextPage);
            fetchQuestions(nextPage);
        }
    };

    useEffect(() => {
        fetchQuestions(1);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMore) {
                    loadMore();
                }
            },
            { threshold: 1.0 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [loading, hasMore]);

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
        <div className="p-6 bg-gray-50 min-h-screen">
            <Flex gap="middle" vertical>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <Title level={3} className="mb-6">题目列表</Title>
                    <Flex align="center" gap="middle" className="w-full mb-4">
                        <Search
                            placeholder="搜索题目"
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="middle"
                            onChange={e => setSearchText(e.target.value)}
                            className="w-64"
                        />
                        <Select
                            defaultValue="all"
                            style={{ width: 120 }}
                            onChange={setDifficultyFilter}
                            size="middle"
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
                            size="middle"
                        >
                            刷新
                        </Button>
                    </Flex>
                    
                    {/* 标签筛选区域 */}
                    <div className="mb-4 pb-2 border-b border-gray-100">
                        <div className="flex justify-between items-center text-sm mb-2 text-gray-500">
                            <span>标签筛选:</span>
                            {hasMoreTags && (
                                <Button 
                                    type="link" 
                                    size="small" 
                                    onClick={() => setTagExpanded(!tagExpanded)}
                                    icon={tagExpanded ? <UpOutlined /> : <DownOutlined />}
                                >
                                    {tagExpanded ? '收起' : '展开'}
                                </Button>
                            )}
                        </div>
                        <div className={`${tagExpanded ? '' : 'h-10 overflow-hidden'} transition-all duration-300`}>
                            <Space wrap size={[8, 6]}>
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
                    <div ref={loadMoreRef} className="py-4 text-center">
                        {loading && <Spin tip="加载中..." />}
                        {!loading && hasMore && <div className="text-gray-400">上滑加载更多</div>}
                        {!loading && !hasMore && filteredQuestions.length > 0 && <div className="text-gray-400">已经到底啦</div>}
                    </div>
                </div>
            </Flex>
        </div>
    );
}

export default Questions;
