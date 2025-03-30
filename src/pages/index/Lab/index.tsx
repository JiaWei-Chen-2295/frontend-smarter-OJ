import MarkDownNewEditor from "../../../components/MarkDownNewEditor.tsx";
import {Card} from "antd";
import {CodeEditor} from "../../../components/CodeEditor.tsx";

function Lab() {
    return (
        <>
            <MarkDownNewEditor height={"350px"} toolbarConfig={{pin: true}} onValueChange={(value) => {
                console.log(value)
            }}></MarkDownNewEditor>

            <Card>

                <CodeEditor className={'h-64 w-64'} />
            </Card>
        </>
    )
}

export default Lab;
