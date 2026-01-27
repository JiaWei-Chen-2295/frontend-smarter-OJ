# QuestionQueryRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**current** | **number** |  | [optional] [default to undefined]
**pageSize** | **number** |  | [optional] [default to undefined]
**sortField** | **string** |  | [optional] [default to undefined]
**sortOrder** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**judgeConfig** | [**JudgeConfig**](JudgeConfig.md) |  | [optional] [default to undefined]
**judgeCase** | [**Array&lt;JudgeCase&gt;**](JudgeCase.md) |  | [optional] [default to undefined]
**answer** | **string** |  | [optional] [default to undefined]
**userId** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { QuestionQueryRequest } from 'question';

const instance: QuestionQueryRequest = {
    current,
    pageSize,
    sortField,
    sortOrder,
    id,
    title,
    content,
    tags,
    judgeConfig,
    judgeCase,
    answer,
    userId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
