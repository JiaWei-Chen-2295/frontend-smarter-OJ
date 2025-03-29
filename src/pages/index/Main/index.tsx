import {Card} from "antd";
import {useSelector} from "react-redux";
import {RootState} from "../../../context/store.ts";
import MarkDownNewEditor from "../../../components/MarkDownNewEditor.tsx";
import {CodeEditor} from "../../../components/CodeEditor.tsx";

function OJMain() {

    const currentUser = useSelector<RootState, OJModel.User>(state => state?.User?.currentUser)

    return (
        <>
            <Card
                title={`欢迎来到 Smarter OJ, ${currentUser?.userName === undefined ? "游客朋友" : currentUser.userName}`}
                variant={"outlined"}
                size={"small"}
            >
                开始今天的随机练习
                {}
            </Card>
            <MarkDownNewEditor height={"350px"} toolbarConfig={{pin: true}} onValueChange={(value) => {
                console.log(value)
            }}></MarkDownNewEditor>

            <Card>

                <CodeEditor className={'h-64 w-64'} />
            </Card>

        </>
    )
}

export default OJMain;
