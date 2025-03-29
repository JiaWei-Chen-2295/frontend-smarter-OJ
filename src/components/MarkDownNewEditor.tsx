import {useEffect, useState} from "react";
import Vditor from 'vditor'
import "vditor/dist/index.css";
import "./MarkDownNewEditor.css"
import {Button, Card} from "antd";

const MarkDownNewEditor = ({ onValueChange, ...options }: IOptions & { onValueChange?: (value: string) => void }) => {
    const [vd, setVd] = useState<Vditor>();
    const [value, setValue] = useState<string>("# 写点什么吧😎 支持`markdown`\n## 二标题")
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
            pin: true, // 固定工具栏，滚动时保持可见
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
            <Card style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
                <div className={"flex flex-col items-center gap-4"}>
                    <div id="vditor" className={' w-full'} onInput={handleInput} />
                    <Button
                        onClick={() => {
                            setValue(vd?.getValue() || "");
                        }}
                        type="primary"
                        className={"mt-2"}
                    >
                        提交
                    </Button>
                </div>
            </Card>
        </>
    );
}

export default MarkDownNewEditor;
