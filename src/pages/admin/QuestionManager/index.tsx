import { Button, Modal, Form, InputNumber, message } from "antd";
import { useState } from "react";
import { ProForm, ProFormText, ProFormTextArea, ProFormItem } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
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
            >
                <ProForm
                    form={form}
                    layout="vertical"
                    submitter={false}
                >
                    <ProFormText
                        name="title"
                        label="Title"
                        placeholder="请输入题目标题"
                        rules={[{ required: true, message: '请输入题目标题!' }]}
                    />
                    <ProFormItem
                        name="content"
                        label="Content"
                        rules={[{ required: true, message: '请输入题目内容!' }]}
                        style={{ width: '100%' }}
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
                        label="Answer"
                        placeholder="请输入题目答案"
                        rules={[{ required: true, message: '请输入题目答案!' }]}
                    />
                    <Form.List name="tags">
                        {(fields, operation) => {
                            return (
                                <>
                                    {fields.map((field) => (
                                        <ProFormText
                                            key={String(field.key)}
                                            name={field.name}
                                            fieldKey={field.fieldKey}
                                            rules={[{ required: true, message: 'Tag is required' }]}
                                            placeholder="Tag"
                                            addonAfter={<a onClick={() => operation.remove(field.name)}>删除</a>}
                                        />
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
                                </>
                            );
                        }}
                    </Form.List>
                    <Form.List name="judgeCase">
                        {(fields, operation) => {
                            return (
                                <>
                                    {fields.map((field) => (
                                        <div key={String(field.key)}>
                                            <ProFormText
                                                {...field}
                                                key={`${field.key}-input`}
                                                name={[field.name, 'input']}
                                                fieldKey={[field.fieldKey, 'input']}
                                                rules={[{ required: true, message: 'Input is required' }]}
                                                placeholder="Input"
                                            />
                                            <ProFormText
                                                {...field}
                                                key={`${field.key}-output`}
                                                name={[field.name, 'output']}
                                                fieldKey={[field.fieldKey, 'output']}
                                                rules={[{ required: true, message: 'Output is required' }]}
                                                placeholder="Output"
                                            />
                                            <a onClick={() => operation.remove(field.name)}>删除</a>
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
                                </>
                            );
                        }}
                    </Form.List>
                    <ProForm.Group>
                        <ProFormItem
                            name={['judgeConfig', 'memoryLimit']}
                            label="Memory Limit"
                            rules={[{ required: true, message: '请输入内存限制!' }]}
                        >
                            <InputNumber placeholder="请输入内存限制" style={{ width: '100%' }} />
                        </ProFormItem>
                        <ProFormItem
                            name={['judgeConfig', 'stackLimit']}
                            label="Stack Limit"
                            rules={[{ required: true, message: '请输入栈限制!' }]}
                        >
                            <InputNumber placeholder="请输入栈限制" style={{ width: '100%' }} />
                        </ProFormItem>
                        <ProFormItem
                            name={['judgeConfig', 'timeLimit']}
                            label="Time Limit"
                            rules={[{ required: true, message: '请输入时间限制!' }]}
                        >
                            <InputNumber placeholder="请输入时间限制" style={{ width: '100%' }} />
                        </ProFormItem>
                        <ProFormText
                            name={['judgeConfig', 'customField']}
                            label="Custom Field"
                            placeholder="请输入自定义字段"
                        />
                    </ProForm.Group>
                </ProForm>
            </Modal>
        </>
    );
}

export default QuestionManager;