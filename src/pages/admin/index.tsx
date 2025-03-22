import MainLayout from "../../layouts/MainLayout.tsx";
import {Outlet} from "react-router";

function AdminPageMain() {
    return (
        <>
            <MainLayout>
                <div>
                    管理员主页面
                </div>
                <Outlet/>
            </MainLayout>

        </>
    );
}

export default AdminPageMain;
