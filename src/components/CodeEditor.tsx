import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import Editor, { useMonaco, EditorProps } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

export interface CodeEditorRef {
    getValue: () => string | undefined;
    setValue: (value: string) => void;
    setLanguage: (language: string) => void;
    formatCode: () => void;
    setFontSize: (size: number) => void;
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

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.updateOptions({ fontSize });
        }
    }, [fontSize]);

    useImperativeHandle(ref, () => ({
        getValue: () => editorRef.current?.getValue(),
        setValue: (value: string) => {
            if (editorRef.current) {
                editorRef.current.setValue(value);
            }
        },
        setLanguage: (newLanguage: string) => {
            if (editorRef.current && monaco) {
                monaco.editor.setModelLanguage(editorRef.current.getModel()!, newLanguage);
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
        }
    }));

    const monaco = useMonaco();

    function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
        editorRef.current = editor;
    }

    function handleEditorChange(value: string | undefined) {
        onChange?.(value);
    }

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
                ...restProps.options
            }}
            {...restProps}
        />
    );
});

CodeEditor.displayName = 'CodeEditor';
