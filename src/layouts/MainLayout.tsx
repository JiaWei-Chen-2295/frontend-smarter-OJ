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
        token: { colorBgContainer },
    } = theme.useToken();

    const [currentKey, setCurrentKey] = useState<string>('');

    const navigate = useNavigate();
    const location = useLocation();
    const hideMenu = location.pathname === '/profile';
    // @ts-expect-error useSelector
    const currentUser = useSelector<RootState, OJModel.User>(state => state.User?.currentUser)

    const { useToken } = theme;
    const { token } = useToken();

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
            label: '个人主页',
            icon: <UserOutlined />,
            disabled: currentUser === null,
            onClick: () => {
                navigate('/profile')
            },
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer">
                    注销
                </a>
            ),
            icon: <LogoutOutlined />,
            danger: true,
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
                zIndex: 1000,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                background: colorBgContainer,
                padding: '0 24px',
                height: 64,
                lineHeight: '64px',
            }}>
                <div className="my-logo">
                    <img src="/logo.svg" height={'48px'} width={'64px'} alt='Smarter OJ' />

                </div>
                {!hideMenu && (
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
                )}
                {hideMenu && <div style={{ flex: 1 }} />}

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
            <Content style={{ padding: '24px' }}>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 'calc(100vh - 112px)',
                        padding: '32px',
                        borderRadius: 8,
                        maxWidth: 1280,
                        margin: '0 auto',
                    }}
                >
                    {children}
                </div>
            </Content>
            <Footer style={{ 
                textAlign: 'center',
                padding: '24px 0',
                background: colorBgContainer,
                borderTop: '1px solid #f0f0f0',
            }}>
                <Space split={<Divider type="vertical" />} size="middle">
                    <span>Smarter OJ ©{new Date().getFullYear()} Created by JavierChen</span>
                    <Space size="small">
                        <SourceCode theme="outline" size="16" fill="#000000" />
                        <span>开源代码许可</span>
                    </Space>
                </Space>
            </Footer>
        </Layout>
    );
}

export default MainLayout;
