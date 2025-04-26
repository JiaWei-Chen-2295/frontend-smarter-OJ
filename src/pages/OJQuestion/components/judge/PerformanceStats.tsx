import React from 'react';
import type { JudgeInfo } from '../../../../../generated';
import { formatMemorySize } from '../../utils/formatUtils';

interface PerformanceStatsProps {
    judgeInfo: JudgeInfo;
}

const PerformanceStats: React.FC<PerformanceStatsProps> = ({ judgeInfo }) => {
    return (
        <div style={{ 
            backgroundColor: '#1e1e1e',
            border: '1px solid #303030',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
        }}>
            <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '8px', marginTop: 0 }}>性能统计</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', marginTop: '10px' }}>
                <div>
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '5px' }}>执行用时</div>
                    <div style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold', 
                        color: '#52c41a',
                        fontFamily: 'monospace'
                    }}>
                        {judgeInfo.time !== undefined ? `${judgeInfo.time}ms` : 'N/A'}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '5px' }}>内存消耗</div>
                    <div style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold', 
                        color: '#1890ff',
                        fontFamily: 'monospace'
                    }}>
                        {judgeInfo.memory !== undefined ? formatMemorySize(judgeInfo.memory) : 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceStats; 