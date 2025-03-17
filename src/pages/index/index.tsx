import MainLayout from "../../layouts/MainLayout.tsx";
import {Outlet} from "react-router";


function OJIndex() {
    return (
        <MainLayout>
           <Outlet />
        </MainLayout>
    )
}

export default OJIndex
