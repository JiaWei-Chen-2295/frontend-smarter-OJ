import axios from "axios";

export const PhoneLoginService = {
    /**
     * 发送短信验证码
     * @param phone 手机号
     * @param captchaVerification 行为验证码校验串
     */
    sendSmsCaptcha: async (phone: string, captchaVerification: string) => {
        return await axios.post('/api/user/captcha/sms', { phone, captchaVerification });
    },

    /**
     * 手机号登录
     * @param phone 手机号
     * @param captcha 短信验证码
     */
    userLoginByPhone: async (phone: string, captcha: string) => {
        return await axios.post('/api/user/login/phone', { phone, captcha });
    }
};
