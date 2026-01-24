// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {createBrowserRouter} from "react-router-dom";
import OJIndex from "../pages/index";
import OJQuestion from "../pages/OJQuestion";
import Questions from "../pages/index/Questions";
import QuestionList from "../pages/OJQuestion/QuestionList";
import OJMain from "../pages/index/Main";
import AdminPageMain from "../pages/admin";
import AuthRouter from "../router/AuthRouter";
import Dashboard from "../pages/admin/Dashboard";
import QuestionManager from "../pages/admin/QuestionManager";
import {NoAdmin} from "../pages/NoAdmin.tsx";
import Lab from "../pages/index/Lab";
import Posts from "../pages/index/Posts";
import PostDetail from "../pages/post/PostDetail";
import UserManager from "../pages/admin/UserManager";
import UserSubmitManager from "../pages/admin/UserSubmitManager";
import { ErrorBoundary } from "../router/ErrorBoundary";
import RoomList from "../pages/room/RoomList";
import CreateRoom from "../pages/room/CreateRoom";
import RoomDetail from "../pages/room/RoomDetail";
import MyRooms from "../pages/room/MyRooms";
import RoomChatPage from "../pages/room/RoomChat";
import Profile from "../pages/user/Profile";

// 题单模块
import QuestionSets from "../pages/index/QuestionSets";
import QuestionSetDetail from "../pages/index/QuestionSets/QuestionSetDetail";
import QuestionSetEdit from "../pages/index/QuestionSets/QuestionSetEdit";

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
        errorElement: <ErrorBoundary />,
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
            },
            {
                path: "posts",
                element: <Posts />
            },
            {
                path: "post/:postId",
                element: <PostDetail />
            },
            {
                path: "question-sets",
                element: <QuestionSets />
            },
            {
                path: "question-set/:id",
                element: <QuestionSetDetail />
            },
            {
                path: "question-set/edit/:id",
                element: <QuestionSetEdit />
            },
            {
                path: "room",
                element: <RoomList/>
            },
            {
                path: "room/create",
                element: <CreateRoom/>
            },
            {
                path: "room/my",
                element: <MyRooms/>
            },
            {
                path: "profile",
                element: <Profile/>
            }
        ]
    },
    {
        path: "/oj/:questionId",
        element:
            <>   <AuthRouter>
                <OJQuestion/>
            </AuthRouter></>
        ,
        errorElement: <ErrorBoundary />,
    },
    {
        path: "/questions",
        element:
            <><AuthRouter>
                <QuestionList/>
            </AuthRouter></>,
        errorElement: <ErrorBoundary />,
    },
    {
        path: "/room/:roomId",
        element:
            <>
                <AuthRouter>
                    <RoomDetail/>
                </AuthRouter>
            </>,
        errorElement: <ErrorBoundary />,
    },
    {
        path: "/room/:roomId/chat",
        element:
            <>
                <AuthRouter>
                    <RoomChatPage/>
                </AuthRouter>
            </>,
        errorElement: <ErrorBoundary />,
    },
    {
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
        errorElement: <ErrorBoundary />,
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
            },
            {
                path: "user-submit-manager",
                element: <UserSubmitManager/>
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
    },
    {
        path: "*",
        element: <ErrorBoundary />
    }

]);
