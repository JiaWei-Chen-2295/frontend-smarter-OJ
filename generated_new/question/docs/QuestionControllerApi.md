# QuestionControllerApi

All URIs are relative to *http://192.168.254.1:8202/api/question*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addQuestion**](#addquestion) | **POST** /add | |
|[**deleteQuestion**](#deletequestion) | **POST** /delete | |
|[**doQuestionSubmit**](#doquestionsubmit) | **POST** /submit | |
|[**editQuestion**](#editquestion) | **POST** /edit | |
|[**getAllQuestionSubmitByList**](#getallquestionsubmitbylist) | **GET** /submit/admin/list | |
|[**getQuestionById1**](#getquestionbyid1) | **GET** /get/all | |
|[**getQuestionList**](#getquestionlist) | **POST** /list/admin-page | |
|[**getQuestionVOById**](#getquestionvobyid) | **GET** /get/vo | |
|[**getSubmit**](#getsubmit) | **GET** /submit/getSubmitStatus | |
|[**listMyQuestionVOByPage**](#listmyquestionvobypage) | **POST** /my/list/page/vo | |
|[**listQuestionByPage**](#listquestionbypage) | **POST** /list/page | |
|[**listQuestionSubmitByPage**](#listquestionsubmitbypage) | **POST** /submit/admin/page | |
|[**listQuestionVOByPage**](#listquestionvobypage) | **POST** /list/page/vo | |
|[**updateQuestion**](#updatequestion) | **POST** /update | |

# **addQuestion**
> BaseResponseLong addQuestion(questionAddRequest)


### Example

```typescript
import {
    QuestionControllerApi,
    Configuration,
    QuestionAddRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionControllerApi(configuration);

let questionAddRequest: QuestionAddRequest; //

const { status, data } = await apiInstance.addQuestion(
    questionAddRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionAddRequest** | **QuestionAddRequest**|  | |


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

# **deleteQuestion**
> BaseResponseBoolean deleteQuestion(deleteRequest)


### Example

```typescript
import {
    QuestionControllerApi,
    Configuration,
    DeleteRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionControllerApi(configuration);

let deleteRequest: DeleteRequest; //

const { status, data } = await apiInstance.deleteQuestion(
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

# **doQuestionSubmit**
> BaseResponseLong doQuestionSubmit(questionSubmitAddRequest)


### Example

```typescript
import {
    QuestionControllerApi,
    Configuration,
    QuestionSubmitAddRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionControllerApi(configuration);

let questionSubmitAddRequest: QuestionSubmitAddRequest; //

const { status, data } = await apiInstance.doQuestionSubmit(
    questionSubmitAddRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionSubmitAddRequest** | **QuestionSubmitAddRequest**|  | |


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

# **editQuestion**
> BaseResponseBoolean editQuestion(questionEditRequest)


### Example

```typescript
import {
    QuestionControllerApi,
    Configuration,
    QuestionEditRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionControllerApi(configuration);

let questionEditRequest: QuestionEditRequest; //

const { status, data } = await apiInstance.editQuestion(
    questionEditRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionEditRequest** | **QuestionEditRequest**|  | |


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

# **getAllQuestionSubmitByList**
> BaseResponseListQuestionSubmit getAllQuestionSubmitByList()


### Example

```typescript
import {
    QuestionControllerApi,
    Configuration
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionControllerApi(configuration);

const { status, data } = await apiInstance.getAllQuestionSubmitByList();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**BaseResponseListQuestionSubmit**

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

# **getQuestionById1**
> BaseResponseQuestion getQuestionById1()


### Example

```typescript
import {
    QuestionControllerApi,
    Configuration
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getQuestionById1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**BaseResponseQuestion**

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

# **getQuestionList**
> BaseResponsePageQuestion getQuestionList(questionQueryRequest)


### Example

```typescript
import {
    QuestionControllerApi,
    Configuration,
    QuestionQueryRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionControllerApi(configuration);

let questionQueryRequest: QuestionQueryRequest; //

const { status, data } = await apiInstance.getQuestionList(
    questionQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionQueryRequest** | **QuestionQueryRequest**|  | |


### Return type

**BaseResponsePageQuestion**

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

# **getQuestionVOById**
> BaseResponseQuestionVO getQuestionVOById()


### Example

```typescript
import {
    QuestionControllerApi,
    Configuration
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getQuestionVOById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**BaseResponseQuestionVO**

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

# **getSubmit**
> BaseResponseQuestionSubmitVO getSubmit()


### Example

```typescript
import {
    QuestionControllerApi,
    Configuration
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionControllerApi(configuration);

let submitId: string; // (default to undefined)

const { status, data } = await apiInstance.getSubmit(
    submitId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **submitId** | [**string**] |  | defaults to undefined|


### Return type

**BaseResponseQuestionSubmitVO**

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

# **listMyQuestionVOByPage**
> BaseResponsePageQuestionVO listMyQuestionVOByPage(questionQueryRequest)


### Example

```typescript
import {
    QuestionControllerApi,
    Configuration,
    QuestionQueryRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionControllerApi(configuration);

let questionQueryRequest: QuestionQueryRequest; //

const { status, data } = await apiInstance.listMyQuestionVOByPage(
    questionQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionQueryRequest** | **QuestionQueryRequest**|  | |


### Return type

**BaseResponsePageQuestionVO**

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

# **listQuestionByPage**
> BaseResponsePageQuestion listQuestionByPage(questionQueryRequest)


### Example

```typescript
import {
    QuestionControllerApi,
    Configuration,
    QuestionQueryRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionControllerApi(configuration);

let questionQueryRequest: QuestionQueryRequest; //

const { status, data } = await apiInstance.listQuestionByPage(
    questionQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionQueryRequest** | **QuestionQueryRequest**|  | |


### Return type

**BaseResponsePageQuestion**

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

# **listQuestionSubmitByPage**
> BaseResponsePageQuestionSubmitVO listQuestionSubmitByPage(questionSubmitQueryRequest)


### Example

```typescript
import {
    QuestionControllerApi,
    Configuration,
    QuestionSubmitQueryRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionControllerApi(configuration);

let questionSubmitQueryRequest: QuestionSubmitQueryRequest; //

const { status, data } = await apiInstance.listQuestionSubmitByPage(
    questionSubmitQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionSubmitQueryRequest** | **QuestionSubmitQueryRequest**|  | |


### Return type

**BaseResponsePageQuestionSubmitVO**

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

# **listQuestionVOByPage**
> BaseResponsePageQuestionVO listQuestionVOByPage(questionQueryRequest)


### Example

```typescript
import {
    QuestionControllerApi,
    Configuration,
    QuestionQueryRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionControllerApi(configuration);

let questionQueryRequest: QuestionQueryRequest; //

const { status, data } = await apiInstance.listQuestionVOByPage(
    questionQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionQueryRequest** | **QuestionQueryRequest**|  | |


### Return type

**BaseResponsePageQuestionVO**

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

# **updateQuestion**
> BaseResponseBoolean updateQuestion(questionUpdateRequest)


### Example

```typescript
import {
    QuestionControllerApi,
    Configuration,
    QuestionUpdateRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionControllerApi(configuration);

let questionUpdateRequest: QuestionUpdateRequest; //

const { status, data } = await apiInstance.updateQuestion(
    questionUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionUpdateRequest** | **QuestionUpdateRequest**|  | |


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

