import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useModel } from '@umijs/max'; // 暂时注释掉未使用的导入
import { Button, Select, Space, Spin, message as messageService, ConfigProvider, Modal, Layout } from "antd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
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
    CaretRightOutlined,
    FullscreenOutlined,
    LoadingOutlined,
    RedoOutlined,
    SettingOutlined,
    CopyOutlined,
    FullscreenExitOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { QuestionSubmitControllerService } from "../../../../generated";
import MojoCarrot from "../../../components/MojoCarrot";
import JudgeResultCard from "./judge/JudgeResultCard";
import AiAssistant, { ErrorType } from './judge/AiAssistant';
import InlineCodeHint from './judge/InlineCodeHint';

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
    parsedJudgeInfo?: JudgeInfo;
}

const CustomSplitter: React.FC<CustomSplitterProps> = ({ question, fontSize = 14 }) => {
    const [width, setWidth] = useState(600);
    const codeEditorRef = useRef<CodeEditorRef>(null);
    const [currentLanguage, setCurrentLanguage] = useState('java');
    const [, contextHolder] = messageService.useMessage();
    
    // 计时相关状态
    const [solving, setSolving] = useState(false);
    const [solvingTime, setSolvingTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<number | null>(null);

    // 仅用于展示UI的状态
    const [showBubble] = useState(true);

    // 记录最后一次提交的 Id 及相关状态
    const [, setLastSubmitId] = useState<string | null>(null);
    const [isJudging, setIsJudging] = useState(false);
    const [judgeProgress, setJudgeProgress] = useState(0);
    
    // 提交结果相关状态
    const [submissionResult, setSubmissionResult] = useState<ExtendedQuestionSubmit | null>(null);
    const [judgeInfo, setJudgeInfo] = useState<JudgeInfo | null>(null);
    const [showResultCard, setShowResultCard] = useState(false);
    const [isRollingRequest, setIsRollingRequest] = useState(false); // 是否正在轮询请求

    // 预期答案 - 从测试用例中提取
    const [expectedOutputs] = useState<string[]>([]);

    // AI助手相关状态
    const [showAiAssistant, setShowAiAssistant] = useState(false);
    const [anxietyLevel, setAnxietyLevel] = useState(20); // 初始焦虑值
    const [submissionHistory, setSubmissionHistory] = useState<ErrorType[]>([]); // 提交历史
    const [thinkingTime, setThinkingTime] = useState(0); // 思考时间（秒）
    const [currentError, setCurrentError] = useState<ErrorType | undefined>(); // 当前错误
    const [lastActivity, setLastActivity] = useState(Date.now()); // 最后活动时间

    // 内联提示控制
    const [showInlineHint, setShowInlineHint] = useState(false);

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

    // 组件卸载时清理定时器以及停止请求
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
            }
            if (isRollingRequest) {
                setIsRollingRequest(false);
            }
        };
    }, []);

    // 更新思考时间和自动提示
    useEffect(() => {
        const timer = setInterval(() => {
            // 只有在编辑器中有代码且在写代码时才计时
            if (solving && !isPaused) {
                // 检查是否超过一定时间没有活动，如果是则认为在思考
                const now = Date.now();
                if (now - lastActivity > 10000) { // 10秒无活动认为在思考
                    setThinkingTime(prev => prev + 1);
                    
                    // 思考超过特定时间自动弹出提示 (30秒内联提示，60秒完整提示)
                    if (thinkingTime === 29) {
                        setShowInlineHint(true);
                    } else if (thinkingTime === 59) {
                        setShowInlineHint(false);
                        setShowAiAssistant(true);
                    }
                }
            }
        }, 1000);
        
        return () => clearInterval(timer);
    }, [solving, isPaused, lastActivity, thinkingTime]);

    const handleResize = (_: React.SyntheticEvent, data: ResizeData) => {
        setWidth(data.size.width);
    };

    const handleCodeChange = (value: string | undefined) => {
        // 记录活动时间
        setLastActivity(Date.now());
        
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
        if (!submitId) return null;
        
        setIsJudging(true);
        setJudgeProgress(0);
        
        let retryCount = 0;
        const maxRetries = 30; // 最多轮询30次，每次间隔1秒
        const intervalTime = 1000; // 1秒
        
        return new Promise<ExtendedQuestionSubmit | null>((resolve) => {
            setIsRollingRequest(true);
            const pollInterval = setInterval(async () => {
                try {
                    if (!isRollingRequest) return ;

                    // 更新进度条
                    setJudgeProgress(prev => Math.min(prev + (100 / maxRetries), 95));
                    
                    // 获取所有提交记录
                    const qustionSubmitResp = await QuestionSubmitControllerService.getSubmitUsingGet(Number(submitId));
                    
                    if (qustionSubmitResp.code === 0 && qustionSubmitResp.data) {
                        // 找到当前提交的记录
                        setIsRollingRequest(false);
                        const currentSubmission = qustionSubmitResp.data;
                        if (currentSubmission) {
                            // 更新提交结果
                            const extSubmission = currentSubmission as ExtendedQuestionSubmit;
                            
                            // 解析judgeInfo
                            if (currentSubmission.judgeInfo) {
                                try {
                                    const parsedJudgeInfo = currentSubmission.judgeInfo;
                                    setJudgeInfo(parsedJudgeInfo);
                                    
                                    // 存储解析后的judgeInfo
                                    extSubmission.parsedJudgeInfo = parsedJudgeInfo;
                                    
                                    // 判断是否完成判题
                                    if (parsedJudgeInfo?.memory) {
                                        setSubmissionResult(extSubmission);
                                        finishJudging(pollInterval, extSubmission);
                                        return;
                                    }
                                } catch (error) {
                                    console.error('解析judgeInfo失败:', error);
                                }
                            }
                            
                            // 检查输出结果
                            const hasOutputResult = !!(extSubmission.outputResult && extSubmission.outputResult.length > 0);
                            
                            // 只要有outputResult，就认为判题结束
                            if (hasOutputResult) {
                                setSubmissionResult(extSubmission);
                                finishJudging(pollInterval, extSubmission);
                                return;
                            }
                        }
                    }
                    
                    // 检查是否超过最大重试次数
                    if (++retryCount >= maxRetries) {
                        clearInterval(pollInterval);
                        setIsJudging(false);
                        setJudgeProgress(100);
                        messageService.warning('判题时间较长，请稍后查看结果');
                        resolve(null);
                    }
                } catch (error) {
                    console.error('轮询判题结果出错:', error);
                    clearInterval(pollInterval);
                    setIsJudging(false);
                    resolve(null);
                }
            }, intervalTime);
            
            // 完成判题的辅助函数
            function finishJudging(interval: ReturnType<typeof setInterval>, submission: ExtendedQuestionSubmit) {
                setJudgeProgress(100);
                setIsJudging(false);
                setShowResultCard(true);
                clearInterval(interval);
                resolve(submission);
            }
        });
    }, []);

    const handleSubmitCode = async () => {
        try {
            const code = codeEditorRef.current?.getValue();
            if (!code) {
                messageService.error('请先编写代码');
                return;
            }

            // 提交代码时只暂停计时，不清空时间
            stopTimer();

            // 显示提交中的消息
            const submitMsg = messageService.loading('代码提交中...', 0);

            const resp = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
                code: code,
                language: currentLanguage,
                questionId: question?.id,
            });

            if (resp.code === 0) {
                submitMsg(); // 关闭提交中的消息
                messageService.success('代码提交成功，正在判题...');

                const submitId = resp.data;
                setLastSubmitId(submitId);
                
                // 开始轮询判题结果
                pollJudgeResult(submitId).then((result) => {
                    // 根据判题结果判断错误类型
                    if (result?.judgeInfo && (
                        typeof result.judgeInfo === 'object' ? 
                            result.judgeInfo.message === '答案错误' || result.judgeInfo.message === 'Wrong Answer' 
                            : false) ||
                        (!result?.judgeInfo && result?.status === 2)) {
                        setCurrentError(ErrorType.WRONG_ANSWER);
                        setSubmissionHistory(prev => [...prev, ErrorType.WRONG_ANSWER]);
                    } else if (result?.judgeInfo && (
                        typeof result.judgeInfo === 'object' ? 
                            result.judgeInfo.message === '时间超限' || result.judgeInfo.message === 'Time Limit Exceeded'
                            : false)) {
                        setCurrentError(ErrorType.TIME_LIMIT_EXCEEDED);
                        setSubmissionHistory(prev => [...prev, ErrorType.TIME_LIMIT_EXCEEDED]);
                    } else if (result?.status === 2) { // 其他失败情况，假设为边界问题
                        setCurrentError(ErrorType.BOUNDARY_ERROR);
                        setSubmissionHistory(prev => [...prev, ErrorType.BOUNDARY_ERROR]);
                    }
                    
                    // 更新焦虑值：连续错误会增加焦虑
                    if (result?.status === 2 || 
                        (result?.judgeInfo && typeof result.judgeInfo === 'object' && 
                            (result.judgeInfo.message === '答案错误' || result.judgeInfo.message === '时间超限'))) {
                        setAnxietyLevel(prev => Math.min(prev + 15, 100));
                        
                        // 显示内联提示，连续多次错误则直接显示AI助手
                        if (submissionHistory.length >= 2) {
                            setShowInlineHint(false);
                            setShowAiAssistant(true);
                        } else {
                            setShowInlineHint(true);
                        }
                    } else if (result?.status === 1) {
                        // 成功则降低焦虑，并关闭提示
                        setAnxietyLevel(prev => Math.max(prev - 20, 0));
                        setShowInlineHint(false);
                    }
                });

                // 小窗口显示判题中状态
                setJudgeInfo(null);
                setSubmissionResult(null);
                setShowResultCard(true);
            } else {
                submitMsg(); // 关闭提交中的消息
                messageService.error(resp.message || '提交失败');
            }
        } catch (error) {
            // 处理错误，避免访问可能不存在的message属性
            const errorMsg = typeof error === 'object' && error !== null && 'message' in error 
                ? String((error as { message: string }).message) 
                : String(error);
            messageService.error(`提交失败，请稍后重试${errorMsg}`);
        }
    };

    // 模拟错误类型
    const simulateError = (errorType: ErrorType) => {
        setCurrentError(errorType);
        setSubmissionHistory(prev => [...prev, errorType]);
        
        // 增加焦虑值
        setAnxietyLevel(prev => Math.min(prev + 15, 100));
        
        // 打开AI助手
        setShowAiAssistant(true);
    };
    
    // 增加焦虑值
    const increaseAnxiety = () => {
        setAnxietyLevel(prev => Math.min(prev + 10, 100));
    };
    
    // 减少焦虑值
    const decreaseAnxiety = () => {
        setAnxietyLevel(prev => Math.max(prev - 10, 0));
    };
    
    // 重置状态
    const resetStats = () => {
        setAnxietyLevel(20);
        setSubmissionHistory([]);
        setThinkingTime(0);
        setCurrentError(undefined);
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
                onClick={() => setShowAiAssistant(true)}
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
                            {submissionHistory.length > 0 
                                ? '看起来你遇到了一些问题，点击查看提示！' 
                                : thinkingTime > 300 
                                ? '需要一些帮助吗？点击查看解题思路！'
                                : '点击查看你的代码分析和建议！'}
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

            {/* AI助手 */}
            <AiAssistant
                open={showAiAssistant}
                onCancel={() => setShowAiAssistant(false)}
                problemTitle={question?.title || '最大子数组和'}
                problemType="dynamic_programming"
                anxiety={anxietyLevel}
                submissionCount={submissionHistory.length}
                errorHistory={submissionHistory}
                thinkingTime={thinkingTime}
                currentError={currentError}
                onSimulateError={simulateError}
                onIncreaseAnxiety={increaseAnxiety}
                onDecreaseAnxiety={decreaseAnxiety}
                onResetStats={resetStats}
            />

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
                
                /* 自定义滚动条样式 */
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #228B22 #303030;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #303030;
                    border-radius: 4px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #228B22;
                    border-radius: 4px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #1a6b1a;
                }
                `}
            </style>

            <Layout className="h-screen bg-[#141414]">
                <ResizableBox
                    width={width}
                    height={Infinity}
                    minConstraints={[300, Infinity]}
                    maxConstraints={[1200, Infinity]}
                    onResize={handleResize}
                    handle={
                        <div className="w-1 h-full bg-[#303030] cursor-col-resize absolute right-0 top-0 transition-colors duration-300 hover:bg-[#228B22]" />
                    }
                >
                    <Sider
                        width={width}
                        className="bg-[#141414] border-r border-[#303030] overflow-auto h-screen custom-scrollbar"
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
                <Content className="bg-[#141414] p-4 h-screen flex-grow overflow-hidden">
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
                            <div style={{ position: 'relative', height: '100%' }}>
                                <CodeEditor
                                    ref={codeEditorRef}
                                    language={currentLanguage}
                                    onChange={handleCodeChange}
                                    defaultValue="// 在这里编写你的代码"
                                    fontSize={fontSize}
                                />
                                <InlineCodeHint 
                                    visible={showInlineHint && !showAiAssistant}
                                    errorType={currentError}
                                    thinkingTime={thinkingTime}
                                    onOpen={() => setShowAiAssistant(true)}
                                    onClose={() => setShowInlineHint(false)}
                                />
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>
        </ConfigProvider>
    );
};

export default CustomSplitter; 