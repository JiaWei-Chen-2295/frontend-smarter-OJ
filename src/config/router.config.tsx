// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {createBrowserRouter} from "react-router";
import OJIndex from "../pages/index";
import OJQuestion from "../pages/OJQuestion";
import Questions from "../pages/index/Questions";
import OJMain from "../pages/index/Main";
import AdminPageMain from "../pages/admin";
import AuthRouter from "../router/AuthRouter";
import Dashboard from "../pages/admin/Dashboard";
import QuestionManager from "../pages/admin/QuestionManager";
import {NoAdmin} from "../pages/NoAdmin.tsx";
import Lab from "../pages/index/Lab";
import UserManager from "../pages/admin/UserManager";
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
        </>,
        children: [
            {
                path: "dashboard",
                element: <Dashboard/>
            },
            {
                path: "question-manager",
                element: <QuestionManager/>
            },
            {
                path: "user-manager",
                element: <UserManager/>
            }
        ],
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
