import React from 'react';
import type { JudgeInfo } from '../../../../../generated_new/question';

interface OutputResultProps {
    submissionResult: any;
    formatOutputResult: () => string[];
    judgeInfo: JudgeInfo | null;
    expectedOutputs: string[];
}

const OutputResult: React.FC<OutputResultProps> = ({
    submissionResult,
    formatOutputResult,
    judgeInfo,
    expectedOutputs
}) => {
    return (
        <div style={{ marginBottom: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '8px' }}>程序输出</h3>

            {/* 始终显示原始输出结果 */}
            <div style={{
                backgroundColor: '#252525',
                padding: '12px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                marginBottom: '15px',
                border: '1px solid #303030'
            }}>
                <div style={{ fontWeight: 'bold', color: '#bbb', marginBottom: '8px' }}>
                    原始输出:
                </div>
                <div style={{ backgroundColor: '#1e1e1e', padding: '10px', borderRadius: '4px', color: '#fff' }}>
                    {submissionResult.outputResult ? String(submissionResult.outputResult) : '无输出结果'}
                </div>
            </div>

            {/* 格式化的输出结果 */}
            {submissionResult.outputResult && (
                <div>
                    <div style={{ fontWeight: 'bold', color: '#bbb', marginBottom: '8px' }}>
                        解析后的测试用例输出:
                    </div>
                    <div style={{
                        backgroundColor: '#252525',
                        padding: '12px',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '14px'
                    }}>
                        {formatOutputResult().length > 0 ? (
                            <div>
                                {formatOutputResult().map((output, index) => (
                                    <div key={index} style={{
                                        marginBottom: '12px',
                                        padding: '8px',
                                        backgroundColor: '#1e1e1e',
                                        borderRadius: '4px',
                                        border: judgeInfo?.message === '答案错误' ? '1px solid #f5222d' : '1px solid #303030'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '8px'
                                        }}>
                                            <span style={{ color: '#888' }}>测试用例 {index + 1}</span>
                                            {judgeInfo?.message === '答案错误' ? (
                                                <span style={{ color: '#f5222d' }}>❌ 未通过</span>
                                            ) : (
                                                <span style={{ color: '#52c41a' }}>✓ 通过</span>
                                            )}
                                        </div>
                                        <div style={{
                                            backgroundColor: '#252525',
                                            padding: '5px 8px',
                                            borderRadius: '4px',
                                            marginBottom: '4px',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-all'
                                        }}>
                                            <span style={{ color: '#fff' }}>{output}</span>
                                        </div>
                                        {expectedOutputs[index] && (
                                            <div style={{ display: 'flex' }}>
                                                <span style={{ color: '#888', width: '80px' }}>预期结果:</span>
                                                <span style={{ color: judgeInfo?.message === '答案错误' ? '#f5222d' : '#52c41a' }}>
                                                    {expectedOutputs[index]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                padding: '10px',
                                color: '#999',
                                textAlign: 'center'
                            }}>
                                未能解析测试用例输出
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OutputResult; 