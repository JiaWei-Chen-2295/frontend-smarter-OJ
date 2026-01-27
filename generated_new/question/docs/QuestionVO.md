# QuestionVO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**submitNum** | **number** |  | [optional] [default to undefined]
**acceptedNum** | **number** |  | [optional] [default to undefined]
**judgeConfig** | [**JudgeConfig**](JudgeConfig.md) |  | [optional] [default to undefined]
**favourNum** | **number** |  | [optional] [default to undefined]
**codeTemplate** | [**CodeTemplate**](CodeTemplate.md) |  | [optional] [default to undefined]
**userId** | **string** |  | [optional] [default to undefined]
**createTime** | **string** |  | [optional] [default to undefined]
**userVO** | [**UserVO**](UserVO.md) |  | [optional] [default to undefined]

## Example

```typescript
import { QuestionVO } from 'question';

const instance: QuestionVO = {
    id,
    title,
    content,
    tags,
    submitNum,
    acceptedNum,
    judgeConfig,
    favourNum,
    codeTemplate,
    userId,
    createTime,
    userVO,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
