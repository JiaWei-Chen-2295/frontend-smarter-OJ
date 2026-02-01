import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircleFilled,
    CloseCircleFilled,
    ClockCircleOutlined,
    DatabaseOutlined,
    RightOutlined,
    DownOutlined,
    LoadingOutlined,
    CloseOutlined,
    ThunderboltFilled,
    InfoCircleFilled,
    SafetyCertificateFilled
} from '@ant-design/icons';
import { Progress, Tag, Button } from 'antd';
import type { JudgeInfo } from '../../../../../generated_new/question';
import { formatMemorySize, formatTime } from '../../utils/formatUtils';

interface JudgeResultOverlayProps {
    isVisible: boolean;
    onClose: () => void;
    submissionResult: any;
    judgeInfo: JudgeInfo | null;
    isJudging: boolean;
    judgeProgress: number;
    solvingTime: number;
    expectedOutputs: string[];
}

const JudgeResultOverlay: React.FC<JudgeResultOverlayProps> = ({
    isVisible,
    onClose,
    submissionResult,
    judgeInfo,
    isJudging,
    judgeProgress,
    solvingTime,
    expectedOutputs
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [overlayHeight, setOverlayHeight] = useState(480);
    const [isResizing, setIsResizing] = useState(false);

    // Auto-expand when judging starts or finish
    useEffect(() => {
        if (isJudging || (submissionResult && !isJudging)) {
            setIsExpanded(true);
        }
    }, [isJudging, submissionResult]);

    // Handle Resize
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            // The overlay is fixed to the bottom (12px offset).
            // Height = windowHeight - mouseY - offset
            const newHeight = window.innerHeight - e.clientY - 12;
            const constrainedHeight = Math.min(Math.max(newHeight, 180), window.innerHeight - 100);
            setOverlayHeight(constrainedHeight);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ns-resize';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    if (!isVisible) return null;

    const parseJudgeMessage = (msg?: string) => {
        if (!msg) return 'Unknown';
        if (msg.startsWith('{')) {
            try { return JSON.parse(msg).message || msg; } catch { return msg; }
        }
        return msg;
    };

    const statusMsg = isJudging ? '判题中...' : parseJudgeMessage(judgeInfo?.message);
    const isAccepted = statusMsg === 'Accepted' || statusMsg === '成功' || statusMsg.includes('Accepted') || statusMsg === '通过';

    // Theme configuration to match Project forest green
    const BRAND_GREEN = '#228B22';
    const ERROR_RED = '#ff4d4f';
    const PENDING_GREEN = '#228B22';

    const statusTheme = {
        color: isJudging ? PENDING_GREEN : isAccepted ? BRAND_GREEN : ERROR_RED,
        bg: isJudging ? 'rgba(34, 139, 34, 0.1)' : isAccepted ? 'rgba(34, 139, 34, 0.15)' : 'rgba(255, 77, 79, 0.15)',
        glow: isJudging ? 'rgba(34, 139, 34, 0.3)' : isAccepted ? 'rgba(34, 139, 34, 0.4)' : 'rgba(255, 77, 79, 0.4)'
    };

    const formatOutputResult = () => {
        if (!submissionResult?.outputResult) return [];
        try {
            if (Array.isArray(submissionResult.outputResult)) return submissionResult.outputResult;
            let outputData = submissionResult.outputResult;
            if (typeof outputData === 'string') {
                try {
                    const parsed = JSON.parse(outputData);
                    return Array.isArray(parsed) ? parsed : [parsed];
                } catch {
                    return outputData.split('\n').filter((l: string) => l.trim());
                }
            }
            return [String(outputData)];
        } catch {
            return [String(submissionResult.outputResult)];
        }
    };

    const outputs = formatOutputResult();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 150, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 150, opacity: 0 }}
                style={{
                    position: 'absolute',
                    left: '12px',
                    right: '12px',
                    bottom: '12px',
                    zIndex: 1000,
                    pointerEvents: 'none'
                }}
            >
                <div style={{
                    backgroundColor: 'rgba(15, 15, 15, 0.95)',
                    backdropFilter: 'blur(30px)',
                    border: `1px solid ${isJudging ? 'rgba(34, 139, 34, 0.3)' : statusTheme.color}88`,
                    borderRadius: '24px',
                    pointerEvents: 'auto',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: isExpanded ? `${overlayHeight}px` : '64px',
                    transition: isResizing ? 'none' : 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    borderBottom: `5px solid ${statusTheme.color}`,
                    boxShadow: `0 32px 80px rgba(0,0,0,0.9), 0 0 50px ${statusTheme.glow}55`
                }}>
                    {/* Identification Header / Resize Handle */}
                    <div
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            padding: '8px 24px',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'ns-resize',
                            userSelect: 'none',
                        }}
                        onMouseDown={() => {
                            if (isExpanded) setIsResizing(true);
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <SafetyCertificateFilled style={{ color: BRAND_GREEN, fontSize: '14px' }} />
                            <span style={{ fontSize: '11px', fontWeight: 900, color: '#999', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                                Smarter Judge Console | 智能判题控制台
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
                            <div style={{ fontSize: '10px', fontWeight: 700, color: BRAND_GREEN, opacity: 0.8 }}>
                                [ 核心执行单元 ]
                            </div>
                        </div>
                    </div>

                    {/* Main Control Bar */}
                    <div
                        style={{
                            height: '64px',
                            minHeight: '64px',
                            padding: '0 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                        }}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ position: 'relative' }}>
                                {isJudging ? (
                                    <div className="judging-spinner" style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '18px',
                                        background: 'rgba(34, 139, 34, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1.5px solid rgba(34, 139, 34, 0.5)'
                                    }}>
                                        <LoadingOutlined style={{ color: BRAND_GREEN, fontSize: '18px' }} />
                                    </div>
                                ) : isAccepted ? (
                                    <CheckCircleFilled style={{ color: statusTheme.color, fontSize: '32px', filter: `drop-shadow(0 0 10px ${statusTheme.glow}66)` }} />
                                ) : (
                                    <CloseCircleFilled style={{ color: statusTheme.color, fontSize: '32px', filter: `drop-shadow(0 0 10px ${statusTheme.glow}66)` }} />
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                <span style={{
                                    fontSize: '20px',
                                    fontWeight: 900,
                                    color: '#fff',
                                    lineHeight: 1.1,
                                    letterSpacing: '0.2px'
                                }}>
                                    {statusMsg === 'Accepted' ? '通过 (Accepted)' : statusMsg}
                                </span>
                                {!isJudging && (
                                    <span style={{ fontSize: '11px', color: isAccepted ? BRAND_GREEN : ERROR_RED, opacity: 0.8, fontWeight: 700, letterSpacing: '0.5px' }}>
                                        {isAccepted ? '核心加密逻辑验证通过' : '检测到关键内核执行异常'}
                                    </span>
                                )}
                            </div>

                            {!isJudging && (
                                <div style={{ display: 'flex', gap: '8px', marginLeft: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                        <ClockCircleOutlined style={{ color: '#888', fontSize: '13px' }} />
                                        <span style={{ color: '#ddd', fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>{judgeInfo?.time || 0} ms</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                        <DatabaseOutlined style={{ color: '#888', fontSize: '13px' }} />
                                        <span style={{ color: '#ddd', fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>{judgeInfo?.memory ? formatMemorySize(judgeInfo.memory) : '0 KB'}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {isJudging && (
                                <div style={{ width: '160px', position: 'relative' }}>
                                    <Progress
                                        percent={Math.round(judgeProgress)}
                                        size="small"
                                        strokeColor={BRAND_GREEN}
                                        trailColor="rgba(255,255,255,0.1)"
                                        showInfo={false}
                                        strokeWidth={4}
                                    />
                                    <div style={{ position: 'absolute', top: -16, right: 0, fontSize: '10px', color: BRAND_GREEN, fontWeight: 900, letterSpacing: '1px' }}>
                                        正在分析: {Math.round(judgeProgress)}%
                                    </div>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <Button
                                    type="text"
                                    icon={isExpanded ? <DownOutlined /> : <RightOutlined />}
                                    onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                                    style={{ color: '#888', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                />
                                <Button
                                    type="text"
                                    icon={<CloseOutlined />}
                                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                                    style={{ color: '#888', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Expandable Body */}
                    {isExpanded && (
                        <div
                            style={{
                                flex: 1,
                                padding: '0 20px 20px',
                                overflowY: 'auto',
                                borderTop: '1px solid rgba(255,255,255,0.1)'
                            }}
                            className="custom-scrollbar"
                        >
                            <div style={{ marginTop: '20px' }}>
                                {isJudging ? (
                                    <div style={{ padding: '60px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                                        <motion.div
                                            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.4, 0.8, 0.4] }}
                                            transition={{ repeat: Infinity, duration: 2.5 }}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '40px',
                                                background: 'radial-gradient(circle, rgba(34, 139, 34, 0.3) 0%, transparent 75%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '2px solid rgba(34, 139, 34, 0.15)'
                                            }}
                                        >
                                            <SafetyCertificateFilled style={{ fontSize: '40px', color: BRAND_GREEN, opacity: 0.7 }} />
                                        </motion.div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <span style={{ color: '#fff', fontSize: '18px', fontWeight: 800, letterSpacing: '1px' }}>正在解析核心逻辑 (Parsing Engine...)</span>
                                            <span style={{ color: '#888', fontSize: '14px' }}>智能判题系统正在对您的代码进行深度特征提取与结果核验。</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                                            <div style={{
                                                flex: 1,
                                                background: 'rgba(255,255,255,0.03)',
                                                padding: '16px 20px',
                                                borderRadius: '16px',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center'
                                            }}>
                                                <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 900 }}>
                                                    <ThunderboltFilled style={{ color: '#faad14', fontSize: '12px' }} />
                                                    解题时长 (ELAPSED TIME)
                                                </div>
                                                <div style={{ fontSize: '24px', fontWeight: 900, color: '#fff', fontFamily: 'monospace', lineHeight: 1 }}>
                                                    {formatTime(solvingTime)}
                                                </div>
                                            </div>
                                            <div style={{
                                                flex: 1,
                                                background: 'rgba(255,255,255,0.03)',
                                                padding: '16px 20px',
                                                borderRadius: '16px',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center'
                                            }}>
                                                <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 900 }}>测试用例通过率 (SUCCESS RATE)</div>
                                                <div style={{ fontSize: '24px', fontWeight: 900, color: statusTheme.color, fontFamily: 'monospace', lineHeight: 1 }}>
                                                    {isAccepted ? '100.0%' : '未完全通过'}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '24px' }}>
                                            <h4 style={{ color: '#666', fontSize: '11px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900, borderLeft: `3px solid ${BRAND_GREEN}`, paddingLeft: '10px' }}>
                                                实时执行日志 (Detailed Logs)
                                            </h4>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {outputs.length > 0 ? (
                                                    outputs.map((out: string, idx: number) => {
                                                        const expectedOut = submissionResult?.judgeCaseList?.[idx]?.output || expectedOutputs?.[idx];
                                                        const normalize = (s: string) =>
                                                            (s || '').toString()
                                                                .replace(/\r\n/g, '\n')
                                                                .replace(/\r/g, '\n')
                                                                .split('\n')
                                                                .map(l => l.trimEnd())
                                                                .join('\n')
                                                                .trim();

                                                        const isMatch = normalize(String(out)) === normalize(String(expectedOut));

                                                        return (
                                                            <div key={idx} style={{
                                                                background: 'rgba(255,255,255,0.015)',
                                                                borderRadius: '12px',
                                                                border: `1px solid ${isMatch ? 'rgba(34, 139, 34, 0.15)' : 'rgba(255, 77, 79, 0.15)'}`,
                                                                overflow: 'hidden'
                                                            }}>
                                                                <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                                    <span style={{ fontSize: '13px', color: '#888', fontWeight: 800 }}>CASE #{idx + 1}</span>
                                                                    <Tag color={isMatch ? BRAND_GREEN : ERROR_RED} bordered={false} style={{ margin: 0, fontSize: '10px', fontWeight: 900, borderRadius: '4px', padding: '1px 8px' }}>
                                                                        {isMatch ? 'PASSED' : 'FAILED'}
                                                                    </Tag>
                                                                </div>
                                                                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                                        <span style={{ color: '#666', fontSize: '12px', fontWeight: 700, minWidth: '70px', paddingTop: '2px' }}>实际输出:</span>
                                                                        <div style={{
                                                                            color: isMatch ? '#fff' : '#ffccc7',
                                                                            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                                                                            fontSize: '13px',
                                                                            lineHeight: '1.5',
                                                                            background: 'rgba(0,0,0,0.2)',
                                                                            padding: '8px 12px',
                                                                            borderRadius: '8px',
                                                                            flex: 1,
                                                                            border: isMatch ? '1px solid rgba(255,255,255,0.05)' : `1px solid ${ERROR_RED}22`
                                                                        }}>
                                                                            {String(out) || <span style={{ opacity: 0.3, fontStyle: 'italic' }}>[ 空 / NULL ]</span>}
                                                                        </div>
                                                                    </div>
                                                                    {expectedOut && (
                                                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                                            <span style={{ color: '#666', fontSize: '12px', fontWeight: 700, minWidth: '70px', paddingTop: '2px' }}>预期输出:</span>
                                                                            <div style={{
                                                                                color: BRAND_GREEN,
                                                                                fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                                                                                fontSize: '13px',
                                                                                lineHeight: '1.5',
                                                                                background: 'rgba(34, 139, 34, 0.05)',
                                                                                padding: '8px 12px',
                                                                                borderRadius: '8px',
                                                                                flex: 1,
                                                                                border: `1px solid ${BRAND_GREEN}22`
                                                                            }}>
                                                                                {String(expectedOut)}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div style={{ padding: '40px', textAlign: 'center', color: '#444', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '14px' }}>
                                                        无颗粒度执行数据可用。
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {!isAccepted && (
                                            <div style={{
                                                padding: '16px 20px',
                                                borderRadius: '16px',
                                                background: 'rgba(255, 77, 79, 0.05)',
                                                border: '1px solid rgba(255, 77, 79, 0.1)',
                                                display: 'flex',
                                                gap: '16px',
                                                alignItems: 'center'
                                            }}>
                                                <InfoCircleFilled style={{ color: ERROR_RED, fontSize: '20px' }} />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontSize: '14px', color: '#fff', fontWeight: 800 }}>核心引擎诊断 (Diagnostic)</span>
                                                    <span style={{ fontSize: '13px', color: '#ffccc7', opacity: 0.8 }}>
                                                        {statusMsg.includes('Time')
                                                            ? '检测到算法时间复杂度较高，请优化逻辑。'
                                                            : '核心逻辑验证发现数据对齐错误，请核对边界条件。'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default JudgeResultOverlay;
