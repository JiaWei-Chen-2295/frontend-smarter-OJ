import React, { useState } from 'react';
import { 
  Button, 
  Select, 
  Space, 
  Popconfirm, 
  Tooltip,
  Typography,
  Tag
} from 'antd';
import { 
  PlayCircleOutlined,
  StopOutlined,
  CodeOutlined,
  ShareAltOutlined,
  EyeOutlined,
  CrownOutlined,
  UserOutlined
} from '@ant-design/icons';
import './index.css';

const { Text } = Typography;
const { Option } = Select;

// 支持的编程语言
const SUPPORTED_LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'C', value: 'c' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'SQL', value: 'sql' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'Markdown', value: 'markdown' }
];

interface CodeShareControlsProps {
  currentUserId?: string;
  roomLeaderId?: string;
  language: string;
  isSharing: boolean;
  sharedByUser?: string;
  sharedByUserName?: string;
  onLanguageChange: (language: string) => void;
  onStartSharing: (language: string) => void;
  onStopSharing: () => void;
  canEdit?: boolean;
  viewerCount?: number;
}

const CodeShareControls: React.FC<CodeShareControlsProps> = ({
  currentUserId,
  roomLeaderId,
  language,
  isSharing,
  sharedByUser,
  sharedByUserName,
  onLanguageChange,
  onStartSharing,
  onStopSharing,
  canEdit = true,
  viewerCount = 0
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  // 是否为房间队长
  const isRoomLeader = currentUserId === roomLeaderId;
  
  // 是否为代码分享者
  const isSharer = currentUserId === sharedByUser;
  
  // 是否可以开始分享（队长或者没人在分享时）
  const canStartShare = canEdit && (isRoomLeader || (!sharedByUser && !isSharing));
  
  // 是否可以停止分享
  const canStopShare = isSharing && (isSharer || isRoomLeader);

  // 语言改变处理
  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  // 开始分享
  const handleStartSharing = () => {
    onStartSharing(selectedLanguage);
  };

  // 停止分享
  const handleStopSharing = () => {
    onStopSharing();
  };

  // 获取当前状态描述
  const getStatusInfo = () => {
    if (isSharing && sharedByUser) {
      if (isSharer) {
        return {
          status: '正在分享',
          icon: <CodeOutlined />,
          color: 'processing',
          description: '您正在向房间成员分享代码'
        };
      } else {
        return {
          status: '观看模式',
          icon: <EyeOutlined />,
          color: 'default',
          description: `正在观看 ${sharedByUserName || sharedByUser} 的代码分享`
        };
      }
    }
    return null;
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="code-share-controls">
      <div className="controls-section">
        <div className="controls-left">
          {/* 语言选择 */}
          <div className="language-selector">
            <Text strong style={{ marginRight: 8, color: '#595959' }}>语言:</Text>
            <Select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              style={{ width: 120 }}
              size="small"
              disabled={isSharing && !isSharer}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <Option key={lang.value} value={lang.value}>
                  {lang.label}
                </Option>
              ))}
            </Select>
          </div>

          {/* 状态信息 */}
          {statusInfo && (
            <div className="status-info">
              <Tag 
                icon={statusInfo.icon} 
                color={statusInfo.color}
                className="status-tag"
              >
                {statusInfo.status}
              </Tag>
              
              {viewerCount > 0 && (
                <Tooltip title={`${viewerCount} 人正在观看`}>
                  <Tag color="blue" className="viewer-count">
                    <EyeOutlined /> {viewerCount}
                  </Tag>
                </Tooltip>
              )}
            </div>
          )}
        </div>

        <div className="controls-right">
          <Space>
            {/* 队长标识 */}
            {isRoomLeader && (
              <Tooltip title="房间队长">
                <CrownOutlined style={{ color: '#faad14' }} />
              </Tooltip>
            )}

            {/* 分享控制按钮 */}
            {!isSharing && canStartShare && (
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={handleStartSharing}
                className="share-button"
              >
                开始分享
              </Button>
            )}

            {canStopShare && (
              <Popconfirm
                title={isRoomLeader && !isSharer ? 
                  `确认停止 ${sharedByUserName || sharedByUser} 的代码分享？` : 
                  '确认停止代码分享？'
                }
                description={isRoomLeader && !isSharer ? 
                  '作为队长，您可以停止任何人的代码分享' : 
                  '停止后其他成员将无法继续观看您的代码'
                }
                onConfirm={handleStopSharing}
                okText="确认停止"
                cancelText="取消"
              >
                <Button
                  danger
                  icon={<StopOutlined />}
                  className="stop-button"
                >
                  {isRoomLeader && !isSharer ? '停止分享' : '停止分享'}
                </Button>
              </Popconfirm>
            )}

            {/* 只读状态提示 */}
            {!canEdit && (
              <Tooltip title="只有房间成员可以编辑代码">
                <Tag icon={<UserOutlined />} color="default">
                  只读模式
                </Tag>
              </Tooltip>
            )}
          </Space>
        </div>
      </div>

      {/* 分享说明 */}
      {statusInfo && (
        <div className="status-description">
          <Text type="secondary" style={{ fontSize: 12 }}>
            {statusInfo.description}
          </Text>
        </div>
      )}

      {/* 功能提示 */}
      {!isSharing && !sharedByUser && canEdit && (
        <div className="feature-tips">
          <Text type="secondary" style={{ fontSize: 11, fontStyle: 'italic' }}>
            💡 提示：{isRoomLeader ? '作为队长，' : ''}点击"开始分享"让房间成员看到您的代码编辑过程
          </Text>
        </div>
      )}
    </div>
  );
};

export default CodeShareControls;
