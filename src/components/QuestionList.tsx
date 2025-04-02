import React, { useState, useRef } from "react";
import { ProTable, ProColumns, ActionType } from "@ant-design/pro-components";
import { QuestionControllerService, Question, QuestionQueryRequest, QuestionVO } from "../../generated"; // Import Question and QuestionQueryRequest
import { Tag, Button, Modal, Form, InputNumber, message, Row, Col, Tooltip, Space } from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined, ExclamationCircleFilled, InboxOutlined } from "@ant-design/icons";
import { ProForm, ProFormText, ProFormTextArea, ProFormItem } from '@ant-design/pro-components';
import MarkDownNewEditor from "../components/MarkDownNewEditor";


type DataType = Question;

type QuestionAddRequest = {
    answer?: string;
    content?: string;
    judgeCase?: Array<JudgeCase>;
    judgeConfig?: JudgeConfig;
    tags?: Array<string>;
    title?: string;
};
type JudgeCase = {
    input?: string;
    output?: string;
};
type JudgeConfig = {
    memoryLimit?: number;
    stackLimit?: number;
    timeLimit?: number;
    customField?: string;
};

export default function QuestionList() {
    const actionRef = useRef<ActionType>();

    // === Modal State and Handlers ===
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm<QuestionAddRequest>();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [modal, contextHolder] = Modal.useModal();

    const fetchQuestionData = async (id: number) => {
        setConfirmLoading(true);
        try {
            // Use getQuestionVOByIdUsingGet for filling the edit form
            // const response = await QuestionControllerService.getQuestionVoByIdUsingGet(id);
            const response = await QuestionControllerService.getQuestionByIdUsingGet(id);
            if (response.code === 0 && response.data) {
                const questionData = response.data;
                questionData.tags = JSON.parse(questionData?.tags ?? " ");
                questionData.judgeCase = JSON.parse(questionData?.judgeCase ?? " ");
                questionData.judgeConfig = JSON.parse(questionData?.judgeConfig ?? " ");
                setCurrentQuestion(questionData);

                form.setFieldsValue({
                    title: questionData.title,
                    tags: questionData.tags,
                    answer: questionData.answer,
                    judgeCase: questionData.judgeCase,
                    judgeConfig: {
                        memoryLimit: questionData.judgeConfig?.memoryLimit ? Number(questionData.judgeConfig.memoryLimit) : undefined,
                        stackLimit: questionData.judgeConfig?.stackLimit ? Number(questionData.judgeConfig.stackLimit) : undefined,
                        timeLimit: questionData.judgeConfig?.timeLimit ? Number(questionData.judgeConfig.timeLimit) : undefined,
                    }
                });
                setOpen(true);
            } else {
                message.error('获取题目信息失败：' + (response.message || '未知错误'));
            }
        } catch (error) {
            console.error('Failed to fetch question data:', error);
            message.error('获取题目信息失败，请重试');
        } finally {
            setConfirmLoading(false);
        }
    };

    const showModal = (id: number | null = null) => {
        form.resetFields();
        setCurrentQuestion(null);
        if (id !== null) {
            setIsEditMode(true);
            setEditingQuestionId(id);
            fetchQuestionData(id);
        } else {
            setIsEditMode(false);
            setEditingQuestionId(null);
            setOpen(true);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Form values submitted:', values);
            setConfirmLoading(true);
            try {
                let response;
                if (isEditMode && editingQuestionId) {
                    response = await QuestionControllerService.editQuestionUsingPost({
                        ...values,
                        id: editingQuestionId
                    });
                } else {
                    response = await QuestionControllerService.addQuestionUsingPost(values);
                }

                const successMessage = isEditMode ? '修改题目成功' : '添加题目成功';
                const failureMessagePrefix = isEditMode ? '修改题目失败：' : '添加题目失败：';

                if (response && response.code === 0) {
                    message.success(successMessage);
                    setOpen(false);
                    form.resetFields();
                    actionRef.current?.reload();
                } else {
                    message.error(failureMessagePrefix + (response?.message || '未知错误'));
                }
            } catch (apiError) {
                console.error('API call failed:', apiError);
                message.error('添加题目失败/修改失败，请检查网络或联系管理员');
            } finally {
                setConfirmLoading(false);
            }
        } catch (validationError) {
            console.error('表单验证失败:', validationError);
        }
    };

    const handleCancel = () => {
        setOpen(false);
        form.resetFields();
    };

    const handleDelete = (id: number) => {
        const config = {
            title: '确认删除',
            icon: <ExclamationCircleFilled />,
            content: `确定要删除 ID 为 ${id} 的题目吗？此操作不可撤销。`,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                try {
                    console.log(`Attempting to delete question with ID: ${id}`);
                    const response = await QuestionControllerService.deleteQuestionUsingPost({ id });
                    console.log('Delete API Response:', response);

                    if (response && response.code === 0) {
                        message.success('删除题目成功');
                        actionRef.current?.reload(); // Refresh the table
                    } else {
                        message.error('删除题目失败：' + (response?.message || '未知错误'));
                    }
                } catch (error) {
                    console.error('Failed to delete question:', error);
                    message.error('删除题目失败，请重试');
                }
            },
            onCancel() {
                console.log('Delete cancelled');
            },
        }

        modal.confirm(config);
    };


    // Define columns with updated render functions
    const columns: ProColumns<DataType>[] = [
        { title: "ID", dataIndex: "id", key: "id", width: 100 },
        { title: "题目标题", dataIndex: "title", key: "title" },
        { title: "提交数", dataIndex: "submitNum", key: "submitNum", width: 80, hideInSearch: true },
        { title: "通过数", dataIndex: "acceptedNum", key: "acceptedNum", width: 80, hideInSearch: true },
        {
            title: "标签",
            dataIndex: "tags",
            key: "tags",
            render: (tagsString: unknown) => {
                if (typeof tagsString !== 'string') return null;
                try {
                    const tagsArray = JSON.parse(tagsString);
                    return Array.isArray(tagsArray) ? tagsArray.map((tag: string) => <Tag key={tag}>{tag}</Tag>) : null;
                } catch (e) {
                    console.error('Failed to parse tags string:', tagsString, e);
                    return <Tag color="error">解析失败</Tag>;
                }
            },
            width: 150
        },
        {
            title: "判题配置",
            dataIndex: "judgeConfig",
            key: "judgeConfig",
            hideInSearch: true,
            render: (judgeConfigString: unknown) => {
                if (typeof judgeConfigString !== 'string') return '-';
                try {
                    const config = JSON.parse(judgeConfigString);
                    return `时:${config?.timeLimit || '?'}ms 存:${config?.memoryLimit || '?'}KB 栈:${config?.stackLimit || '?'}MB`;
                } catch (e) {
                    console.error('Failed to parse judgeConfig string:', judgeConfigString, e);
                    return <Tag color="error">解析失败</Tag>;
                }
            },
            width: 200
        },
        { title: "创建时间", dataIndex: "createTime", key: "createTime", valueType: 'dateTime', hideInSearch: true, width: 150 },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            width: 150,
            render: (text, record) => [
                <Space>
                    <Space.Compact direction="vertical">
                        <Button
                            key="edit"
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => showModal(record.id as number)}
                        >
                            编辑
                        </Button>
                        <Button
                            key="edit"
                            type="link"
                            icon={<InboxOutlined />}
                            onClick={() => showModal(record.id as number)}
                        >
                            详情
                        </Button>
                        <Button
                            key="delete"
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id as number)} // 确保调用 handleDelete
                        >
                            删除
                        </Button>

                    </Space.Compact>
                </Space>,
            ],
        },
    ];

    return (
        <div>
            <ProTable<DataType>
                columns={columns}
                actionRef={actionRef}
                request={async (params, sort, filter) => {
                    try {
                        const queryRequest: QuestionQueryRequest = {
                            pageSize: params.pageSize || 10,
                            current: params.current || 1,
                        };
                        console.log('Query Request:', queryRequest);
                        const res = await QuestionControllerService.getQuestionListUsingPost(queryRequest);
                        console.log('API Response (Question List):', res);

                        return {
                            data: res?.data?.records || [],
                            success: !!res?.data,
                            total: res?.data?.total || 0,
                        };
                    } catch (error) {
                        console.error("Error fetching data:", error);
                        message.error('获取题目列表失败');
                        return {
                            data: [],
                            success: false,
                            total: 0,
                        };
                    }
                }}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                }}
                search={{
                    layout: 'vertical',
                }}
                dateFormatter="string"
                headerTitle="题目列表"
                toolBarRender={() => [
                    <Button
                        key="add"
                        type="primary"
                        onClick={() => showModal()}
                        icon={<PlusOutlined />}
                    >
                        添加题目
                    </Button>,
                ]}
            />

            {/* === Modal and Form === */}
            <Modal
                title={isEditMode ? "修改题目" : "添加题目"}
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={800}
                footer={null}
                destroyOnClose
            >
                <div className="max-h-[60vh] overflow-y-auto pr-4">
                    <ProForm<QuestionAddRequest>
                        form={form}
                        layout="vertical"
                        submitter={false}
                    >
                        <ProFormText
                            name="title"
                            label="题目标题"
                            placeholder="请输入题目标题"
                            rules={[{ required: true, message: '请输入题目标题!' }]}
                            style={{ marginBottom: 16 }}
                        />
                        <ProFormItem
                            name="content"
                            label="题目内容"
                            rules={[{ required: true, message: '请输入题目内容!' }]}
                            style={{ width: '100%', marginBottom: 16 }}
                        >
                            <div style={{ width: '100%' }}>
                                <MarkDownNewEditor
                                    value={currentQuestion?.content}
                                    defaultValue={currentQuestion?.content ?? "#请你指定一个内容吧 \n 支持`markdown` 😎"}
                                    height={"350px"}
                                    toolbarConfig={{ pin: true }}
                                    onValueChange={(value: string) => {
                                        form.setFieldValue('content', value);
                                    }}
                                />
                            </div>
                        </ProFormItem>
                        <ProFormTextArea
                            name="answer"
                            label="参考答案"
                            placeholder="请输入题目答案"
                            rules={[{ required: true, message: '请输入题目答案!' }]}
                            style={{ marginBottom: 16 }}
                        />
                        <Form.List name="tags">
                            {(fields, operation) => (
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', marginBottom: 8 }}>标签</label>
                                    {fields.map((field, index) => (
                                        <div key={String(field.key)} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                            <ProFormText
                                                name={field.name}
                                                fieldKey={field.fieldKey}
                                                rules={[{ required: true, message: '请输入标签！' }]}
                                                placeholder={`标签 ${index + 1}`}
                                                style={{ flex: 1, marginRight: 8 }}
                                            />
                                            <Tooltip title="删除此标签">
                                                <Button danger type="text" icon={<DeleteOutlined />} onClick={() => operation.remove(field.name)} />
                                            </Tooltip>
                                        </div>
                                    ))}
                                    <Button
                                        type="dashed"
                                        onClick={() => operation.add()}
                                        block
                                        icon={<PlusOutlined />}
                                        style={{ marginTop: 8 }}
                                    >
                                        添加 Tag
                                    </Button>
                                </div>
                            )}
                        </Form.List>
                        <Form.List name="judgeCase">
                            {(fields, operation) => (
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', marginBottom: 8 }}>判题用例</label>
                                    {fields.map((field, index) => (
                                        <div key={String(field.key)} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: index === fields.length - 1 ? 'none' : '1px dashed #d9d9d9' }}>
                                            <Row gutter={16}>
                                                <Col span={21}>
                                                    <ProFormText
                                                        name={[field.name, 'input']}
                                                        fieldKey={field.fieldKey}
                                                        rules={[{ required: true, message: '请输入输入用例！' }]}
                                                        placeholder={`输入 ${index + 1}`}
                                                        style={{ marginBottom: 8 }}
                                                    />
                                                    <ProFormText
                                                        name={[field.name, 'output']}
                                                        fieldKey={field.fieldKey}
                                                        rules={[{ required: true, message: '请输入输出用例！' }]}
                                                        placeholder={`输出 ${index + 1}`}
                                                    />
                                                </Col>
                                                <Col span={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Tooltip title="删除此用例">
                                                        <Button danger type="text" icon={<DeleteOutlined />} onClick={() => operation.remove(field.name)} />
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}
                                    <Button
                                        type="dashed"
                                        onClick={() => operation.add()}
                                        block
                                        icon={<PlusOutlined />}
                                        style={{ marginTop: 8 }}
                                    >
                                        添加 Judge Case
                                    </Button>
                                </div>
                            )}
                        </Form.List>
                        <ProForm.Group title="判题配置" style={{ marginTop: 16 }}>
                            <ProFormItem
                                name={['judgeConfig', 'memoryLimit']}
                                label="内存限制 (KB)"
                                rules={[{ required: true, message: '请输入内存限制 (KB)!' }]}
                            >
                                <InputNumber placeholder="请输入内存限制，单位 KB" style={{ width: '100%' }} />
                            </ProFormItem>
                            <ProFormItem
                                name={['judgeConfig', 'stackLimit']}
                                label="堆栈限制 (MB)"
                                rules={[{ required: true, message: '请输入栈限制!' }]}
                            >
                                <InputNumber placeholder="请输入栈限制" style={{ width: '100%' }} />
                            </ProFormItem>
                            <ProFormItem
                                name={['judgeConfig', 'timeLimit']}
                                label="运行时间限制 (ms)"
                                rules={[{ required: true, message: '请输入时间限制 (ms)!' }]}
                            >
                                <InputNumber placeholder="请输入运行时间限制，单位 ms" style={{ width: '100%' }} />
                            </ProFormItem>
                            <ProFormText
                                name={['judgeConfig', 'customField']}
                                label="自定义字段"
                                placeholder="请输入自定义字段"
                            />
                        </ProForm.Group>
                    </ProForm>
                </div>
                <div className="flex justify-end mt-4">
                    <Button onClick={handleCancel} className="mr-2">
                        取消
                    </Button>
                    <Button type="primary" onClick={handleOk} loading={confirmLoading}>
                        确定
                    </Button>
                </div>
            </Modal>
            {contextHolder}
        </div>
    );
} 