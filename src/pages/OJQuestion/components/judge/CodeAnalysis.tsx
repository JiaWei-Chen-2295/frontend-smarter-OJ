import React from 'react';
import type { JudgeInfo } from '../../../../../generated';

interface CodeAnalysisProps {
    judgeInfo: JudgeInfo | null;
    submissionResult: any;
}

const CodeAnalysis: React.FC<CodeAnalysisProps> = ({ judgeInfo, submissionResult }) => {
    return (
        <div style={{ marginBottom: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '8px' }}>代码分析</h3>
            {(judgeInfo?.message === '成功' || judgeInfo?.message === 'Accepted' || 
              (!judgeInfo?.message && submissionResult.status === 1)) ? (
                <div>
                    <p>🎉 恭喜！你的解决方案成功通过了所有测试用例。</p>
                    <ul style={{ color: '#999' }}>
                        <li>时间复杂度: O(n) - 算法效率良好</li>
                        <li>空间复杂度: O(1) - 内存使用非常高效</li>
                    </ul>
                </div>
            ) : (judgeInfo?.message === '答案错误' || judgeInfo?.message === 'Wrong Answer' ||
                 (!judgeInfo?.message && submissionResult.status === 2)) ? (
                <div>
                    <p>你的代码未能通过所有测试用例，请检查以下可能的问题：</p>
                    <ul style={{ color: '#999' }}>
                        <li>边界情况处理是否正确？（如空输入、极值等）</li>
                        <li>算法逻辑是否完整处理了所有可能情况？</li>
                        <li>输出格式是否符合要求？</li>
                    </ul>
                </div>
            ) : judgeInfo?.message === '内存超限' || judgeInfo?.message === 'Memory Limit Exceeded' ? (
                <div>
                    <p>你的代码内存使用超出了限制，请考虑这些优化方向：</p>
                    <ul style={{ color: '#999' }}>
                        <li>是否可以优化数据结构，减少内存占用？</li>
                        <li>检查是否有不必要的大数组或集合创建</li>
                        <li>考虑使用空间效率更高的算法</li>
                    </ul>
                </div>
            ) : judgeInfo?.message === '时间超限' || judgeInfo?.message === 'Time Limit Exceeded' ? (
                <div>
                    <p>你的代码执行时间超出了限制，请考虑这些优化方向：</p>
                    <ul style={{ color: '#999' }}>
                        <li>检查是否有不必要的循环嵌套</li>
                        <li>考虑使用更高效的算法或数据结构</li>
                        <li>移除无用的计算步骤</li>
                    </ul>
                </div>
            ) : (
                <p>根据程序运行结果和测试用例输出分析你的代码表现，必要时进行优化和修改。</p>
            )}
        </div>
    );
};

export default CodeAnalysis; 