/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_Room_ } from '../models/BaseResponse_Page_Room_';
import type { BaseResponse_Page_RoomVO_ } from '../models/BaseResponse_Page_RoomVO_';
import type { BaseResponse_Room_ } from '../models/BaseResponse_Room_';
import type { BaseResponse_RoomAuthRequest_ } from '../models/BaseResponse_RoomAuthRequest_';
import type { BaseResponse_RoomVO_ } from '../models/BaseResponse_RoomVO_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { RoomAddRequest } from '../models/RoomAddRequest';
import type { RoomAuthRequest } from '../models/RoomAuthRequest';
import type { RoomEditRequest } from '../models/RoomEditRequest';
import type { RoomJoinRequest } from '../models/RoomJoinRequest';
import type { RoomQueryRequest } from '../models/RoomQueryRequest';
import type { RoomQuitRequest } from '../models/RoomQuitRequest';
import type { RoomTransferRequest } from '../models/RoomTransferRequest';
import type { RoomUpdateRequest } from '../models/RoomUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoomControllerService {
    /**
     * addRoom
     * @param roomAddRequest roomAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addRoomUsingPost(
        roomAddRequest: RoomAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/room/add',
            body: roomAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * auth
     * @param roomAuthRequest roomAuthRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static authUsingPost(
        roomAuthRequest: RoomAuthRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/room/auth',
            body: roomAuthRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * generateAuthToken
     * @param roomId roomId
     * @returns BaseResponse_RoomAuthRequest_ OK
     * @throws ApiError
     */
    public static generateAuthTokenUsingGet(
        roomId: number,
    ): CancelablePromise<BaseResponse_RoomAuthRequest_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/room/auth/token',
            query: {
                'roomId': roomId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteRoom
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteRoomUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/room/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * editRoom
     * @param roomEditRequest roomEditRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static editRoomUsingPost(
        roomEditRequest: RoomEditRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/room/edit',
            body: roomEditRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getRoomById
     * @param id id
     * @returns BaseResponse_Room_ OK
     * @throws ApiError
     */
    public static getRoomByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_Room_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/room/get',
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
     * getRoomVOById
     * @param id id
     * @returns BaseResponse_RoomVO_ OK
     * @throws ApiError
     */
    public static getRoomVoByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_RoomVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/room/get/vo',
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
     * joinRoom
     * @param roomJoinRequest roomJoinRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static joinRoomUsingPost(
        roomJoinRequest: RoomJoinRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/room/join',
            body: roomJoinRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listRoomByPage
     * @param roomQueryRequest roomQueryRequest
     * @returns BaseResponse_Page_Room_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listRoomByPageUsingPost(
        roomQueryRequest: RoomQueryRequest,
    ): CancelablePromise<BaseResponse_Page_Room_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/room/list/page',
            body: roomQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listRoomVOByPage
     * @param roomQueryRequest roomQueryRequest
     * @returns BaseResponse_Page_RoomVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listRoomVoByPageUsingPost(
        roomQueryRequest: RoomQueryRequest,
    ): CancelablePromise<BaseResponse_Page_RoomVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/room/list/page/vo',
            body: roomQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listMyRoomVOByPage
     * @param roomQueryRequest roomQueryRequest
     * @returns BaseResponse_Page_RoomVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listMyRoomVoByPageUsingPost(
        roomQueryRequest: RoomQueryRequest,
    ): CancelablePromise<BaseResponse_Page_RoomVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/room/my/list/page/vo',
            body: roomQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * quitRoom
     * @param roomQuitRequest roomQuitRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static quitRoomUsingPost(
        roomQuitRequest: RoomQuitRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/room/quit',
            body: roomQuitRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * transferLeader
     * @param roomTransferRequest roomTransferRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static transferLeaderUsingPost(
        roomTransferRequest: RoomTransferRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/room/transfer',
            body: roomTransferRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateRoom
     * @param roomUpdateRequest roomUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateRoomUsingPost(
        roomUpdateRequest: RoomUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/room/update',
            body: roomUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
