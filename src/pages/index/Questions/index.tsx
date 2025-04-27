import React, { useState, useEffect } from 'react';
import { Button, Flex, Table, Input, Tag, Space, Select, Tooltip, Card, Typography, Popover } from 'antd';
import type { TableColumnsType, TableProps, TablePaginationConfig } from 'antd';
import { QuestionControllerService } from '../../../../generated';
import { SearchOutlined, StarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

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

const columns: TableColumnsType<DataType> = [
    { 
        title: '题目', 
        dataIndex: 'title',
        width: '60%',
        render: (text: string, record) => {
            const difficulty = getDifficulty(record.tags);
            return (
                <Popover
                    content={
                        <div className="max-w-md">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {record.content || ''}
                            </ReactMarkdown>
                        </div>
                    }
                    title="题目内容"
                    trigger="hover"
                >
                    <Card 
                        className="hover:shadow-md transition-shadow duration-300 cursor-pointer"
                        bodyStyle={{ padding: '8px' }}
                    >
                        <Space direction="vertical" size="small" className="w-full">
                            <Space>
                                <Link to={`/oj/${record.id}`} className="text-base font-medium text-blue-500 hover:text-blue-700">
                                    {text}
                                </Link>
                                {difficulty && (
                                    <Tag color={difficultyColors[difficulty as keyof typeof difficultyColors]}>
                                        {difficulty}
                                    </Tag>
                                )}
                            </Space>
                            <Space wrap>
                                {record.tags
                                    ?.filter(tag => !['简单', '中等', '困难'].includes(tag))
                                    .map((tag, index) => (
                                        <Tag key={index} color="default" className="text-xs">
                                            {tag}
                                        </Tag>
                                    ))}
                            </Space>
                        </Space>
                    </Card>
                </Popover>
            );
        }
    },
    { 
        title: '通过率', 
        key: 'acceptRate',
        width: '20%',
        sorter: (a, b) => {
            const rateA = a.submitNum ? (a.acceptedNum || 0) / a.submitNum : 0;
            const rateB = b.submitNum ? (b.acceptedNum || 0) / b.submitNum : 0;
            return rateA - rateB;
        },
        render: (_, record) => {
            if (!record.submitNum || record.submitNum === 0) return '暂无提交';
            const rate = ((record.acceptedNum || 0) / record.submitNum * 100).toFixed(1);
            const rateNum = parseFloat(rate);
            return (
                <Tooltip title={`通过: ${record.acceptedNum} / 提交: ${record.submitNum}`}>
                    <Space>
                        <CheckCircleOutlined className={rateNum >= 50 ? 'text-green-500' : rateNum >= 30 ? 'text-yellow-500' : 'text-red-500'} />
                        <span className={rateNum >= 50 ? 'text-green-500' : rateNum >= 30 ? 'text-yellow-500' : 'text-red-500'}>
                            {rate}%
                        </span>
                    </Space>
                </Tooltip>
            );
        }
    },
    { 
        title: '点赞数', 
        dataIndex: 'favourNum',
        width: '20%',
        sorter: (a, b) => (a.favourNum || 0) - (b.favourNum || 0),
        render: (num: number) => (
            <Space>
                <StarOutlined className="text-pink-500" />
                <span className="text-pink-500">
                    {num || 0}
                </span>
            </Space>
        )
    },
];

function Questions() {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<DataType[]>([]);
    const [searchText, setSearchText] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        pages: 1
    });

    const fetchQuestions = async (current = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const resp = await QuestionControllerService.listQuestionVoByPageUsingPost({
                current,
                pageSize
            });
            if (resp.code === 0 && resp.data) {
                setQuestions(resp.data.records || []);
                setPagination({
                    current: Number(resp.data.current) || 1,
                    pageSize: Number(resp.data.size) || 10,
                    total: Number(resp.data.total) || 0,
                    pages: Number(resp.data.pages) || 1
                });
            }
        } catch (error) {
            console.error('获取题目列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const filteredQuestions = questions.filter(question => {
        const matchesSearch = question.title?.toLowerCase().includes(searchText.toLowerCase());
        const matchesDifficulty = difficultyFilter === 'all' || 
            question.tags?.includes(difficultyFilter);
        return matchesSearch && matchesDifficulty;
    });

    const handleTableChange = (newPagination: TablePaginationConfig) => {
        fetchQuestions(newPagination.current as number, newPagination.pageSize as number);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Flex gap="middle" vertical>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <Title level={3} className="mb-6">题目列表</Title>
                    <Flex align="center" gap="middle" className="w-full mb-6">
                        <Search
                            placeholder="搜索题目"
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onChange={e => setSearchText(e.target.value)}
                            className="w-64"
                        />
                        <Select
                            defaultValue="all"
                            style={{ width: 120 }}
                            onChange={setDifficultyFilter}
                            size="large"
                        >
                            <Option value="all">全部难度</Option>
                            <Option value="简单">简单</Option>
                            <Option value="中等">中等</Option>
                            <Option value="困难">困难</Option>
                        </Select>
                        <Button type="primary" onClick={() => fetchQuestions()} loading={loading}>
                            刷新
                        </Button>
                        {hasSelected && (
                            <Text type="secondary">
                                已选择 {selectedRowKeys.length} 项
                            </Text>
                        )}
                    </Flex>
                    <Table<DataType> 
                        rowSelection={rowSelection} 
                        columns={columns} 
                        dataSource={filteredQuestions}
                        loading={loading}
                        rowKey="id"
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => `共 ${total} 条`,
                            pageSizeOptions: ['10', '20', '50', '100']
                        }}
                        onChange={handleTableChange}
                        className="bg-white rounded-lg"
                    />
                </div>
            </Flex>
        </div>
    );
}

export default Questions;
