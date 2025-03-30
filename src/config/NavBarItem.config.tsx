import {CrownOutlined, ExperimentOutlined, HomeOutlined, QuestionOutlined} from "@ant-design/icons";

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
    {
        key: '3',
        label: '实验室',
        path: '/lab',
        icon: <ExperimentOutlined />,
    },
    {
        key: '4',
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
