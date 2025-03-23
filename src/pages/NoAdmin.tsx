import {Button, Result} from "antd";
import MainLayout from "../layouts/MainLayout.tsx";
import {Navigate, NavLink, useNavigate} from "react-router";


export function NoAdmin() {
    return (
        <MainLayout>
            <Result
                status="403"
                title="403"
                subTitle="你没有权限去访问这个页面"
                extra={<NavLink to={'/'} ><Button type={'primary'}>回到主页</Button></NavLink>}
            />
        </MainLayout>
    )
}
