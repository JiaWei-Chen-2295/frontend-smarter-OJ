import { Tabs } from "antd";
import MainLayout from "../../layouts/MainLayout.tsx";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function AdminPageMain() {

    const adminPageTabItems = [
        {
            key: "1",
            label: "数据看板",
            path: "/admin/dashboard",
        },
        {
            key: "2",
            label: "题目管理",
            path: "/admin/question-manager",
        },
        {
            key: "3",
            label: "用户管理",
            path: "/admin/user-manager",
        },
        {
            key: "4",
            label: "用户提交管理",
            path: "/admin/user-submit-manager",
        },
        {
            key: "5",
            label: "房间管理",
            path: "/admin/room-manager",
        },
        {
            key: "6",
            label: "题目单管理",
            path: "/admin/question-set-manager",
        },
    ]

    const navigate = useNavigate();
    const location = useLocation();
    const [activeKey, setActiveKey] = useState("1");

    useEffect(() => {
        const currentPath = location.pathname;
        const currentItem = adminPageTabItems.find(item => item.path === currentPath);
        if (currentItem) {
            setActiveKey(currentItem.key);
        } else if (currentPath === "/admin") {
            navigate(adminPageTabItems.find(item => item.key === "1")?.path || "/admin");
        }
    }, [location.pathname]);

    return (
        <>
            <MainLayout>
                <Tabs
                    activeKey={activeKey}
                    centered
                    items={adminPageTabItems}
                    onChange={(key) => {
                        const path = adminPageTabItems.find(item => item.key === key)?.path;
                        if (path) {
                            navigate(path);
                        }
                    }}
                />
                <Outlet />
            </MainLayout>

        </>
    );
}

export default AdminPageMain;
