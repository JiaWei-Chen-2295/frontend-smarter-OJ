# CaptchaVO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**captchaId** | **string** |  | [optional] [default to undefined]
**projectCode** | **string** |  | [optional] [default to undefined]
**captchaType** | **string** |  | [optional] [default to undefined]
**captchaOriginalPath** | **string** |  | [optional] [default to undefined]
**captchaFontType** | **string** |  | [optional] [default to undefined]
**captchaFontSize** | **number** |  | [optional] [default to undefined]
**secretKey** | **string** |  | [optional] [default to undefined]
**originalImageBase64** | **string** |  | [optional] [default to undefined]
**point** | [**PointVO**](PointVO.md) |  | [optional] [default to undefined]
**jigsawImageBase64** | **string** |  | [optional] [default to undefined]
**wordList** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**pointList** | [**Array&lt;CaptchaVOPointListInner&gt;**](CaptchaVOPointListInner.md) |  | [optional] [default to undefined]
**pointJson** | **string** |  | [optional] [default to undefined]
**token** | **string** |  | [optional] [default to undefined]
**result** | **boolean** |  | [optional] [default to undefined]
**captchaVerification** | **string** |  | [optional] [default to undefined]
**clientUid** | **string** |  | [optional] [default to undefined]
**ts** | **number** |  | [optional] [default to undefined]
**browserInfo** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { CaptchaVO } from 'user';

const instance: CaptchaVO = {
    captchaId,
    projectCode,
    captchaType,
    captchaOriginalPath,
    captchaFontType,
    captchaFontSize,
    secretKey,
    originalImageBase64,
    point,
    jigsawImageBase64,
    wordList,
    pointList,
    pointJson,
    token,
    result,
    captchaVerification,
    clientUid,
    ts,
    browserInfo,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
