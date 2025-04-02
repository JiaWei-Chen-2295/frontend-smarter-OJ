import { ReactNode } from "react";
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
    QuestionCircleOutlined
} from "@ant-design/icons";

function QuestionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar className="bg-[#228B22]/10 backdrop-blur-md border-b border-[#228B22]/20 h-16">
        {/* 左侧：核心操作区 */}
        <NavbarContent className="basis-1/3">
          <div className="flex items-center gap-6">
            {/* 运行和保存按钮组 */}
            <div className="flex items-center gap-3">
              <Tooltip content="运行代码 (Ctrl + Enter)" placement="bottom">
                <Button
                  className="bg-[#228B22]/20 hover:bg-[#228B22]/30 text-[#228B22] px-5 h-10"
                  aria-label="运行代码"
                >
                  <PlayCircleOutlined className="text-lg mr-2" />
                  <span className="text-sm">运行</span>
                </Button>
              </Tooltip>

              <Tooltip content="保存代码 (Ctrl + S)" placement="bottom">
                <Button
                  className="bg-[#228B22]/20 hover:bg-[#228B22]/30 text-[#228B22] px-5 h-10"
                  aria-label="保存代码"
                >
                  <SaveOutlined className="text-lg mr-2" />
                  <span className="text-sm">保存</span>
                </Button>
              </Tooltip>
            </div>

            <Divider orientation="vertical" className="h-8 bg-[#228B22]/20" />

            {/* 调试和提交按钮组 */}
            <div className="flex items-center gap-3">
              <Tooltip content="调试代码" placement="bottom">
                <Button
                  isIconOnly
                  className="bg-[#228B22]/20 hover:bg-[#228B22]/30 text-[#228B22] w-10 h-10"
                  aria-label="调试代码"
                >
                  <BugOutlined className="text-lg" />
                </Button>
              </Tooltip>

              <Tooltip content="提交历史" placement="bottom">
                <Button
                  isIconOnly
                  className="bg-[#228B22]/20 hover:bg-[#228B22]/30 text-[#228B22] w-10 h-10"
                  aria-label="提交历史"
                >
                  <HistoryOutlined className="text-lg" />
                </Button>
              </Tooltip>
            </div>
          </div>
        </NavbarContent>

        {/* 中间：辅助功能区 */}
        <NavbarContent className="basis-1/3 justify-center">
          <div className="flex items-center gap-6">
            {/* 题目和帮助按钮组 */}
            <div className="flex items-center gap-3">
              <Tooltip content="题目描述" placement="bottom">
                <Button
                  isIconOnly
                  className="bg-[#228B22]/20 hover:bg-[#228B22]/30 text-[#228B22] w-8 h-8"
                  aria-label="题目描述"
                >
                  <FileTextOutlined className="text-base" />
                </Button>
              </Tooltip>

              <Tooltip content="帮助" placement="bottom">
                <Button
                  isIconOnly
                  className="bg-[#228B22]/20 hover:bg-[#228B22]/30 text-[#228B22] w-8 h-8"
                  aria-label="帮助"
                >
                  <QuestionCircleOutlined className="text-base" />
                </Button>
              </Tooltip>
            </div>

            <Divider orientation="vertical" className="h-8 bg-[#228B22]/20" />

            {/* 设置按钮 */}
            <Tooltip content="设置" placement="bottom">
              <Button
                isIconOnly
                className="bg-[#228B22]/20 hover:bg-[#228B22]/30 text-[#228B22] w-8 h-8"
                aria-label="设置"
              >
                <SettingOutlined className="text-base" />
              </Button>
            </Tooltip>
          </div>
        </NavbarContent>

        {/* 右侧：用户头像 */}
        <NavbarContent className="basis-1/3 justify-end pr-4">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform hover:scale-105 border-2 border-[#228B22]/50"
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
              <DropdownItem key="profile" className="h-14 gap-2 text-gray-300">
                <p className="font-semibold">当前登录</p>
                <p className="font-semibold text-gray-400">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" className="hover:bg-red-500/10">
                <LogoutOutlined className="mr-2" />
                退出登录
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      <main className="h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}

export default QuestionLayout;