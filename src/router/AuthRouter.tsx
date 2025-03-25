// 创建一个高阶函数
import * as React from "react";
import {useEffect, useMemo} from "react";
import {useLocation, useNavigate} from "react-router";
import {router} from "../config/router.config.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../context/store.ts";
import {message} from "antd";
import User = OJModel.User;

/**
 * 用于权限校验的路由守卫组件
 * @param children
 * @constructor
 */
const AuthRouter = ({children}: { children: React.ReactElement }) => {

    const location = useLocation();
    const navigate = useNavigate();
    // @ts-expect-error useSelector
    const currentUser = useSelector<RootState, User>(state => state.User?.currentUser)

    // 根据当前路由状况获取配置
    const currentRoute = useMemo(() => {
        return router.routes.find(r => r.path === location.pathname)
    }, [location.pathname])

    // todo： 细化权限控制 包括：是否登录 是否是管理员
    useEffect(() => {
        // @ts-expect-error meta
        if (currentRoute?.meta?.requiresAuth && !currentUser) {
            navigate('/', { replace: true })
        }
        // @ts-expect-error meta
        if (currentRoute?.meta?.requiresAuth && currentUser?.userRole !== 'admin') {
            message.error('您没有权限访问此页面').then()
            navigate('/no-admin')
        }
    }, [currentRoute, currentUser, navigate])

    // @ts-expect-error meta
    return currentRoute?.meta?.requiresAuth
        ? currentUser ? children : null
        : children
}


export default AuthRouter;
