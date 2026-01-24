import {CrownOutlined, ExperimentOutlined, HomeOutlined, QuestionOutlined, TeamOutlined, BookOutlined, MessageOutlined} from "@ant-design/icons";
import type { ReactNode } from 'react';

interface NavBarItem {
    key: string;
    label: string;
    path: string;
    icon?: ReactNode;
    children?: NavBarItem[];
}

const NavBarItems: NavBarItem[] = [
    {
        key: '1',
        label: '首页',
        path: '/',
        icon: <HomeOutlined />,
    },
    {
        key: '2',
        label: '题库',
        path: '/qs',
        icon: <QuestionOutlined />,
    },
    {
        key: '3',
        label: '题单',
        path: '/question-sets',
        icon: <BookOutlined />,
    },
    {
        key: '4',
        label: '实验室',
        path: '/lab',
        icon: <ExperimentOutlined />,
    },
    {
        key: '5',
        label: '帖子',
        path: '/posts',
        icon: <MessageOutlined />,
    },
    {
        key: '6',
        label: '房间',
        path: '/room',
        icon: <TeamOutlined />,
    },
    {
        key: '7',
        label: '管理员',
        path: '/admin',
        icon: <CrownOutlined />,
    }
];

export function getPathByKey(key: string)  {
    const item = NavBarItems.find(item => item.key === key);
    return item?.path;
}

export default NavBarItems;
