import React from 'react';
import { Space, Button, Tooltip } from 'antd';
import { BulbOutlined, CloseOutlined } from '@ant-design/icons';
import { ErrorType } from './AiAssistant';

interface InlineCodeHintProps {
  visible: boolean;
  errorType?: ErrorType;
  thinkingTime: number;
  onOpen: () => void;
  onClose: () => void;
}

const InlineCodeHint: React.FC<InlineCodeHintProps> = ({
  visible,
  errorType,
  thinkingTime,
  onOpen,
  onClose
}) => {
  if (!visible) return null;
  
  // 根据不同场景提供不同的提示内容
  let hintContent = '';
  let hintType = 'normal';
  
  if (errorType) {
    hintType = 'error';
    switch (errorType) {
      case ErrorType.WRONG_ANSWER:
        hintContent = '你的代码可能存在逻辑错误，需要帮助吗？';
        break;
      case ErrorType.BOUNDARY_ERROR:
        hintContent = '检查边界条件可能会有帮助，需要提示吗？';
        break;
      case ErrorType.TIME_LIMIT_EXCEEDED:
        hintContent = '代码运行超时，需要优化算法吗？';
        break;
      default:
        hintContent = '遇到了一些问题，需要帮助吗？';
    }
  } else if (thinkingTime > 30) {
    hintType = 'thinking';
    hintContent = '看起来你在思考中，需要一些提示吗？';
  }
  
  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: hintType === 'error' ? 'rgba(255, 77, 79, 0.2)' : 
                          hintType === 'thinking' ? 'rgba(24, 144, 255, 0.2)' : 
                          'rgba(82, 196, 26, 0.2)',
        borderLeft: `4px solid ${hintType === 'error' ? '#ff4d4f' : 
                                 hintType === 'thinking' ? '#1890ff' : 
                                 '#52c41a'}`,
        padding: '8px 12px',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        maxWidth: '300px',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
          <BulbOutlined style={{ marginRight: '8px' }} />
          <span style={{ fontWeight: 'bold' }}>胡萝卜助手提示</span>
        </div>
        <Tooltip title="关闭提示">
          <Button 
            type="text" 
            size="small" 
            icon={<CloseOutlined />} 
            onClick={onClose}
            style={{ color: '#fff', padding: 0, marginLeft: '4px', marginTop: '-4px' }}
          />
        </Tooltip>
      </div>
      <p style={{ margin: '0 0 10px 0', color: '#fff' }}>{hintContent}</p>
      <Space>
        <Button 
          size="small" 
          type="primary"
          onClick={onOpen}
          style={{ 
            backgroundColor: hintType === 'error' ? '#ff4d4f' : 
                            hintType === 'thinking' ? '#1890ff' : 
                            '#52c41a',
            borderColor: 'transparent'
          }}
        >
          查看详细提示
        </Button>
      </Space>
    </div>
  );
};

export default InlineCodeHint;