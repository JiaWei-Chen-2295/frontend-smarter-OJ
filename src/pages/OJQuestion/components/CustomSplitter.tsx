import { Layout, Select, Button, Space, message, ConfigProvider, Modal } from "antd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { useState, useRef } from "react";
import type { QuestionVO } from "../../../../generated";
import Veditor from "../../../components/Veditor";
import { CodeEditor, CodeEditorRef } from "../../../components/CodeEditor";
import { FormatPainterOutlined, SendOutlined, CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { QuestionSubmitControllerService } from "../../../../generated";
import MojoCarrot from "../../../components/MojoCarrot";

const { Sider, Content } = Layout;
const { Option } = Select;

interface CustomSplitterProps {
    question?: QuestionVO;
    fontSize?: number;
}

interface ResizeData {
    size: {
        width: number;
        height: number;
    };
}

const SUPPORTED_LANGUAGES = [
    { value: 'java', label: 'Java' },
    { value: 'python', label: 'Python' },
    { value: 'cpp', label: 'C++' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
];

const CustomSplitter: React.FC<CustomSplitterProps> = ({ question, fontSize = 14 }) => {
    const [width, setWidth] = useState(600);
    const codeEditorRef = useRef<CodeEditorRef>(null);
    const [currentLanguage, setCurrentLanguage] = useState('java');
    const [messageApi, contextHolder] = message.useMessage();
    
    // 仅用于展示UI的状态
    const [showBubble] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const handleResize = (_: React.SyntheticEvent, data: ResizeData) => {
        setWidth(data.size.width);
    };

    const handleCodeChange = (value: string | undefined) => {
        // 这里可以处理代码变化
        console.log('Code changed:', value);
    };

    const handleLanguageChange = (value: string) => {
        setCurrentLanguage(value);
        codeEditorRef.current?.setLanguage(value);
    };

    const handleFormatCode = () => {
        codeEditorRef.current?.formatCode();
    };

    const handleSubmitCode = async () => {
        try {
            const code = codeEditorRef.current?.getValue();
            if (!code) {
                messageApi.error('请先编写代码');
                return;
            }

            const resp = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
                code: code,
                language: currentLanguage,
                questionId: question?.id,
            })


            if (resp.code === 0) {
                messageApi.success('代码提交成功');
            } else {
                messageApi.error(resp.message || '提交失败');
            }
        } catch (error) {
            messageApi.error(`提交失败，请稍后重试${error}`);
        }
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Message: {
                        contentBg: '#1a1a1a',
                        colorText: '#ffffff',
                        colorTextHeading: '#ffffff',
                        colorBgElevated: '#1a1a1a',
                        colorBorder: '#303030',
                    }
                }
            }}
        >
            {contextHolder}

            {/* 自定义悬浮按钮 AI助手 */}
            <div 
                style={{
                    position: 'fixed',
                    right: '24px',
                    bottom: '24px',
                    width: '130px',
                    height: '164px',
                    zIndex: 100,
                    backgroundColor: '#228B22',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    cursor: 'pointer'
                }}
                onClick={() => setShowModal(true)}
            >
                <MojoCarrot width={130} height={164} />
                
                {/* 萝卜说话的气泡 */}
                {showBubble && (
                    <div style={{
                        position: 'absolute',
                        top: '-80px',
                        right: '0',
                        backgroundColor: 'white',
                        padding: '12px',
                        borderRadius: '10px',
                        maxWidth: '220px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        zIndex: 101,
                    }}>
                        <div style={{
                            color: '#333',
                            fontSize: '14px',
                            fontWeight: 'bold',
                        }}>
                            点击查看你的代码分析和建议！
                        </div>
                        <div style={{
                            position: 'absolute',
                            bottom: '-10px',
                            right: '20px',
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'white',
                            transform: 'rotate(45deg)',
                            zIndex: -1,
                        }} />
                    </div>
                )}
            </div>

            {/* 判题结果和代码建议模态框 */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MojoCarrot width={40} height={40} />
                        <span>代码分析和建议</span>
                    </div>
                }
                open={showModal}
                onCancel={() => setShowModal(false)}
                footer={null}
                width={700}
                bodyStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    color: 'white',
                    padding: '20px'
                }}
                style={{ top: 20 }}
            >
                <div style={{ 
                    backgroundColor: '#228B22', 
                    padding: '15px', 
                    borderRadius: '8px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <CheckCircleOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>恭喜！你的代码通过了所有测试用例</div>
                        <div>执行用时: 5ms | 内存消耗: 38.2MB | 击败了95%的用户</div>
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '8px' }}>代码分析</h3>
                    <p>你的解决方案采用了动态规划的思路，时间复杂度为O(n)，空间复杂度为O(1)，这是一个非常高效的实现。</p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '8px' }}>优化建议</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <InfoCircleOutlined style={{ color: '#228B22', marginTop: '3px' }} />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>考虑边界情况</div>
                            <div>尝试考虑输入为空或只有一个元素的情况，增强代码的健壮性。</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <InfoCircleOutlined style={{ color: '#228B22', marginTop: '3px' }} />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>优化变量命名</div>
                            <div>变量名可以更有描述性，例如将 'dp' 改为 'maxSum' 会让代码更易读。</div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '8px' }}>其他可能的解法</h3>
                    <p>除了动态规划，这个问题还可以用分治法或贪心算法解决。想尝试这些方法吗？</p>
                </div>
            </Modal>

            <Layout className="h-screen bg-[#141414]">
                <ResizableBox
                    width={width}
                    height={Infinity}
                    minConstraints={[400, Infinity]}
                    maxConstraints={[800, Infinity]}
                    onResize={handleResize}
                    handle={
                        <div className="w-1 h-full bg-[#303030] cursor-col-resize absolute right-0 top-0 transition-colors duration-300 hover:bg-[#228B22]" />
                    }
                >
                    <Sider
                        width={width}
                        className="bg-[#141414] border-r border-[#303030] overflow-auto h-screen"
                    >
                        <div className="p-4">
                            <h1 className="text-xl font-bold text-white mb-4">{question?.title}</h1>
                            <div className="prose prose-invert max-w-none">
                                <Veditor
                                    value={question?.content || ''}
                                    className="bg-transparent"
                                />
                            </div>
                            {question?.tags && question.tags.length > 0 && (
                                <div className="mt-4">
                                    <h2 className="text-lg font-semibold text-white mb-2">标签</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {question.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-[#303030] text-gray-300 rounded text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Sider>
                </ResizableBox>
                <Content className="bg-[#141414] p-4 h-screen">
                    <div className="h-full bg-[#1e1e1e] rounded-lg p-4">
                        <div className="mb-4">
                            <Space>
                                <Select
                                    value={currentLanguage}
                                    onChange={handleLanguageChange}
                                    style={{ width: 120 }}
                                    className="[&_.ant-select-selector]:bg-[#303030] [&_.ant-select-selector]:border-[#404040] [&_.ant-select-selection-item]:text-white [&_.ant-select-arrow]:text-white hover:[&_.ant-select-selector]:border-[#228B22] [&_.ant-select-dropdown]:bg-[#1e1e1e] [&_.ant-select-dropdown]:border-[#303030] [&_.ant-select-item]:text-white hover:[&_.ant-select-item]:bg-[#303030] [&_.ant-select-item-option-selected]:bg-[#228B22] [&_.ant-select-item-option-selected]:text-white [&_.ant-select-item-option-active]:bg-[#303030] [&_.ant-select-item-option-search]:text-white [&_.ant-select-item-option-search_input]:bg-[#303030] [&_.ant-select-item-option-search_input]:text-white [&_.ant-select-item-option-search_input]:border-[#404040] focus:[&_.ant-select-item-option-search_input]:border-[#228B22] focus:[&_.ant-select-item-option-search_input]:shadow-[0_0_0_2px_rgba(34,139,34,0.2)]"
                                    popupClassName="bg-[#1e1e1e] border border-[#303030]"
                                    optionFilterProp="children"
                                >
                                    {SUPPORTED_LANGUAGES.map(lang => (
                                        <Option
                                            key={lang.value}
                                            value={lang.value}
                                            className="text-white hover:bg-[#303030] data-[selected=true]:bg-[#228B22] data-[selected=true]:text-white"
                                        >
                                            {lang.label}
                                        </Option>
                                    ))}
                                </Select>
                                <Button
                                    icon={<FormatPainterOutlined />}
                                    onClick={handleFormatCode}
                                    className="bg-[#303030] text-white hover:bg-[#404040]"
                                >
                                    格式化代码
                                </Button>
                                <Button
                                    icon={<SendOutlined />}
                                    onClick={handleSubmitCode}
                                    className="bg-[#228B22] text-white hover:bg-[#1a6b1a]"
                                >
                                    提交代码
                                </Button>

                                <div className="solve-qustion-time-counter">
                                    <span className="text-white">已用时:</span>
                                    <span className="text-[#228B22]">00:00</span>
                                </div>

                            </Space>
                        </div>
                        <div className="h-[calc(100%-48px)]">
                            <CodeEditor
                                ref={codeEditorRef}
                                language={currentLanguage}
                                onChange={handleCodeChange}
                                defaultValue="// 在这里编写你的代码"
                                fontSize={fontSize}
                            />
                        </div>
                    </div>
                </Content>
            </Layout>
        </ConfigProvider>
    );
};

export default CustomSplitter; 