# CaptchaControllerApi

All URIs are relative to *http://192.168.254.1:8201/api/user*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**check**](#check) | **POST** /captcha/check | |
|[**get**](#get) | **POST** /captcha/get | |

# **check**
> ResponseModel check(captchaVO)


### Example

```typescript
import {
    CaptchaControllerApi,
    Configuration,
    CaptchaVO
} from 'user';

const configuration = new Configuration();
const apiInstance = new CaptchaControllerApi(configuration);

let captchaVO: CaptchaVO; //

const { status, data } = await apiInstance.check(
    captchaVO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **captchaVO** | **CaptchaVO**|  | |


### Return type

**ResponseModel**

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

# **get**
> ResponseModel get(captchaVO)


### Example

```typescript
import {
    CaptchaControllerApi,
    Configuration,
    CaptchaVO
} from 'user';

const configuration = new Configuration();
const apiInstance = new CaptchaControllerApi(configuration);

let captchaVO: CaptchaVO; //

const { status, data } = await apiInstance.get(
    captchaVO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **captchaVO** | **CaptchaVO**|  | |


### Return type

**ResponseModel**

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

