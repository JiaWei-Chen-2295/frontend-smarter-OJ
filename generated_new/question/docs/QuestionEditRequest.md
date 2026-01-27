# QuestionEditRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**judgeConfig** | [**JudgeConfig**](JudgeConfig.md) |  | [optional] [default to undefined]
**judgeCase** | [**Array&lt;JudgeCase&gt;**](JudgeCase.md) |  | [optional] [default to undefined]
**answer** | **string** |  | [optional] [default to undefined]
**codeTemplate** | [**CodeTemplate**](CodeTemplate.md) |  | [optional] [default to undefined]

## Example

```typescript
import { QuestionEditRequest } from 'question';

const instance: QuestionEditRequest = {
    id,
    title,
    content,
    tags,
    judgeConfig,
    judgeCase,
    answer,
    codeTemplate,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
