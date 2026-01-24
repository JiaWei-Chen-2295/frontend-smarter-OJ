/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_Map_string_object_ } from '../models/BaseResponse_Map_string_object_';
import type { WsMessageAddRequest } from '../models/WsMessageAddRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WsMessageControllerService {
    /**
     * ackMessage
     * @param messageId messageId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static ackMessageUsingPost(
        messageId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/wsMessage/ack',
            query: {
                'messageId': messageId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * addMessage
     * @param wsMessageAddRequest wsMessageAddRequest
     * @returns BaseResponse_Map_string_object_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addMessageUsingPost(
        wsMessageAddRequest: WsMessageAddRequest,
    ): CancelablePromise<BaseResponse_Map_string_object_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/wsMessage/add',
            body: wsMessageAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * failMessage
     * @param messageId messageId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static failMessageUsingPost(
        messageId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/wsMessage/fail',
            query: {
                'messageId': messageId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
