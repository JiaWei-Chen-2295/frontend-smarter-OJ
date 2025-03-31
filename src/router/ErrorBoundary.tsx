import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Result, Typography } from 'antd';

const { Paragraph, Text } = Typography;
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";

export function ErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();
    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <Result
                    status="error"
                    title={"路由出错" + error.status + error.statusText}
                    extra={[
                        <Button type="primary" key="console" onClick={() => navigate("/")}>
                            回到主页
                        </Button>,

                    ]}
                >
                    <div className="desc">
                        <Paragraph>
                            <CloseCircleOutlined className="site-result-demo-error-icon" />{error.data}
                        </Paragraph>
                    </div>
                </Result>

            </div>
        );
    } else if (error instanceof Error) {
        return (
            <div>
                <Result
                    status="error"
                    title={error.message}
                    extra={[
                        <Button type="primary" key="console" onClick={() => navigate("/")}>
                            回到主页
                        </Button>,

                    ]}
                >
                    <div className="desc">
                        <Paragraph>
                            <Text
                                strong
                                style={{
                                    fontSize: 16,
                                }}
                            >
                                页面发生错误:
                            </Text>
                        </Paragraph>
                        <Paragraph>
                            <CloseCircleOutlined className="site-result-demo-error-icon" />{error.message}
                        </Paragraph>
                        <Paragraph>
                            <CloseCircleOutlined className="site-result-demo-error-icon" />
                            错误堆栈:
                            <pre>{error.stack}</pre>
                        </Paragraph>
                    </div>
                </Result>
            </div>
        );
    } else {
        return <Result
            status="error"
            title={"未知错误"}
            extra={[
                <Button type="primary" key="console" onClick={() => navigate("/")}>
                    回到主页
                </Button>,

            ]}
        >
        </Result>;
    }
}