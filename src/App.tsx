import './App.css'
import {RouterProvider} from "react-router";
import {router} from "./config/router.config.tsx";
import {Button, Checkbox, Form, FormProps, Input, message, Modal, QRCode, Tabs} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentUser} from "./features/userSlice.ts";
import {ReactNode, useEffect, useState} from "react";
import {RootState} from "./context/store.ts";
import {UserControllerService} from "../generated";


function App() {

    const [messageApi, contextHolder] = message.useMessage()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loginCounter, setLoginCounter] = useState(0);
    // @ts-expect-error useSelector
    const currentUser = useSelector<RootState, OJModel.User>(state => state.User.currentUser)
    const dispatch = useDispatch();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };


    useEffect(() => {
        // TODO: 未来使用请求的方式获取当前用户

        if (!currentUser && !isModalOpen && loginCounter === 0) {
            messageApi.warning('用户请登录').then()
            showModal()
            setLoginCounter(loginCounter + 1)
        }

    }, [currentUser, dispatch, isModalOpen, loginCounter, messageApi]);


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
