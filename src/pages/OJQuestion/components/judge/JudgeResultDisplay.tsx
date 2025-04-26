import React from 'react';
import { Card, Tag, Divider } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { formatMemorySize } from '../../utils/formatUtils';

export interface JudgeResult {
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error' | 'compilation_error' | 'pending';
  testCases?: {
    id: number;
    status: string;
    input?: string;
    expectedOutput?: string;
    actualOutput?: string;
    memoryUsed?: number;
    timeUsed?: number;
  }[];
  message?: string;
  timeUsed?: number;
  memoryUsed?: number;
  score?: number;
}

interface JudgeResultDisplayProps {
  judgeResult: JudgeResult;
  showDetails?: boolean;
}

const JudgeResultDisplay: React.FC<JudgeResultDisplayProps> = ({ judgeResult, showDetails = true }) => {
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Tag color="success" icon={<CheckCircleOutlined />}>通过</Tag>;
      case 'wrong_answer':
        return <Tag color="error" icon={<CloseCircleOutlined />}>答案错误</Tag>;
      case 'time_limit_exceeded':
        return <Tag color="warning">超时</Tag>;
      case 'memory_limit_exceeded':
        return <Tag color="warning">内存超限</Tag>;
      case 'runtime_error':
        return <Tag color="error">运行错误</Tag>;
      case 'compilation_error':
        return <Tag color="error">编译错误</Tag>;
      default:
        return <Tag icon={<QuestionCircleOutlined />}>未知状态</Tag>;
    }
  };

  const getTestCaseStatusTag = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Tag color="success">通过</Tag>;
      case 'wrong_answer':
        return <Tag color="error">错误</Tag>;
      case 'time_limit_exceeded':
        return <Tag color="warning">超时</Tag>;
      case 'memory_limit_exceeded':
        return <Tag color="warning">内存超限</Tag>;
      case 'runtime_error':
        return <Tag color="error">运行错误</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  return (
    <div className="judge-result">
      <Card title="判题结果" bordered={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            状态: {getStatusTag(judgeResult.status)}
          </div>
          {judgeResult.score !== undefined && (
            <div>
              <Tag color="blue">得分: {judgeResult.score}</Tag>
            </div>
          )}
        </div>

        {judgeResult.memoryUsed !== undefined && judgeResult.timeUsed !== undefined && (
          <div style={{ marginBottom: 16 }}>
            <Tag>内存: {formatMemorySize(judgeResult.memoryUsed)}</Tag>
            <Tag style={{ marginLeft: 8 }}>时间: {judgeResult.timeUsed} ms</Tag>
          </div>
        )}

        {judgeResult.message && (
          <div style={{ marginBottom: 16 }}>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: 10, 
              borderRadius: 4,
              maxHeight: '200px',
              overflow: 'auto' 
            }}>
              {judgeResult.message}
            </pre>
          </div>
        )}

        {showDetails && judgeResult.testCases && judgeResult.testCases.length > 0 && (
          <>
            <Divider>测试用例</Divider>
            {judgeResult.testCases.map((testCase) => (
              <Card 
                key={testCase.id} 
                type="inner" 
                title={`测试用例 #${testCase.id}`}
                extra={getTestCaseStatusTag(testCase.status)}
                style={{ marginBottom: 16 }}
              >
                {(testCase.input || testCase.expectedOutput || testCase.actualOutput) && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {testCase.input && (
                      <div>
                        <h4>输入:</h4>
                        <pre style={{ 
                          backgroundColor: '#f5f5f5', 
                          padding: 10, 
                          borderRadius: 4,
                          maxHeight: '150px',
                          overflow: 'auto' 
                        }}>
                          {testCase.input}
                        </pre>
                      </div>
                    )}
                    
                    {testCase.expectedOutput && (
                      <div>
                        <h4>期望输出:</h4>
                        <pre style={{ 
                          backgroundColor: '#f5f5f5', 
                          padding: 10, 
                          borderRadius: 4,
                          maxHeight: '150px',
                          overflow: 'auto' 
                        }}>
                          {testCase.expectedOutput}
                        </pre>
                      </div>
                    )}
                    
                    {testCase.actualOutput && (
                      <div style={{ gridColumn: '1 / span 2' }}>
                        <h4>实际输出:</h4>
                        <pre style={{ 
                          backgroundColor: '#f5f5f5', 
                          padding: 10, 
                          borderRadius: 4,
                          maxHeight: '150px',
                          overflow: 'auto',
                          borderColor: testCase.status === 'wrong_answer' ? '#ff4d4f' : 'transparent',
                          borderWidth: testCase.status === 'wrong_answer' ? '1px' : '0',
                          borderStyle: 'solid'
                        }}>
                          {testCase.actualOutput}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
                
                {testCase.memoryUsed !== undefined && testCase.timeUsed !== undefined && (
                  <div style={{ marginTop: 16 }}>
                    <Tag>内存: {formatMemorySize(testCase.memoryUsed)}</Tag>
                    <Tag style={{ marginLeft: 8 }}>时间: {testCase.timeUsed} ms</Tag>
                  </div>
                )}
              </Card>
            ))}
          </>
        )}
      </Card>
    </div>
  );
};

export default JudgeResultDisplay; 