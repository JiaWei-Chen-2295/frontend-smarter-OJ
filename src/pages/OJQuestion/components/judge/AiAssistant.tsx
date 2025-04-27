import React, { useState } from 'react';
import { Modal, Button, Space, Collapse, Tabs, Tag, Badge, Tooltip } from 'antd';
import type { TabsProps } from 'antd';
import { QuestionCircleOutlined, BulbOutlined, HistoryOutlined, RocketOutlined } from '@ant-design/icons';
import MojoCarrot from '../../../../components/MojoCarrot';

// 错误类型定义
export enum ErrorType {
  WRONG_ANSWER = 'wrong_answer',
  TIME_LIMIT_EXCEEDED = 'time_limit_exceeded',
  BOUNDARY_ERROR = 'boundary_error',
  ARRAY_INDEX_ERROR = 'array_index_error',
  INVALID_INPUT = 'invalid_input',
  LOGIC_ERROR = 'logic_error'
}

// 焦虑值等级
export enum AnxietyLevel {
  LOW = 'low', // 0-30
  MEDIUM = 'medium', // 30-70
  HIGH = 'high' // 70-100
}

// 提示级别
export enum HintLevel {
  BASIC = 'basic', // 初级提示
  ADVANCED = 'advanced' // 深度提示
}

interface AiAssistantProps {
  open: boolean;
  onCancel: () => void;
  problemTitle: string;
  problemType: string;
  anxiety: number; // 0-100的焦虑值
  submissionCount: number; // 提交次数
  errorHistory: ErrorType[]; // 历史错误类型
  thinkingTime: number; // 思考时间（秒）
  currentError?: ErrorType; // 当前错误类型
  
  // 用于测试的回调函数
  onSimulateError?: (errorType: ErrorType) => void;
  onIncreaseAnxiety?: () => void;
  onDecreaseAnxiety?: () => void;
  onResetStats?: () => void;
}

interface Hint {
  level: HintLevel;
  title: string;
  content: React.ReactNode;
}

const AiAssistant: React.FC<AiAssistantProps> = ({
  open,
  onCancel,
  problemTitle,
  problemType,
  anxiety,
  submissionCount,
  errorHistory,
  thinkingTime,
  currentError,
  onSimulateError,
  onIncreaseAnxiety,
  onDecreaseAnxiety,
  onResetStats
}) => {
  const [activeTab, setActiveTab] = useState<string>('hints');
  
  // 计算焦虑等级
  const getAnxietyLevel = (): AnxietyLevel => {
    if (anxiety < 30) return AnxietyLevel.LOW;
    if (anxiety < 70) return AnxietyLevel.MEDIUM;
    return AnxietyLevel.HIGH;
  };
  
  // 根据焦虑等级设置语气
  const getToneBasedOnAnxiety = (): string => {
    const level = getAnxietyLevel();
    switch (level) {
      case AnxietyLevel.LOW:
        return '技术型';
      case AnxietyLevel.MEDIUM:
        return '鼓励型';
      case AnxietyLevel.HIGH:
        return '轻松型';
    }
  };
  
  // 根据错误类型和焦虑等级生成提示
  const generateHints = (): Hint[] => {
    const anxietyLevel = getAnxietyLevel();
    const hints: Hint[] = [];
    
    // 如果连续多次错误，给出初级提示
    if (submissionCount >= 3 && currentError) {
      switch (currentError) {
        case ErrorType.BOUNDARY_ERROR:
          hints.push({
            level: HintLevel.BASIC,
            title: '边界条件考虑',
            content: anxietyLevel === AnxietyLevel.HIGH 
              ? <p>边界有点小问题哦~(◠‿◠) 试试输入为空数组或只有一个元素的情况？</p>
              : anxietyLevel === AnxietyLevel.MEDIUM
              ? <p>检查一下边界情况，例如空数组或只有一个元素的情况，你已经很接近答案了！</p>
              : <p>检测到边界条件处理可能不完善，建议检查数组为空或只有一个元素的情况。</p>
          });
          break;
        case ErrorType.TIME_LIMIT_EXCEEDED:
          hints.push({
            level: HintLevel.BASIC,
            title: '时间复杂度分析',
            content: anxietyLevel === AnxietyLevel.HIGH 
              ? <p>算法好像有点慢呢 (≧∇≦)/ 有没有O(n)的方法呢？</p>
              : anxietyLevel === AnxietyLevel.MEDIUM
              ? <p>你的算法可能在大量数据时超时，尝试使用动态规划来优化时间复杂度！</p>
              : <p>当前算法时间复杂度过高，导致运行超时。请考虑使用Kadane算法实现O(n)复杂度。</p>
          });
          break;
        case ErrorType.WRONG_ANSWER:
          hints.push({
            level: HintLevel.BASIC,
            title: '逻辑错误检查',
            content: anxietyLevel === AnxietyLevel.HIGH
              ? <p>答案差一点点就对啦！(●ˇ∀ˇ●) 记得考虑负数可能比当前子数组和更大哦~</p>
              : anxietyLevel === AnxietyLevel.MEDIUM
              ? <p>检查一下maxCurrent的更新方式，记住子数组必须是连续的！</p>
              : <p>检测到maxCurrent的计算逻辑可能有误，请重新分析Math.max()的使用场景。</p>
          });
          break;
        default:
          hints.push({
            level: HintLevel.BASIC,
            title: '一般错误检查',
            content: <p>检查一下代码的逻辑，确保你正确处理了所有可能的情况。</p>
          });
      }
    }
    
    // 如果长时间思考，提供算法思路
    if (thinkingTime > 60) { // 5分钟以上
      hints.push({
        level: HintLevel.BASIC,
        title: '算法思路启发',
        content: anxietyLevel === AnxietyLevel.HIGH
          ? <p>卡住了吗？没关系！(๑•̀ㅂ•́)و✧ 想想每个位置的"决策"：要么从当前位置重新开始，要么延续之前的子数组~</p>
          : anxietyLevel === AnxietyLevel.MEDIUM
          ? <p>试着思考动态规划的角度：每个位置有两个选择，要么接着前面的子数组，要么从当前位置重新开始。</p>
          : <p>本题可采用动态规划思想，记录每个位置的最大子数组和，状态转移方程为：dp[i] = max(nums[i], dp[i-1] + nums[i])。</p>
      });
    }
    
    // 如果多次出现相同错误，给出深度提示
    const errorCounts: Record<ErrorType, number> = {} as Record<ErrorType, number>;
    errorHistory.forEach(error => {
      errorCounts[error] = (errorCounts[error] || 0) + 1;
    });
    
    const repeatedErrors = Object.entries(errorCounts)
      .filter(([_, count]) => count >= 2)
      .map(([error]) => error as ErrorType);
    
    if (repeatedErrors.includes(ErrorType.BOUNDARY_ERROR)) {
      hints.push({
        level: HintLevel.ADVANCED,
        title: '边界处理详解',
        content: <div>
          <p>边界条件是本题的关键点之一。请特别注意以下几种情况：</p>
          <ul>
            <li>空数组：应当返回什么？</li>
            <li>全负数组：最大子数组和应是？</li>
            <li>单元素数组：结果应该是什么？</li>
          </ul>
          <p>代码中检查：</p>
          <pre>{`if (args.length == 0) {
    System.out.println(0);
    return;
}`}</pre>
        </div>
      });
    }
    
    if (repeatedErrors.includes(ErrorType.WRONG_ANSWER) || problemType === 'dynamic_programming') {
      hints.push({
        level: HintLevel.ADVANCED,
        title: '最大子数组和算法详解',
        content: <div>
          <p>最大子数组和是一个经典的动态规划问题，通常称为Kadane算法。核心思想是：</p>
          <ol>
            <li>维护两个变量：maxCurrent（当前位置的最大子数组和）和maxGlobal（全局最大子数组和）</li>
            <li>对于每个元素，有两种选择：
              <ul>
                <li>将元素加入到现有子数组</li>
                <li>以当前元素开始新的子数组</li>
              </ul>
            </li>
            <li>状态转移方程：maxCurrent = Math.max(nums[i], maxCurrent + nums[i])</li>
            <li>更新全局最大值：maxGlobal = Math.max(maxGlobal, maxCurrent)</li>
          </ol>
          <p>Kadane算法伪代码：</p>
          <pre>{`initialize maxCurrent = nums[0]
initialize maxGlobal = nums[0]
for i from 1 to n-1:
    maxCurrent = max(nums[i], maxCurrent + nums[i])
    if maxCurrent > maxGlobal:
        maxGlobal = maxCurrent
return maxGlobal`}</pre>
        </div>
      });
    }
    
    return hints;
  };
  
  const hints = generateHints();
  
  // 计算徽标数字
  const getHintBadgeCount = () => {
    return hints.length;
  };

  // 测试工具栏
  const renderDebugToolbar = () => {
    if (!onSimulateError && !onIncreaseAnxiety && !onDecreaseAnxiety && !onResetStats) {
      return null;
    }
    
    return (
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#252525', 
        borderRadius: '8px',
        border: '1px dashed #444'
      }}>
        <h4 style={{ color: '#999' }}>调试工具 (仅开发环境可见)</h4>
        <Space direction="vertical" style={{ width: '100%' }}>
          {onSimulateError && (
            <Space wrap>
              <span style={{ color: '#999' }}>模拟错误:</span>
              <Button size="small" onClick={() => onSimulateError(ErrorType.WRONG_ANSWER)}>
                错误答案
              </Button>
              <Button size="small" onClick={() => onSimulateError(ErrorType.BOUNDARY_ERROR)}>
                边界错误
              </Button>
              <Button size="small" onClick={() => onSimulateError(ErrorType.TIME_LIMIT_EXCEEDED)}>
                超时
              </Button>
            </Space>
          )}
          
          {(onIncreaseAnxiety || onDecreaseAnxiety) && (
            <Space>
              <span style={{ color: '#999' }}>焦虑值 ({anxiety}):</span>
              {onDecreaseAnxiety && (
                <Button size="small" onClick={onDecreaseAnxiety}>
                  -10
                </Button>
              )}
              {onIncreaseAnxiety && (
                <Button size="small" onClick={onIncreaseAnxiety}>
                  +10
                </Button>
              )}
            </Space>
          )}
          
          {onResetStats && (
            <Button size="small" danger onClick={onResetStats}>
              重置状态
            </Button>
          )}
        </Space>
      </div>
    );
  };
  
  // Tabs配置
  const items: TabsProps['items'] = [
    {
      key: 'hints',
      label: (
        <Badge count={getHintBadgeCount()} size="small">
          <BulbOutlined /> 智能提示
        </Badge>
      ),
      children: (
        <div>
          {hints.length > 0 ? (
            <Collapse 
              bordered={false}
              style={{ backgroundColor: 'transparent' }}
              items={hints.map((hint, index) => ({
                key: index,
                label: (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{hint.title}</span>
                    <Tag color={hint.level === HintLevel.BASIC ? 'blue' : 'purple'}>
                      {hint.level === HintLevel.BASIC ? '基础提示' : '深度指导'}
                    </Tag>
                  </div>
                ),
                children: hint.content,
                style: { 
                  marginBottom: '8px', 
                  backgroundColor: '#252525', 
                  borderRadius: '8px',
                  border: hint.level === HintLevel.ADVANCED ? '1px solid #8a2be2' : '1px solid #333'
                }
              }))}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              <QuestionCircleOutlined style={{ fontSize: '24px', marginBottom: '10px' }} />
              <p>目前没有特定提示，继续尝试解题吧！</p>
            </div>
          )}
          {renderDebugToolbar()}
        </div>
      ),
    },
    {
      key: 'stats',
      label: (
        <span>
          <HistoryOutlined /> 解题统计
        </span>
      ),
      children: (
        <div>
          <div style={{ 
            backgroundColor: '#252525', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '15px'
          }}>
            <h4 style={{ borderBottom: '1px solid #333', paddingBottom: '8px' }}>当前状态</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>提交次数:</span>
              <span>{submissionCount} 次</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>思考时间:</span>
              <span>{Math.floor(thinkingTime / 60)}分{thinkingTime % 60}秒</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>焦虑水平:</span>
              <span>
                {anxiety}/100 
                <Tag 
                  color={
                    getAnxietyLevel() === AnxietyLevel.LOW ? 'green' : 
                    getAnxietyLevel() === AnxietyLevel.MEDIUM ? 'orange' : 'red'
                  }
                  style={{ marginLeft: '8px' }}
                >
                  {getAnxietyLevel() === AnxietyLevel.LOW ? '低' : 
                   getAnxietyLevel() === AnxietyLevel.MEDIUM ? '中' : '高'}
                </Tag>
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>交互语气:</span>
              <span>{getToneBasedOnAnxiety()}</span>
            </div>
          </div>
          
          {errorHistory.length > 0 && (
            <div style={{ 
              backgroundColor: '#252525', 
              padding: '15px', 
              borderRadius: '8px' 
            }}>
              <h4 style={{ borderBottom: '1px solid #333', paddingBottom: '8px' }}>错误历史</h4>
              <Space wrap style={{ marginTop: '10px' }}>
                {errorHistory.map((error, index) => (
                  <Tag 
                    color={
                      error === ErrorType.WRONG_ANSWER ? 'red' :
                      error === ErrorType.TIME_LIMIT_EXCEEDED ? 'orange' :
                      error === ErrorType.BOUNDARY_ERROR ? 'purple' :
                      'default'
                    } 
                    key={index}
                  >
                    {error === ErrorType.WRONG_ANSWER ? '错误答案' :
                     error === ErrorType.TIME_LIMIT_EXCEEDED ? '超时' :
                     error === ErrorType.BOUNDARY_ERROR ? '边界错误' :
                     error === ErrorType.ARRAY_INDEX_ERROR ? '数组越界' :
                     error === ErrorType.INVALID_INPUT ? '输入错误' :
                     error === ErrorType.LOGIC_ERROR ? '逻辑错误' :
                     '未知错误'}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
          
          {renderDebugToolbar()}
        </div>
      ),
    },
    {
      key: 'resources',
      label: (
        <span>
          <RocketOutlined /> 学习资源
        </span>
      ),
      children: (
        <div>
          <div style={{ 
            backgroundColor: '#252525', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '15px'
          }}>
            <h4 style={{ borderBottom: '1px solid #333', paddingBottom: '8px' }}>动态规划资源</h4>
            <ul style={{ paddingInlineStart: '20px' }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#1890ff' }}>Kadane算法详解与可视化</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#1890ff' }}>子数组问题集锦</a>
              </li>
              <li>
                <a href="#" style={{ color: '#1890ff' }}>动态规划基础训练（10题）</a>
              </li>
            </ul>
          </div>
          
          <div style={{ 
            backgroundColor: '#252525', 
            padding: '15px', 
            borderRadius: '8px' 
          }}>
            <h4 style={{ borderBottom: '1px solid #333', paddingBottom: '8px' }}>相关问题推荐</h4>
            <ul style={{ paddingInlineStart: '20px' }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#1890ff' }}>买卖股票的最佳时机</a>
                <Tag color="green" style={{ marginLeft: '8px' }}>简单</Tag>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#1890ff' }}>乘积最大子数组</a>
                <Tag color="orange" style={{ marginLeft: '8px' }}>中等</Tag>
              </li>
              <li>
                <a href="#" style={{ color: '#1890ff' }}>环形子数组的最大和</a>
                <Tag color="orange" style={{ marginLeft: '8px' }}>中等</Tag>
              </li>
            </ul>
          </div>
          
          {renderDebugToolbar()}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MojoCarrot width={40} height={40} />
          <div>
            <div>胡萝卜助手</div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              正在解决: {problemTitle}
            </div>
          </div>
        </div>
      }
      open={open}
      onCancel={onCancel}
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
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={items}
        style={{ color: 'white' }}
      />
    </Modal>
  );
};

export default AiAssistant; 