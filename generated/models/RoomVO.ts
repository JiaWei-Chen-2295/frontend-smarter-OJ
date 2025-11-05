/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RoomMemberVO } from './RoomMemberVO';
import type { UserVO } from './UserVO';
export type RoomVO = {
    createTime?: string;
    currentNum?: number;
    description?: string;
    id?: number;
    mateNum?: number;
    members?: Array<RoomMemberVO>;
    name?: string;
    status?: number;
    userId?: number;
    userVO?: UserVO;
};

