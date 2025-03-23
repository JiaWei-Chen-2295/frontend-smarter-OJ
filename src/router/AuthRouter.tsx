// 创建一个高阶函数
import * as React from "react";
import {useEffect, useMemo} from "react";
import {useLocation, useNavigate} from "react-router";
import {router} from "../config/router.config.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../context/store.ts";
import {message} from "antd";
import User = OJModel.User;

const AuthRouter = ({children}: { children: React.ReactElement }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = useSelector<RootState, User>(state => state.User?.currentUser)

    // 根据当前路由状况获取配置
    const currentRoute = useMemo(() => {
        return router.routes.find(r => r.path === location.pathname)
    }, [location.pathname])

    useEffect(() => {
        if (currentRoute?.meta?.requiresAuth && !currentUser) {
            navigate('/', { replace: true })
        }

        if (currentRoute?.meta?.requiresAuth && currentUser?.role !== 'admin') {
            message.error('您没有权限访问此页面').then()
            navigate('/no-admin')
        }
    }, [currentRoute, currentUser, navigate])



    return currentRoute?.meta?.requiresAuth
        ? currentUser ? children : null
        : children
}


export default AuthRouter;
