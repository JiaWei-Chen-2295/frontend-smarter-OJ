import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

// Extend window interface for Ali-Captcha
declare global {
    interface Window {
        initAlicom4: (
            config: {
                captchaId: string;
                product: string;
                [key: string]: any;
            },
            callback: (instance: any) => void
        ) => void;
    }
}

export interface VerifyHandle {
    show: () => void;
    reset: () => void;
}

interface VerifyProps {
    onSuccess: (params: { captchaVerification: string }) => void;
    onFail?: () => void;
}

const Verify = forwardRef<VerifyHandle, VerifyProps>(({ onSuccess, onFail }, ref) => {
    const captchaInstance = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        show: () => {
            if (captchaInstance.current) {
                captchaInstance.current.showBox();
            } else {
                console.error('AliCaptcha instance not initialized yet');
            }
        },
        reset: () => {
            if (captchaInstance.current) {
                captchaInstance.current.reset();
            }
        }
    }));

    useEffect(() => {
        const captchaId = "00d2067122b25ef2034928cc85383abe";
        const product = "bind"; // Use 'bind' mode to attach to an existing button logic

        if (window.initAlicom4) {
            window.initAlicom4(
                {
                    captchaId: captchaId,
                    product: product,
                },
                (instance: any) => {
                    captchaInstance.current = instance;

                    instance.onSuccess(() => {
                        const result = instance.getValidate();
                        onSuccess({
                            captchaVerification: JSON.stringify(result)
                        });
                    });

                    instance.onError((err: any) => {
                        console.error('AliCaptcha Error:', err);
                        if (onFail) onFail();
                    });
                }
            );
        }

        return () => {
            if (captchaInstance.current) {
                // Cleanup if necessary
            }
        };
    }, [onSuccess, onFail]);

    // 'bind' mode doesn't need a visible container, but we keep a hidden one if required by SDK
    return <div id="captcha-element" style={{ display: 'none' }}></div>;
});

export default Verify;
