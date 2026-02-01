import { Avatar, Button, Divider, Dropdown, Layout, MenuProps, Space, theme } from 'antd';
import { ReactNode, useEffect, useState } from "react";
import NavBarItems, { getPathByKey } from "../config/NavBarItem.config.tsx";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../context/store.ts";
import { router } from "../config/router.config.tsx";
import { SourceCode } from "@icon-park/react";
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { userApi } from '../api';
import '../styles/uiuxpro.css';

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
                userApi.userLogout()
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
        const resolveActiveKey = () => {
            const exact = NavBarItems.find(item => item.path === path);
            if (exact) return exact.key.toString();

            const aliasMap: Record<string, string> = {
                '/post': '/posts',
                '/question-set': '/question-sets',
                '/oj': '/qs',
            };
            for (const [prefix, target] of Object.entries(aliasMap)) {
                if (path === prefix || path.startsWith(`${prefix}/`)) {
                    const hit = NavBarItems.find(item => item.path === target);
                    if (hit) return hit.key.toString();
                }
            }

            const candidates = NavBarItems
                .filter(item => item.path !== '/' && (path === item.path || path.startsWith(`${item.path}/`)))
                .sort((a, b) => b.path.length - a.path.length);
            return candidates[0]?.key.toString() ?? '';
        };

        const selectedKey = resolveActiveKey();
        setCurrentKey(selectedKey);
    }, [location]);

    return (
        <Layout>
            <Header className="uiux-scope uiux-navbar" style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                width: '100%',
                background: 'transparent',
                padding: 0,
                height: 64,
                lineHeight: '64px',
            }}>
                <div className="uiux-navbar-inner">
                    <button
                        type="button"
                        className="uiux-navbar-logo"
                        onClick={() => navigate('/')}
                    >
                        <img src="/logo.svg" height={'40px'} width={'56px'} alt='Smarter OJ' />
                        <span className="uiux-navbar-brand">SmarterOJ</span>
                    </button>
                    {!hideMenu && (
                        <nav className="uiux-navbar-nav uiux-tabs" aria-label="主导航">
                            {NavBarItems.filter(item => {
                                const findRoute = router.routes.find(route => item.path === route.path);
                                // @ts-expect-error meta
                                return !(findRoute?.meta?.requiresAuth && currentUser?.userRole !== 'admin');
                            }).map(item => (
                                <button
                                    key={item.key}
                                    type="button"
                                    className={`uiux-tab uiux-navbar-tab ${currentKey === item.key ? 'uiux-tab-active' : ''}`}
                                    onClick={() => {
                                        const path = getPathByKey(item.key);
                                        if (path) navigate(path);
                                    }}
                                    aria-current={currentKey === item.key ? 'page' : undefined}
                                >
                                    <span className="uiux-navbar-tab-icon">{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    )}
                    {hideMenu && <div style={{ flex: 1 }} />}

                    <Dropdown
                        menu={{ items }}
                        placement="bottomLeft"
                        dropdownRender={(menu) => (
                            <div
                                className="uiux-scope uiux-card"
                                style={{
                                    ...contentStyle,
                                    backgroundColor: 'var(--uiux-card)',
                                    borderRadius: 16,
                                    overflow: 'hidden',
                                }}
                            >
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
                            <div className="uiux-navbar-user pr-6">
                                <Avatar
                                    style={{ backgroundColor: 'rgba(240, 253, 244, 1)', color: 'rgba(22, 163, 74, 1)' }}
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
                </div>




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
