# InnerUserControllerApi

All URIs are relative to *http://192.168.254.1:8201/api/user*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getById**](#getbyid) | **GET** /inner/get/id | |
|[**listByIds**](#listbyids) | **GET** /inner/list/id | |

# **getById**
> User getById()


### Example

```typescript
import {
    InnerUserControllerApi,
    Configuration
} from 'user';

const configuration = new Configuration();
const apiInstance = new InnerUserControllerApi(configuration);

let userId: string; // (default to undefined)

const { status, data } = await apiInstance.getById(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] |  | defaults to undefined|


### Return type

**User**

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

# **listByIds**
> Array<User> listByIds()


### Example

```typescript
import {
    InnerUserControllerApi,
    Configuration
} from 'user';

const configuration = new Configuration();
const apiInstance = new InnerUserControllerApi(configuration);

let idList: Array<string>; // (default to undefined)

const { status, data } = await apiInstance.listByIds(
    idList
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **idList** | **Array&lt;string&gt;** |  | defaults to undefined|


### Return type

**Array<User>**

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

