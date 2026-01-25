# UserControllerApi

All URIs are relative to *http://192.168.254.1:8201/api/user*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addUser**](#adduser) | **POST** /add | |
|[**deleteUser**](#deleteuser) | **POST** /delete | |
|[**getCaptcha**](#getcaptcha) | **POST** /captcha/fetch | |
|[**getLoginUser**](#getloginuser) | **GET** /get/login | |
|[**getUserById**](#getuserbyid) | **GET** /get | |
|[**getUserVOById**](#getuservobyid) | **GET** /get/vo | |
|[**listUserByPage**](#listuserbypage) | **POST** /list/page | |
|[**listUserVOByPage**](#listuservobypage) | **POST** /list/page/vo | |
|[**sendSmsCaptcha**](#sendsmscaptcha) | **POST** /captcha/sms | |
|[**updateMyUser**](#updatemyuser) | **POST** /update/my | |
|[**updateUser**](#updateuser) | **POST** /update | |
|[**userLogin**](#userlogin) | **POST** /login | |
|[**userLoginByPhone**](#userloginbyphone) | **POST** /login/phone | |
|[**userLogout**](#userlogout) | **POST** /logout | |
|[**userRegister**](#userregister) | **POST** /register | |

# **addUser**
> BaseResponseLong addUser(userAddRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    UserAddRequest
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let userAddRequest: UserAddRequest; //

const { status, data } = await apiInstance.addUser(
    userAddRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userAddRequest** | **UserAddRequest**|  | |


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

# **deleteUser**
> BaseResponseBoolean deleteUser(deleteRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    DeleteRequest
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let deleteRequest: DeleteRequest; //

const { status, data } = await apiInstance.deleteUser(
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

# **getCaptcha**
> BaseResponseString getCaptcha()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

const { status, data } = await apiInstance.getCaptcha();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**BaseResponseString**

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

# **getLoginUser**
> BaseResponseLoginUserVO getLoginUser()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

const { status, data } = await apiInstance.getLoginUser();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**BaseResponseLoginUserVO**

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

# **getUserById**
> BaseResponseUser getUserById()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getUserById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**BaseResponseUser**

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

# **getUserVOById**
> BaseResponseUserVO getUserVOById()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getUserVOById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**BaseResponseUserVO**

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

# **listUserByPage**
> BaseResponsePageUser listUserByPage(userQueryRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    UserQueryRequest
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let userQueryRequest: UserQueryRequest; //

const { status, data } = await apiInstance.listUserByPage(
    userQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userQueryRequest** | **UserQueryRequest**|  | |


### Return type

**BaseResponsePageUser**

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

# **listUserVOByPage**
> BaseResponsePageUserVO listUserVOByPage(userQueryRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    UserQueryRequest
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let userQueryRequest: UserQueryRequest; //

const { status, data } = await apiInstance.listUserVOByPage(
    userQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userQueryRequest** | **UserQueryRequest**|  | |


### Return type

**BaseResponsePageUserVO**

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

# **sendSmsCaptcha**
> BaseResponseBoolean sendSmsCaptcha(smsCaptchaRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    SmsCaptchaRequest
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let smsCaptchaRequest: SmsCaptchaRequest; //

const { status, data } = await apiInstance.sendSmsCaptcha(
    smsCaptchaRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **smsCaptchaRequest** | **SmsCaptchaRequest**|  | |


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

# **updateMyUser**
> BaseResponseBoolean updateMyUser(userUpdateMyRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    UserUpdateMyRequest
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let userUpdateMyRequest: UserUpdateMyRequest; //

const { status, data } = await apiInstance.updateMyUser(
    userUpdateMyRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userUpdateMyRequest** | **UserUpdateMyRequest**|  | |


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

# **updateUser**
> BaseResponseBoolean updateUser(userUpdateRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    UserUpdateRequest
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let userUpdateRequest: UserUpdateRequest; //

const { status, data } = await apiInstance.updateUser(
    userUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userUpdateRequest** | **UserUpdateRequest**|  | |


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

# **userLogin**
> BaseResponseLoginUserVO userLogin(userLoginRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    UserLoginRequest
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let userLoginRequest: UserLoginRequest; //

const { status, data } = await apiInstance.userLogin(
    userLoginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userLoginRequest** | **UserLoginRequest**|  | |


### Return type

**BaseResponseLoginUserVO**

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

# **userLoginByPhone**
> BaseResponseLoginUserVO userLoginByPhone(userPhoneLoginRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    UserPhoneLoginRequest
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let userPhoneLoginRequest: UserPhoneLoginRequest; //

const { status, data } = await apiInstance.userLoginByPhone(
    userPhoneLoginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userPhoneLoginRequest** | **UserPhoneLoginRequest**|  | |


### Return type

**BaseResponseLoginUserVO**

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

# **userLogout**
> BaseResponseBoolean userLogout()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

const { status, data } = await apiInstance.userLogout();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**BaseResponseBoolean**

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

# **userRegister**
> BaseResponseLong userRegister(userRegisterRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    UserRegisterRequest
} from 'user';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let userRegisterRequest: UserRegisterRequest; //

const { status, data } = await apiInstance.userRegister(
    userRegisterRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userRegisterRequest** | **UserRegisterRequest**|  | |


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

