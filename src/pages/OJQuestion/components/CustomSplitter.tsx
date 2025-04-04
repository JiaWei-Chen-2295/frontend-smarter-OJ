import { Layout, Select, Button, Space, message, ConfigProvider } from "antd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { useState, useRef } from "react";
import type { QuestionVO } from "../../../../generated";
import Veditor from "../../../components/Veditor";
import { CodeEditor, CodeEditorRef } from "../../../components/CodeEditor";
import { FormatPainterOutlined, SendOutlined } from "@ant-design/icons";
import { QuestionSubmitControllerService } from "../../../../generated";

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
            messageApi.error('提交失败，请稍后重试');
            console.error('提交代码失败:', error);
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