import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, Typography, Divider, message } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../../context/store';
import CodeShareControls from '../CodeShareControls';
import CodeDiffEditor, { CodeDiffEditorRef } from '../CodeDiffEditor';
import { WebSocketChatService } from '../../services/websocket';
import './index.css';

const { Text } = Typography;

interface RoomCodeCollaborationProps {
  roomId: string;
  roomLeaderId?: string;
  wsService?: WebSocketChatService;
  visible?: boolean;
}

const RoomCodeCollaboration: React.FC<RoomCodeCollaborationProps> = ({
  roomLeaderId,
  wsService,
  visible = true
}) => {
  const currentUser = useSelector((state: RootState) => state.User.currentUser);
  const editorRef = useRef<CodeDiffEditorRef>(null);
  
  // 代码协作状态
  const [code, setCode] = useState('// 欢迎使用房间代码协作功能\n// 点击"开始分享"让其他成员看到您的代码\n\nfunction hello() {\n    console.log("Hello, Room!");\n}');
  const [language, setLanguage] = useState('javascript');
  const [isSharing, setIsSharing] = useState(false);
  const [sharedByUser, setSharedByUser] = useState<string | null>(null);
  const [sharedByUserName, setSharedByUserName] = useState<string | null>(null);
  const [viewerCount, setViewerCount] = useState(0);

  // 获取房间成员数量来估算观看人数
  const estimateViewers = useCallback(() => {
    // 这里应该从房间信息中获取，暂时用模拟数据
    return isSharing ? Math.max(0, Math.floor(Math.random() * 5) + 1) : 0;
  }, [isSharing]);

  // 更新观看人数
  useEffect(() => {
    if (isSharing) {
      const interval = setInterval(() => {
        setViewerCount(estimateViewers());
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setViewerCount(0);
    }
  }, [isSharing, estimateViewers]);

  // 代码变更处理
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  // 语言变更处理
  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    editorRef.current?.setLanguage(newLanguage);
  }, []);

  // 开始分享
  const handleStartSharing = useCallback((lang: string) => {
    if (!wsService || !currentUser?.id) {
      message.error('请先连接到聊天室');
      return;
    }

    try {
      // GitHub风格差异分享
      editorRef.current?.startSharing?.(lang);
      message.success('🎨 开始代码分享 - 您的修改将实时显示给其他用户');
      
      setIsSharing(true);
      setSharedByUser(currentUser.id.toString());
      setSharedByUserName(currentUser.userName || currentUser.userAccount || '未知用户');
      
    } catch (error) {
      console.error('开始分享失败:', error);
      message.error('开始分享失败');
    }
  }, [wsService, currentUser]);

  // 停止分享
  const handleStopSharing = useCallback(() => {
    if (!wsService) {
      message.error('连接异常');
      return;
    }

    try {
      // GitHub风格差异分享停止
      editorRef.current?.stopSharing?.();
      message.info('🎨 已停止代码分享');
      
      setIsSharing(false);
      setSharedByUser(null);
      setSharedByUserName(null);
      setViewerCount(0);
      
    } catch (error) {
      console.error('停止分享失败:', error);
      message.error('停止分享失败');
    }
  }, [wsService]);

  // WebSocket 消息处理
  useEffect(() => {
    if (wsService) {
      wsService.updateCallbacks({
        onCodeShareStart: (userId, lang, initialCode) => {
          if (userId !== currentUser?.id?.toString()) {
            setIsSharing(false); // 其他人开始分享，自己停止分享
            setSharedByUser(userId);
            // 这里应该从在线用户列表获取用户名
            setSharedByUserName(`用户${userId}`);
            
            if (lang) {
              setLanguage(lang);
              editorRef.current?.setLanguage(lang);
            }
            if (initialCode) {
              setCode(initialCode);
              editorRef.current?.setValue(initialCode);
            }
          }
        },
        onCodeShareEnd: (userId) => {
          if (userId === sharedByUser) {
            setSharedByUser(null);
            setSharedByUserName(null);
            setViewerCount(0);
          }
        },
        onCodeSync: (newCode, newLang) => {
          setCode(newCode);
          editorRef.current?.setValue(newCode);
          
          if (newLang && newLang !== language) {
            setLanguage(newLang);
            editorRef.current?.setLanguage(newLang);
          }
        }
      });
    }
  }, [wsService, currentUser?.id, sharedByUser, language]);

  // 判断当前用户是否可以编辑
  const canEdit = !sharedByUser || sharedByUser === currentUser?.id?.toString();

  if (!visible) {
    return null;
  }

  return (
    <div>
      <Card 
        className="room-code-collaboration"
        bodyStyle={{ padding: 0 }}
        title={
          <div className="collaboration-header">
            <CodeOutlined style={{ color: '#667eea', marginRight: 8 }} />
            <Text strong>代码协作区</Text>
            {isSharing && (
              <div className="sharing-indicator">
                <span className="sharing-dot"></span>
                <Text type="secondary" style={{ fontSize: 12, marginLeft: 6 }}>
                  分享中
                </Text>
              </div>
            )}
          </div>
        }
      >
        <CodeShareControls
          currentUserId={currentUser?.id?.toString()}
          roomLeaderId={roomLeaderId}
          language={language}
          isSharing={isSharing}
          sharedByUser={sharedByUser || undefined}
          sharedByUserName={sharedByUserName || undefined}
          onLanguageChange={handleLanguageChange}
          onStartSharing={handleStartSharing}
          onStopSharing={handleStopSharing}
          canEdit={canEdit}
          viewerCount={viewerCount}
        />
        
        <Divider style={{ margin: 0 }} />
        
        <div className="code-editor-wrapper">
          <CodeDiffEditor
            ref={editorRef}
            value={code}
            language={language}
            theme="vs-dark"
            height={450}
            readOnly={!canEdit}
            wsService={wsService}
            currentUserId={currentUser?.id?.toString()}
            currentUserName={currentUser?.userName || currentUser?.userAccount}
            isSharing={isSharing}
            onValueChange={handleCodeChange}
            onSharingChange={setIsSharing}
          />
        </div>
      </Card>
    </div>
  );
};

export default RoomCodeCollaboration;
