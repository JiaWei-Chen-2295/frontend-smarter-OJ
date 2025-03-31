import {useEffect, useState} from "react";
import Vditor from 'vditor'
import "vditor/dist/index.css";
import "./MarkDownNewEditor.css"

const MarkDownNewEditor = ( {defaultValue, onValueChange, ...options }: IOptions & {defaultValue?: string, onValueChange?: (value: string) => void }) => {
    const [vd, setVd] = useState<Vditor>();
    const [value, setValue] = useState<string>(defaultValue ? defaultValue : "# 写点什么吧😎 支持`markdown`\n## 二标题")
    const viditorOption: IOptions = {
        toolbar: [
            "headings",
            "bold",
            "italic",
            "strike",
            "link",
            "list",
            "quote",
            "code",
            "table",
            "image",
            "|",
            "undo",
            "redo",
            "|",
            "edit-mode"
        ],
        width: "90%",
        toolbarConfig: {
            hide: true,
            pin: false, // 固定工具栏，滚动时保持可见
        },
        counter: {
            enable: true,
            type: "markdown",
            max: 1000,
        },

        ...options
    }

    useEffect(() => {
        const vditor = new Vditor("vditor", {
            after: () => {
                vditor.setValue(value);
                setVd(vditor);
            },
            cdn: 'https://cdn.jsdelivr.net/npm/vditor@3.10.9',
            ...viditorOption,
        });
        return () => {
            vd?.destroy();
            setVd(undefined);
        };
    }, []);

    const handleInput = () => {
        const newValue = vd?.getValue() || "";
        setValue(newValue);
        onValueChange?.(newValue); // 调用父组件传递的回调函数
    };

    return (
        <>
            <div className={"flex flex-col items-center gap-4"}>
                    <div id="vditor" className={' w-full'} onInput={handleInput} />
                </div>
        </>
    );
}

export default MarkDownNewEditor;
