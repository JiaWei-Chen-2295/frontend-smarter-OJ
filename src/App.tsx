import './App.css'
import {RouterProvider} from "react-router";
import {router} from "./config/router.config.tsx";
import {Button, Checkbox, Form, FormProps, Input, message, Modal, QRCode, Tabs} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentUser} from "./features/userSlice.ts";
import {ReactNode, useEffect, useState} from "react";
import {RootState} from "./context/store.ts";


function App() {

    const [messageApi, contextHolder] = message.useMessage()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loginCounter, setLoginCounter] = useState(0);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };


    // @ts-expect-error useSelector
    const currentUser = useSelector<RootState, OJModel.User>(state => state.User.currentUser)
    const dispatch = useDispatch();


    useEffect(() => {
        // TODO: 未来使用请求的方式获取当前用户
        const fetchCurrentUser = {
            username: 'admin',
            password: 'admin',
            email: 'admin@admin.com',
            avatar: 'https://avatars.githubusercontent.com/u/102040770?v=4',
            role: 'user',
            id: '1'
        }
        if (fetchCurrentUser) {
            setTimeout(() => {
                dispatch(setCurrentUser(fetchCurrentUser));
            }, 5000)
        }

        if (!currentUser && !isModalOpen && loginCounter === 0) {
            messageApi.warning('用户请登录').then()
            showModal()
            setLoginCounter(loginCounter + 1)
            console.log('loginCounter', loginCounter)
        }

    }, [currentUser, dispatch, isModalOpen, loginCounter, messageApi]);


    // 关于登录相关
    type FieldType = {
        username?: string;
        password?: string;
        remember?: string;
    };

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const loginTabArray:{
        label: string;
        key: number;
        children: ReactNode;
    }[] = [
        {
            label: '账号密码登录',
            key: 1,
            children: <div
                className={'flex items-center justify-center '}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
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
            </div>,
        },
        {
            label: '扫码登录',
            key: 2,
            children: <div className={'flex items-center justify-center h-1/4'}>
                <QRCode value={'/'} title={'扫码登录'} />
            </div>
               ,
        },

    ]


    return (
    <>
        { contextHolder }
            <RouterProvider router={router}></RouterProvider>
        <Modal title="请先登录" open={isModalOpen} onCancel={handleClose} centered={true} footer={null}>
            <Tabs
                type="card"
                centered={true}
                items={loginTabArray.map( item => item ) as never}
            />
        </Modal>
    </>
  )
}

export default App
