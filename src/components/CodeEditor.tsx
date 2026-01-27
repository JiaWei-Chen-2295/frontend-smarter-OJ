import { useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import Editor, { useMonaco, EditorProps } from '@monaco-editor/react';
import type { editor, IDisposable } from 'monaco-editor';
import './CodeEditor.css';

export interface CodeEditorRef {
    getValue: () => string | undefined;
    setValue: (value: string) => void;
    setLanguage: (language: string) => void;
    formatCode: () => void;
    setFontSize: (size: number) => void;
    addAiSuggestion: (lineNumber: number, suggestion: string) => string[];
    removeAiSuggestion: (decorationIds: string[]) => void;
    getEditor: () => editor.IStandaloneCodeEditor | null;
}

interface AiSuggestion {
    lineNumber: number;
    suggestion: string;
    decorationIds: string[];
    wasEmpty: boolean;
    widgetId?: string;
}

// 内容小部件类，用于确保AI建议总是可见
class AiSuggestionWidget implements editor.IContentWidget {
    private readonly domNode: HTMLElement;
    private position: editor.IContentWidgetPosition | null = null;
    private readonly id: string;
    private keyDownHandler: ((e: KeyboardEvent) => void) | null = null;
    private disposed: boolean = false;
    
    constructor(
        private readonly lineNumber: number,
        private readonly suggestion: string,
        private readonly editor: editor.ICodeEditor,
        private readonly onAccept: () => void
    ) {
        this.id = `ai-suggestion-widget-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        
        // 创建DOM节点
        this.domNode = document.createElement('div');
        this.domNode.className = 'ai-suggestion-widget';
        
        // 添加灯泡图标
        const iconElem = document.createElement('span');
        iconElem.innerHTML = '💡';
        iconElem.className = 'ai-suggestion-icon';
        this.domNode.appendChild(iconElem);
        
        // 添加提示内容
        const contentElem = document.createElement('span');
        contentElem.textContent = suggestion;
        contentElem.className = 'ai-suggestion-content';
        this.domNode.appendChild(contentElem);
        
        // 添加插入提示
        const hintElem = document.createElement('span');
        hintElem.textContent = '[点击或按Tab键插入]';
        hintElem.className = 'ai-suggestion-hint';
        this.domNode.appendChild(hintElem);
        
        // 添加点击事件
        const handleClick = (event: MouseEvent) => {
            console.log('AI建议小部件被点击，准备插入建议');
            event.preventDefault();
            event.stopPropagation();
            if (!this.disposed) {
                this.onAccept();
            }
        };
        this.domNode.addEventListener('click', handleClick);
        
        // 添加Tab键事件监听 - 使用非常高的优先级捕获Tab键
        this.keyDownHandler = (e: KeyboardEvent) => {
            // 添加安全检查：确保widget未被销毁
            if (e.key === 'Tab' && !this.disposed) {
                const editorDomNode = this.editor.getDomNode();
                // 确保编辑器有焦点
                if (editorDomNode && 
                    (document.activeElement === editorDomNode || 
                     editorDomNode.contains(document.activeElement))) {
                    
                    console.log('AiSuggestionWidget: Tab键被按下，阻止默认行为');
                    // 标记这个事件已被处理，防止重复处理
                    const keyEvent = e as KeyboardEvent & { __handledByAiWidget?: boolean };
                    if (keyEvent.__handledByAiWidget) {
                        return;
                    }
                    keyEvent.__handledByAiWidget = true;
                    
                    // 阻止默认行为，但仅在处理建议时
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 直接调用回调，不使用setTimeout避免可能的竞态条件
                    if (!this.disposed) {
                        console.log('AiSuggestionWidget: 执行接受建议操作');
                        this.onAccept();
                        
                        // 在建议被接受后，延迟一小段时间移除事件处理器
                        // 这确保后续的Tab键可以正常工作，而不会被这个事件处理器捕获
                        setTimeout(() => {
                            if (this.keyDownHandler) {
                                console.log('AiSuggestionWidget: 移除Tab键事件处理器');
                                document.removeEventListener('keydown', this.keyDownHandler, true);
                                this.keyDownHandler = null;
                            }
                        }, 50);
                    }
                }
            }
        };
        
        // 注册全局键盘事件 - 使用捕获阶段和高优先级
        document.addEventListener('keydown', this.keyDownHandler, true);
        
        // 更新位置
        this.updatePosition();
    }
    
    // 清理资源
    dispose(): void {
        if (!this.disposed) {
            console.log('AiSuggestionWidget: 清理资源');
            this.disposed = true;
            
            if (this.keyDownHandler) {
                document.removeEventListener('keydown', this.keyDownHandler, true);
                this.keyDownHandler = null;
                
                // 确保清除全局事件标记
                interface KeyEventInfo {
                    __handledByAiWidget?: boolean;
                }
                const windowWithEvents = window as Window & KeyEventInfo;
                windowWithEvents.__handledByAiWidget = false;
            }
            
            // 移除所有事件监听器
            const clone = this.domNode.cloneNode(true);
            if (this.domNode.parentNode) {
                this.domNode.parentNode.replaceChild(clone, this.domNode);
            }
        }
    }
    
    getId(): string {
        return this.id;
    }
    
    getDomNode(): HTMLElement {
        return this.domNode;
    }
    
    getPosition(): editor.IContentWidgetPosition | null {
        return this.position;
    }
    
    updatePosition(): void {
        const model = this.editor.getModel();
        if (model) {
            const lineContent = model.getLineContent(this.lineNumber);
            this.position = {
                position: {
                    lineNumber: this.lineNumber,
                    column: lineContent.length + 1
                },
                preference: [
                    1 // EXACT = 1
                ]
            };
        }
    }
}

export interface CodeEditorProps extends Omit<EditorProps, 'onMount'> {
    language?: string;
    defaultValue?: string;
    onChange?: (value: string | undefined) => void;
    fontSize?: number;
}

export const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>((props, ref) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const { language = 'java', defaultValue = '', onChange, fontSize = 14, ...restProps } = props;
    const monacoRef = useRef<typeof import('monaco-editor')>();
    // 存储当前的AI建议
    const currentSuggestionRef = useRef<AiSuggestion | null>(null);
    const [currentWidget, setCurrentWidget] = useState<AiSuggestionWidget | null>(null);
    
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.updateOptions({ fontSize });
        }
    }, [fontSize]);

    useEffect(() => {
        if (editorRef.current && typeof defaultValue === 'string') {
            const currentValue = editorRef.current.getValue();
            if (currentValue !== defaultValue) {
                editorRef.current.setValue(defaultValue);
            }
        }
    }, [defaultValue]);

    // 清理小部件 - 更直接的方式
    const cleanupWidget = () => {
        if (currentWidget && editorRef.current) {
            try {
                console.log('清理小部件 - 开始执行');
                
                // 首先调用dispose方法清理事件监听器
                currentWidget.dispose();
                
                // 直接从编辑器移除内容小部件
                editorRef.current.removeContentWidget(currentWidget);
                
                // 获取DOM元素并直接处理
                const domNode = currentWidget.getDomNode();
                if (domNode && document.body.contains(domNode)) {
                    // 如果DOM节点仍在文档中，尝试直接移除
                    domNode.parentNode?.removeChild(domNode);
                }
                
                // 立即更新状态
                setCurrentWidget(null);
                console.log('清理小部件 - 完成');
            } catch (error) {
                console.error('清理小部件时出错:', error);
                // 确保状态被更新
                setCurrentWidget(null);
            }
        } else {
            console.log('没有活跃的小部件需要清理');
        }
    };

    // 自动清理函数
    const autoCleanupAfterInsert = (timeout = 300) => {
        setTimeout(() => {
            if (currentSuggestionRef.current) {
                console.log('自动清理未使用的建议');
                const { decorationIds } = currentSuggestionRef.current;
                if (decorationIds.length > 0 && editorRef.current) {
                    editorRef.current.deltaDecorations(decorationIds, []);
                }
                cleanupWidget();
                currentSuggestionRef.current = null;
            }
        }, timeout);
    };
    
    // 组件卸载时清理所有资源
    useEffect(() => {
        return () => {
            if (currentSuggestionRef.current?.decorationIds.length && editorRef.current) {
                editorRef.current.deltaDecorations(currentSuggestionRef.current.decorationIds, []);
            }
            // 确保清理小部件上的事件监听器
            if (currentWidget) {
                currentWidget.dispose();
                if (editorRef.current) {
                    editorRef.current.removeContentWidget(currentWidget);
                }
                setCurrentWidget(null);
            } else {
                cleanupWidget();
            }
            currentSuggestionRef.current = null;
        };
    }, []);

    // 全局键盘事件监听
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            console.log('全局键盘事件:', e.key, 'KeyCode:', e.keyCode, 'Code:', e.code);
            
            // 如果按下Tab键并且有活跃的AI建议
            if (e.key === 'Tab' && currentSuggestionRef.current) {
                // 如果已经被widget的事件处理器处理过，就不再处理
                const keyEvent = e as KeyboardEvent & { __handledByAiWidget?: boolean };
                if (keyEvent.__handledByAiWidget) {
                    console.log('Tab键已被Widget处理，全局处理器跳过');
                    return;
                }
                
                // 获取当前编辑器的DOM节点
                const editorDomNode = editorRef.current?.getDomNode();
                
                // 检查编辑器是否有焦点
                const isEditorFocused = editorDomNode && 
                    (editorDomNode === document.activeElement || editorDomNode.contains(document.activeElement));
                
                if (isEditorFocused) {
                    console.log('编辑器有焦点，Tab键被按下，准备插入AI建议');
                    
                    // 标记事件已处理
                    keyEvent.__handledByAiWidget = true;
                    
                    // 阻止默认的Tab键行为
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 插入建议并清理
                    const { lineNumber, suggestion } = currentSuggestionRef.current;
                    insertSuggestionAndCleanup(lineNumber, suggestion);
                    
                    // 完全清除当前建议
                    currentSuggestionRef.current = null;
                }
            }
        };
        
        // 使用事件捕获阶段（第三个参数为true）
        document.addEventListener('keydown', handleKeyDown, true);
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, []);
    
    useEffect(() => {
        if (editorRef.current && monacoRef.current) {
            const disposable = editorRef.current.onKeyDown((e) => {
                // 首先打印所有键盘事件的键码
                console.log("Monaco键盘事件 KeyCode:", e.keyCode, "按键:", e.browserEvent.key, "浏览器KeyCode:", e.browserEvent.keyCode);
                
                // 尝试多种方式检测Tab键
                const isTabKey = e.keyCode === 2 || e.browserEvent.key === 'Tab' || e.browserEvent.keyCode === 9;
                
                if (isTabKey && currentSuggestionRef.current) {
                    // 检查这个事件是否已经被处理过
                    const keyEvent = e.browserEvent as KeyboardEvent & { __handledByAiWidget?: boolean };
                    if (keyEvent.__handledByAiWidget) {
                        console.log('此Tab事件已被其他处理器处理，Monaco处理器跳过');
                        return;
                    }
                    
                    const { lineNumber, suggestion } = currentSuggestionRef.current;
                    console.log('Monaco Tab事件: 准备插入建议');
                    
                    // 标记事件已处理
                    keyEvent.__handledByAiWidget = true;
                    
                    // 使用统一的插入和清理函数
                    insertSuggestionAndCleanup(lineNumber, suggestion);
                    
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
            
            return () => {
                disposable.dispose();
            };
        }
    }, []);
    
    // 添加Tab键命令 - 简化这部分，因为我们已经在其他地方处理了Tab键
    useEffect(() => {
        if (editorRef.current && monacoRef.current) {
            // 添加一个自定义命令，在Tab键按下时触发
            // 保留这部分作为后备处理机制
            const disposableOrCommandId = editorRef.current.addCommand(
                monacoRef.current.KeyCode.Tab,
                () => {
                    console.log('Tab键命令触发');
                    // 只在有AI建议时处理Tab键，否则保持默认行为
                    if (currentSuggestionRef.current) {
                        // 检查事件是否已被处理
                        interface LastKeyEventInfo {
                            __lastTabKeyEvent?: number;
                            __handledByAiWidget?: boolean;
                        }
                        const windowWithEvents = window as Window & LastKeyEventInfo;
                        
                        // 如果已经被其他处理器处理过，跳过
                        if (windowWithEvents.__handledByAiWidget) {
                            console.log('Tab键已在其他处理器中处理，addCommand处理器跳过');
                            return false; // 未处理，让其他处理器有机会处理
                        }
                        
                        const lastKeyEvent = windowWithEvents.__lastTabKeyEvent;
                        const now = Date.now();
                        if (lastKeyEvent && now - lastKeyEvent < 50) {
                            console.log('Tab键已在其他处理器中处理，跳过');
                            return false; // 未处理，允许继续处理默认的Tab行为
                        }
                        
                        // 标记这个事件已处理
                        windowWithEvents.__handledByAiWidget = true;
                        windowWithEvents.__lastTabKeyEvent = now;
                        
                        const { lineNumber, suggestion } = currentSuggestionRef.current;
                        insertSuggestionAndCleanup(lineNumber, suggestion);
                        
                        // 清除当前建议，确保后续的Tab键可以正常工作
                        currentSuggestionRef.current = null;
                        
                        return true; // 表示命令已处理
                    }
                    
                    // 没有AI建议时，让Tab键保持默认的缩进行为
                    return false; // 未处理，允许继续处理默认的Tab行为
                },
                // 修改上下文条件，只在编辑器有焦点时触发
                'editorTextFocus'
            );
            
            // 创建自定义的清理函数，兼容两种情况
            return () => {
                // 如果返回的是 IDisposable 对象
                if (disposableOrCommandId && typeof disposableOrCommandId === 'object') {
                    const disposable = disposableOrCommandId as unknown as IDisposable;
                    disposable.dispose();
                }
                // 如果是字符串命令ID，目前无法直接清理，但monaco编辑器会在实例销毁时自动清理
            };
        }
        
        return () => {}; // 空的清理函数
    }, []);
    
    useImperativeHandle(ref, () => ({
        getValue: () => editorRef.current?.getValue(),
        setValue: (value: string) => {
            if (editorRef.current) {
                editorRef.current.setValue(value);
            }
        },
        setLanguage: (newLanguage: string) => {
            if (editorRef.current && monacoRef.current) {
                monacoRef.current.editor.setModelLanguage(editorRef.current.getModel()!, newLanguage);
            }
        },
        formatCode: () => {
            if (editorRef.current) {
                editorRef.current.getAction('editor.action.formatDocument')?.run();
            }
        },
        setFontSize: (size: number) => {
            if (editorRef.current) {
                editorRef.current.updateOptions({ fontSize: size });
            }
        },
        addAiSuggestion: (lineNumber: number, suggestion: string) => {
            if (editorRef.current && monacoRef.current) {
                const model = editorRef.current.getModel();
                if (model) {
                    console.log('添加AI建议 - 行号:', lineNumber, '建议内容:', suggestion);
                    
                    // 清除之前的建议
                    if (currentSuggestionRef.current) {
                        // 移除旧的装饰
                        editorRef.current.deltaDecorations(currentSuggestionRef.current.decorationIds, []);
                        // 移除旧的小部件
                        cleanupWidget();
                        currentSuggestionRef.current = null;
                    }
                    
                    // 添加高亮装饰
                    const decorationIds = editorRef.current.deltaDecorations([], [
                        {
                            range: new monacoRef.current.Range(lineNumber, 1, lineNumber, model.getLineMaxColumn(lineNumber)),
                            options: {
                                isWholeLine: true,
                                className: 'ai-suggestion-line',
                                glyphMarginClassName: 'codicon codicon-light-bulb'
                            }
                        }
                    ]);
                    
                    // 确保编辑器能看到这一行
                    editorRef.current.revealLineInCenter(lineNumber);
                    
                    // 检查当前行是否为空
                    const lineContent = model.getLineContent(lineNumber).trim();
                    const isEmpty = lineContent.length === 0;
                    
                    // 创建并添加内容小部件
                    const widget = new AiSuggestionWidget(
                        lineNumber,
                        suggestion,
                        editorRef.current,
                        () => {
                            // 接受建议的回调
                            insertSuggestionAndCleanup(lineNumber, suggestion);
                        }
                    );
                    
                    editorRef.current.addContentWidget(widget);
                    setCurrentWidget(widget);
                    
                    // 存储当前建议
                    currentSuggestionRef.current = {
                        lineNumber,
                        suggestion,
                        decorationIds,
                        wasEmpty: isEmpty,
                        widgetId: widget.getId()
                    };
                    
                    // 设置10秒后自动清理，如果用户没有操作
                    autoCleanupAfterInsert(10000);
                    
                    return decorationIds;
                }
            }
            return [];
        },
        removeAiSuggestion: (decorationIds: string[]) => {
            if (editorRef.current && decorationIds.length > 0) {
                editorRef.current.deltaDecorations(decorationIds, []);
                
                if (currentSuggestionRef.current && 
                    decorationIds.some(id => currentSuggestionRef.current!.decorationIds.includes(id))) {
                    // 移除小部件
                    cleanupWidget();
                    currentSuggestionRef.current = null;
                }
            }
        },
        getEditor: () => editorRef.current,
    }));

    const monaco = useMonaco();

    useEffect(() => {
        if (monaco) {
            monacoRef.current = monaco as typeof import('monaco-editor');
        }
    }, [monaco]);

    function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
        editorRef.current = editor;
    }

    function handleEditorChange(value: string | undefined) {
        onChange?.(value);
    }

    // 插入建议并关闭提示窗口的函数 - 更可靠的实现
    const insertSuggestionAndCleanup = (lineNumber: number, suggestion: string) => {
        // 添加一个防止重复调用的机制
        interface LastInsertTimeInfo {
            __lastInsertTime?: number;
        }
        const windowWithInsertTime = window as Window & LastInsertTimeInfo;
        const now = Date.now();
        const lastInsertTime = windowWithInsertTime.__lastInsertTime || 0;
        
        // 如果在50ms内有过插入操作，忽略本次请求
        if (now - lastInsertTime < 50) {
            console.log('防止重复插入: 忽略过于频繁的插入请求');
            return;
        }
        
        // 记录本次插入时间
        windowWithInsertTime.__lastInsertTime = now;
        
        if (!editorRef.current || !monacoRef.current) {
            console.error('缺少必要的引用对象');
            return;
        }
        
        const model = editorRef.current.getModel();
        if (!model) {
            console.error('缺少编辑器模型');
            return;
        }
        
        // 如果当前没有活跃的建议，直接返回
        if (!currentSuggestionRef.current) {
            console.log('没有活跃的建议需要插入');
            return;
        }
        
        // 创建临时变量保存当前建议信息
        const currentSuggestion = { ...currentSuggestionRef.current };
        
        // 立即将全局引用设为null，防止重复处理
        currentSuggestionRef.current = null;
        
        try {
            console.log('------ 开始执行插入并清理 ------');
            
            // 1. 先尝试直接通过DOM操作移除小部件元素
            console.log('1. 直接清理小部件DOM');
            // 尝试找到小部件元素并直接从DOM中移除
            const widgetElements = document.querySelectorAll('.ai-suggestion-widget');
            if (widgetElements.length > 0) {
                console.log(`找到 ${widgetElements.length} 个小部件元素，直接移除`);
                widgetElements.forEach(el => {
                    if (el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                });
            }
            
            // 2. 移除所有装饰
            console.log('2. 移除装饰');
            const activeDecorIds = currentSuggestion.decorationIds || [];
            if (activeDecorIds.length > 0 && editorRef.current) {
                editorRef.current.deltaDecorations(activeDecorIds, []);
            }
            
            // 3. 调用清理小部件方法
            console.log('3. 调用清理小部件方法');
            cleanupWidget();
            
            // 4. 获取当前行内容并插入建议
            console.log('4. 插入建议内容');
            const lineContent = model.getLineContent(lineNumber);
            const editOperation = {
                range: new monacoRef.current.Range(
                    lineNumber, lineContent.length + 1, lineNumber, lineContent.length + 1
                ),
                text: suggestion,
                forceMoveMarkers: true
            };
            
            editorRef.current.executeEdits('ai-suggestion-insert', [editOperation]);
            
            // 5. 设置光标位置
            console.log('5. 设置光标位置');
            editorRef.current.setPosition({
                lineNumber: lineNumber,
                column: lineContent.length + suggestion.length + 1
            });
            
            // 6. 强制编辑器刷新视图
            console.log('6. 强制编辑器刷新');
            editorRef.current.focus();
            editorRef.current.render();
            
            // 7. 重置Tab键事件处理标记
            console.log('7. 重置Tab键事件处理标记');
            interface KeyEventInfo {
                __handledByAiWidget?: boolean;
                __lastTabKeyEvent?: number;
            }
            const windowWithEvents = window as Window & KeyEventInfo;
            // 清除所有Tab键事件标记
            windowWithEvents.__handledByAiWidget = false;
            windowWithEvents.__lastTabKeyEvent = 0;
            
            console.log('------ 完成插入并清理 ------');
            
        } catch (error) {
            console.error('插入建议时出错:', error);
            // 确保失败时也清理资源
            cleanupWidget();
        }
    };

    return (
        <Editor
            height="100%"
            theme="vs-dark"
            defaultLanguage={language}
            defaultValue={defaultValue}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
                minimap: { enabled: false },
                fontSize,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
                glyphMargin: true,
                renderLineHighlight: 'all',
                lineDecorationsWidth: 5,
                ...restProps.options
            }}
            {...restProps}
        />
    );
});

CodeEditor.displayName = 'CodeEditor';
