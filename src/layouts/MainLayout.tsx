import {Layout, Menu, theme} from 'antd';
import {ReactNode, useEffect, useState} from "react";
import NavBarItems, {getPathByKey} from "../config/NavBarItem.config.tsx";
import {useLocation, useNavigate} from "react-router";
import {useSelector} from "react-redux";
import { RootState } from "../context/store.ts";


const { Header, Content, Footer } = Layout;

function MainLayout ({children}: {children: ReactNode}) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [currentKey, setCurrentKey] = useState<string>('');

    const navigate = useNavigate();
    const location = useLocation();
    // @ts-expect-error useSelector
    const currentUser = useSelector<RootState, OJModel.User>(state => state.User?.currentUser)


    useEffect(() => {
        const path = location.pathname;
        const selectedItem = NavBarItems.find(item => item.path === path);
        if (selectedItem) {
            setCurrentKey(selectedItem.key.toString());
        }
    }, [location]);

    return (
        <Layout>
            <Header  style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                background: colorBgContainer,
                padding: 0,
            }}>
                <div className="my-logo" >
                    <h2
                        className={"text-3xl text-green-700 font-bold pl-12 pr-5 "}
                    >Smarter OJ</h2>
                </div>
                <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[currentKey]}
                    items={NavBarItems}
                    onClick={(info) => {
                         const path = getPathByKey(info.key);
                         if (path) {
                            navigate(path)
                         }
                    }}
                    style={{ flex: 1, minWidth: 0 }}
                />
                <div className="my-user">
                    <img
                        className={"w-10 h-10 rounded-full"}
                        src={currentUser?.avatar}
                        alt={currentUser?.username}
                    />
                </div>
            </Header>
            <Content className={"p-6"}>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: '100vh',
                        paddingTop: 48,
                        paddingLeft: 48,
                        paddingRight: 48,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Smarter OJ ©{new Date().getFullYear()} Created by JavierChen
            </Footer>
        </Layout>
    );
}

export default MainLayout;
