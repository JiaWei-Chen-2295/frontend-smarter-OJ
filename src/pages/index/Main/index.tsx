import {Button, Card} from "antd";
import {useSelector} from "react-redux";
import {RootState} from "../../../context/store.ts";
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
        </>
    )
}

export default OJMain;
