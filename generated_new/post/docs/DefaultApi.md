# DefaultApi

All URIs are relative to *http://172.24.80.1:8204/api/post*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addPost**](#addpost) | **POST** /add | 创建帖子|
|[**deletePost**](#deletepost) | **POST** /delete | 删除帖子|
|[**doPostFavour**](#dopostfavour) | **POST** /favour | 收藏/取消收藏|
|[**doThumb**](#dothumb) | **POST** /thumb | 点赞/取消点赞|
|[**editPost**](#editpost) | **POST** /edit | 编辑帖子|
|[**getById**](#getbyid) | **GET** /inner/get/id | 根据id获取帖子|
|[**getPostVOById**](#getpostvobyid) | **GET** /get/vo | 根据id获取帖子|
|[**listByIds**](#listbyids) | **GET** /inner/list/id | 通过id集合查询帖子集合|
|[**listFavourPostByPage**](#listfavourpostbypage) | **POST** /favour/list/page | 获取用户收藏的帖子列表|
|[**listMyFavourPostByPage**](#listmyfavourpostbypage) | **POST** /favour/my/list/page | 获取我收藏的帖子列表|
|[**listMyPostVOByPage**](#listmypostvobypage) | **POST** /my/list/page/vo | 分页获取我的帖子列表|
|[**listPostByPage**](#listpostbypage) | **POST** /list/page | 分页获取帖子列表（管理员）|
|[**listPostVOByPage**](#listpostvobypage) | **POST** /list/page/vo | 分页获取帖子列表（封装类）|
|[**updatePost**](#updatepost) | **POST** /update | 更新帖子（管理员）|

# **addPost**
> BaseResponseLong addPost(postAddRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PostAddRequest
} from 'post';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let postAddRequest: PostAddRequest; //

const { status, data } = await apiInstance.addPost(
    postAddRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postAddRequest** | **PostAddRequest**|  | |


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

# **deletePost**
> BaseResponseBoolean deletePost(deleteRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DeleteRequest
} from 'post';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let deleteRequest: DeleteRequest; //

const { status, data } = await apiInstance.deletePost(
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

# **doPostFavour**
> BaseResponseInteger doPostFavour(postFavourAddRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PostFavourAddRequest
} from 'post';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let postFavourAddRequest: PostFavourAddRequest; //

const { status, data } = await apiInstance.doPostFavour(
    postFavourAddRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postFavourAddRequest** | **PostFavourAddRequest**|  | |


### Return type

**BaseResponseInteger**

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

# **doThumb**
> BaseResponseInteger doThumb(postThumbAddRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PostThumbAddRequest
} from 'post';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let postThumbAddRequest: PostThumbAddRequest; //

const { status, data } = await apiInstance.doThumb(
    postThumbAddRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postThumbAddRequest** | **PostThumbAddRequest**|  | |


### Return type

**BaseResponseInteger**

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

# **editPost**
> BaseResponseBoolean editPost(postEditRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PostEditRequest
} from 'post';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let postEditRequest: PostEditRequest; //

const { status, data } = await apiInstance.editPost(
    postEditRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postEditRequest** | **PostEditRequest**|  | |


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

# **getById**
> Post getById()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from 'post';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let postId: string; // (default to undefined)

const { status, data } = await apiInstance.getById(
    postId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postId** | [**string**] |  | defaults to undefined|


### Return type

**Post**

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

# **getPostVOById**
> BaseResponsePostVO getPostVOById()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from 'post';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getPostVOById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**BaseResponsePostVO**

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

# **listByIds**
> Array<Post> listByIds()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from 'post';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let idList: Array<string>; // (default to undefined)

const { status, data } = await apiInstance.listByIds(
    idList
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **idList** | **Array&lt;string&gt;** |  | defaults to undefined|


### Return type

**Array<Post>**

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

# **listFavourPostByPage**
> BaseResponsePagePostVO listFavourPostByPage(postFavourQueryRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PostFavourQueryRequest
} from 'post';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let postFavourQueryRequest: PostFavourQueryRequest; //

const { status, data } = await apiInstance.listFavourPostByPage(
    postFavourQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postFavourQueryRequest** | **PostFavourQueryRequest**|  | |


### Return type

**BaseResponsePagePostVO**

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

# **listMyFavourPostByPage**
> BaseResponsePagePostVO listMyFavourPostByPage(postQueryRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PostQueryRequest
} from 'post';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let postQueryRequest: PostQueryRequest; //

const { status, data } = await apiInstance.listMyFavourPostByPage(
    postQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postQueryRequest** | **PostQueryRequest**|  | |


### Return type

**BaseResponsePagePostVO**

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

# **listMyPostVOByPage**
> BaseResponsePagePostVO listMyPostVOByPage(postQueryRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PostQueryRequest
} from 'post';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let postQueryRequest: PostQueryRequest; //

const { status, data } = await apiInstance.listMyPostVOByPage(
    postQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postQueryRequest** | **PostQueryRequest**|  | |


### Return type

**BaseResponsePagePostVO**

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

# **listPostByPage**
> BaseResponsePagePost listPostByPage(postQueryRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PostQueryRequest
} from 'post';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let postQueryRequest: PostQueryRequest; //

const { status, data } = await apiInstance.listPostByPage(
    postQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postQueryRequest** | **PostQueryRequest**|  | |


### Return type

**BaseResponsePagePost**

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

# **listPostVOByPage**
> BaseResponsePagePostVO listPostVOByPage(postQueryRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PostQueryRequest
} from 'post';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let postQueryRequest: PostQueryRequest; //

const { status, data } = await apiInstance.listPostVOByPage(
    postQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postQueryRequest** | **PostQueryRequest**|  | |


### Return type

**BaseResponsePagePostVO**

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

# **updatePost**
> BaseResponseBoolean updatePost(postUpdateRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PostUpdateRequest
} from 'post';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let postUpdateRequest: PostUpdateRequest; //

const { status, data } = await apiInstance.updatePost(
    postUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postUpdateRequest** | **PostUpdateRequest**|  | |


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

