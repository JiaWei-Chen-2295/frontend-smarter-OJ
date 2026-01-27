
import React, { useEffect, useState } from 'react';
import { Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { questionApi } from '../../../api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../context/store';
import { QuestionSubmitVO } from '../../../../generated_new/question'; // Adjust import path

interface Props {
    questionId?: string;
}

const SubmissionHistory: React.FC<Props> = ({ questionId }) => {
    const [data, setData] = useState<QuestionSubmitVO[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const currentUser = useSelector((state: RootState) => state.User.currentUser);

    const fetchData = async () => {
        if (!questionId || !currentUser?.id) return;

        setLoading(true);
        try {
            const resp = await questionApi.listQuestionSubmitByPage({
                questionId: questionId,
                userId: String(currentUser.id),
                current: current,
                pageSize: pageSize,
                sortField: 'createTime',
                sortOrder: 'descend',
            });

            if (resp.data.code === 0 && resp.data.data) {
                setData(resp.data.data.records || []);
                setTotal(Number(resp.data.data.total) || 0);
            } else {
                message.warning(resp.data.message || '获取提交记录失败');
            }
        } catch (error) {
            console.error('获取提交记录失败', error);
            message.error('获取提交记录失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [questionId, currentUser, current, pageSize]);

    const columns: ColumnsType<QuestionSubmitVO> = [
        {
            title: '状态',
            dataIndex: 'judgeInfo',
            key: 'status',
            render: (judgeInfo) => {
                let text = judgeInfo?.message || '等待中';
                // Try to handle potential JSON message
                if (text && (text.startsWith('{') || text.startsWith('['))) {
                    try {
                        // If it's JSON, it might be detailed error info. 
                        // We can define a mapping or just show "Error Details"
                        // Or try to parse and see if there is a 'message' field
                        const parsed = JSON.parse(text);
                        if (parsed && parsed.message) {
                            text = parsed.message;
                        } else {
                            // Fallback if we can't extract a simple message
                            text = '判题详情';
                        }
                    } catch (e) {
                        // ignore parse error
                    }
                }

                let color = 'gold';
                if (text.includes('Accepted') || text === '成功') color = 'success';
                else if (text.includes('Wrong Answer') || text === '答案错误') color = 'error';
                else if (text.includes('Compilation Error') || text === '编译错误') color = 'error';
                else if (text.includes('Time Limit Exceeded') || text === '时间超限') color = 'error';
                else if (text.includes('Memory Limit Exceeded') || text === '内存超限') color = 'error';
                else if (text === '判题详情') color = 'warning';

                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: '语言',
            dataIndex: 'language',
            key: 'language',
        },
        {
            title: '执行用时',
            dataIndex: 'judgeInfo',
            key: 'time',
            render: (judgeInfo) => (judgeInfo?.time !== undefined && judgeInfo?.time !== null) ? `${Number(judgeInfo.time)} ms` : '-',
        },
        {
            title: '内存消耗',
            dataIndex: 'judgeInfo',
            key: 'memory',
            render: (judgeInfo) => {
                if (judgeInfo?.memory === undefined || judgeInfo?.memory === null) return '-';
                const memory = Number(judgeInfo.memory);
                return `${memory / 1024 / 1024 < 1 ? (memory / 1024).toFixed(0) + ' KB' : (memory / 1024 / 1024).toFixed(2) + ' MB'}`;
            },
        },
        {
            title: '提交时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text) => {
                if (!text) return '-';
                const date = new Date(text);
                if (isNaN(date.getTime())) return text;
                const y = date.getFullYear();
                const m = (date.getMonth() + 1).toString().padStart(2, '0');
                const d = date.getDate().toString().padStart(2, '0');
                const hh = date.getHours().toString().padStart(2, '0');
                const mm = date.getMinutes().toString().padStart(2, '0');
                const ss = date.getSeconds().toString().padStart(2, '0');
                return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
            }
        }
    ];

    return (
        <div className="submission-history">
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{
                    current,
                    pageSize,
                    total,
                    onChange: (page, size) => {
                        setCurrent(page);
                        setPageSize(size);
                    },
                    showSizeChanger: false, // simplified for sidebar
                    size: "small"
                }}
                size="small"
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default SubmissionHistory;
