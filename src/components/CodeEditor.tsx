import { useRef, forwardRef, useImperativeHandle } from 'react';
import Editor, { useMonaco, EditorProps } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

export interface CodeEditorRef {
    getValue: () => string;
    setValue: (value: string) => void;
    setLanguage: (language: string) => void;
    formatCode: () => void;
}

export interface CodeEditorProps extends Omit<EditorProps, 'onMount'> {
    language?: string;
    defaultValue?: string;
    onChange?: (value: string | undefined) => void;
}

export const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>((props, ref) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const { language = 'java', defaultValue = '', onChange, ...restProps } = props;

    useImperativeHandle(ref, () => ({
        getValue: () => editorRef.current?.getValue() || '',
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
        formatCode: async () => {
            if (editorRef.current) {
                await editorRef.current.getAction('editor.action.formatDocument')?.run();
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
                fontSize: 14,
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
