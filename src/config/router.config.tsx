// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {createBrowserRouter} from "react-router";
import OJIndex from "../pages/index";
import OJQuestion from "../pages/OJQuestion";
import Questions from "../pages/index/Questions";
import OJMain from "../pages/index/Main";
import AdminPageMain from "../pages/admin";
import AuthRouter from "../router/AuthRouter";
import {NoAdmin} from "../pages/NoAdmin.tsx";
import Lab from "../pages/index/Lab";

export const router = createBrowserRouter([
    {
        path: "/",
        element:
            <>
                <AuthRouter>
                <OJIndex/>
                </AuthRouter>
            </>,
        meta: {
            title: "首页",
            requiresAuth: false,
        },
        children: [
            {
                path: "/",
                element: <OJMain/>,
            },
            {
                path: "/qs",
                element: <Questions/>,
            },
            {
                path: "lab",
                element: <Lab />
            }
        ]
    },
    {
        path: "/oj",
        element:
            <>   <AuthRouter>
                <OJQuestion/>
            </AuthRouter></>
        ,
    }, {
        path: "/admin",
        meta: {
            title: "管理员",
            requiresAuth: true,
        },
        element: <>
            <AuthRouter>
            <AdminPageMain/>
            </AuthRouter>
        </>
        ,
    },
    {
        path: "/no-admin",
        meta: {
            title: "无权限",
            requiresAuth: false,
        },
        element: <NoAdmin/>
    }

]);
