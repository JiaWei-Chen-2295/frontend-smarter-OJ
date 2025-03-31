import { Button, Modal, Form, InputNumber, message, Row, Col, Tooltip } from "antd";
import { useState } from "react";
import { ProForm, ProFormText, ProFormTextArea, ProFormItem } from '@ant-design/pro-components';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import MarkDownNewEditor from "../../../components/MarkDownNewEditor";
import { QuestionControllerService } from "../../../../generated";

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
    // You can add more fields here
    customField?: string; // Example of an additional field
};

function QuestionManager() {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm<QuestionAddRequest>();

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Form values submitted:', values);
            setConfirmLoading(true);
            try {
                const response = await QuestionControllerService.addQuestionUsingPost(values);
                
                if (response.code === 0 && response.data) {
                    message.success('添加题目成功');
                    setOpen(false);
                    form.resetFields();
                } else {
                    message.error('添加题目失败：' + (response.message || '未知错误'));
                }
            } catch (apiError) {
                console.error('API call failed:', apiError);
                message.error('添加题目失败，请检查网络或联系管理员');
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

    return (
        <>
            <div>
                <Button type="primary" onClick={showModal}>添加题目</Button>
            </div>
            <Modal
                title="添加题目"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={800}
                bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
            >
                <ProForm
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
                                defaultValue={"# 写点什么吧😎 支持`markdown`\n## 这是题目添加页面"}
                                height={"350px"}
                                toolbarConfig={{ pin: true }}
                                onValueChange={(value) => {
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
                        {(fields, operation) => {
                            return (
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
                            );
                        }}
                    </Form.List>
                    <Form.List name="judgeCase">
                        {(fields, operation) => {
                            return (
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', marginBottom: 8 }}>判题用例</label>
                                    {fields.map((field, index) => (
                                        <div key={String(field.key)} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: index === fields.length - 1 ? 'none' : '1px dashed #d9d9d9' }}>
                                            <Row gutter={16}>
                                                <Col span={21}>
                                                    <ProFormText
                                                        {...field}
                                                        name={[field.name, 'input']}
                                                        fieldKey={[field.fieldKey, 'input']}
                                                        rules={[{ required: true, message: '请输入输入用例！' }]}
                                                        placeholder={`输入 ${index + 1}`}
                                                        style={{ marginBottom: 8 }}
                                                    />
                                                    <ProFormText
                                                        {...field}
                                                        name={[field.name, 'output']}
                                                        fieldKey={[field.fieldKey, 'output']}
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
                            );
                        }}
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
            </Modal>
        </>
    );
}

export default QuestionManager;