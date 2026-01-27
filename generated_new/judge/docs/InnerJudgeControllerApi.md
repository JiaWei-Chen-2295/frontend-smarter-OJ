# InnerJudgeControllerApi

All URIs are relative to *http://172.19.0.8:8203/api/judge*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**doJudge**](#dojudge) | **POST** /inner/do | |

# **doJudge**
> QuestionSubmitVO doJudge(judgeRequest)


### Example

```typescript
import {
    InnerJudgeControllerApi,
    Configuration,
    JudgeRequest
} from 'judge';

const configuration = new Configuration();
const apiInstance = new InnerJudgeControllerApi(configuration);

let judgeRequest: JudgeRequest; //

const { status, data } = await apiInstance.doJudge(
    judgeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **judgeRequest** | **JudgeRequest**|  | |


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

