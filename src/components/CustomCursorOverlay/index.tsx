import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Avatar, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { editor } from 'monaco-editor';
import { CursorInfo } from '../../services/websocket';
import './index.css';

interface RemoteUserCursor {
  userId: string;
  userName: string;
  userAvatar?: string;
  position: CursorInfo;
  color: string;
  lastUpdate: number;
}

interface CustomCursorOverlayProps {
  editor: editor.IStandaloneCodeEditor | null;
  remoteCursors: Map<string, RemoteUserCursor>;
  visible?: boolean;
  containerHeight?: number;
  containerWidth?: number;
}

const CustomCursorOverlay: React.FC<CustomCursorOverlayProps> = ({
  editor,
  remoteCursors,
  visible = true,
  containerHeight = 400,
  containerWidth = 800
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [cursorElements, setCursorElements] = useState<JSX.Element[]>([]);
  const [lineHeight, setLineHeight] = useState(20);
  const [charWidth, setCharWidth] = useState(7.2); // Monaco默认字符宽度

  // 计算字符和行高
  const calculateMetrics = useCallback(() => {
    if (!editor) return;

    try {
      const config = editor.getOptions();
      const fontSize = config.get(editor.EditorOption.fontSize) || 14;
      
      // 估算行高和字符宽度
      const estimatedLineHeight = Math.round(fontSize * 1.4); // 通常是字体大小的1.4倍
      const estimatedCharWidth = fontSize * 0.6; // 等宽字体的字符宽度约为字体大小的0.6倍
      
      setLineHeight(estimatedLineHeight);
      setCharWidth(estimatedCharWidth);
      
      console.log('📏 计算编辑器度量:', {
        fontSize,
        lineHeight: estimatedLineHeight,
        charWidth: estimatedCharWidth
      });
      
    } catch (error) {
      console.error('计算编辑器度量失败:', error);
      // 使用默认值
      setLineHeight(20);
      setCharWidth(7.2);
    }
  }, [editor]);

  // 将编辑器坐标转换为屏幕坐标
  const convertToScreenPosition = useCallback((position: CursorInfo) => {
    if (!editor) return { x: 0, y: 0 };

    try {
      // 获取编辑器的滚动位置
      const scrollTop = editor.getScrollTop();
      const scrollLeft = editor.getScrollLeft();
      
      // 计算基础位置
      const baseX = (position.column - 1) * charWidth - scrollLeft + 60; // 60px是行号区域宽度
      const baseY = (position.lineNumber - 1) * lineHeight - scrollTop + 2; // 2px是顶部偏移
      
      // 确保位置在可视区域内
      const x = Math.max(60, Math.min(baseX, containerWidth - 100));
      const y = Math.max(2, Math.min(baseY, containerHeight - 30));
      
      console.log('🎯 坐标转换:', {
        editorPos: position,
        screenPos: { x, y },
        scrollTop,
        scrollLeft,
        lineHeight,
        charWidth
      });
      
      return { x, y };
    } catch (error) {
      console.error('坐标转换失败:', error);
      return { x: 100, y: 50 }; // 默认位置
    }
  }, [editor, lineHeight, charWidth, containerWidth, containerHeight]);

  // 创建光标元素
  const createCursorElement = useCallback((cursor: RemoteUserCursor, index: number) => {
    const screenPos = convertToScreenPosition(cursor.position);
    const isRecent = Date.now() - cursor.lastUpdate < 5000; // 5秒内的光标认为是活跃的
    
    return (
      <div
        key={cursor.userId}
        className={`custom-cursor ${isRecent ? 'active' : 'inactive'}`}
        style={{
          left: screenPos.x,
          top: screenPos.y,
          zIndex: 1000 + index,
          '--cursor-color': cursor.color
        } as React.CSSProperties}
      >
        {/* 光标线 */}
        <div className="cursor-line" />
        
        {/* 用户信息标签 */}
        <div className="cursor-label">
          <div className="cursor-user-info">
            <Avatar
              src={cursor.userAvatar}
              icon={<UserOutlined />}
              size={16}
              style={{ 
                border: `2px solid ${cursor.color}`,
                backgroundColor: cursor.color
              }}
            />
            <span className="cursor-user-name">
              {cursor.userName}
            </span>
          </div>
          <div className="cursor-position">
            {cursor.position.lineNumber}:{cursor.position.column}
          </div>
        </div>
        
        {/* 脉冲效果 */}
        <div className="cursor-pulse" />
      </div>
    );
  }, [convertToScreenPosition]);

  // 更新光标元素
  useEffect(() => {
    if (!visible || remoteCursors.size === 0) {
      setCursorElements([]);
      return;
    }

    const elements = Array.from(remoteCursors.values()).map((cursor, index) => 
      createCursorElement(cursor, index)
    );
    
    setCursorElements(elements);
    console.log('🔄 更新自定义光标显示:', elements.length);
    
  }, [remoteCursors, visible, createCursorElement]);

  // 监听编辑器变化
  useEffect(() => {
    calculateMetrics();
    
    if (editor) {
      // 监听滚动事件，更新光标位置
      const scrollDisposable = editor.onDidScrollChange(() => {
        // 重新计算所有光标位置
        const elements = Array.from(remoteCursors.values()).map((cursor, index) => 
          createCursorElement(cursor, index)
        );
        setCursorElements(elements);
      });

      return () => {
        scrollDisposable?.dispose();
      };
    }
  }, [editor, calculateMetrics, remoteCursors, createCursorElement]);

  if (!visible) {
    return null;
  }

  return (
    <div 
      ref={overlayRef}
      className="custom-cursor-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'hidden'
      }}
    >
      {cursorElements}
      
      {/* 调试信息 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="cursor-debug-info">
          <div>光标数量: {remoteCursors.size}</div>
          <div>行高: {lineHeight}px</div>
          <div>字符宽: {charWidth}px</div>
        </div>
      )}
    </div>
  );
};

export default CustomCursorOverlay;
