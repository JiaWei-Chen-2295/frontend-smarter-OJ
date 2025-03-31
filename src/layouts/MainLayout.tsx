import { Avatar, Button, Divider, Dropdown, Layout, Menu, MenuProps, Space, theme } from 'antd';
import { ReactNode, useEffect, useState } from "react";
import NavBarItems, { getPathByKey } from "../config/NavBarItem.config.tsx";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../context/store.ts";
import { router } from "../config/router.config.tsx";
import { SourceCode } from "@icon-park/react";
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { UserControllerService } from '../../generated/index.ts';

const { Header, Content, Footer } = Layout;

function MainLayout({ children }: { children: ReactNode }) {

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [currentKey, setCurrentKey] = useState<string>('');

    const navigate = useNavigate();
    const location = useLocation();
    // @ts-expect-error useSelector
    const currentUser = useSelector<RootState, OJModel.User>(state => state.User?.currentUser)

    const { useToken } = theme;
    const { token } = useToken();
    console.log('token', token);


    const contentStyle: React.CSSProperties = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
    };

    const menuStyle: React.CSSProperties = {
        boxShadow: 'none',
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    个人中心
                </a>
            ),
            icon: <UserOutlined />,
            disabled: currentUser === null,
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer">
                    注销
                </a>
            ),
            icon: <LogoutOutlined />,
            onClick: () => {
                UserControllerService.userLogoutUsingPost()
                    .then(() => {
                        navigate('/', { replace: true })
                        window.location.reload()
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            },
            disabled: currentUser === null,
        },
    ];

    useEffect(() => {
        const path = location.pathname;
        const selectedItem = NavBarItems.find(item => item.path === path);
        if (selectedItem) {
            setCurrentKey(selectedItem.key.toString());
        }
    }, [location]);

    return (
        <Layout>
            <Header style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                background: colorBgContainer,
                padding: 0,
            }}>
                <div className="my-logo">
                    <h2
                        className={"text-3xl text-green-700 font-bold pl-12 pr-5 "}
                    >Smarter OJ</h2>
                </div>
                <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[currentKey]}
                    items={NavBarItems.filter(item => {
                        const findRoute = router.routes.find(route => item.path === route.path);
                        // @ts-expect-error meta
                        return !(findRoute?.meta?.requiresAuth && currentUser?.userRole !== 'admin');
                    })}
                    onClick={(info) => {
                        const path = getPathByKey(info.key);
                        if (path) {
                            navigate(path)
                        }
                    }}
                    style={{ flex: 1, minWidth: 0 }}
                />

                <Dropdown
                    menu={{ items }}
                    placement="bottomLeft"
                    dropdownRender={(menu) => (
                        <div style={contentStyle}>
                            {React.cloneElement(
                                menu as React.ReactElement<{
                                    style: React.CSSProperties;
                                }>,
                                { style: menuStyle },
                            )}
                            <Divider style={{ margin: 0 }} />
                            {
                                currentUser === null && (
                                    <Space style={{ padding: 8 }}>
                                        <Button type="primary" onClick={() => { window.location.reload() }}>立即登录</Button>
                                    </Space>
                                )
                            }
                        </div>
                    )}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <div className="my-user pr-6">
                            <Avatar
                                style={{ backgroundColor: '#c7fdbb', color: '#096105' }}
                                size={'large'}
                                src={
                                    <img src={currentUser?.userAvatar} alt={currentUser?.userName}></img>
                                }
                            >{
                                    currentUser?.userName?.slice(0, 1)
                                }</Avatar>
                        </div>
                    </a>
                </Dropdown>




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
                <Divider type={"vertical"} />
                <span className={'flex items-center justify-center gap-1.5'}>
                    <SourceCode theme="outline" size="16" fill="#000000" />
                    <p>开源代码许可</p>
                </span>
            </Footer>
        </Layout>
    );
}

export default MainLayout;
