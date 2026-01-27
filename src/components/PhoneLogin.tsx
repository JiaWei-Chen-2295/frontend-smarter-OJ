import React, { useState, useRef } from 'react';
import { Button, Form, Input, message } from 'antd';
import { MobileOutlined, SafetyOutlined } from '@ant-design/icons';
import { PhoneLoginService } from '../services/PhoneLoginService';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../features/userSlice';
import Verify, { VerifyHandle } from './Captcha/Verify';

interface Props {
    onSuccess: () => void;
}

const PhoneLogin: React.FC<Props> = ({ onSuccess }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [countdown, setCountdown] = useState(0);
    const verifyRef = useRef<VerifyHandle>(null);

    const handleCaptchaSuccess = async (params: { captchaVerification: string }) => {
        try {
            const phone = form.getFieldValue('phone');
            const res = await PhoneLoginService.sendSmsCaptcha(phone, params.captchaVerification);
            if (res.data.code === 0) {
                message.success("短信发送成功");
                setCountdown(60);
                const timer = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                message.error(res.data.message || "发送失败");
            }
        } catch (error: any) {
            message.error("发送失败: " + error.message);
        }
    };

    const getCaptcha = async () => {
        try {
            await form.validateFields(['phone']);
            // Directly trigger Ali-Captcha
            if (verifyRef.current) {
                verifyRef.current.show();
            }
        } catch (error) {
            // form validation failed
        }
    };

    const onFinish = async (values: any) => {
        try {
            const res = await PhoneLoginService.userLoginByPhone(values.phone, values.captcha);
            if (res.data.code === 0) {
                message.success("登录成功");
                dispatch(setCurrentUser({ ...res.data.data }));
                onSuccess();
            } else {
                message.error(res.data.message || "登录失败");
            }
        } catch (error: any) {
            message.error("登录失败: " + error.message);
        }
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    name="phone"
                    rules={[
                        { required: true, message: '请输入手机号' },
                        { pattern: /^1\d{10}$/, message: '手机号格式不正确' }
                    ]}
                >
                    <Input prefix={<MobileOutlined />} placeholder="请输入手机号" />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                        <Form.Item
                            name="captcha"
                            noStyle
                            rules={[{ required: true, message: '请输入验证码' }]}
                        >
                            <Input prefix={<SafetyOutlined />} placeholder="请输入验证码" style={{ flex: 1 }} />
                        </Form.Item>
                        <Button disabled={countdown > 0} onClick={getCaptcha}>
                            {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        登录 / 注册
                    </Button>
                </Form.Item>
            </Form>

            {/* Hidden Captcha component that handles the logic */}
            <Verify
                ref={verifyRef}
                onSuccess={handleCaptchaSuccess}
                onFail={() => {
                    message.error("验证失败，请重试");
                }}
            />
        </div>
    );
};

export default PhoneLogin;
