# RoomControllerApi

All URIs are relative to *http://172.19.0.4:8205/api/room*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addRoom**](#addroom) | **POST** /add | |
|[**auth**](#auth) | **POST** /auth | |
|[**deleteRoom**](#deleteroom) | **POST** /delete | |
|[**editRoom**](#editroom) | **POST** /edit | |
|[**generateAuthToken**](#generateauthtoken) | **GET** /auth/token | |
|[**getRoomById**](#getroombyid) | **GET** /get | |
|[**getRoomVOById**](#getroomvobyid) | **GET** /get/vo | |
|[**joinRoom**](#joinroom) | **POST** /join | |
|[**listMyRoomVOByPage**](#listmyroomvobypage) | **POST** /my/list/page/vo | |
|[**listRoomByPage**](#listroombypage) | **POST** /list/page | |
|[**listRoomVOByPage**](#listroomvobypage) | **POST** /list/page/vo | |
|[**quitRoom**](#quitroom) | **POST** /quit | |
|[**transferLeader**](#transferleader) | **POST** /transfer | |
|[**updateRoom**](#updateroom) | **POST** /update | |

# **addRoom**
> BaseResponseLong addRoom(roomAddRequest)


### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    RoomAddRequest
} from 'room';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomAddRequest: RoomAddRequest; //

const { status, data } = await apiInstance.addRoom(
    roomAddRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomAddRequest** | **RoomAddRequest**|  | |


### Return type

**BaseResponseLong**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **auth**
> BaseResponseBoolean auth(roomAuthRequest)


### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    RoomAuthRequest
} from 'room';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomAuthRequest: RoomAuthRequest; //

const { status, data } = await apiInstance.auth(
    roomAuthRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomAuthRequest** | **RoomAuthRequest**|  | |


### Return type

**BaseResponseBoolean**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteRoom**
> BaseResponseBoolean deleteRoom(deleteRequest)


### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    DeleteRequest
} from 'room';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let deleteRequest: DeleteRequest; //

const { status, data } = await apiInstance.deleteRoom(
    deleteRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **deleteRequest** | **DeleteRequest**|  | |


### Return type

**BaseResponseBoolean**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **editRoom**
> BaseResponseBoolean editRoom(roomEditRequest)


### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    RoomEditRequest
} from 'room';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomEditRequest: RoomEditRequest; //

const { status, data } = await apiInstance.editRoom(
    roomEditRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomEditRequest** | **RoomEditRequest**|  | |


### Return type

**BaseResponseBoolean**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **generateAuthToken**
> BaseResponseRoomAuthRequest generateAuthToken()


### Example

```typescript
import {
    RoomControllerApi,
    Configuration
} from 'room';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomId: string; // (default to undefined)

const { status, data } = await apiInstance.generateAuthToken(
    roomId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomId** | [**string**] |  | defaults to undefined|


### Return type

**BaseResponseRoomAuthRequest**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRoomById**
> BaseResponseRoom getRoomById()


### Example

```typescript
import {
    RoomControllerApi,
    Configuration
} from 'room';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getRoomById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**BaseResponseRoom**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRoomVOById**
> BaseResponseRoomVO getRoomVOById()


### Example

```typescript
import {
    RoomControllerApi,
    Configuration
} from 'room';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getRoomVOById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**BaseResponseRoomVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **joinRoom**
> BaseResponseBoolean joinRoom(roomJoinRequest)


### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    RoomJoinRequest
} from 'room';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomJoinRequest: RoomJoinRequest; //

const { status, data } = await apiInstance.joinRoom(
    roomJoinRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomJoinRequest** | **RoomJoinRequest**|  | |


### Return type

**BaseResponseBoolean**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listMyRoomVOByPage**
> BaseResponsePageRoomVO listMyRoomVOByPage(roomQueryRequest)


### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    RoomQueryRequest
} from 'room';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomQueryRequest: RoomQueryRequest; //

const { status, data } = await apiInstance.listMyRoomVOByPage(
    roomQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomQueryRequest** | **RoomQueryRequest**|  | |


### Return type

**BaseResponsePageRoomVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listRoomByPage**
> BaseResponsePageRoom listRoomByPage(roomQueryRequest)


### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    RoomQueryRequest
} from 'room';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomQueryRequest: RoomQueryRequest; //

const { status, data } = await apiInstance.listRoomByPage(
    roomQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomQueryRequest** | **RoomQueryRequest**|  | |


### Return type

**BaseResponsePageRoom**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listRoomVOByPage**
> BaseResponsePageRoomVO listRoomVOByPage(roomQueryRequest)


### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    RoomQueryRequest
} from 'room';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomQueryRequest: RoomQueryRequest; //

const { status, data } = await apiInstance.listRoomVOByPage(
    roomQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomQueryRequest** | **RoomQueryRequest**|  | |


### Return type

**BaseResponsePageRoomVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quitRoom**
> BaseResponseBoolean quitRoom(roomQuitRequest)


### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    RoomQuitRequest
} from 'room';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomQuitRequest: RoomQuitRequest; //

const { status, data } = await apiInstance.quitRoom(
    roomQuitRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomQuitRequest** | **RoomQuitRequest**|  | |


### Return type

**BaseResponseBoolean**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **transferLeader**
> BaseResponseBoolean transferLeader(roomTransferRequest)


### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    RoomTransferRequest
} from 'room';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomTransferRequest: RoomTransferRequest; //

const { status, data } = await apiInstance.transferLeader(
    roomTransferRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomTransferRequest** | **RoomTransferRequest**|  | |


### Return type

**BaseResponseBoolean**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateRoom**
> BaseResponseBoolean updateRoom(roomUpdateRequest)


### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    RoomUpdateRequest
} from 'room';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomUpdateRequest: RoomUpdateRequest; //

const { status, data } = await apiInstance.updateRoom(
    roomUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomUpdateRequest** | **RoomUpdateRequest**|  | |


### Return type

**BaseResponseBoolean**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

