import './App.css'
import {RouterProvider} from "react-router-dom";
import {router} from "./config/router.config.tsx";
import {Button, Checkbox, Form, FormProps, Input, message, Modal, QRCode, Tabs, ConfigProvider} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentUser, UserStateStatus} from "./features/userSlice.ts";
import {useEffect, useState} from "react";
import {RootState} from "./context/store.ts";
import {UserControllerService} from "../generated";
import zhCN from "antd/locale/zh_CN";
import {themeConfig} from "./config/theme.config.ts";

function App() {
    const [messageApi, contextHolder] = message.useMessage()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loginCounter, setLoginCounter] = useState(0);
    // @ts-expect-error useSelector
    const currentUser = useSelector<RootState, OJModel.User>(state => state.User.currentUser)
    const status = useSelector<RootState, UserStateStatus>(state => state.User.status)
    const dispatch = useDispatch();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (status == 'ok' && !currentUser && !isModalOpen && loginCounter == 0) {
            messageApi.warning('用户请登录').then()
            showModal()
            setLoginCounter(loginCounter + 1)
        }
    }, [status, currentUser, dispatch, isModalOpen, loginCounter, messageApi]);

    // 关于登录相关
    type FieldType = {
        username?: string;
        password?: string;
        remember?: string;
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const resp = await UserControllerService.userLoginUsingPost({
                userAccount: values.username,
                userPassword: values.password
            })
        dispatch(setCurrentUser({...resp.data}));
        if (resp.code === 0) {
            handleClose()
        }
        console.log('Success:', resp);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const tabItems = [
        {
            key: "1",
            label: "账号密码登录",
            children: <div className={'flex items-center justify-center py-4'}>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="账户"
                        name="username"
                        rules={[{ required: true, message: '请填入用户名!' }]}
                    >
                        <Input autoComplete={'username'}/>
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '必须输入密码!' }]}
                    >
                        <Input.Password autoComplete={'current-password'}/>
                    </Form.Item>

                    <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
                        <Checkbox>记住我</Checkbox>
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        },
        {
            key: "2",
            label: "扫码登录",
            children: <div className={'flex items-center justify-center h-48'}>
                    <QRCode value={'/'} />
                </div>
        },
    ];


    return (
        <ConfigProvider theme={themeConfig} locale={zhCN}>
            { contextHolder }
            <RouterProvider router={router}></RouterProvider>
       
            <Modal 
                title="请先登录" 
                open={isModalOpen} 
                onCancel={handleClose} 
                centered={true} 
                footer={null}
                width={600}
            >
                <Tabs 
                    defaultActiveKey="1" 
                    items={tabItems}
                    centered
                />
            </Modal>
        </ConfigProvider>
  )
}

export default App
