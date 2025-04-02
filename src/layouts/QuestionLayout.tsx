import { ReactNode, useState } from "react";
import {
    Navbar,
    NavbarContent,
    Button,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar,
    Tooltip,
    Divider,
} from "@heroui/react";
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
    HomeOutlined
} from "@ant-design/icons";
import { Drawer, Form, InputNumber, Space, Typography } from "antd";
import { Link } from "react-router-dom";

const { Text } = Typography;

interface QuestionLayoutProps {
    children: ReactNode;
    fontSize?: number;
    onFontSizeChange?: (size: number) => void;
}

function QuestionLayout({ children, fontSize = 14, onFontSizeChange }: QuestionLayoutProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleFontSizeChange = (value: number | null) => {
        if (value && onFontSizeChange) {
            onFontSizeChange(value);
        }
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a]">
            <Navbar className="bg-[#228B22]/10 backdrop-blur-md border-b border-[#228B22]/20 h-16">
                {/* 左侧：LOGO */}
                <NavbarContent className="basis-0">
                    <Link to="/" className="flex items-center gap-2 px-4">
                        <HomeOutlined className="text-[#228B22] text-xl md:text-2xl" />
                        <span className="text-[#228B22] font-bold text-lg md:text-xl hidden sm:inline">SmarterOJ</span>
                    </Link>
                </NavbarContent>

                {/* 中间：核心操作区 */}
                <NavbarContent className="basis-1/2 justify-center">
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* 运行和保存按钮组 */}
                        <div className="flex items-center gap-2 md:gap-3">
                            <Tooltip content="运行代码 (Ctrl + Enter)" placement="bottom" className="[&_.tooltip-content]:bg-white [&_.tooltip-content]:text-gray-800 [&_.tooltip-content]:border [&_.tooltip-content]:border-gray-200 [&_.tooltip-content]:shadow-lg [&_.tooltip-content]:p-2">
                                <Button
                                    className="bg-[#228B22]/20 hover:bg-[#228B22]/30 text-[#228B22] px-3 md:px-5 h-8 md:h-10"
                                    aria-label="运行代码"
                                >
                                    <PlayCircleOutlined className="text-base md:text-lg mr-1 md:mr-2" />
                                    <span className="text-xs md:text-sm hidden sm:inline">运行</span>
                                </Button>
                            </Tooltip>

                            <Tooltip content="保存代码 (Ctrl + S)" placement="bottom" className="[&_.tooltip-content]:bg-white [&_.tooltip-content]:text-gray-800 [&_.tooltip-content]:border [&_.tooltip-content]:border-gray-200 [&_.tooltip-content]:shadow-lg [&_.tooltip-content]:p-2">
                                <Button
                                    className="bg-[#228B22]/20 hover:bg-[#228B22]/30 text-[#228B22] px-3 md:px-5 h-8 md:h-10"
                                    aria-label="保存代码"
                                >
                                    <SaveOutlined className="text-base md:text-lg mr-1 md:mr-2" />
                                    <span className="text-xs md:text-sm hidden sm:inline">保存</span>
                                </Button>
                            </Tooltip>
                        </div>

                        <Divider orientation="vertical" className="h-6 md:h-8 bg-[#228B22]/20" />

                        {/* 调试和提交按钮组 */}
                        <div className="flex items-center gap-2 md:gap-3">
                            <Tooltip content="调试代码 (F5)" placement="bottom" className="[&_.tooltip-content]:bg-white [&_.tooltip-content]:text-gray-800 [&_.tooltip-content]:border [&_.tooltip-content]:border-gray-200 [&_.tooltip-content]:shadow-lg [&_.tooltip-content]:p-2">
                                <Button
                                    isIconOnly
                                    className="bg-[#228B22]/20 hover:bg-[#228B22]/30 text-[#228B22] w-8 h-8 md:w-10 md:h-10"
                                    aria-label="调试代码"
                                >
                                    <BugOutlined className="text-base md:text-lg" />
                                </Button>
                            </Tooltip>

                            <Tooltip content="提交历史" placement="bottom" className="[&_.tooltip-content]:bg-white [&_.tooltip-content]:text-gray-800 [&_.tooltip-content]:border [&_.tooltip-content]:border-gray-200 [&_.tooltip-content]:shadow-lg [&_.tooltip-content]:p-2">
                                <Button
                                    isIconOnly
                                    className="bg-[#228B22]/20 hover:bg-[#228B22]/30 text-[#228B22] w-8 h-8 md:w-10 md:h-10"
                                    aria-label="提交历史"
                                >
                                    <HistoryOutlined className="text-base md:text-lg" />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </NavbarContent>

                {/* 右侧：辅助功能和用户头像 */}
                <NavbarContent className="basis-1/2 justify-end">
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* 题目和帮助按钮组 */}
                        <div className="flex items-center gap-2 md:gap-3">
                            <Tooltip content="题目描述" placement="bottom" className="[&_.tooltip-content]:bg-white [&_.tooltip-content]:text-gray-800 [&_.tooltip-content]:border [&_.tooltip-content]:border-gray-200 [&_.tooltip-content]:shadow-lg [&_.tooltip-content]:p-2">
                                <Button
                                    isIconOnly
                                    className="bg-[#228B22]/20 hover:bg-[#228B22]/30 text-[#228B22] w-7 h-7 md:w-8 md:h-8"
                                    aria-label="题目描述"
                                >
                                    <FileTextOutlined className="text-sm md:text-base" />
                                </Button>
                            </Tooltip>

                            <Tooltip content="帮助文档" placement="bottom" className="[&_.tooltip-content]:bg-white [&_.tooltip-content]:text-gray-800 [&_.tooltip-content]:border [&_.tooltip-content]:border-gray-200 [&_.tooltip-content]:shadow-lg [&_.tooltip-content]:p-2">
                                <Button
                                    isIconOnly
                                    className="bg-[#228B22]/20 hover:bg-[#228B22]/30 text-[#228B22] w-7 h-7 md:w-8 md:h-8"
                                    aria-label="帮助"
                                >
                                    <QuestionCircleOutlined className="text-sm md:text-base" />
                                </Button>
                            </Tooltip>
                        </div>

                        <Divider orientation="vertical" className="h-6 md:h-8 bg-[#228B22]/20" />

                        {/* 设置按钮 */}
                        <Tooltip content="编辑器设置" placement="bottom" className="[&_.tooltip-content]:bg-white [&_.tooltip-content]:text-gray-800 [&_.tooltip-content]:border [&_.tooltip-content]:border-gray-200 [&_.tooltip-content]:shadow-lg [&_.tooltip-content]:p-2">
                            <Button
                                isIconOnly
                                className="bg-[#228B22]/20 hover:bg-[#228B22]/30 text-[#228B22] w-7 h-7 md:w-8 md:h-8"
                                aria-label="设置"
                                onClick={() => setIsSettingsOpen(true)}
                            >
                                <SettingOutlined className="text-sm md:text-base" />
                            </Button>
                        </Tooltip>

                        {/* 用户头像 */}
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform hover:scale-105 border-2 border-[#228B22]/50 w-7 h-7 md:w-8 md:h-8"
                                    color="secondary"
                                    name="Jason Hughes"
                                    size="sm"
                                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                />
                            </DropdownTrigger>
                            <DropdownMenu 
                                aria-label="用户菜单" 
                                variant="flat"
                                className="bg-[#1a1a1a] border border-[#228B22]/20"
                            >
                                <DropdownItem key="profile" className="h-12 md:h-14 gap-2 text-gray-300">
                                    <p className="font-semibold text-sm md:text-base">当前登录</p>
                                    <p className="font-semibold text-gray-400 text-xs md:text-sm">zoey@example.com</p>
                                </DropdownItem>
                                <DropdownItem key="logout" color="danger" className="hover:bg-red-500/10">
                                    <LogoutOutlined className="mr-2" />
                                    退出登录
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </NavbarContent>
            </Navbar>
            <main className="h-[calc(100vh-4rem)]">
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