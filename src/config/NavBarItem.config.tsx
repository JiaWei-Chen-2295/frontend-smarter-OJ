import {HomeOutlined, QuestionOutlined} from "@ant-design/icons";

const NavBarItems: ConfigModel.NavBarItem[] = [
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
];

export function getPathByKey(key: string)  {
    const item = NavBarItems.find(item => item.key === key);
    return item?.path;
}

export default NavBarItems;
