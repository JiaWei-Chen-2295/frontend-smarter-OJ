import { ReactNode, useState } from "react";
import {
    PlayCircleOutlined,
    SaveOutlined,
    HistoryOutlined,
    SettingOutlined,
    LogoutOutlined,
    BugOutlined,
    FileTextOutlined,
    QuestionCircleOutlined,
    FontSizeOutlined,
    HomeOutlined,
    UserOutlined
} from "@ant-design/icons";
import { Layout, Button, Dropdown, Space, Avatar, Tooltip, Divider, Drawer, Form, InputNumber, Typography, MenuProps, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../context/store";
import { logoutUser } from "../features/userSlice";
import { UserControllerService } from "../../generated";

const { Header } = Layout;
const { Text } = Typography;

interface QuestionLayoutProps {
    children: ReactNode;
    fontSize?: number;
    onFontSizeChange?: (size: number) => void;
}

function QuestionLayout({ children, fontSize = 14, onFontSizeChange }: QuestionLayoutProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    // 从 Redux 获取当前用户
    const currentUser = useSelector((state: RootState) => state.User.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await UserControllerService.userLogoutUsingPost();
            if (res.code === 0) {
                dispatch(logoutUser());
                message.success('退出成功');
                navigate('/');
            } else {
                message.error('退出失败：' + res.message);
            }
        } catch (e: any) {
            message.error('退出异常：' + e.message);
        }
    };

    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        if (key === 'logout') {
            handleLogout();
        } else if (key === 'profile') {
            navigate('/profile');
        } else if (key === 'admin') {
            navigate('/admin/dashboard');
        }
    };

    const handleFontSizeChange = (value: number | null) => {
        if (value && onFontSizeChange) {
            onFontSizeChange(value);
        }
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: (
                <div>
                    <div className="font-semibold">{currentUser?.userName || '未登录'}</div>
                    <div className="text-xs text-gray-400">{currentUser?.userProfile || (currentUser?.userRole === 'admin' ? '系统管理员' : '普通用户')}</div>
                </div>
            ),
        },
        currentUser?.userRole === 'admin' ? {
            key: 'admin',
            icon: <SettingOutlined />,
            label: '管理后台',
        } : null,
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
            danger: true,
        },
    ];

    return (
        <div className="h-screen overflow-hidden bg-[#1a1a1a]">
            <Header className="bg-[#141414] border-b border-[#228B22]/20 px-4 sm:px-6 flex items-center justify-between" style={{ position: 'sticky', top: 0, zIndex: 1000, height: 64, lineHeight: '64px' }}>
                <Link to="/" className="flex items-center gap-2">
                    <HomeOutlined className="text-[#228B22] text-xl sm:text-2xl" />
                    <span className="text-[#228B22] font-bold text-xl hidden md:inline">SmarterOJ</span>
                </Link>

                <Space size="middle" className="flex-1 justify-center overflow-hidden px-2">
                    <Space size="small" className="overflow-x-auto no-scrollbar">
                        <Tooltip title="运行代码 (Ctrl + Enter)">
                            <Button
                                type="primary"
                                ghost
                                size="middle"
                                icon={<PlayCircleOutlined style={{ fontSize: 16 }} />}
                                className="border-[#228B22] text-[#228B22] hover:bg-[#228B22]/10"
                                style={{ height: 32 }}
                            >
                                <span className="hidden sm:inline">运行</span>
                            </Button>
                        </Tooltip>

                        <Tooltip title="保存代码 (Ctrl + S)">
                            <Button
                                type="primary"
                                ghost
                                size="middle"
                                icon={<SaveOutlined style={{ fontSize: 16 }} />}
                                className="border-[#228B22] text-[#228B22] hover:bg-[#228B22]/10"
                                style={{ height: 32 }}
                            >
                                <span className="hidden sm:inline">保存</span>
                            </Button>
                        </Tooltip>
                    </Space>

                    <Divider type="vertical" style={{ height: 24, margin: '0 8px' }} className="bg-[#228B22]/20 hidden sm:block" />

                    <Space size="small" className="hidden sm:flex">
                        <Tooltip title="调试代码 (F5)">
                            <Button
                                type="text"
                                size="middle"
                                icon={<BugOutlined style={{ fontSize: 16 }} />}
                                className="text-[#228B22] hover:bg-[#228B22]/10"
                                style={{ height: 32, width: 32 }}
                            />
                        </Tooltip>

                        <Tooltip title="提交历史">
                            <Button
                                type="text"
                                size="middle"
                                icon={<HistoryOutlined style={{ fontSize: 16 }} />}
                                className="text-[#228B22] hover:bg-[#228B22]/10"
                                style={{ height: 32, width: 32 }}
                            />
                        </Tooltip>
                    </Space>
                </Space>

                <Space size="small">
                    <div className="hidden sm:flex">
                        <Tooltip title="题目描述">
                            <Button
                                type="text"
                                size="middle"
                                icon={<FileTextOutlined style={{ fontSize: 16 }} />}
                                className="text-[#228B22] hover:bg-[#228B22]/10"
                                style={{ height: 32, width: 32 }}
                            />
                        </Tooltip>

                        <Tooltip title="帮助文档">
                            <Button
                                type="text"
                                size="middle"
                                icon={<QuestionCircleOutlined style={{ fontSize: 16 }} />}
                                className="text-[#228B22] hover:bg-[#228B22]/10"
                                style={{ height: 32, width: 32 }}
                            />
                        </Tooltip>
                    </div>

                    <Divider type="vertical" style={{ height: 24, margin: '0 8px' }} className="bg-[#228B22]/20 hidden sm:block" />

                    <Tooltip title="编辑器设置">
                        <Button
                            type="text"
                            size="middle"
                            icon={<SettingOutlined style={{ fontSize: 16 }} />}
                            onClick={() => setIsSettingsOpen(true)}
                            className="text-[#228B22] hover:bg-[#228B22]/10"
                            style={{ height: 32, width: 32 }}
                        />
                    </Tooltip>

                    <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight">
                        <Avatar
                            size={32}
                            src={currentUser?.userAvatar || "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"}
                            className="cursor-pointer border-2 border-[#228B22]/50 hover:scale-105 transition-transform ml-2"
                        />
                    </Dropdown>

                </Space>
            </Header>
            <main className="h-[calc(100vh-4rem)] overflow-hidden">
                {children}
            </main>

            {/* 设置面板 */}
            <Drawer
                title="设置"
                placement="right"
                onClose={() => setIsSettingsOpen(false)}
                open={isSettingsOpen}
                className="bg-[#1a1a1a] text-white [&_.ant-drawer-header]:bg-[#1a1a1a] [&_.ant-drawer-header]:border-[#303030] [&_.ant-drawer-title]:text-white [&_.ant-drawer-close]:text-white hover:[&_.ant-drawer-close]:text-[#228B22] [&_.ant-drawer-body]:bg-[#1a1a1a]"
            >
                <Form className="text-white">
                    <Form.Item
                        label="编辑器设置"
                        className="[&_.ant-form-item-label]:text-white"
                    >
                        <Space direction="vertical" className="w-full">
                            <div className="flex items-center gap-2">
                                <FontSizeOutlined className="text-white" />
                                <Text className="text-white">字体大小</Text>
                            </div>
                            <InputNumber
                                min={12}
                                max={24}
                                value={fontSize}
                                onChange={handleFontSizeChange}
                                className="w-full [&_.ant-input-number-handler-wrap]:bg-[#303030] [&_.ant-input-number-handler-wrap]:border-[#404040] [&_.ant-input-number-handler]:text-white hover:[&_.ant-input-number-handler]:bg-[#404040] [&_.ant-input-number-handler]:border-[#404040] [&_.ant-input-number-handler-up-inner]:text-white [&_.ant-input-number-handler-down-inner]:text-white [&_.ant-input-number-input]:bg-[#303030] [&_.ant-input-number-input]:text-white [&_.ant-input-number-input]:border-[#404040] hover:[&_.ant-input-number-input]:border-[#228B22] focus:[&_.ant-input-number-input]:border-[#228B22] focus:[&_.ant-input-number-input]:shadow-[0_0_0_2px_rgba(34,139,34,0.2)]"
                            />
                        </Space>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}

export default QuestionLayout;
