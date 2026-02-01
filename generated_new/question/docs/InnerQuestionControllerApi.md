# InnerQuestionControllerApi

All URIs are relative to *http://172.24.80.1:8202/api/question*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getQuestionById**](#getquestionbyid) | **GET** /inner/get/id | |
|[**getQuestionSubmitById**](#getquestionsubmitbyid) | **GET** /inner/submit/update/id | |
|[**getQuestionSubmitVO**](#getquestionsubmitvo) | **POST** /inner/submit/get/vo | |
|[**updateQuestionSubmitById**](#updatequestionsubmitbyid) | **POST** /inner/submit/update | |

# **getQuestionById**
> Question getQuestionById()


### Example

```typescript
import {
    InnerQuestionControllerApi,
    Configuration
} from 'question';

const configuration = new Configuration();
const apiInstance = new InnerQuestionControllerApi(configuration);

let questionId: string; // (default to undefined)

const { status, data } = await apiInstance.getQuestionById(
    questionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionId** | [**string**] |  | defaults to undefined|


### Return type

**Question**

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

# **getQuestionSubmitById**
> QuestionSubmit getQuestionSubmitById()


### Example

```typescript
import {
    InnerQuestionControllerApi,
    Configuration
} from 'question';

const configuration = new Configuration();
const apiInstance = new InnerQuestionControllerApi(configuration);

let questionSubmitId: string; // (default to undefined)

const { status, data } = await apiInstance.getQuestionSubmitById(
    questionSubmitId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionSubmitId** | [**string**] |  | defaults to undefined|


### Return type

**QuestionSubmit**

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

# **getQuestionSubmitVO**
> QuestionSubmitVO getQuestionSubmitVO(questionSubmit)


### Example

```typescript
import {
    InnerQuestionControllerApi,
    Configuration,
    User,
    QuestionSubmit
} from 'question';

const configuration = new Configuration();
const apiInstance = new InnerQuestionControllerApi(configuration);

let loginUser: User; // (default to undefined)
let questionSubmit: QuestionSubmit; //

const { status, data } = await apiInstance.getQuestionSubmitVO(
    loginUser,
    questionSubmit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionSubmit** | **QuestionSubmit**|  | |
| **loginUser** | **User** |  | defaults to undefined|


### Return type

**QuestionSubmitVO**

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

# **updateQuestionSubmitById**
> boolean updateQuestionSubmitById(questionSubmit)


### Example

```typescript
import {
    InnerQuestionControllerApi,
    Configuration,
    QuestionSubmit
} from 'question';

const configuration = new Configuration();
const apiInstance = new InnerQuestionControllerApi(configuration);

let questionSubmit: QuestionSubmit; //

const { status, data } = await apiInstance.updateQuestionSubmitById(
    questionSubmit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionSubmit** | **QuestionSubmit**|  | |


### Return type

**boolean**

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

