import {ClassAttributes, HTMLAttributes, useRef} from 'react';
import {JSX} from 'react/jsx-runtime';

import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
export const CodeEditor = (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>) => {
    const editorRef = useRef(null);

    const monaco = useMonaco();

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    function showValue() {
        alert(editorRef.current?.getValue());
    }

    return   <>
        <button onClick={showValue}>Show value</button>
        <Editor
            {...props}
            defaultLanguage="java"
            defaultValue="public class MainApplication {
                            public static void main(String[] args) {
                                SpringApplication.run(MainApplication.class, args);
                            }}"
            onMount={handleEditorDidMount}
        />
    </>;
};
