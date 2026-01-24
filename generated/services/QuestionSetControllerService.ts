/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_QuestionSet_ } from '../models/BaseResponse_Page_QuestionSet_';
import type { BaseResponse_Page_QuestionSetVO_ } from '../models/BaseResponse_Page_QuestionSetVO_';
import type { BaseResponse_QuestionSet_ } from '../models/BaseResponse_QuestionSet_';
import type { BaseResponse_QuestionSetVO_ } from '../models/BaseResponse_QuestionSetVO_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { QuestionSetAddRequest } from '../models/QuestionSetAddRequest';
import type { QuestionSetEditRequest } from '../models/QuestionSetEditRequest';
import type { QuestionSetItemAddRequest } from '../models/QuestionSetItemAddRequest';
import type { QuestionSetItemRemoveRequest } from '../models/QuestionSetItemRemoveRequest';
import type { QuestionSetQueryRequest } from '../models/QuestionSetQueryRequest';
import type { QuestionSetUpdateRequest } from '../models/QuestionSetUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuestionSetControllerService {
    /**
     * addQuestionSet
     * @param questionSetAddRequest questionSetAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addQuestionSetUsingPost(
        questionSetAddRequest: QuestionSetAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/questionSet/add',
            body: questionSetAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteQuestionSet
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteQuestionSetUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/questionSet/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * editQuestionSet
     * @param questionSetEditRequest questionSetEditRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static editQuestionSetUsingPost(
        questionSetEditRequest: QuestionSetEditRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/questionSet/edit',
            body: questionSetEditRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getQuestionSetById
     * @param id id
     * @returns BaseResponse_QuestionSet_ OK
     * @throws ApiError
     */
    public static getQuestionSetByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_QuestionSet_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/questionSet/get',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getQuestionSetVOById
     * @param id id
     * @returns BaseResponse_QuestionSetVO_ OK
     * @throws ApiError
     */
    public static getQuestionSetVoByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_QuestionSetVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/questionSet/get/vo',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * addQuestionToSet
     * @param itemAddRequest itemAddRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addQuestionToSetUsingPost(
        itemAddRequest: QuestionSetItemAddRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/questionSet/item/add',
            body: itemAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * removeQuestionFromSet
     * @param itemRemoveRequest itemRemoveRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static removeQuestionFromSetUsingPost(
        itemRemoveRequest: QuestionSetItemRemoveRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/questionSet/item/remove',
            body: itemRemoveRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listQuestionSetByPage
     * @param questionSetQueryRequest questionSetQueryRequest
     * @returns BaseResponse_Page_QuestionSet_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionSetByPageUsingPost(
        questionSetQueryRequest: QuestionSetQueryRequest,
    ): CancelablePromise<BaseResponse_Page_QuestionSet_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/questionSet/list/page',
            body: questionSetQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listQuestionSetVOByPage
     * @param questionSetQueryRequest questionSetQueryRequest
     * @returns BaseResponse_Page_QuestionSetVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionSetVoByPageUsingPost(
        questionSetQueryRequest: QuestionSetQueryRequest,
    ): CancelablePromise<BaseResponse_Page_QuestionSetVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/questionSet/list/page/vo',
            body: questionSetQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listMyQuestionSetVOByPage
     * @param questionSetQueryRequest questionSetQueryRequest
     * @returns BaseResponse_Page_QuestionSetVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listMyQuestionSetVoByPageUsingPost(
        questionSetQueryRequest: QuestionSetQueryRequest,
    ): CancelablePromise<BaseResponse_Page_QuestionSetVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/questionSet/my/list/page/vo',
            body: questionSetQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateQuestionSet
     * @param questionSetUpdateRequest questionSetUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateQuestionSetUsingPost(
        questionSetUpdateRequest: QuestionSetUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/questionSet/update',
            body: questionSetUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
