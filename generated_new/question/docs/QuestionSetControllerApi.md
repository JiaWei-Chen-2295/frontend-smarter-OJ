# QuestionSetControllerApi

All URIs are relative to *http://192.168.254.1:8202/api/question*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addQuestionSet**](#addquestionset) | **POST** /questionSet/add | |
|[**addQuestionToSet**](#addquestiontoset) | **POST** /questionSet/item/add | |
|[**deleteQuestionSet**](#deletequestionset) | **POST** /questionSet/delete | |
|[**editQuestionSet**](#editquestionset) | **POST** /questionSet/edit | |
|[**getQuestionSetById**](#getquestionsetbyid) | **GET** /questionSet/get | |
|[**getQuestionSetVOById**](#getquestionsetvobyid) | **GET** /questionSet/get/vo | |
|[**listMyQuestionSetVOByPage**](#listmyquestionsetvobypage) | **POST** /questionSet/my/list/page/vo | |
|[**listQuestionSetByPage**](#listquestionsetbypage) | **POST** /questionSet/list/page | |
|[**listQuestionSetVOByPage**](#listquestionsetvobypage) | **POST** /questionSet/list/page/vo | |
|[**redirectDocHtml**](#redirectdochtml) | **GET** /questionSet/doc.html | |
|[**redirectOpenApiDocs**](#redirectopenapidocs) | **GET** /questionSet/v3/api-docs | |
|[**removeQuestionFromSet**](#removequestionfromset) | **POST** /questionSet/item/remove | |
|[**updateQuestionSet**](#updatequestionset) | **POST** /questionSet/update | |

# **addQuestionSet**
> BaseResponseLong addQuestionSet(questionSetAddRequest)


### Example

```typescript
import {
    QuestionSetControllerApi,
    Configuration,
    QuestionSetAddRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionSetControllerApi(configuration);

let questionSetAddRequest: QuestionSetAddRequest; //

const { status, data } = await apiInstance.addQuestionSet(
    questionSetAddRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionSetAddRequest** | **QuestionSetAddRequest**|  | |


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

# **addQuestionToSet**
> BaseResponseBoolean addQuestionToSet(questionSetItemAddRequest)


### Example

```typescript
import {
    QuestionSetControllerApi,
    Configuration,
    QuestionSetItemAddRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionSetControllerApi(configuration);

let questionSetItemAddRequest: QuestionSetItemAddRequest; //

const { status, data } = await apiInstance.addQuestionToSet(
    questionSetItemAddRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionSetItemAddRequest** | **QuestionSetItemAddRequest**|  | |


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

# **deleteQuestionSet**
> BaseResponseBoolean deleteQuestionSet(deleteRequest)


### Example

```typescript
import {
    QuestionSetControllerApi,
    Configuration,
    DeleteRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionSetControllerApi(configuration);

let deleteRequest: DeleteRequest; //

const { status, data } = await apiInstance.deleteQuestionSet(
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

# **editQuestionSet**
> BaseResponseBoolean editQuestionSet(questionSetEditRequest)


### Example

```typescript
import {
    QuestionSetControllerApi,
    Configuration,
    QuestionSetEditRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionSetControllerApi(configuration);

let questionSetEditRequest: QuestionSetEditRequest; //

const { status, data } = await apiInstance.editQuestionSet(
    questionSetEditRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionSetEditRequest** | **QuestionSetEditRequest**|  | |


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

# **getQuestionSetById**
> BaseResponseQuestionSet getQuestionSetById()


### Example

```typescript
import {
    QuestionSetControllerApi,
    Configuration
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionSetControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getQuestionSetById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**BaseResponseQuestionSet**

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

# **getQuestionSetVOById**
> BaseResponseQuestionSetVO getQuestionSetVOById()


### Example

```typescript
import {
    QuestionSetControllerApi,
    Configuration
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionSetControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getQuestionSetVOById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**BaseResponseQuestionSetVO**

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

# **listMyQuestionSetVOByPage**
> BaseResponsePageQuestionSetVO listMyQuestionSetVOByPage(questionSetQueryRequest)


### Example

```typescript
import {
    QuestionSetControllerApi,
    Configuration,
    QuestionSetQueryRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionSetControllerApi(configuration);

let questionSetQueryRequest: QuestionSetQueryRequest; //

const { status, data } = await apiInstance.listMyQuestionSetVOByPage(
    questionSetQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionSetQueryRequest** | **QuestionSetQueryRequest**|  | |


### Return type

**BaseResponsePageQuestionSetVO**

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

# **listQuestionSetByPage**
> BaseResponsePageQuestionSet listQuestionSetByPage(questionSetQueryRequest)


### Example

```typescript
import {
    QuestionSetControllerApi,
    Configuration,
    QuestionSetQueryRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionSetControllerApi(configuration);

let questionSetQueryRequest: QuestionSetQueryRequest; //

const { status, data } = await apiInstance.listQuestionSetByPage(
    questionSetQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionSetQueryRequest** | **QuestionSetQueryRequest**|  | |


### Return type

**BaseResponsePageQuestionSet**

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

# **listQuestionSetVOByPage**
> BaseResponsePageQuestionSetVO listQuestionSetVOByPage(questionSetQueryRequest)


### Example

```typescript
import {
    QuestionSetControllerApi,
    Configuration,
    QuestionSetQueryRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionSetControllerApi(configuration);

let questionSetQueryRequest: QuestionSetQueryRequest; //

const { status, data } = await apiInstance.listQuestionSetVOByPage(
    questionSetQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionSetQueryRequest** | **QuestionSetQueryRequest**|  | |


### Return type

**BaseResponsePageQuestionSetVO**

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

# **redirectDocHtml**
> redirectDocHtml()


### Example

```typescript
import {
    QuestionSetControllerApi,
    Configuration
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionSetControllerApi(configuration);

const { status, data } = await apiInstance.redirectDocHtml();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **redirectOpenApiDocs**
> redirectOpenApiDocs()


### Example

```typescript
import {
    QuestionSetControllerApi,
    Configuration
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionSetControllerApi(configuration);

const { status, data } = await apiInstance.redirectOpenApiDocs();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **removeQuestionFromSet**
> BaseResponseBoolean removeQuestionFromSet(questionSetItemRemoveRequest)


### Example

```typescript
import {
    QuestionSetControllerApi,
    Configuration,
    QuestionSetItemRemoveRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionSetControllerApi(configuration);

let questionSetItemRemoveRequest: QuestionSetItemRemoveRequest; //

const { status, data } = await apiInstance.removeQuestionFromSet(
    questionSetItemRemoveRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionSetItemRemoveRequest** | **QuestionSetItemRemoveRequest**|  | |


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

# **updateQuestionSet**
> BaseResponseBoolean updateQuestionSet(questionSetUpdateRequest)


### Example

```typescript
import {
    QuestionSetControllerApi,
    Configuration,
    QuestionSetUpdateRequest
} from 'question';

const configuration = new Configuration();
const apiInstance = new QuestionSetControllerApi(configuration);

let questionSetUpdateRequest: QuestionSetUpdateRequest; //

const { status, data } = await apiInstance.updateQuestionSet(
    questionSetUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **questionSetUpdateRequest** | **QuestionSetUpdateRequest**|  | |


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

