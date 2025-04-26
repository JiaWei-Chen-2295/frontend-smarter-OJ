import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface JudgingInProgressProps {
  judgeProgress: number;
  solvingTime?: string;
}

const JudgingInProgress: React.FC<JudgingInProgressProps> = ({ judgeProgress, solvingTime }) => {
  return (
    <div>
      <div style={{ 
        backgroundColor: '#1e1e1e',
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <Spin 
          indicator={<LoadingOutlined style={{ fontSize: 48, color: '#228B22' }} spin />} 
          tip="正在判题中，请稍候..." 
          style={{ color: 'white' }}
        />
        <div style={{ 
          marginTop: '20px', 
          height: '6px', 
          backgroundColor: '#0a0a0a', 
          borderRadius: '3px', 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            height: '100%', 
            width: `${judgeProgress}%`, 
            backgroundColor: '#228B22',
            transition: 'width 0.3s ease-in-out'
          }} />
        </div>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
          正在评测你的代码表现，测试输入输出正确性和性能...
        </div>
        {solvingTime && (
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#52c41a' }}>
            解题用时: {solvingTime}
          </div>
        )}
      </div>
      <div style={{ color: '#999', fontSize: '14px', textAlign: 'center' }}>
        判题过程不会影响你的其他操作，你可以继续编写代码
      </div>
    </div>
  );
};

export default JudgingInProgress; 