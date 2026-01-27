## post@v0

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install post@v0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://172.19.0.7:8204/api/post*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*DefaultApi* | [**addPost**](docs/DefaultApi.md#addpost) | **POST** /add | 创建帖子
*DefaultApi* | [**deletePost**](docs/DefaultApi.md#deletepost) | **POST** /delete | 删除帖子
*DefaultApi* | [**doPostFavour**](docs/DefaultApi.md#dopostfavour) | **POST** /favour | 收藏/取消收藏
*DefaultApi* | [**doThumb**](docs/DefaultApi.md#dothumb) | **POST** /thumb | 点赞/取消点赞
*DefaultApi* | [**editPost**](docs/DefaultApi.md#editpost) | **POST** /edit | 编辑帖子
*DefaultApi* | [**getById**](docs/DefaultApi.md#getbyid) | **GET** /inner/get/id | 根据id获取帖子
*DefaultApi* | [**getPostVOById**](docs/DefaultApi.md#getpostvobyid) | **GET** /get/vo | 根据id获取帖子
*DefaultApi* | [**listByIds**](docs/DefaultApi.md#listbyids) | **GET** /inner/list/id | 通过id集合查询帖子集合
*DefaultApi* | [**listFavourPostByPage**](docs/DefaultApi.md#listfavourpostbypage) | **POST** /favour/list/page | 获取用户收藏的帖子列表
*DefaultApi* | [**listMyFavourPostByPage**](docs/DefaultApi.md#listmyfavourpostbypage) | **POST** /favour/my/list/page | 获取我收藏的帖子列表
*DefaultApi* | [**listMyPostVOByPage**](docs/DefaultApi.md#listmypostvobypage) | **POST** /my/list/page/vo | 分页获取我的帖子列表
*DefaultApi* | [**listPostByPage**](docs/DefaultApi.md#listpostbypage) | **POST** /list/page | 分页获取帖子列表（管理员）
*DefaultApi* | [**listPostVOByPage**](docs/DefaultApi.md#listpostvobypage) | **POST** /list/page/vo | 分页获取帖子列表（封装类）
*DefaultApi* | [**updatePost**](docs/DefaultApi.md#updatepost) | **POST** /update | 更新帖子（管理员）


### Documentation For Models

 - [BaseResponseBoolean](docs/BaseResponseBoolean.md)
 - [BaseResponseInteger](docs/BaseResponseInteger.md)
 - [BaseResponseLong](docs/BaseResponseLong.md)
 - [BaseResponsePagePost](docs/BaseResponsePagePost.md)
 - [BaseResponsePagePostVO](docs/BaseResponsePagePostVO.md)
 - [BaseResponsePostVO](docs/BaseResponsePostVO.md)
 - [DeleteRequest](docs/DeleteRequest.md)
 - [OrderItem](docs/OrderItem.md)
 - [PagePost](docs/PagePost.md)
 - [PagePostVO](docs/PagePostVO.md)
 - [Post](docs/Post.md)
 - [PostAddRequest](docs/PostAddRequest.md)
 - [PostEditRequest](docs/PostEditRequest.md)
 - [PostFavourAddRequest](docs/PostFavourAddRequest.md)
 - [PostFavourQueryRequest](docs/PostFavourQueryRequest.md)
 - [PostQueryRequest](docs/PostQueryRequest.md)
 - [PostThumbAddRequest](docs/PostThumbAddRequest.md)
 - [PostUpdateRequest](docs/PostUpdateRequest.md)
 - [PostVO](docs/PostVO.md)
 - [UserVO](docs/UserVO.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization

Endpoints do not require authorization.

