import React from 'react';
import { Modal, Result } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    InfoCircleOutlined,
    SyncOutlined,
    WarningOutlined
} from '@ant-design/icons';
import type { JudgeInfo } from '../../../../../generated_new/question';
import { formatTime, formatMemorySize } from '../../utils/formatUtils';
import PerformanceStats from './PerformanceStats';
import OutputResult from './OutputResult';

import JudgingInProgress from './JudgingInProgress';

interface JudgeResultCardProps {
    open: boolean;
    onCancel: () => void;
    submissionResult: any; // 使用更具体的类型
    judgeInfo: JudgeInfo | null;
    isJudging: boolean;
    judgeProgress: number;
    solvingTime: number;
    expectedOutputs: string[];
}

// 状态图标和颜色相关函数
const getStatusIconAndColor = (isJudging: boolean, submissionResult: any, judgeInfo: JudgeInfo | null) => {
    if (isJudging) return { icon: <SyncOutlined spin />, color: '#1890ff' };

    // 如果judgeInfo为空对象，根据提交状态决定显示
    if (!judgeInfo || (typeof judgeInfo === 'object' && Object.keys(judgeInfo).length === 0)) {
        // 如果有提交结果，根据status判断
        if (submissionResult && submissionResult.status !== undefined) {
            switch (submissionResult.status) {
                case 1: // 成功
                    return { icon: <CheckCircleOutlined />, color: '#228B22' };
                case 2: // 失败
                    return { icon: <CloseCircleOutlined />, color: '#f5222d' };
                case 3: // 进行中
                    return { icon: <SyncOutlined spin />, color: '#1890ff' };
                default:
                    return { icon: <InfoCircleOutlined />, color: '#228B22' };
            }
        }
        return { icon: <InfoCircleOutlined />, color: '#228B22' };
    }

    // 根据judgeInfo.message判断
    switch (judgeInfo.message) {
        case '成功':
        case 'Accepted':
            return { icon: <CheckCircleOutlined />, color: '#228B22' };
        case '答案错误':
        case 'Wrong Answer':
            return { icon: <CloseCircleOutlined />, color: '#f5222d' };
        case '内存超限':
        case 'Memory Limit Exceeded':
            return { icon: <WarningOutlined />, color: '#faad14' };
        case '时间超限':
        case 'Time Limit Exceeded':
            return { icon: <WarningOutlined />, color: '#faad14' };
        default:
            return { icon: <InfoCircleOutlined />, color: '#228B22' };
    }
};

// 获取判题状态消息
const getJudgeStatusMessage = (isJudging: boolean, submissionResult: any, judgeInfo: JudgeInfo | null) => {
    if (isJudging) return '判题进行中...';

    // 如果judgeInfo有message，直接返回
    if (judgeInfo && judgeInfo.message) {
        return judgeInfo.message;
    }

    // 如果judgeInfo为空，但有提交状态，根据状态返回消息
    if (submissionResult && submissionResult.status !== undefined) {
        switch (submissionResult.status) {
            case 0: return '等待判题';
            case 1: return '判题成功';
            case 2: return '判题失败';
            case 3: return '判题中';
            default: return '判题完成';
        }
    }

    return '判题完成';
};

const JudgeResultCard: React.FC<JudgeResultCardProps> = ({
    open,
    onCancel,
    submissionResult,
    judgeInfo,
    isJudging,
    judgeProgress,
    solvingTime,
    expectedOutputs
}) => {
    const statusInfo = getStatusIconAndColor(isJudging, submissionResult, judgeInfo);

    // 格式化输出结果
    const formatOutputResult = () => {
        if (!submissionResult || !submissionResult.outputResult) return [];

        try {
            // 尝试解析JSON格式的输出结果
            let outputData = submissionResult.outputResult;

            // 尝试多次解析，处理可能的双重编码情况
            let parseAttempts = 0;
            const maxParseAttempts = 2;

            while (typeof outputData === 'string' && parseAttempts < maxParseAttempts) {
                try {
                    const parsed = JSON.parse(outputData);
                    outputData = parsed;
                    parseAttempts++;
                } catch {
                    break;
                }
            }

            // 确保结果是数组
            if (Array.isArray(outputData)) {
                return outputData;
            } else if (outputData !== null && outputData !== undefined) {
                return [outputData];
            }

            // 如果解析后是null或undefined，抛出错误进入catch分支
            throw new Error('解析结果为null或undefined');
        } catch (error) {
            // 如果解析失败，尝试按行分割
            if (typeof submissionResult.outputResult === 'string') {
                // 尝试匹配JSON数组格式的字符串并提取元素
                const jsonArrayMatch = submissionResult.outputResult.match(/\[\s*"([^"]*)"(?:\s*,\s*"([^"]*)")*\s*\]/);
                if (jsonArrayMatch) {
                    // 提取所有引号中的内容
                    const extractedItems = submissionResult.outputResult.match(/"([^"]*)"/g);
                    if (extractedItems) {
                        return extractedItems.map((item: string) => item.replace(/"/g, ''));
                    }
                }

                // 按行分割
                const lines = submissionResult.outputResult.split('\n').filter((line: string) => line.trim());
                if (lines.length > 0) {
                    return lines;
                }
            }

            // 如果所有方法都失败，直接返回原始字符串
            return [String(submissionResult.outputResult)];
        }
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {statusInfo.icon}
                    <span>{getJudgeStatusMessage(isJudging, submissionResult, judgeInfo)}</span>
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={null}
            width={700}
            style={{
                top: 20
            }}
            styles={{
                body: {
                    backgroundColor: '#141414',
                    color: 'white',
                    padding: '20px',
                },
            }}
            maskClosable={!isJudging}
            className="dark-modal"
        >
            {isJudging ? (
                <JudgingInProgress judgeProgress={judgeProgress} />
            ) : submissionResult ? (
                <JudgeResultContent
                    submissionResult={submissionResult}
                    judgeInfo={judgeInfo}
                    statusInfo={statusInfo}
                    solvingTime={solvingTime}
                    formatOutputResult={formatOutputResult}
                    expectedOutputs={expectedOutputs}
                />
            ) : (
                <Result
                    icon={<InfoCircleOutlined style={{ color: '#228B22' }} />}
                    title="等待判题结果"
                    subTitle="判题结果尚未返回，请稍后再查看"
                />
            )}
        </Modal>
    );
};

// 判题结果内容组件
const JudgeResultContent: React.FC<{
    submissionResult: any,
    judgeInfo: JudgeInfo | null,
    statusInfo: { icon: React.ReactNode, color: string },
    solvingTime: number,
    formatOutputResult: () => string[],
    expectedOutputs: string[]
}> = ({
    submissionResult,
    judgeInfo,
    statusInfo,
    solvingTime,
    formatOutputResult,
    expectedOutputs
}) => (
        <>
            <div style={{
                backgroundColor: statusInfo.color,
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center'
            }}>
                {statusInfo.icon}
                <div style={{ marginLeft: '12px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        {getJudgeStatusMessage(false, submissionResult, judgeInfo)}
                    </div>
                    <div>
                        {submissionResult.status === 0 ? (
                            '等待判题中...'
                        ) : judgeInfo?.time !== undefined || judgeInfo?.memory !== undefined ? (
                            <>执行用时: {judgeInfo?.time || 0}ms | 内存消耗: {judgeInfo?.memory ? formatMemorySize(judgeInfo.memory) : 'N/A'}</>
                        ) : (
                            '判题结果：' + (submissionResult.status === 1 ? '通过' : submissionResult.status === 2 ? '未通过' : '进行中')
                        )}
                    </div>
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
            </div>

            {/* 添加性能统计卡片 */}
            {judgeInfo && (judgeInfo.time !== undefined || judgeInfo.memory !== undefined) && (
                <PerformanceStats judgeInfo={judgeInfo} />
            )}

            {/* 程序输出结果部分 */}
            {submissionResult && (
                <OutputResult
                    submissionResult={submissionResult}
                    formatOutputResult={formatOutputResult}
                    judgeInfo={judgeInfo}
                    expectedOutputs={expectedOutputs}
                />
            )}


        </>
    );

export default JudgeResultCard; 