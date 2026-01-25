# QuestionSetVO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**questionNum** | **number** |  | [optional] [default to undefined]
**userId** | **string** |  | [optional] [default to undefined]
**favourNum** | **number** |  | [optional] [default to undefined]
**createTime** | **string** |  | [optional] [default to undefined]
**userVO** | [**UserVO**](UserVO.md) |  | [optional] [default to undefined]
**questions** | [**Array&lt;QuestionVO&gt;**](QuestionVO.md) |  | [optional] [default to undefined]

## Example

```typescript
import { QuestionSetVO } from 'question';

const instance: QuestionSetVO = {
    id,
    title,
    description,
    tags,
    questionNum,
    userId,
    favourNum,
    createTime,
    userVO,
    questions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
