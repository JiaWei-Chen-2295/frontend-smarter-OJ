import MarkDownNewEditor from "../../../components/MarkDownNewEditor.tsx";
import { Card } from "antd";
import { CodeEditor } from "../../../components/CodeEditor.tsx";
import QuestionList from "../../../components/QustionList.tsx";
function Lab() {
    return (
        <>
            <MarkDownNewEditor defaultValue={"# 写点什么吧😎 支持`markdown`\n## 这是 Lab 页面"} height={"350px"} toolbarConfig={{ pin: true }} onValueChange={(value) => {
                console.log(value)
            }}></MarkDownNewEditor>

            <Card>
                <CodeEditor className={'h-64 w-64'} />
            </Card>

            <QuestionList />
        </>
    )
}

export default Lab;