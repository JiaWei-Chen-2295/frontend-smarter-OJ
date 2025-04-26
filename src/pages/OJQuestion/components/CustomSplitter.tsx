import { Layout, Select, Button, Space, message, ConfigProvider, Modal } from "antd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { useState, useRef, useEffect, useCallback } from "react";
import type { QuestionVO, JudgeInfo, QuestionSubmit } from "../../../../generated";
import Veditor from "../../../components/Veditor";
import { CodeEditor, CodeEditorRef } from "../../../components/CodeEditor";
import { 
    FormatPainterOutlined, 
    SendOutlined, 
    CheckCircleOutlined, 
    InfoCircleOutlined, 
    PauseCircleOutlined, 
    PlayCircleOutlined,
} from "@ant-design/icons";
import { QuestionSubmitControllerService } from "../../../../generated";
import MojoCarrot from "../../../components/MojoCarrot";
import JudgeResultCard from "./judge/JudgeResultCard";

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

// 扩展QuestionSubmit类型，添加outputResult字段
interface ExtendedQuestionSubmit extends QuestionSubmit {
    outputResult?: string | null;
}

const CustomSplitter: React.FC<CustomSplitterProps> = ({ question, fontSize = 14 }) => {
    const [width, setWidth] = useState(600);
    const codeEditorRef = useRef<CodeEditorRef>(null);
    const [currentLanguage, setCurrentLanguage] = useState('java');
    const [messageApi, contextHolder] = message.useMessage();
    
    // 计时相关状态
    const [solving, setSolving] = useState(false);
    const [solvingTime, setSolvingTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<number | null>(null);

    // 仅用于展示UI的状态
    const [showBubble] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // 记录最后一次提交的 Id 及相关状态
    const [, setLastSubmitId] = useState<string | null>(null);
    const [isJudging, setIsJudging] = useState(false);
    const [judgeProgress, setJudgeProgress] = useState(0);
    
    // 提交结果相关状态
    const [submissionResult, setSubmissionResult] = useState<ExtendedQuestionSubmit | null>(null);
    const [judgeInfo, setJudgeInfo] = useState<JudgeInfo | null>(null);
    const [showResultCard, setShowResultCard] = useState(false);
    
    // 预期答案 - 从测试用例中提取
    const [expectedOutputs] = useState<string[]>([]);

    // 格式化时间显示
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // 启动计时器
    const startTimer = useCallback(() => {
        if (!solving) {
            setSolving(true);
            setIsPaused(false);
            
            // 设置定时器，每秒更新一次
            timerRef.current = window.setInterval(() => {
                setSolvingTime(prev => prev + 1);
            }, 1000);
        }
    }, [solving]);

    // 暂停计时器
    const pauseTimer = useCallback(() => {
        if (solving && !isPaused && timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
            setIsPaused(true);
        }
    }, [solving, isPaused]);

    // 继续计时器
    const resumeTimer = useCallback(() => {
        if (solving && isPaused) {
            timerRef.current = window.setInterval(() => {
                setSolvingTime(prev => prev + 1);
            }, 1000);
            setIsPaused(false);
        }
    }, [solving, isPaused]);

    // 停止计时器 - 仅在提交代码时使用
    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
            setIsPaused(true);  // 标记为暂停状态，但不重置时间
        }
    }, []);

    // 组件卸载时清理定时器
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
            }
        };
    }, []);

    const handleResize = (_: React.SyntheticEvent, data: ResizeData) => {
        setWidth(data.size.width);
    };

    const handleCodeChange = (value: string | undefined) => {
        // 第一次输入时开始计时
        if (value && value !== "// 在这里编写你的代码" && !solving) {
            startTimer();
        }
    };

    const handleLanguageChange = (value: string) => {
        setCurrentLanguage(value);
        codeEditorRef.current?.setLanguage(value);
    };

    const handleFormatCode = () => {
        codeEditorRef.current?.formatCode();
    };

    // 轮询判题结果
    const pollJudgeResult = useCallback(async (submitId: string) => {
        if (!submitId) return;
        
        setIsJudging(true);
        setJudgeProgress(0);
        
        let retryCount = 0;
        const maxRetries = 30; // 最多轮询30次，每次间隔1秒
        const intervalTime = 1000; // 1秒
        
        const pollInterval = setInterval(async () => {
            try {
                // 更新进度条
                setJudgeProgress(prev => Math.min(prev + (100 / maxRetries), 95));
                
                // 获取所有提交记录
                const listResp = await QuestionSubmitControllerService.getAllQuestionSubmitByListUsingGet();
                
                if (listResp.code === 0 && listResp.data) {
                    // 找到当前提交的记录
                    const currentSubmission = listResp.data.find(item => String(item.id) === String(submitId));
                    
                    if (currentSubmission) {
                        // 更新提交结果
                        setSubmissionResult(currentSubmission as ExtendedQuestionSubmit);
                        
                        // 检查输出结果和判题信息
                        const extSubmission = currentSubmission as ExtendedQuestionSubmit;
                        const hasOutputResult = !!(extSubmission.outputResult && extSubmission.outputResult.length > 0);
                        
                        // 解析judgeInfo
                        if (currentSubmission.judgeInfo) {
                            try {
                                const parsedJudgeInfo = JSON.parse(currentSubmission.judgeInfo);
                                setJudgeInfo(parsedJudgeInfo);
                                
                                // 判断是否完成判题
                                if (parsedJudgeInfo?.memory) {
                                    finishJudging(pollInterval);
                                    return;
                                }
                            } catch (error) {
                                console.error('解析judgeInfo失败:', error);
                            }
                        }
                        
                        // 只要有outputResult，就认为判题结束
                        if (hasOutputResult) {
                            finishJudging(pollInterval);
                            return;
                        }
                    }
                }
                
                // 检查是否超过最大重试次数
                if (++retryCount >= maxRetries) {
                    clearInterval(pollInterval);
                    setIsJudging(false);
                    setJudgeProgress(100);
                    message.warning('判题时间较长，请稍后查看结果');
                }
            } catch (error) {
                console.error('轮询判题结果出错:', error);
                clearInterval(pollInterval);
                setIsJudging(false);
            }
        }, intervalTime);
        
        // 完成判题的辅助函数
        function finishJudging(interval: ReturnType<typeof setInterval>) {
            setJudgeProgress(100);
            setIsJudging(false);
            setShowResultCard(true);
            clearInterval(interval);
        }
        
        // 组件卸载时清除定时器
        return () => clearInterval(pollInterval);
    }, []);

    const handleSubmitCode = async () => {
        try {
            const code = codeEditorRef.current?.getValue();
            if (!code) {
                messageApi.error('请先编写代码');
                return;
            }

            // 提交代码时只暂停计时，不清空时间
            stopTimer();

            // 显示提交中的消息
            const submitMsg = messageApi.loading('代码提交中...', 0);

            const resp = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
                code: code,
                language: currentLanguage,
                questionId: question?.id,
            });

            if (resp.code === 0) {
                submitMsg(); // 关闭提交中的消息
                messageApi.success('代码提交成功，正在判题...');
                
                const submitId = resp.data;
                setLastSubmitId(submitId);
                
                // 开始轮询判题结果
                pollJudgeResult(submitId);
                
                // 小窗口显示判题中状态
                setJudgeInfo(null);
                setSubmissionResult(null);
                setShowResultCard(true);
            } else {
                submitMsg(); // 关闭提交中的消息
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
                    },
                    Modal: {
                        contentBg: '#141414',
                        headerBg: '#141414',
                        titleColor: '#ffffff',
                        colorBgElevated: '#141414',
                        colorText: '#ffffff',
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

            {/* 判题结果卡片 */}
            <JudgeResultCard
                open={showResultCard}
                onCancel={() => setShowResultCard(false)}
                submissionResult={submissionResult}
                judgeInfo={judgeInfo}
                isJudging={isJudging}
                judgeProgress={judgeProgress}
                solvingTime={solvingTime}
                expectedOutputs={expectedOutputs}
            />

            {/* AI助手模态框 - 保留原来的模态框 */}
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
                style={{ 
                    top: 20
                }}
                bodyStyle={{
                    backgroundColor: '#141414',
                    color: 'white',
                    padding: '20px',
                }}
                className="dark-modal"
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

                {/* 解题用时卡片 */}
                <div style={{ 
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #303030',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                            backgroundColor: '#252525', 
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px'
                        }}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="#228B22">
                                <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: '#e0e0e0' }}>解题用时</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                {formatTime(solvingTime)}
                            </div>
                        </div>
                    </div>
                    <div style={{ 
                        backgroundColor: '#228B22', 
                        padding: '6px 12px', 
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>
                        击败了78%的用户
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

            <style>
                {`
                .dark-modal .ant-modal-content {
                    background-color: #141414;
                }
                .dark-modal .ant-modal-header {
                    background-color: #141414;
                    border-bottom: 1px solid #303030;
                }
                .dark-modal .ant-modal-title {
                    color: white;
                }
                .dark-modal .ant-modal-close {
                    color: #999;
                }
                .dark-modal .ant-modal-close:hover {
                    color: white;
                }
                .dark-modal .ant-result-title,
                .dark-modal .ant-result-subtitle {
                    color: white;
                }
                `}
            </style>

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

                                <div className="solve-qustion-time-counter bg-[#252525] rounded-lg px-4 py-2 ml-4 border border-[#404040] flex items-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-gray-300 text-xs mb-1">已用时间</span>
                                        <div className="flex items-center">
                                            <span className="text-[#228B22] font-bold text-xl font-mono">
                                                {formatTime(solvingTime)}
                                            </span>
                                            <span className="ml-1 text-xs text-gray-400 self-end mb-1">
                                                {solving && !isPaused ? "(计时中...)" : "(已暂停)"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-3 cursor-pointer" onClick={isPaused ? resumeTimer : pauseTimer}>
                                        {isPaused ? 
                                            <PlayCircleOutlined className="text-[#228B22] text-xl hover:text-[#2aa12a]" /> : 
                                            <PauseCircleOutlined className="text-[#228B22] text-xl hover:text-[#2aa12a]" />
                                        }
                                    </div>
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