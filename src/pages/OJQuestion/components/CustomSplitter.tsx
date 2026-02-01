import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Select, Space, message as messageService, ConfigProvider, Layout, Tabs } from "antd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import type { QuestionVO, JudgeInfo, QuestionSubmitVO, JudgeCase } from "../../../../generated_new/question";
import { questionApi } from "../../../api";
import Veditor from "../../../components/Veditor";
import { CodeEditor, CodeEditorRef } from "../../../components/CodeEditor";
import {
    FormatPainterOutlined,
    SendOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
} from "@ant-design/icons";
import MojoCarrot from "../../../components/MojoCarrot";
import JudgeResultOverlay from "./judge/JudgeResultOverlay";
import SubmissionHistory from "./SubmissionHistory";

const { Sider, Content } = Layout;
const { Option } = Select;

interface ExtendedQuestionVO extends QuestionVO {
    judgeCase?: string;
}

interface CustomSplitterProps {
    question?: ExtendedQuestionVO;
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
    { value: 'javascript', label: 'JavaScript' }
];

// 扩展QuestionSubmit类型，添加outputResult字段
interface ExtendedQuestionSubmit extends QuestionSubmitVO {
    parsedJudgeInfo?: JudgeInfo;
}

const CustomSplitter: React.FC<CustomSplitterProps> = ({ question, fontSize = 14 }) => {
    const [width, setWidth] = useState(600);
    const codeEditorRef = useRef<CodeEditorRef>(null);
    const [currentLanguage, setCurrentLanguage] = useState('java');
    const [editorCode, setEditorCode] = useState("// 在这里编写你的代码");
    const [, contextHolder] = messageService.useMessage();
    const codeByLanguageRef = useRef<Record<string, string>>({});
    const lastQuestionIdRef = useRef<string | undefined>(undefined);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileTab, setMobileTab] = useState<'question' | 'code'>('question');
    const [availableHeight, setAvailableHeight] = useState(() => Math.max(window.innerHeight - 64, 360));
    const getStorageKey = useCallback((questionId: string, language: string) => {
        return `oj:question:${questionId}:lang:${language}`;
    }, []);

    const readStoredCode = useCallback((questionId: string, language: string) => {
        try {
            const stored = localStorage.getItem(getStorageKey(questionId, language));
            return stored === null ? undefined : stored;
        } catch {
            return undefined;
        }
    }, [getStorageKey]);

    const writeStoredCode = useCallback((questionId: string, language: string, value: string) => {
        try {
            localStorage.setItem(getStorageKey(questionId, language), value);
        } catch {
            return;
        }
    }, [getStorageKey]);

    // 计时相关状态
    const [solving, setSolving] = useState(false);
    const [solvingTime, setSolvingTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<number | null>(null);

    // 记录最后一次提交的 Id 及相关状态
    const [, setLastSubmitId] = useState<string | null>(null);
    const [isJudging, setIsJudging] = useState(false);
    const [judgeProgress, setJudgeProgress] = useState(0);

    const [submissionResult, setSubmissionResult] = useState<ExtendedQuestionSubmit | null>(null);

    const [judgeInfo, setJudgeInfo] = useState<JudgeInfo | null>(null);
    const [showResultCard, setShowResultCard] = useState(false);
    const isRollingRequestRef = useRef(false); // 用于内部逻辑，避免闭包过时


    // 预期答案 - 从测试用例中提取
    const [expectedOutputs, setExpectedOutputs] = useState<string[]>([]);

    // 辅助函数：从 judgeCase 字符串中解析预期输出
    const extractExpectedOutputs = useCallback((judgeCaseStr?: string) => {
        if (!judgeCaseStr) return [];
        try {
            const cases: JudgeCase[] = JSON.parse(judgeCaseStr);
            return cases.map(c => c.output || '');
        } catch (e) {
            console.warn('Failed to parse judgeCase:', e);
            return [];
        }
    }, []);

    // 监听题目变化，更新预期输出
    useEffect(() => {
        if (question?.judgeCase) {
            const outputs = extractExpectedOutputs(question.judgeCase);
            setExpectedOutputs(outputs);
        }
    }, [question?.judgeCase, extractExpectedOutputs]);


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
            isRollingRequestRef.current = false;
        };
    }, []);

    useEffect(() => {
        const media = window.matchMedia('(max-width: 768px)');
        const update = () => setIsMobile(media.matches);
        update();
        if (media.addEventListener) {
            media.addEventListener('change', update);
            return () => media.removeEventListener('change', update);
        }
        media.addListener(update);
        return () => media.removeListener(update);
    }, []);

    useEffect(() => {
        const updateHeight = () => {
            setAvailableHeight(Math.max(window.innerHeight - 64, 360));
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);


    const handleResize = (_: React.SyntheticEvent, data: ResizeData) => {
        setWidth(data.size.width);
    };

    const handleCodeChange = (value: string | undefined) => {
        const nextValue = value ?? '';
        codeByLanguageRef.current[currentLanguage] = nextValue;
        setEditorCode(nextValue);
        if (question?.id) {
            writeStoredCode(question.id, currentLanguage, nextValue);
        }
        // 第一次输入时开始计时
        if (value && value !== "// 在这里编写你的代码" && !solving) {
            startTimer();
        }
    };

    const getTemplateForLanguage = useCallback((language: string, template?: QuestionVO['codeTemplate']) => {
        if (!template) return undefined;
        if (language === 'java') return template.java;
        if (language === 'cpp') return template.cpp;
        if (language === 'python') return template.python;
        return undefined;
    }, []);


    const handleLanguageChange = (value: string) => {
        setCurrentLanguage(value);
        codeEditorRef.current?.setLanguage(value);
        const questionId = question?.id;
        const storedCode = questionId ? readStoredCode(questionId, value) : undefined;
        const nextCode = storedCode
            ?? codeByLanguageRef.current[value]
            ?? getTemplateForLanguage(value, question?.codeTemplate)
            ?? "// 在这里编写你的代码";
        codeByLanguageRef.current[value] = nextCode;
        setEditorCode(nextCode);
        codeEditorRef.current?.setValue(nextCode);
    };

    const handleFormatCode = () => {
        codeEditorRef.current?.formatCode();
    };

    useEffect(() => {
        if (!question?.id) return;
        const isNewQuestion = question.id !== lastQuestionIdRef.current;
        if (isNewQuestion) {
            codeByLanguageRef.current = {};
            lastQuestionIdRef.current = question.id;
        }
        const storedCode = readStoredCode(question.id, currentLanguage);
        const template = getTemplateForLanguage(currentLanguage, question.codeTemplate);
        const initialCode = storedCode
            ?? codeByLanguageRef.current[currentLanguage]
            ?? template
            ?? "// 在这里编写你的代码";
        if (codeByLanguageRef.current[currentLanguage] !== initialCode || isNewQuestion) {
            codeByLanguageRef.current[currentLanguage] = initialCode;
            setEditorCode(initialCode);
            codeEditorRef.current?.setValue(initialCode);
        }
    }, [currentLanguage, getTemplateForLanguage, question?.codeTemplate, question?.id, readStoredCode]);



    // 轮询判题结果
    const pollJudgeResult = useCallback(async (submitId: string) => {
        if (!submitId) return null;

        setIsJudging(true);
        setJudgeProgress(0);

        let retryCount = 0;
        const maxRetries = 60; // 增加重试次数
        const intervalTime = 1000;

        return new Promise<ExtendedQuestionSubmit | null>((resolve) => {
            isRollingRequestRef.current = true;

            const pollInterval = setInterval(async () => {
                try {
                    // 使用 ref 进行判断，避免闭包陷阱
                    if (!isRollingRequestRef.current) {
                        clearInterval(pollInterval);
                        return;
                    }

                    // 更新进度条
                    setJudgeProgress(prev => Math.min(prev + (100 / maxRetries), 98));

                    // 获取提交记录
                    const qustionSubmitResp = await questionApi.getSubmit(submitId);

                    if (qustionSubmitResp.data.code === 0 && qustionSubmitResp.data.data) {
                        const currentSubmission = qustionSubmitResp.data.data;
                        const extSubmission = currentSubmission as ExtendedQuestionSubmit;

                        // 解析judgeInfo
                        if (currentSubmission.judgeInfo) {
                            try {
                                const parsedJudgeInfo = currentSubmission.judgeInfo;
                                setJudgeInfo(parsedJudgeInfo);
                                extSubmission.parsedJudgeInfo = parsedJudgeInfo;

                                // 判断是否完成判题 (通过状态或者具体的判题消息)
                                const statusLabel = parsedJudgeInfo.message;
                                const isFinished = statusLabel && (
                                    statusLabel.includes('Accepted') ||
                                    statusLabel.includes('Wrong Answer') ||
                                    statusLabel.includes('Limit Exceeded') ||
                                    statusLabel.includes('Error') ||
                                    statusLabel === '成功' ||
                                    statusLabel === '失败'
                                );

                                if (isFinished || (parsedJudgeInfo.time !== undefined && parsedJudgeInfo.memory !== undefined)) {
                                    setSubmissionResult(extSubmission);
                                    finishJudging(pollInterval, extSubmission);
                                    return;
                                }
                            } catch (error) {
                                console.error('解析JudgeInfo出错:', error);
                            }
                        }

                        // 备用方案：检查输出结果
                        if (extSubmission.outputResult && extSubmission.outputResult.length > 0) {
                            setSubmissionResult(extSubmission);
                            finishJudging(pollInterval, extSubmission);
                            return;
                        }
                    }

                    // 检查是否超过最大重试次数
                    if (++retryCount >= maxRetries) {
                        finishJudging(pollInterval, null);
                        messageService.warning('判题时间较长，请稍后在提交历史中查看结果');
                    }
                } catch (error) {
                    console.error('轮询判题结果出错:', error);
                    finishJudging(pollInterval, null);
                }
            }, intervalTime);

            // 完成判题的辅助函数
            function finishJudging(interval: ReturnType<typeof setInterval>, submission: ExtendedQuestionSubmit | null) {
                clearInterval(interval);
                isRollingRequestRef.current = false;
                setIsJudging(false);
                setJudgeProgress(100);
                if (submission) {
                    setSubmissionResult(submission);
                }
                setShowResultCard(true);
                resolve(submission);
            }
        });
    }, []); // 移除 isRollingRequest 依赖

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

            // 如果 id 是 string 类型，直接传递，不需要 cast
            const resp = await questionApi.doQuestionSubmit(
                {
                    code: code,
                    language: currentLanguage,
                    questionId: question?.id,
                }
            );

            if (resp.data.code === 0) {
                submitMsg(); // 关闭提交中的消息
                messageService.success('代码提交成功，正在判题...');

                const submitId = resp.data.data; // data is string now
                // @ts-ignore
                setLastSubmitId(submitId);

                // 开始轮询判题结果
                // @ts-ignore
                pollJudgeResult(submitId);


                // 小窗口显示判题中状态
                setJudgeInfo(null);
                setSubmissionResult(null);
                setShowResultCard(true);
            } else {
                submitMsg(); // 关闭提交中的消息
                messageService.error(resp.data.message || '提交失败');
            }
        } catch (error) {
            // 处理错误，避免访问可能不存在的message属性
            const errorMsg = typeof error === 'object' && error !== null && 'message' in error
                ? String((error as { message: string }).message)
                : String(error);
            messageService.error(`提交失败，请稍后重试${errorMsg}`);
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

            {/* 自定义悬浮按钮 AI助手 (仅保留图标动画) */}
            <div
                style={{
                    position: 'fixed',
                    right: '24px',
                    bottom: '24px',
                    width: '130px',
                    height: '164px',
                    zIndex: 100,
                    backgroundColor: 'transparent',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'default'
                }}
            >
                <MojoCarrot width={130} height={164} />
            </div>


            {/* 判题结果浮层 (取代原有的 Modal) */}
            <JudgeResultOverlay
                isVisible={showResultCard}
                onClose={() => setShowResultCard(false)}
                // @ts-ignore
                submissionResult={submissionResult}
                judgeInfo={judgeInfo}
                isJudging={isJudging}
                judgeProgress={judgeProgress}
                solvingTime={solvingTime}
                expectedOutputs={expectedOutputs}
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
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #1a6b1a;
                }

                /* Tabs custom styles */
                .ant-tabs-nav {
                    margin-bottom: 0 !important;
                    padding: 0 16px; 
                    border-bottom: 1px solid #303030;
                }
                .ant-tabs-tab {
                    color: #a6a6a6 !important;
                }
                .ant-tabs-tab-active .ant-tabs-tab-btn {
                    color: #228B22 !important;
                }
                .ant-tabs-ink-bar {
                    background-color: #228B22 !important;
                }
                
                /* Ensure tabs fill height and content scrolls */
                .ant-tabs {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .ant-tabs-content-holder {
                    flex: 1;
                    min-height: 0;
                    overflow: hidden;
                }
                .ant-tabs-content {
                    height: 100%;
                }
                .ant-tabs-tabpane {
                    height: 100%;
                    padding: 0 !important;
                }
                `}
            </style>

            <Layout className={`bg-[#141414] overflow-hidden min-h-0 ${isMobile ? 'flex flex-col' : ''}`} style={{ height: availableHeight }}>
                {isMobile && (
                    <div className="flex bg-[#141414] border-b border-[#303030] shrink-0 h-10">
                        <div
                            className={`flex-1 flex items-center justify-center cursor-pointer transition-colors ${mobileTab === 'question' ? 'text-[#228B22] border-b-2 border-[#228B22] font-medium bg-[#1a1a1a]' : 'text-gray-400 hover:text-gray-200 bg-[#141414]'}`}
                            onClick={() => setMobileTab('question')}
                        >
                            题目描述
                        </div>
                        <div
                            className={`flex-1 flex items-center justify-center cursor-pointer transition-colors ${mobileTab === 'code' ? 'text-[#228B22] border-b-2 border-[#228B22] font-medium bg-[#1a1a1a]' : 'text-gray-400 hover:text-gray-200 bg-[#141414]'}`}
                            onClick={() => setMobileTab('code')}
                        >
                            代码编辑
                        </div>
                    </div>
                )}

                {(!isMobile || mobileTab === 'question') && (
                    isMobile ? (
                        <div className="flex-1 overflow-hidden min-h-0 relative">
                            <div className="absolute inset-0 p-3 flex flex-col gap-3 min-h-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h1 className="text-base font-bold text-white truncate">{question?.title}</h1>
                                    <span className="text-[10px] text-[#8a8a8a] bg-[#1f1f1f] border border-[#303030] rounded-full px-2 py-1">
                                        题目详情
                                    </span>
                                </div>
                                <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-[#232323] bg-[#171717]/60 shadow-[0_0_0_1px_rgba(34,139,34,0.08)]">
                                    <Tabs
                                        defaultActiveKey="1"
                                        className="h-full"
                                        items={[
                                            {
                                                key: '1',
                                                label: '题目描述',
                                                children: (
                                                    <div className="h-full overflow-auto custom-scrollbar p-3">
                                                        <div className="prose prose-invert max-w-none">
                                                            <Veditor
                                                                value={question?.content || ''}
                                                                className="bg-transparent"
                                                            />
                                                        </div>
                                                        {question?.tags && question.tags.length > 0 && (
                                                            <div className="mt-4 rounded-lg border border-[#232323] bg-[#151515] p-3">
                                                                <h2 className="text-xs font-semibold text-white mb-2">标签</h2>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {question.tags.map((tag, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className="px-2 py-1 bg-[#303030] text-gray-300 rounded text-[10px] border border-[#3a3a3a]"
                                                                        >
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            },
                                            {
                                                key: '2',
                                                label: '提交记录',
                                                children: (
                                                    <div className="h-full overflow-auto custom-scrollbar p-3">
                                                        <SubmissionHistory questionId={question?.id} />
                                                    </div>
                                                )
                                            }
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ResizableBox
                            width={width}
                            height={availableHeight}
                            minConstraints={[300, Infinity]}
                            maxConstraints={[1200, Infinity]}
                            onResize={handleResize}
                            handle={
                                <div className="w-1 h-full bg-[#303030] cursor-col-resize absolute right-0 top-0 transition-colors duration-300 hover:bg-[#228B22]" />
                            }
                        >
                            <Sider
                                width={width}
                                className="bg-[#141414] border-r border-[#303030] h-full overflow-hidden"
                            >
                                <div className="h-full p-4 flex flex-col gap-4 min-h-0">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-xl font-bold text-white">{question?.title}</h1>
                                        <span className="text-xs text-[#8a8a8a] bg-[#1f1f1f] border border-[#303030] rounded-full px-3 py-1">
                                            题目详情
                                        </span>
                                    </div>
                                    <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-[#232323] bg-[#171717]/60 shadow-[0_0_0_1px_rgba(34,139,34,0.08)]">
                                        <Tabs
                                            defaultActiveKey="1"
                                            className="h-full"
                                            items={[
                                                {
                                                    key: '1',
                                                    label: '题目描述',
                                                    children: (
                                                        <div className="h-full overflow-auto custom-scrollbar p-4">
                                                            <div className="prose prose-invert max-w-none">
                                                                <Veditor
                                                                    value={question?.content || ''}
                                                                    className="bg-transparent"
                                                                />
                                                            </div>
                                                            {question?.tags && question.tags.length > 0 && (
                                                                <div className="mt-6 rounded-lg border border-[#232323] bg-[#151515] p-3">
                                                                    <h2 className="text-sm font-semibold text-white mb-2">标签</h2>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {question.tags.map((tag, index) => (
                                                                            <span
                                                                                key={index}
                                                                                className="px-2 py-1 bg-[#303030] text-gray-300 rounded text-xs border border-[#3a3a3a]"
                                                                            >
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                },
                                                {
                                                    key: '2',
                                                    label: '提交记录',
                                                    children: (
                                                        <div className="h-full overflow-auto custom-scrollbar p-4">
                                                            <SubmissionHistory questionId={question?.id} />
                                                        </div>
                                                    )
                                                }
                                            ]}
                                        />
                                    </div>
                                </div>
                            </Sider>
                        </ResizableBox>
                    )
                )}

                {(!isMobile || mobileTab === 'code') && (
                    <Content
                        className={`bg-[#141414] ${isMobile ? 'px-3 pb-3 pt-2' : 'p-4'} flex-grow overflow-hidden min-h-0`}
                        style={isMobile ? { height: '100%', position: 'relative' } : { position: 'relative' }}
                    >
                        <div className={`h-full bg-[#1b1b1b] rounded-xl ${isMobile ? 'p-3' : 'p-4'} border border-[#232323] shadow-[0_0_0_1px_rgba(34,139,34,0.08)] flex flex-col gap-4 min-h-0 relative`}>
                            <div className={`flex items-center justify-between ${isMobile ? 'flex-wrap gap-2' : ''}`}>
                                <Space className={isMobile ? 'w-full justify-between' : ''}>
                                    <Select
                                        value={currentLanguage}
                                        onChange={handleLanguageChange}
                                        style={{ width: isMobile ? 100 : 120 }}
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
                                    <div className="flex gap-2">
                                        <Button
                                            icon={<FormatPainterOutlined />}
                                            onClick={handleFormatCode}
                                            className="bg-[#303030] text-white hover:bg-[#404040]"
                                            size={isMobile ? 'small' : 'middle'}
                                        >
                                            {isMobile ? '' : '格式化代码'}
                                        </Button>
                                        <Button
                                            icon={<SendOutlined />}
                                            onClick={handleSubmitCode}
                                            className="bg-[#228B22] text-white hover:bg-[#1a6b1a]"
                                            size={isMobile ? 'small' : 'middle'}
                                        >
                                            {isMobile ? '提交' : '提交代码'}
                                        </Button>
                                    </div>
                                </Space>


                                <div className={`solve-qustion-time-counter bg-[#252525] rounded-lg border border-[#404040] flex items-center ${isMobile ? 'w-full justify-between px-3 py-2 mt-2' : 'px-4 py-2 ml-4'}`}>
                                    <div className="flex flex-col items-center">
                                        <span className="text-gray-300 text-xs mb-1">已用时间</span>
                                        <div className="flex items-center">
                                            <span className={`text-[#228B22] font-bold font-mono ${isMobile ? 'text-lg' : 'text-xl'}`}>
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

                                {!isMobile && (
                                    <div className="text-xs text-[#8a8a8a] bg-[#1f1f1f] border border-[#303030] rounded-full px-3 py-1">
                                        代码编辑区
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-[#232323] bg-[#141414]">
                                <div className="h-full custom-scrollbar overflow-hidden">
                                    <div style={{ position: 'relative', height: '100%' }}>
                                        <CodeEditor
                                            ref={codeEditorRef}
                                            language={currentLanguage}
                                            onChange={handleCodeChange}
                                            defaultValue={editorCode}
                                            fontSize={fontSize}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Content>
                )}
            </Layout>
        </ConfigProvider>
    );
};

export default CustomSplitter;
