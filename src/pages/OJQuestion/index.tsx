import { ConfigProvider, theme, Spin } from "antd";
import QuestionLayout from "../../layouts/QuestionLayout";
import { useParams } from "react-router-dom";
import CustomSplitter from "./components/CustomSplitter";
import { QuestionControllerService } from "../../../generated";
import { useEffect, useState } from "react";
import type { QuestionVO } from "../../../generated";

function OJQuestion() {
    const params = useParams<{questionId: string}>();
    const [question, setQuestion] = useState<QuestionVO>();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const resp = await QuestionControllerService.getQuestionVoByIdUsingGet(
                    params.questionId
                );
                if (resp.code === 0 && resp.data) {
                    setQuestion(resp.data);
                }
            } catch (error) {
                console.error('获取题目详情失败:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [params.questionId]);

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#228B22',
                    colorInfo: '#228B22',
                    colorBgContainer: '#141414',
                    colorBgLayout: '#141414',
                    colorText: '#ffffff',
                    colorTextSecondary: '#a6a6a6',
                    colorBorder: '#303030',
                }
            }}
        >
            <QuestionLayout>
                <Spin spinning={loading} tip="加载中...">
                    <CustomSplitter question={question} />
                </Spin>
            </QuestionLayout>
        </ConfigProvider>
    );
}

export default OJQuestion;
