# RoomVO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**mateNum** | **number** |  | [optional] [default to undefined]
**userId** | **string** |  | [optional] [default to undefined]
**status** | **number** |  | [optional] [default to undefined]
**createTime** | **string** |  | [optional] [default to undefined]
**currentNum** | **number** |  | [optional] [default to undefined]
**userVO** | [**UserVO**](UserVO.md) |  | [optional] [default to undefined]
**members** | [**Array&lt;RoomMemberVO&gt;**](RoomMemberVO.md) |  | [optional] [default to undefined]

## Example

```typescript
import { RoomVO } from 'room';

const instance: RoomVO = {
    id,
    name,
    description,
    mateNum,
    userId,
    status,
    createTime,
    currentNum,
    userVO,
    members,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
