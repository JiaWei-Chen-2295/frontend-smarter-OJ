import React, { useRef, forwardRef, useImperativeHandle, useEffect, useState, useCallback } from 'react';
import { message, Button } from 'antd';
import Editor, { useMonaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { 
  WebSocketChatService, 
  CodeLineChange, 
  CodeDiffInfo 
} from '../../services/websocket';
import './index.css';

export interface CodeDiffEditorRef {
  getValue: () => string | undefined;
  setValue: (value: string) => void;
  setLanguage: (language: string) => void;
  getEditor: () => editor.IStandaloneCodeEditor | null;
  startSharing: (language?: string) => void;
  stopSharing: () => void;
}

interface DiffDecoration {
  id: string;
  lineNumber: number;
  changeType: 'added' | 'modified' | 'deleted';
  decorationIds: string[];
  timestamp: number;
  timeoutId: number;
}

interface CodeDiffEditorProps {
  value?: string;
  language?: string;
  theme?: string;
  height?: string | number;
  readOnly?: boolean;
  wsService?: WebSocketChatService;
  currentUserId?: string;
  currentUserName?: string;
  onValueChange?: (value: string) => void;
  isSharing?: boolean;
  onSharingChange?: (sharing: boolean) => void;
}

const CodeDiffEditor = forwardRef<CodeDiffEditorRef, CodeDiffEditorProps>(({
  value = '',
  language = 'javascript',
  theme = 'vs-dark',
  height = 400,
  readOnly = false,
  wsService,
  currentUserId,
  currentUserName,
  onValueChange,
  isSharing = false,
  onSharingChange
}, ref) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monaco = useMonaco();
  
  // 代码差异状态
  const [editorValue, setEditorValue] = useState(value);
  const [editorLanguage, setEditorLanguage] = useState(language);
  const [diffDecorations, setDiffDecorations] = useState<Map<string, DiffDecoration>>(new Map());
  const [lastCode, setLastCode] = useState(value); // 用于检测变更
  const [activeDiffLines, setActiveDiffLines] = useState<Map<number, {
    change: CodeLineChange;
    userName: string;
  }>>(new Map()); // 当前活跃的diff行
  
  const isApplyingRemoteChange = useRef(false);
  const changeDetectionTimeout = useRef<number | null>(null);

  // 检测代码行变更 - 增强版
  const detectLineChanges = useCallback((oldCode: string, newCode: string): CodeLineChange[] => {
    if (oldCode === newCode) {
      console.log('🔍 代码内容相同，无变更');
      return [];
    }

    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    const changes: CodeLineChange[] = [];
    const timestamp = Date.now();

    console.log('🔍 开始详细变更检测:', {
      oldLinesCount: oldLines.length,
      newLinesCount: newLines.length,
      oldCodeLength: oldCode.length,
      newCodeLength: newCode.length
    });

    const maxLines = Math.max(oldLines.length, newLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];
      
      // 处理undefined为空字符串
      const oldContent = oldLine !== undefined ? oldLine : '';
      const newContent = newLine !== undefined ? newLine : '';
      
      if (oldContent !== newContent) {
        let changeType: 'added' | 'modified' | 'deleted';
        
        if (oldContent === '' && newContent !== '') {
          changeType = 'added';
          console.log(`➕ 第${i + 1}行新增: "${newContent}"`);
        } else if (oldContent !== '' && newContent === '') {
          changeType = 'deleted';
          console.log(`❌ 第${i + 1}行删除: "${oldContent}"`);
        } else {
          changeType = 'modified';
          console.log(`📝 第${i + 1}行修改: "${oldContent}" → "${newContent}"`);
        }

        changes.push({
          lineNumber: i + 1,
          changeType,
          oldContent,
          newContent,
          timestamp
        });
      }
    }

    console.log(`✅ 变更检测完成: ${changes.length} 行变更`, changes);
    return changes;
  }, []);

  // GitHub风格的内联差异显示
  const applyDiffDisplay = useCallback((userId: string, lineChanges: CodeLineChange[]) => {
    if (!editorRef.current || !monaco) return;

    console.log(`🎨 应用GitHub风格diff显示:`, {
      fromUserId: userId,
      currentUserId,
      isFromSelf: userId === currentUserId,
      changesCount: lineChanges.length,
      isSharing,
      willApply: userId !== currentUserId || !isSharing // 非分享者或者观看模式都显示
    });

    // 在生产模式下，分享者不显示自己的diff
    // 在开发模式下，显示所有diff便于调试
    const isDebugMode = process.env.NODE_ENV === 'development';
    
    if (userId === currentUserId && isSharing && !isDebugMode) {
      console.log('⚠️ 生产模式：跳过分享者自己的diff显示');
      return;
    }
    
    if (userId === currentUserId && isDebugMode) {
      console.log('🧪 调试模式：显示分享者自己的diff用于测试');
    }

    const userName = currentUserName || `用户${userId.slice(-4)}`;

    lineChanges.forEach(change => {
      const diffId = `diff_${userId}_${change.lineNumber}_${change.timestamp}`;
      
      // 更新活跃diff行状态
      setActiveDiffLines(prev => {
        const newLines = new Map(prev);
        newLines.set(change.lineNumber, { change, userName });
        
        // 5秒后清除
        setTimeout(() => {
          setActiveDiffLines(current => {
            const updated = new Map(current);
            updated.delete(change.lineNumber);
            return updated;
          });
        }, 5000);
        
        return newLines;
      });

      // 清除该行的旧装饰
      setDiffDecorations(prev => {
        const newDiffs = new Map(prev);
        const oldDiffsToRemove = Array.from(prev.values()).filter(
          diff => diff.lineNumber === change.lineNumber
        );
        
        oldDiffsToRemove.forEach(oldDiff => {
          if (oldDiff.decorationIds.length > 0) {
            editorRef.current?.deltaDecorations(oldDiff.decorationIds, []);
          }
          clearTimeout(oldDiff.timeoutId);
          newDiffs.delete(oldDiff.id);
        });

        return newDiffs;
      });

      // 创建GitHub风格的内联差异装饰
      try {
        let decorationIds: string[] = [];

        if (change.changeType === 'modified' && change.oldContent && change.newContent) {
          // 修改行：显示删除行 + 新增行
          decorationIds = editorRef.current?.deltaDecorations([], [
            // 在目标行上方显示删除的内容（红色）
            {
              range: new monaco.Range(change.lineNumber, 1, change.lineNumber, 1),
              options: {
                beforeContentClassName: 'github-diff-deleted-line',
                before: {
                  content: `- ${change.oldContent}`,
                  inlineClassName: 'github-diff-deleted-content',
                  inlineClassNameAffectsLetterSpacing: false
                }
              }
            },
            // 在目标行显示新增的内容（绿色）
            {
              range: new monaco.Range(change.lineNumber, 1, change.lineNumber, 1),
              options: {
                isWholeLine: true,
                className: 'github-diff-added-line',
                marginClassName: 'github-diff-margin-added',
                hoverMessage: {
                  value: `🔄 ${userName} 修改了这行\n\n- ${change.oldContent}\n+ ${change.newContent}\n\n${new Date(change.timestamp).toLocaleString()}`
                }
              }
            }
          ]) || [];
          
        } else if (change.changeType === 'added') {
          // 新增行：显示绿色新增行
          decorationIds = editorRef.current?.deltaDecorations([], [
            {
              range: new monaco.Range(change.lineNumber, 1, change.lineNumber, 1),
              options: {
                isWholeLine: true,
                className: 'github-diff-added-line',
                marginClassName: 'github-diff-margin-added',
                hoverMessage: {
                  value: `✨ ${userName} 新增了这行\n\n+ ${change.newContent}\n\n${new Date(change.timestamp).toLocaleString()}`
                }
              }
            }
          ]) || [];
          
        } else if (change.changeType === 'deleted') {
          // 删除行：在该位置显示红色删除行
          decorationIds = editorRef.current?.deltaDecorations([], [
            {
              range: new monaco.Range(change.lineNumber, 1, change.lineNumber, 1),
              options: {
                beforeContentClassName: 'github-diff-deleted-line',
                before: {
                  content: `- ${change.oldContent}`,
                  inlineClassName: 'github-diff-deleted-content',
                  inlineClassNameAffectsLetterSpacing: false
                },
                hoverMessage: {
                  value: `❌ ${userName} 删除了这行\n\n- ${change.oldContent}\n\n${new Date(change.timestamp).toLocaleString()}`
                }
              }
            }
          ]) || [];
        }

        // 5秒后自动清除装饰
        const timeoutId = window.setTimeout(() => {
          console.log(`⏰ 清除第${change.lineNumber}行的GitHub风格diff`);
          
          setDiffDecorations(prev => {
            const newDiffs = new Map(prev);
            const diffToRemove = newDiffs.get(diffId);
            
            if (diffToRemove && diffToRemove.decorationIds.length > 0) {
              editorRef.current?.deltaDecorations(diffToRemove.decorationIds, []);
            }
            
            newDiffs.delete(diffId);
            return newDiffs;
          });
        }, 5000);

        // 保存装饰信息
        const diffDecoration: DiffDecoration = {
          id: diffId,
          lineNumber: change.lineNumber,
          changeType: change.changeType,
          decorationIds,
          timestamp: change.timestamp,
          timeoutId
        };

        setDiffDecorations(prev => {
          const newDiffs = new Map(prev);
          newDiffs.set(diffId, diffDecoration);
          return newDiffs;
        });

        console.log(`✨ 第${change.lineNumber}行GitHub风格diff已应用:`, {
          type: change.changeType,
          decorationCount: decorationIds.length,
          oldContent: change.oldContent?.substring(0, 30),
          newContent: change.newContent.substring(0, 30)
        });

      } catch (error) {
        console.error(`❌ 创建第${change.lineNumber}行GitHub diff失败:`, error);
      }
    });
  }, [monaco, currentUserId, currentUserName]);

  // 编辑器变更处理
  const handleEditorChange = useCallback((newValue: string | undefined) => {
    if (isApplyingRemoteChange.current || !newValue) return;

    console.log('🔄 编辑器内容变更:', { 
      newLength: newValue.length, 
      oldLength: lastCode.length,
      isSharing,
      hasWsService: !!wsService
    });

    // 清除之前的变更检测定时器
    if (changeDetectionTimeout.current) {
      clearTimeout(changeDetectionTimeout.current);
    }

    // 立即更新本地状态
    setEditorValue(newValue);
    onValueChange?.(newValue);

    // 使用防抖进行变更检测和同步
    changeDetectionTimeout.current = window.setTimeout(() => {
      if (isSharing && wsService && newValue !== lastCode) {
        console.log('🔍 分析代码变更...');
        
        const lineChanges = detectLineChanges(lastCode, newValue);
        
        if (lineChanges.length > 0) {
          console.log(`📡 检测到 ${lineChanges.length} 行变更，发送详细信息:`, lineChanges);
          
          // 发送行级变更（用于diff显示）
          wsService.sendCodeLineChange(lineChanges);
          
          // 同时发送完整代码同步（用于内容同步）
          wsService.sendCodeSync(newValue, editorLanguage);
        } else {
          console.log('📡 无行级变更，仅发送代码同步');
          // 仅发送代码同步
          wsService.sendCodeSync(newValue, editorLanguage);
        }
        
        setLastCode(newValue);
      } else {
        console.log('跳过变更检测:', {
          isSharing,
          hasWsService: !!wsService,
          isSameContent: newValue === lastCode
        });
      }
    }, 200); // 缩短防抖时间提高响应性

  }, [isSharing, wsService, lastCode, detectLineChanges, onValueChange, editorLanguage]);

  // 编辑器挂载处理
  const handleEditorMount = useCallback((editor: editor.IStandaloneCodeEditor, monacoInstance: any) => {
    console.log('🎯 CodeDiff编辑器挂载成功');
    editorRef.current = editor;

    // 设置编辑器选项
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 20,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true, // 重要：自动适应容器大小
      wordWrap: 'on',
      glyphMargin: true, // 确保有边距显示差异标识
      folding: false,
      lineNumbers: 'on',
      renderLineHighlight: 'none', // 避免与差异高亮冲突
      // 确保编辑器布局正确
      dimension: undefined, // 让编辑器自动计算尺寸
      contextmenu: true,
      smoothScrolling: true
    });

    // 强制重新布局
    setTimeout(() => {
      editor.layout();
      console.log('🔧 强制编辑器重新布局');
    }, 100);

    editor.focus();
  }, []);

  // 设置WebSocket回调
  useEffect(() => {
    if (wsService) {
      wsService.updateCallbacks({
        onCodeLineChange: (userId, lineChanges) => {
          console.log(`🎨 [观看者] 收到用户 ${userId} 的行变更:`, lineChanges);
          
          // 先显示diff效果
          applyDiffDisplay(userId, lineChanges);
        },
        onCodeSync: (code, lang) => {
          if (code !== editorValue) {
            console.log('📥 [观看者] 收到代码同步，延迟应用以保持diff显示');
            
            // 延迟应用代码同步，让diff显示有足够时间展示
            setTimeout(() => {
              isApplyingRemoteChange.current = true;
              
              console.log('📝 应用延迟的代码同步');
              setEditorValue(code);
              setLastCode(code);
              onValueChange?.(code);
              
              if (editorRef.current) {
                const currentPosition = editorRef.current.getPosition();
                editorRef.current.setValue(code);
                
                // 尝试恢复光标位置
                if (currentPosition) {
                  setTimeout(() => {
                    editorRef.current?.setPosition(currentPosition);
                  }, 50);
                }
              }
              
              setTimeout(() => {
                isApplyingRemoteChange.current = false;
              }, 150);
              
            }, 100); // 100ms延迟，让diff动画先显示
          }
        }
      });
    }
  }, [wsService, applyDiffDisplay, editorValue, onValueChange]);

  // 暴露方法
  useImperativeHandle(ref, () => ({
    getValue: () => editorRef.current?.getValue(),
    setValue: (newValue: string) => {
      if (editorRef.current) {
        editorRef.current.setValue(newValue);
        setEditorValue(newValue);
        setLastCode(newValue);
      }
    },
    setLanguage: (newLanguage: string) => {
      if (editorRef.current?.getModel()) {
        const model = editorRef.current.getModel()!;
        monaco?.editor.setModelLanguage(model, newLanguage);
        setEditorLanguage(newLanguage);
      }
    },
    getEditor: () => editorRef.current,
    startSharing: (lang?: string) => {
      if (wsService && currentUserId) {
        const currentCode = editorRef.current?.getValue() || '';
        
        console.log('🚀 开始GitHub风格代码分享:', {
          userId: currentUserId,
          codeLength: currentCode.length,
          language: lang || editorLanguage
        });
        
        wsService.sendCodeShareStart(lang || editorLanguage, currentCode);
        setLastCode(currentCode); // 设置基准代码用于变更检测
        onSharingChange?.(true);
        message.success('🎯 开始GitHub风格代码差异分享');
        
        console.log('✅ 分享状态已启用，代码变更检测已激活');
      } else {
        console.error('❌ 无法开始分享:', {
          hasWsService: !!wsService,
          hasCurrentUserId: !!currentUserId
        });
      }
    },
    stopSharing: () => {
      if (wsService && currentUserId) {
        wsService.sendCodeShareEnd();
        onSharingChange?.(false);
        
        // 清除所有差异装饰
        setDiffDecorations(prev => {
          prev.forEach(diff => {
            if (diff.decorationIds.length > 0) {
              editorRef.current?.deltaDecorations(diff.decorationIds, []);
            }
            clearTimeout(diff.timeoutId);
          });
          return new Map();
        });
        
        message.info('停止代码差异分享');
      }
    }
  }), [wsService, currentUserId, editorLanguage, onSharingChange, monaco]);

  return (
    <div className="code-diff-editor">
      {/* GitHub风格的差异状态栏 */}
      {activeDiffLines.size > 0 && (
        <div className="github-diff-status-bar">
          <div className="diff-summary">
            <span className="diff-indicator">
              📊 正在显示 {activeDiffLines.size} 行变更
            </span>
            {Array.from(activeDiffLines.entries()).map(([lineNumber, { change, userName }]) => (
              <span key={`${lineNumber}-${change.timestamp}`} className={`github-diff-badge diff-${change.changeType}`}>
                {change.changeType === 'added' && '+ '}
                {change.changeType === 'deleted' && '- '}
                {change.changeType === 'modified' && '~ '}
                第{lineNumber}行
                {change.changeType === 'modified' && (
                  <span className="diff-preview"> ({change.oldContent?.substring(0, 8)}...→{change.newContent.substring(0, 8)}...)</span>
                )}
                {change.changeType === 'added' && (
                  <span className="diff-preview"> ({change.newContent.substring(0, 12)}...)</span>
                )}
                {change.changeType === 'deleted' && (
                  <span className="diff-preview"> ({change.oldContent?.substring(0, 12)}...)</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="diff-editor-container">
        <Editor
          height={height}
          width="100%"
          defaultLanguage={editorLanguage}
          value={editorValue}
          language={editorLanguage}
          theme={theme}
          options={{
            readOnly: readOnly || (!isSharing),
            fontSize: 14,
            lineHeight: 20,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true, // 自动适应容器大小变化
            wordWrap: 'on',
            glyphMargin: true,
            folding: false,
            lineNumbers: 'on',
            renderLineHighlight: 'none',
            // 差异相关配置
            renderIndentGuides: true,
            renderWhitespace: 'boundary',
            // 确保编辑器完整显示
            overviewRulerLanes: 0, // 隐藏概览标尺节省空间
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false
          }}
          onMount={handleEditorMount}
          onChange={handleEditorChange}
        />
        
        {/* 调试信息 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="diff-debug-info">
            差异装饰: {diffDecorations.size} 个 | 
            分享状态: {isSharing ? '分享中' : '观看中'} |
            代码长度: {editorValue.length}
          </div>
        )}
      </div>
      
    </div>
  );
});

CodeDiffEditor.displayName = 'CodeDiffEditor';

export default CodeDiffEditor;
