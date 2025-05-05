/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JudgeInfo } from './JudgeInfo';
import type { QuestionVO } from './QuestionVO';
import type { UserVO } from './UserVO';
export type QuestionSubmitVO = {
    code?: string;
    id?: number;
    judgeInfo?: JudgeInfo;
    language?: string;
    outputResult?: string;
    questionId?: number;
    questionVO?: QuestionVO;
    status?: number;
    userId?: number;
    userVO?: UserVO;
};

