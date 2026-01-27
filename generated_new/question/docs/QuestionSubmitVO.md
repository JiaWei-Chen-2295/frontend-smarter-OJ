# QuestionSubmitVO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**questionId** | **string** |  | [optional] [default to undefined]
**userId** | **string** |  | [optional] [default to undefined]
**language** | **string** |  | [optional] [default to undefined]
**code** | **string** |  | [optional] [default to undefined]
**status** | **number** |  | [optional] [default to undefined]
**judgeInfo** | [**JudgeInfo**](JudgeInfo.md) |  | [optional] [default to undefined]
**userVO** | [**UserVO**](UserVO.md) |  | [optional] [default to undefined]
**questionVO** | [**QuestionVO**](QuestionVO.md) |  | [optional] [default to undefined]
**outputResult** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { QuestionSubmitVO } from 'question';

const instance: QuestionSubmitVO = {
    id,
    questionId,
    userId,
    language,
    code,
    status,
    judgeInfo,
    userVO,
    questionVO,
    outputResult,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
