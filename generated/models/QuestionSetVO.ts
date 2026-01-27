/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuestionVO } from './QuestionVO';
import type { UserVO } from './UserVO';
export type QuestionSetVO = {
    createTime?: string;
    description?: string;
    favourNum?: number;
    id?: number;
    questionNum?: number;
    questions?: Array<QuestionVO>;
    tags?: Array<string>;
    title?: string;
    userId?: number;
    userVO?: UserVO;
};

