import { Tabs } from "antd";
import MainLayout from "../../layouts/MainLayout.tsx";
import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";

function AdminPageMain() {
    
    const adminPageTabItems: ConfigModel.TabsItem[] = [
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
        
    ]
    
    const navigate = useNavigate();

    useEffect(() => {
        navigate(adminPageTabItems.find(item => item.key === "1")?.path || "/admin");
    }, []);

    return (
        <>
            <MainLayout>
                <Tabs
                    defaultActiveKey="1"
                    centered
                    items={adminPageTabItems}
                    onChange={(key) => {
                        navigate(adminPageTabItems.find(item => item.key === key)?.path || "/admin");
                    }}
                />
                <Outlet />
            </MainLayout>

        </>
    );
}

export default AdminPageMain;
