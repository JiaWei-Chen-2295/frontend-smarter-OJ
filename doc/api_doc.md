# 接口文档


**简介**:接口文档


**HOST**:localhost:82


**联系人**:


**Version**:1.0


**接口路径**:/v2/api-docs


[TOC]






# file-controller


## uploadFile


**接口地址**:`/api/file/upload`


**请求方式**:`POST`


**请求数据类型**:`multipart/form-data`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|file|file|formData|true|file||
|biz||query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«string»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": "",
	"message": ""
}
```


# post-controller


## addPost


**接口地址**:`/api/post/add`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "content": "",
  "tags": [],
  "title": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|postAddRequest|postAddRequest|body|true|PostAddRequest|PostAddRequest|
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«long»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||integer(int64)|integer(int64)|
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"message": ""
}
```


## deletePost


**接口地址**:`/api/post/delete`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|deleteRequest|deleteRequest|body|true|DeleteRequest|DeleteRequest|
|&emsp;&emsp;id|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## editPost


**接口地址**:`/api/post/edit`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "content": "",
  "id": 0,
  "tags": [],
  "title": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|postEditRequest|postEditRequest|body|true|PostEditRequest|PostEditRequest|
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## getPostVOById


**接口地址**:`/api/post/get/vo`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|id|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«PostVO»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||PostVO|PostVO|
|&emsp;&emsp;content||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;favourNum||integer(int32)||
|&emsp;&emsp;hasFavour||boolean||
|&emsp;&emsp;hasThumb||boolean||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;tagList||array|string|
|&emsp;&emsp;thumbNum||integer(int32)||
|&emsp;&emsp;title||string||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;user||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;userId||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"content": "",
		"createTime": "",
		"favourNum": 0,
		"hasFavour": true,
		"hasThumb": true,
		"id": 0,
		"tagList": [],
		"thumbNum": 0,
		"title": "",
		"updateTime": "",
		"user": {
			"createTime": "",
			"id": 0,
			"userAvatar": "",
			"userName": "",
			"userProfile": "",
			"userRole": ""
		},
		"userId": 0
	},
	"message": ""
}
```


## listPostByPage


**接口地址**:`/api/post/list/page`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "content": "",
  "current": 0,
  "favourUserId": 0,
  "id": 0,
  "notId": 0,
  "orTags": [],
  "pageSize": 0,
  "searchText": "",
  "sortField": "",
  "sortOrder": "",
  "tags": [],
  "title": "",
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|postQueryRequest|postQueryRequest|body|true|PostQueryRequest|PostQueryRequest|
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;favourUserId|||false|integer(int64)||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;notId|||false|integer(int64)||
|&emsp;&emsp;orTags|||false|array|string|
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;searchText|||false|string||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«Post»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«Post»|Page«Post»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|Post|
|&emsp;&emsp;&emsp;&emsp;content||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;favourNum||integer||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;isDelete||integer||
|&emsp;&emsp;&emsp;&emsp;tags||string||
|&emsp;&emsp;&emsp;&emsp;thumbNum||integer||
|&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"content": "",
				"createTime": "",
				"favourNum": 0,
				"id": 0,
				"isDelete": 0,
				"tags": "",
				"thumbNum": 0,
				"title": "",
				"updateTime": "",
				"userId": 0
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## listPostVOByPage


**接口地址**:`/api/post/list/page/vo`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "content": "",
  "current": 0,
  "favourUserId": 0,
  "id": 0,
  "notId": 0,
  "orTags": [],
  "pageSize": 0,
  "searchText": "",
  "sortField": "",
  "sortOrder": "",
  "tags": [],
  "title": "",
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|postQueryRequest|postQueryRequest|body|true|PostQueryRequest|PostQueryRequest|
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;favourUserId|||false|integer(int64)||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;notId|||false|integer(int64)||
|&emsp;&emsp;orTags|||false|array|string|
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;searchText|||false|string||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«PostVO»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«PostVO»|Page«PostVO»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|PostVO|
|&emsp;&emsp;&emsp;&emsp;content||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;favourNum||integer||
|&emsp;&emsp;&emsp;&emsp;hasFavour||boolean||
|&emsp;&emsp;&emsp;&emsp;hasThumb||boolean||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;tagList||array|string|
|&emsp;&emsp;&emsp;&emsp;thumbNum||integer||
|&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;user||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"content": "",
				"createTime": "",
				"favourNum": 0,
				"hasFavour": true,
				"hasThumb": true,
				"id": 0,
				"tagList": [],
				"thumbNum": 0,
				"title": "",
				"updateTime": "",
				"user": {
					"createTime": "",
					"id": 0,
					"userAvatar": "",
					"userName": "",
					"userProfile": "",
					"userRole": ""
				},
				"userId": 0
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## listMyPostVOByPage


**接口地址**:`/api/post/my/list/page/vo`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "content": "",
  "current": 0,
  "favourUserId": 0,
  "id": 0,
  "notId": 0,
  "orTags": [],
  "pageSize": 0,
  "searchText": "",
  "sortField": "",
  "sortOrder": "",
  "tags": [],
  "title": "",
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|postQueryRequest|postQueryRequest|body|true|PostQueryRequest|PostQueryRequest|
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;favourUserId|||false|integer(int64)||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;notId|||false|integer(int64)||
|&emsp;&emsp;orTags|||false|array|string|
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;searchText|||false|string||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«PostVO»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«PostVO»|Page«PostVO»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|PostVO|
|&emsp;&emsp;&emsp;&emsp;content||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;favourNum||integer||
|&emsp;&emsp;&emsp;&emsp;hasFavour||boolean||
|&emsp;&emsp;&emsp;&emsp;hasThumb||boolean||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;tagList||array|string|
|&emsp;&emsp;&emsp;&emsp;thumbNum||integer||
|&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;user||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"content": "",
				"createTime": "",
				"favourNum": 0,
				"hasFavour": true,
				"hasThumb": true,
				"id": 0,
				"tagList": [],
				"thumbNum": 0,
				"title": "",
				"updateTime": "",
				"user": {
					"createTime": "",
					"id": 0,
					"userAvatar": "",
					"userName": "",
					"userProfile": "",
					"userRole": ""
				},
				"userId": 0
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## searchPostVOByPage


**接口地址**:`/api/post/search/page/vo`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "content": "",
  "current": 0,
  "favourUserId": 0,
  "id": 0,
  "notId": 0,
  "orTags": [],
  "pageSize": 0,
  "searchText": "",
  "sortField": "",
  "sortOrder": "",
  "tags": [],
  "title": "",
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|postQueryRequest|postQueryRequest|body|true|PostQueryRequest|PostQueryRequest|
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;favourUserId|||false|integer(int64)||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;notId|||false|integer(int64)||
|&emsp;&emsp;orTags|||false|array|string|
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;searchText|||false|string||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«PostVO»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«PostVO»|Page«PostVO»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|PostVO|
|&emsp;&emsp;&emsp;&emsp;content||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;favourNum||integer||
|&emsp;&emsp;&emsp;&emsp;hasFavour||boolean||
|&emsp;&emsp;&emsp;&emsp;hasThumb||boolean||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;tagList||array|string|
|&emsp;&emsp;&emsp;&emsp;thumbNum||integer||
|&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;user||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"content": "",
				"createTime": "",
				"favourNum": 0,
				"hasFavour": true,
				"hasThumb": true,
				"id": 0,
				"tagList": [],
				"thumbNum": 0,
				"title": "",
				"updateTime": "",
				"user": {
					"createTime": "",
					"id": 0,
					"userAvatar": "",
					"userName": "",
					"userProfile": "",
					"userRole": ""
				},
				"userId": 0
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## updatePost


**接口地址**:`/api/post/update`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "content": "",
  "id": 0,
  "tags": [],
  "title": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|postUpdateRequest|postUpdateRequest|body|true|PostUpdateRequest|PostUpdateRequest|
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


# post-favour-controller


## doPostFavour


**接口地址**:`/api/post_favour/`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "postId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|postFavourAddRequest|postFavourAddRequest|body|true|PostFavourAddRequest|PostFavourAddRequest|
|&emsp;&emsp;postId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«int»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||integer(int32)|integer(int32)|
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"message": ""
}
```


## listFavourPostByPage


**接口地址**:`/api/post_favour/list/page`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "current": 0,
  "pageSize": 0,
  "postQueryRequest": {
    "content": "",
    "current": 0,
    "favourUserId": 0,
    "id": 0,
    "notId": 0,
    "orTags": [],
    "pageSize": 0,
    "searchText": "",
    "sortField": "",
    "sortOrder": "",
    "tags": [],
    "title": "",
    "userId": 0
  },
  "sortField": "",
  "sortOrder": "",
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|postFavourQueryRequest|postFavourQueryRequest|body|true|PostFavourQueryRequest|PostFavourQueryRequest|
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;postQueryRequest|||false|PostQueryRequest|PostQueryRequest|
|&emsp;&emsp;&emsp;&emsp;content|||false|string||
|&emsp;&emsp;&emsp;&emsp;current|||false|integer||
|&emsp;&emsp;&emsp;&emsp;favourUserId|||false|integer||
|&emsp;&emsp;&emsp;&emsp;id|||false|integer||
|&emsp;&emsp;&emsp;&emsp;notId|||false|integer||
|&emsp;&emsp;&emsp;&emsp;orTags|||false|array|string|
|&emsp;&emsp;&emsp;&emsp;pageSize|||false|integer||
|&emsp;&emsp;&emsp;&emsp;searchText|||false|string||
|&emsp;&emsp;&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;&emsp;&emsp;title|||false|string||
|&emsp;&emsp;&emsp;&emsp;userId|||false|integer||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«PostVO»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«PostVO»|Page«PostVO»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|PostVO|
|&emsp;&emsp;&emsp;&emsp;content||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;favourNum||integer||
|&emsp;&emsp;&emsp;&emsp;hasFavour||boolean||
|&emsp;&emsp;&emsp;&emsp;hasThumb||boolean||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;tagList||array|string|
|&emsp;&emsp;&emsp;&emsp;thumbNum||integer||
|&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;user||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"content": "",
				"createTime": "",
				"favourNum": 0,
				"hasFavour": true,
				"hasThumb": true,
				"id": 0,
				"tagList": [],
				"thumbNum": 0,
				"title": "",
				"updateTime": "",
				"user": {
					"createTime": "",
					"id": 0,
					"userAvatar": "",
					"userName": "",
					"userProfile": "",
					"userRole": ""
				},
				"userId": 0
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## listMyFavourPostByPage


**接口地址**:`/api/post_favour/my/list/page`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "content": "",
  "current": 0,
  "favourUserId": 0,
  "id": 0,
  "notId": 0,
  "orTags": [],
  "pageSize": 0,
  "searchText": "",
  "sortField": "",
  "sortOrder": "",
  "tags": [],
  "title": "",
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|postQueryRequest|postQueryRequest|body|true|PostQueryRequest|PostQueryRequest|
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;favourUserId|||false|integer(int64)||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;notId|||false|integer(int64)||
|&emsp;&emsp;orTags|||false|array|string|
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;searchText|||false|string||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«PostVO»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«PostVO»|Page«PostVO»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|PostVO|
|&emsp;&emsp;&emsp;&emsp;content||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;favourNum||integer||
|&emsp;&emsp;&emsp;&emsp;hasFavour||boolean||
|&emsp;&emsp;&emsp;&emsp;hasThumb||boolean||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;tagList||array|string|
|&emsp;&emsp;&emsp;&emsp;thumbNum||integer||
|&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;user||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"content": "",
				"createTime": "",
				"favourNum": 0,
				"hasFavour": true,
				"hasThumb": true,
				"id": 0,
				"tagList": [],
				"thumbNum": 0,
				"title": "",
				"updateTime": "",
				"user": {
					"createTime": "",
					"id": 0,
					"userAvatar": "",
					"userName": "",
					"userProfile": "",
					"userRole": ""
				},
				"userId": 0
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


# post-thumb-controller


## doThumb


**接口地址**:`/api/post_thumb/`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "postId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|postThumbAddRequest|postThumbAddRequest|body|true|PostThumbAddRequest|PostThumbAddRequest|
|&emsp;&emsp;postId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«int»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||integer(int32)|integer(int32)|
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"message": ""
}
```


# question-controller


## listQuestionSubmitByPage


**接口地址**:`/api/question`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "current": 0,
  "language": "",
  "pageSize": 0,
  "questionId": 0,
  "sortField": "",
  "sortOrder": "",
  "status": 0,
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|questionSubmitQueryRequest|questionSubmitQueryRequest|body|true|QuestionSubmitQueryRequest|QuestionSubmitQueryRequest|
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;language|||false|string||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;questionId|||false|integer(int64)||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«QuestionSubmitVO»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«QuestionSubmitVO»|Page«QuestionSubmitVO»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|QuestionSubmitVO|
|&emsp;&emsp;&emsp;&emsp;code||string||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;judgeInfo||JudgeInfo|JudgeInfo|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;memory||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;message||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;time||integer||
|&emsp;&emsp;&emsp;&emsp;language||string||
|&emsp;&emsp;&emsp;&emsp;outputResult||string||
|&emsp;&emsp;&emsp;&emsp;questionId||integer||
|&emsp;&emsp;&emsp;&emsp;questionVO||QuestionVO|QuestionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;acceptedNum||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;content||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;favourNum||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;judgeConfig||JudgeConfig|JudgeConfig|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;memoryLimit||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;stackLimit||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;timeLimit||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;submitNum||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tags||array|string|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userVO||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;&emsp;&emsp;status||integer||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;userVO||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"code": "",
				"id": 0,
				"judgeInfo": {
					"memory": 0,
					"message": "",
					"time": 0
				},
				"language": "",
				"outputResult": "",
				"questionId": 0,
				"questionVO": {
					"acceptedNum": 0,
					"content": "",
					"createTime": "",
					"favourNum": 0,
					"id": 0,
					"judgeConfig": {
						"memoryLimit": 0,
						"stackLimit": 0,
						"timeLimit": 0
					},
					"submitNum": 0,
					"tags": [],
					"title": "",
					"userId": 0,
					"userVO": {
						"createTime": "",
						"id": 0,
						"userAvatar": "",
						"userName": "",
						"userProfile": "",
						"userRole": ""
					}
				},
				"status": 0,
				"userId": 0,
				"userVO": {
					"createTime": "",
					"id": 0,
					"userAvatar": "",
					"userName": "",
					"userProfile": "",
					"userRole": ""
				}
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## addQuestion


**接口地址**:`/api/question/add`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "answer": "",
  "content": "",
  "judgeCase": [
    {
      "input": "",
      "output": ""
    }
  ],
  "judgeConfig": {
    "memoryLimit": 0,
    "stackLimit": 0,
    "timeLimit": 0
  },
  "tags": [],
  "title": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|questionAddRequest|questionAddRequest|body|true|QuestionAddRequest|QuestionAddRequest|
|&emsp;&emsp;answer|||false|string||
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;judgeCase|||false|array|JudgeCase|
|&emsp;&emsp;&emsp;&emsp;input|||false|string||
|&emsp;&emsp;&emsp;&emsp;output|||false|string||
|&emsp;&emsp;judgeConfig|||false|JudgeConfig|JudgeConfig|
|&emsp;&emsp;&emsp;&emsp;memoryLimit|||false|integer||
|&emsp;&emsp;&emsp;&emsp;stackLimit|||false|integer||
|&emsp;&emsp;&emsp;&emsp;timeLimit|||false|integer||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«long»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||integer(int64)|integer(int64)|
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"message": ""
}
```


## deleteQuestion


**接口地址**:`/api/question/delete`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|deleteRequest|deleteRequest|body|true|DeleteRequest|DeleteRequest|
|&emsp;&emsp;id|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## editQuestion


**接口地址**:`/api/question/edit`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "answer": "",
  "content": "",
  "id": 0,
  "judgeCase": [
    {
      "input": "",
      "output": ""
    }
  ],
  "judgeConfig": {
    "memoryLimit": 0,
    "stackLimit": 0,
    "timeLimit": 0
  },
  "tags": [],
  "title": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|questionEditRequest|questionEditRequest|body|true|QuestionEditRequest|QuestionEditRequest|
|&emsp;&emsp;answer|||false|string||
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;judgeCase|||false|array|JudgeCase|
|&emsp;&emsp;&emsp;&emsp;input|||false|string||
|&emsp;&emsp;&emsp;&emsp;output|||false|string||
|&emsp;&emsp;judgeConfig|||false|JudgeConfig|JudgeConfig|
|&emsp;&emsp;&emsp;&emsp;memoryLimit|||false|integer||
|&emsp;&emsp;&emsp;&emsp;stackLimit|||false|integer||
|&emsp;&emsp;&emsp;&emsp;timeLimit|||false|integer||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## getQuestionById


**接口地址**:`/api/question/get/all`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|id|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Question»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Question|Question|
|&emsp;&emsp;acceptedNum||integer(int32)||
|&emsp;&emsp;answer||string||
|&emsp;&emsp;content||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;favourNum||integer(int32)||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;isDelete||integer(int32)||
|&emsp;&emsp;judgeCase||string||
|&emsp;&emsp;judgeConfig||string||
|&emsp;&emsp;submitNum||integer(int32)||
|&emsp;&emsp;tags||string||
|&emsp;&emsp;title||string||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;userId||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"acceptedNum": 0,
		"answer": "",
		"content": "",
		"createTime": "",
		"favourNum": 0,
		"id": 0,
		"isDelete": 0,
		"judgeCase": "",
		"judgeConfig": "",
		"submitNum": 0,
		"tags": "",
		"title": "",
		"updateTime": "",
		"userId": 0
	},
	"message": ""
}
```


## getQuestionVOById


**接口地址**:`/api/question/get/vo`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|id|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«QuestionVO»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||QuestionVO|QuestionVO|
|&emsp;&emsp;acceptedNum||integer(int32)||
|&emsp;&emsp;content||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;favourNum||integer(int32)||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;judgeConfig||JudgeConfig|JudgeConfig|
|&emsp;&emsp;&emsp;&emsp;memoryLimit||integer||
|&emsp;&emsp;&emsp;&emsp;stackLimit||integer||
|&emsp;&emsp;&emsp;&emsp;timeLimit||integer||
|&emsp;&emsp;submitNum||integer(int32)||
|&emsp;&emsp;tags||array|string|
|&emsp;&emsp;title||string||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;userVO||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;userRole||string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"acceptedNum": 0,
		"content": "",
		"createTime": "",
		"favourNum": 0,
		"id": 0,
		"judgeConfig": {
			"memoryLimit": 0,
			"stackLimit": 0,
			"timeLimit": 0
		},
		"submitNum": 0,
		"tags": [],
		"title": "",
		"userId": 0,
		"userVO": {
			"createTime": "",
			"id": 0,
			"userAvatar": "",
			"userName": "",
			"userProfile": "",
			"userRole": ""
		}
	},
	"message": ""
}
```


## getQuestionList


**接口地址**:`/api/question/list/admin-page`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "answer": "",
  "content": "",
  "current": 0,
  "id": 0,
  "judgeCase": [
    {
      "input": "",
      "output": ""
    }
  ],
  "judgeConfig": {
    "memoryLimit": 0,
    "stackLimit": 0,
    "timeLimit": 0
  },
  "pageSize": 0,
  "sortField": "",
  "sortOrder": "",
  "tags": [],
  "title": "",
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|questionQueryRequest|questionQueryRequest|body|true|QuestionQueryRequest|QuestionQueryRequest|
|&emsp;&emsp;answer|||false|string||
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;judgeCase|||false|array|JudgeCase|
|&emsp;&emsp;&emsp;&emsp;input|||false|string||
|&emsp;&emsp;&emsp;&emsp;output|||false|string||
|&emsp;&emsp;judgeConfig|||false|JudgeConfig|JudgeConfig|
|&emsp;&emsp;&emsp;&emsp;memoryLimit|||false|integer||
|&emsp;&emsp;&emsp;&emsp;stackLimit|||false|integer||
|&emsp;&emsp;&emsp;&emsp;timeLimit|||false|integer||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«Question»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«Question»|Page«Question»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|Question|
|&emsp;&emsp;&emsp;&emsp;acceptedNum||integer||
|&emsp;&emsp;&emsp;&emsp;answer||string||
|&emsp;&emsp;&emsp;&emsp;content||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;favourNum||integer||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;isDelete||integer||
|&emsp;&emsp;&emsp;&emsp;judgeCase||string||
|&emsp;&emsp;&emsp;&emsp;judgeConfig||string||
|&emsp;&emsp;&emsp;&emsp;submitNum||integer||
|&emsp;&emsp;&emsp;&emsp;tags||string||
|&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"acceptedNum": 0,
				"answer": "",
				"content": "",
				"createTime": "",
				"favourNum": 0,
				"id": 0,
				"isDelete": 0,
				"judgeCase": "",
				"judgeConfig": "",
				"submitNum": 0,
				"tags": "",
				"title": "",
				"updateTime": "",
				"userId": 0
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## listQuestionByPage


**接口地址**:`/api/question/list/page`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "answer": "",
  "content": "",
  "current": 0,
  "id": 0,
  "judgeCase": [
    {
      "input": "",
      "output": ""
    }
  ],
  "judgeConfig": {
    "memoryLimit": 0,
    "stackLimit": 0,
    "timeLimit": 0
  },
  "pageSize": 0,
  "sortField": "",
  "sortOrder": "",
  "tags": [],
  "title": "",
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|questionQueryRequest|questionQueryRequest|body|true|QuestionQueryRequest|QuestionQueryRequest|
|&emsp;&emsp;answer|||false|string||
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;judgeCase|||false|array|JudgeCase|
|&emsp;&emsp;&emsp;&emsp;input|||false|string||
|&emsp;&emsp;&emsp;&emsp;output|||false|string||
|&emsp;&emsp;judgeConfig|||false|JudgeConfig|JudgeConfig|
|&emsp;&emsp;&emsp;&emsp;memoryLimit|||false|integer||
|&emsp;&emsp;&emsp;&emsp;stackLimit|||false|integer||
|&emsp;&emsp;&emsp;&emsp;timeLimit|||false|integer||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«Question»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«Question»|Page«Question»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|Question|
|&emsp;&emsp;&emsp;&emsp;acceptedNum||integer||
|&emsp;&emsp;&emsp;&emsp;answer||string||
|&emsp;&emsp;&emsp;&emsp;content||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;favourNum||integer||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;isDelete||integer||
|&emsp;&emsp;&emsp;&emsp;judgeCase||string||
|&emsp;&emsp;&emsp;&emsp;judgeConfig||string||
|&emsp;&emsp;&emsp;&emsp;submitNum||integer||
|&emsp;&emsp;&emsp;&emsp;tags||string||
|&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"acceptedNum": 0,
				"answer": "",
				"content": "",
				"createTime": "",
				"favourNum": 0,
				"id": 0,
				"isDelete": 0,
				"judgeCase": "",
				"judgeConfig": "",
				"submitNum": 0,
				"tags": "",
				"title": "",
				"updateTime": "",
				"userId": 0
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## listQuestionVOByPage


**接口地址**:`/api/question/list/page/vo`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "answer": "",
  "content": "",
  "current": 0,
  "id": 0,
  "judgeCase": [
    {
      "input": "",
      "output": ""
    }
  ],
  "judgeConfig": {
    "memoryLimit": 0,
    "stackLimit": 0,
    "timeLimit": 0
  },
  "pageSize": 0,
  "sortField": "",
  "sortOrder": "",
  "tags": [],
  "title": "",
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|questionQueryRequest|questionQueryRequest|body|true|QuestionQueryRequest|QuestionQueryRequest|
|&emsp;&emsp;answer|||false|string||
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;judgeCase|||false|array|JudgeCase|
|&emsp;&emsp;&emsp;&emsp;input|||false|string||
|&emsp;&emsp;&emsp;&emsp;output|||false|string||
|&emsp;&emsp;judgeConfig|||false|JudgeConfig|JudgeConfig|
|&emsp;&emsp;&emsp;&emsp;memoryLimit|||false|integer||
|&emsp;&emsp;&emsp;&emsp;stackLimit|||false|integer||
|&emsp;&emsp;&emsp;&emsp;timeLimit|||false|integer||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«QuestionVO»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«QuestionVO»|Page«QuestionVO»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|QuestionVO|
|&emsp;&emsp;&emsp;&emsp;acceptedNum||integer||
|&emsp;&emsp;&emsp;&emsp;content||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;favourNum||integer||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;judgeConfig||JudgeConfig|JudgeConfig|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;memoryLimit||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;stackLimit||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;timeLimit||integer||
|&emsp;&emsp;&emsp;&emsp;submitNum||integer||
|&emsp;&emsp;&emsp;&emsp;tags||array|string|
|&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;userVO||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"acceptedNum": 0,
				"content": "",
				"createTime": "",
				"favourNum": 0,
				"id": 0,
				"judgeConfig": {
					"memoryLimit": 0,
					"stackLimit": 0,
					"timeLimit": 0
				},
				"submitNum": 0,
				"tags": [],
				"title": "",
				"userId": 0,
				"userVO": {
					"createTime": "",
					"id": 0,
					"userAvatar": "",
					"userName": "",
					"userProfile": "",
					"userRole": ""
				}
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## listMyQuestionVOByPage


**接口地址**:`/api/question/my/list/page/vo`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "answer": "",
  "content": "",
  "current": 0,
  "id": 0,
  "judgeCase": [
    {
      "input": "",
      "output": ""
    }
  ],
  "judgeConfig": {
    "memoryLimit": 0,
    "stackLimit": 0,
    "timeLimit": 0
  },
  "pageSize": 0,
  "sortField": "",
  "sortOrder": "",
  "tags": [],
  "title": "",
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|questionQueryRequest|questionQueryRequest|body|true|QuestionQueryRequest|QuestionQueryRequest|
|&emsp;&emsp;answer|||false|string||
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;judgeCase|||false|array|JudgeCase|
|&emsp;&emsp;&emsp;&emsp;input|||false|string||
|&emsp;&emsp;&emsp;&emsp;output|||false|string||
|&emsp;&emsp;judgeConfig|||false|JudgeConfig|JudgeConfig|
|&emsp;&emsp;&emsp;&emsp;memoryLimit|||false|integer||
|&emsp;&emsp;&emsp;&emsp;stackLimit|||false|integer||
|&emsp;&emsp;&emsp;&emsp;timeLimit|||false|integer||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«QuestionVO»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«QuestionVO»|Page«QuestionVO»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|QuestionVO|
|&emsp;&emsp;&emsp;&emsp;acceptedNum||integer||
|&emsp;&emsp;&emsp;&emsp;content||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;favourNum||integer||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;judgeConfig||JudgeConfig|JudgeConfig|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;memoryLimit||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;stackLimit||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;timeLimit||integer||
|&emsp;&emsp;&emsp;&emsp;submitNum||integer||
|&emsp;&emsp;&emsp;&emsp;tags||array|string|
|&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;userVO||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"acceptedNum": 0,
				"content": "",
				"createTime": "",
				"favourNum": 0,
				"id": 0,
				"judgeConfig": {
					"memoryLimit": 0,
					"stackLimit": 0,
					"timeLimit": 0
				},
				"submitNum": 0,
				"tags": [],
				"title": "",
				"userId": 0,
				"userVO": {
					"createTime": "",
					"id": 0,
					"userAvatar": "",
					"userName": "",
					"userProfile": "",
					"userRole": ""
				}
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## doQuestionSubmit


**接口地址**:`/api/question/submit`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "code": "",
  "language": "",
  "questionId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|questionSubmitAddRequest|questionSubmitAddRequest|body|true|QuestionSubmitAddRequest|QuestionSubmitAddRequest|
|&emsp;&emsp;code|||false|string||
|&emsp;&emsp;language|||false|string||
|&emsp;&emsp;questionId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«long»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||integer(int64)|integer(int64)|
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"message": ""
}
```


## getAllQuestionSubmitByList


**接口地址**:`/api/question/submit/admin/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«List«QuestionSubmit»»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||array|QuestionSubmit|
|&emsp;&emsp;code||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;isDelete||integer(int32)||
|&emsp;&emsp;judgeInfo||string||
|&emsp;&emsp;language||string||
|&emsp;&emsp;outputResult||string||
|&emsp;&emsp;questionId||integer(int64)||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;userId||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": [
		{
			"code": "",
			"createTime": "",
			"id": 0,
			"isDelete": 0,
			"judgeInfo": "",
			"language": "",
			"outputResult": "",
			"questionId": 0,
			"status": 0,
			"updateTime": "",
			"userId": 0
		}
	],
	"message": ""
}
```


## getSubmit


**接口地址**:`/api/question/submit/getSubmitStatus`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|submitId|submitId|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«QuestionSubmitVO»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||QuestionSubmitVO|QuestionSubmitVO|
|&emsp;&emsp;code||string||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;judgeInfo||JudgeInfo|JudgeInfo|
|&emsp;&emsp;&emsp;&emsp;memory||integer||
|&emsp;&emsp;&emsp;&emsp;message||string||
|&emsp;&emsp;&emsp;&emsp;time||integer||
|&emsp;&emsp;language||string||
|&emsp;&emsp;outputResult||string||
|&emsp;&emsp;questionId||integer(int64)||
|&emsp;&emsp;questionVO||QuestionVO|QuestionVO|
|&emsp;&emsp;&emsp;&emsp;acceptedNum||integer||
|&emsp;&emsp;&emsp;&emsp;content||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;favourNum||integer||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;judgeConfig||JudgeConfig|JudgeConfig|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;memoryLimit||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;stackLimit||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;timeLimit||integer||
|&emsp;&emsp;&emsp;&emsp;submitNum||integer||
|&emsp;&emsp;&emsp;&emsp;tags||array|string|
|&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;userVO||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;userVO||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;userRole||string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"code": "",
		"id": 0,
		"judgeInfo": {
			"memory": 0,
			"message": "",
			"time": 0
		},
		"language": "",
		"outputResult": "",
		"questionId": 0,
		"questionVO": {
			"acceptedNum": 0,
			"content": "",
			"createTime": "",
			"favourNum": 0,
			"id": 0,
			"judgeConfig": {
				"memoryLimit": 0,
				"stackLimit": 0,
				"timeLimit": 0
			},
			"submitNum": 0,
			"tags": [],
			"title": "",
			"userId": 0,
			"userVO": {
				"createTime": "",
				"id": 0,
				"userAvatar": "",
				"userName": "",
				"userProfile": "",
				"userRole": ""
			}
		},
		"status": 0,
		"userId": 0,
		"userVO": {
			"createTime": "",
			"id": 0,
			"userAvatar": "",
			"userName": "",
			"userProfile": "",
			"userRole": ""
		}
	},
	"message": ""
}
```


## updateQuestion


**接口地址**:`/api/question/update`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "answer": "",
  "content": "",
  "id": 0,
  "judgeCase": [
    {
      "input": "",
      "output": ""
    }
  ],
  "judgeConfig": {
    "memoryLimit": 0,
    "stackLimit": 0,
    "timeLimit": 0
  },
  "tags": [],
  "title": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|questionUpdateRequest|questionUpdateRequest|body|true|QuestionUpdateRequest|QuestionUpdateRequest|
|&emsp;&emsp;answer|||false|string||
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;judgeCase|||false|array|JudgeCase|
|&emsp;&emsp;&emsp;&emsp;input|||false|string||
|&emsp;&emsp;&emsp;&emsp;output|||false|string||
|&emsp;&emsp;judgeConfig|||false|JudgeConfig|JudgeConfig|
|&emsp;&emsp;&emsp;&emsp;memoryLimit|||false|integer||
|&emsp;&emsp;&emsp;&emsp;stackLimit|||false|integer||
|&emsp;&emsp;&emsp;&emsp;timeLimit|||false|integer||
|&emsp;&emsp;tags|||false|array|string|
|&emsp;&emsp;title|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


# room-controller


## addRoom


**接口地址**:`/api/room/add`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "description": "",
  "mateNum": 0,
  "name": "",
  "password": "",
  "status": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roomAddRequest|roomAddRequest|body|true|RoomAddRequest|RoomAddRequest|
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;mateNum|||false|integer(int32)||
|&emsp;&emsp;name|||false|string||
|&emsp;&emsp;password|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«long»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||integer(int64)|integer(int64)|
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"message": ""
}
```


## auth


**接口地址**:`/api/room/auth`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "roomId": 0,
  "timestamp": 0,
  "token": "",
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roomAuthRequest|roomAuthRequest|body|true|RoomAuthRequest|RoomAuthRequest|
|&emsp;&emsp;roomId|||false|integer(int64)||
|&emsp;&emsp;timestamp|||false|integer(int64)||
|&emsp;&emsp;token|||false|string||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## generateAuthToken


**接口地址**:`/api/room/auth/token`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roomId|roomId|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«RoomAuthRequest»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||RoomAuthRequest|RoomAuthRequest|
|&emsp;&emsp;roomId||integer(int64)||
|&emsp;&emsp;timestamp||integer(int64)||
|&emsp;&emsp;token||string||
|&emsp;&emsp;userId||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"roomId": 0,
		"timestamp": 0,
		"token": "",
		"userId": 0
	},
	"message": ""
}
```


## deleteRoom


**接口地址**:`/api/room/delete`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|deleteRequest|deleteRequest|body|true|DeleteRequest|DeleteRequest|
|&emsp;&emsp;id|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## editRoom


**接口地址**:`/api/room/edit`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "description": "",
  "id": 0,
  "mateNum": 0,
  "name": "",
  "password": "",
  "status": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roomEditRequest|roomEditRequest|body|true|RoomEditRequest|RoomEditRequest|
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;mateNum|||false|integer(int32)||
|&emsp;&emsp;name|||false|string||
|&emsp;&emsp;password|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## getRoomById


**接口地址**:`/api/room/get`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|id|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Room»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Room|Room|
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;description||string||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;isDelete||integer(int32)||
|&emsp;&emsp;mateNum||integer(int32)||
|&emsp;&emsp;name||string||
|&emsp;&emsp;password||string||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;userId||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"createTime": "",
		"description": "",
		"id": 0,
		"isDelete": 0,
		"mateNum": 0,
		"name": "",
		"password": "",
		"status": 0,
		"updateTime": "",
		"userId": 0
	},
	"message": ""
}
```


## getRoomVOById


**接口地址**:`/api/room/get/vo`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|id|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«RoomVO»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||RoomVO|RoomVO|
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;currentNum||integer(int32)||
|&emsp;&emsp;description||string||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;mateNum||integer(int32)||
|&emsp;&emsp;members||array|RoomMemberVO|
|&emsp;&emsp;&emsp;&emsp;isLeader||boolean||
|&emsp;&emsp;&emsp;&emsp;joinTime||string||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;userVO||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;name||string||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;userVO||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;userRole||string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"createTime": "",
		"currentNum": 0,
		"description": "",
		"id": 0,
		"mateNum": 0,
		"members": [
			{
				"isLeader": true,
				"joinTime": "",
				"userId": 0,
				"userVO": {
					"createTime": "",
					"id": 0,
					"userAvatar": "",
					"userName": "",
					"userProfile": "",
					"userRole": ""
				}
			}
		],
		"name": "",
		"status": 0,
		"userId": 0,
		"userVO": {
			"createTime": "",
			"id": 0,
			"userAvatar": "",
			"userName": "",
			"userProfile": "",
			"userRole": ""
		}
	},
	"message": ""
}
```


## joinRoom


**接口地址**:`/api/room/join`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "password": "",
  "roomId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roomJoinRequest|roomJoinRequest|body|true|RoomJoinRequest|RoomJoinRequest|
|&emsp;&emsp;password|||false|string||
|&emsp;&emsp;roomId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## listRoomByPage


**接口地址**:`/api/room/list/page`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "current": 0,
  "description": "",
  "id": 0,
  "name": "",
  "pageSize": 0,
  "sortField": "",
  "sortOrder": "",
  "status": 0,
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roomQueryRequest|roomQueryRequest|body|true|RoomQueryRequest|RoomQueryRequest|
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;name|||false|string||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«Room»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«Room»|Page«Room»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|Room|
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;description||string||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;isDelete||integer||
|&emsp;&emsp;&emsp;&emsp;mateNum||integer||
|&emsp;&emsp;&emsp;&emsp;name||string||
|&emsp;&emsp;&emsp;&emsp;password||string||
|&emsp;&emsp;&emsp;&emsp;status||integer||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"createTime": "",
				"description": "",
				"id": 0,
				"isDelete": 0,
				"mateNum": 0,
				"name": "",
				"password": "",
				"status": 0,
				"updateTime": "",
				"userId": 0
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## listRoomVOByPage


**接口地址**:`/api/room/list/page/vo`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "current": 0,
  "description": "",
  "id": 0,
  "name": "",
  "pageSize": 0,
  "sortField": "",
  "sortOrder": "",
  "status": 0,
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roomQueryRequest|roomQueryRequest|body|true|RoomQueryRequest|RoomQueryRequest|
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;name|||false|string||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«RoomVO»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«RoomVO»|Page«RoomVO»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|RoomVO|
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;currentNum||integer||
|&emsp;&emsp;&emsp;&emsp;description||string||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;mateNum||integer||
|&emsp;&emsp;&emsp;&emsp;members||array|RoomMemberVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;isLeader||boolean||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;joinTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userVO||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;&emsp;&emsp;name||string||
|&emsp;&emsp;&emsp;&emsp;status||integer||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;userVO||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"createTime": "",
				"currentNum": 0,
				"description": "",
				"id": 0,
				"mateNum": 0,
				"members": [
					{
						"isLeader": true,
						"joinTime": "",
						"userId": 0,
						"userVO": {
							"createTime": "",
							"id": 0,
							"userAvatar": "",
							"userName": "",
							"userProfile": "",
							"userRole": ""
						}
					}
				],
				"name": "",
				"status": 0,
				"userId": 0,
				"userVO": {
					"createTime": "",
					"id": 0,
					"userAvatar": "",
					"userName": "",
					"userProfile": "",
					"userRole": ""
				}
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## listMyRoomVOByPage


**接口地址**:`/api/room/my/list/page/vo`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "current": 0,
  "description": "",
  "id": 0,
  "name": "",
  "pageSize": 0,
  "sortField": "",
  "sortOrder": "",
  "status": 0,
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roomQueryRequest|roomQueryRequest|body|true|RoomQueryRequest|RoomQueryRequest|
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;name|||false|string||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«RoomVO»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«RoomVO»|Page«RoomVO»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|RoomVO|
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;currentNum||integer||
|&emsp;&emsp;&emsp;&emsp;description||string||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;mateNum||integer||
|&emsp;&emsp;&emsp;&emsp;members||array|RoomMemberVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;isLeader||boolean||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;joinTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userVO||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;&emsp;&emsp;name||string||
|&emsp;&emsp;&emsp;&emsp;status||integer||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;userVO||UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"createTime": "",
				"currentNum": 0,
				"description": "",
				"id": 0,
				"mateNum": 0,
				"members": [
					{
						"isLeader": true,
						"joinTime": "",
						"userId": 0,
						"userVO": {
							"createTime": "",
							"id": 0,
							"userAvatar": "",
							"userName": "",
							"userProfile": "",
							"userRole": ""
						}
					}
				],
				"name": "",
				"status": 0,
				"userId": 0,
				"userVO": {
					"createTime": "",
					"id": 0,
					"userAvatar": "",
					"userName": "",
					"userProfile": "",
					"userRole": ""
				}
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## quitRoom


**接口地址**:`/api/room/quit`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "roomId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roomQuitRequest|roomQuitRequest|body|true|RoomQuitRequest|RoomQuitRequest|
|&emsp;&emsp;roomId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## transferLeader


**接口地址**:`/api/room/transfer`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "newLeaderUserId": 0,
  "roomId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roomTransferRequest|roomTransferRequest|body|true|RoomTransferRequest|RoomTransferRequest|
|&emsp;&emsp;newLeaderUserId|||false|integer(int64)||
|&emsp;&emsp;roomId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## updateRoom


**接口地址**:`/api/room/update`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "description": "",
  "id": 0,
  "mateNum": 0,
  "name": "",
  "password": "",
  "status": 0,
  "userId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roomUpdateRequest|roomUpdateRequest|body|true|RoomUpdateRequest|RoomUpdateRequest|
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;mateNum|||false|integer(int32)||
|&emsp;&emsp;name|||false|string||
|&emsp;&emsp;password|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;userId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


# user-controller


## addUser


**接口地址**:`/api/user/add`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "userAccount": "",
  "userAvatar": "",
  "userName": "",
  "userRole": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userAddRequest|userAddRequest|body|true|UserAddRequest|UserAddRequest|
|&emsp;&emsp;userAccount|||false|string||
|&emsp;&emsp;userAvatar|||false|string||
|&emsp;&emsp;userName|||false|string||
|&emsp;&emsp;userRole|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«long»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||integer(int64)|integer(int64)|
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"message": ""
}
```


## deleteUser


**接口地址**:`/api/user/delete`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|deleteRequest|deleteRequest|body|true|DeleteRequest|DeleteRequest|
|&emsp;&emsp;id|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## getUserById


**接口地址**:`/api/user/get`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|id|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«User»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||User|User|
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;isDelete||integer(int32)||
|&emsp;&emsp;mpOpenId||string||
|&emsp;&emsp;unionId||string||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;userAccount||string||
|&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;userName||string||
|&emsp;&emsp;userPassword||string||
|&emsp;&emsp;userProfile||string||
|&emsp;&emsp;userRole||string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"createTime": "",
		"id": 0,
		"isDelete": 0,
		"mpOpenId": "",
		"unionId": "",
		"updateTime": "",
		"userAccount": "",
		"userAvatar": "",
		"userName": "",
		"userPassword": "",
		"userProfile": "",
		"userRole": ""
	},
	"message": ""
}
```


## getLoginUser


**接口地址**:`/api/user/get/login`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«LoginUserVO»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||LoginUserVO|LoginUserVO|
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;userName||string||
|&emsp;&emsp;userProfile||string||
|&emsp;&emsp;userRole||string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"createTime": "",
		"id": 0,
		"updateTime": "",
		"userAvatar": "",
		"userName": "",
		"userProfile": "",
		"userRole": ""
	},
	"message": ""
}
```


## getUserVOById


**接口地址**:`/api/user/get/vo`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|id|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«UserVO»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||UserVO|UserVO|
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;userName||string||
|&emsp;&emsp;userProfile||string||
|&emsp;&emsp;userRole||string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"createTime": "",
		"id": 0,
		"userAvatar": "",
		"userName": "",
		"userProfile": "",
		"userRole": ""
	},
	"message": ""
}
```


## listUserByPage


**接口地址**:`/api/user/list/page`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "current": 0,
  "id": 0,
  "mpOpenId": "",
  "pageSize": 0,
  "sortField": "",
  "sortOrder": "",
  "unionId": "",
  "userName": "",
  "userProfile": "",
  "userRole": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userQueryRequest|userQueryRequest|body|true|UserQueryRequest|UserQueryRequest|
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;mpOpenId|||false|string||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;unionId|||false|string||
|&emsp;&emsp;userName|||false|string||
|&emsp;&emsp;userProfile|||false|string||
|&emsp;&emsp;userRole|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«User»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«User»|Page«User»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|User|
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;isDelete||integer||
|&emsp;&emsp;&emsp;&emsp;mpOpenId||string||
|&emsp;&emsp;&emsp;&emsp;unionId||string||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;userAccount||string||
|&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;userPassword||string||
|&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"createTime": "",
				"id": 0,
				"isDelete": 0,
				"mpOpenId": "",
				"unionId": "",
				"updateTime": "",
				"userAccount": "",
				"userAvatar": "",
				"userName": "",
				"userPassword": "",
				"userProfile": "",
				"userRole": ""
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## listUserVOByPage


**接口地址**:`/api/user/list/page/vo`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "current": 0,
  "id": 0,
  "mpOpenId": "",
  "pageSize": 0,
  "sortField": "",
  "sortOrder": "",
  "unionId": "",
  "userName": "",
  "userProfile": "",
  "userRole": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userQueryRequest|userQueryRequest|body|true|UserQueryRequest|UserQueryRequest|
|&emsp;&emsp;current|||false|integer(int32)||
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;mpOpenId|||false|string||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;unionId|||false|string||
|&emsp;&emsp;userName|||false|string||
|&emsp;&emsp;userProfile|||false|string||
|&emsp;&emsp;userRole|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«Page«UserVO»»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||Page«UserVO»|Page«UserVO»|
|&emsp;&emsp;countId||string||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;optimizeCountSql||boolean||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;pages||integer(int64)||
|&emsp;&emsp;records||array|UserVO|
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;userProfile||string||
|&emsp;&emsp;&emsp;&emsp;userRole||string||
|&emsp;&emsp;searchCount||boolean||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;total||integer(int64)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"countId": "",
		"current": 0,
		"maxLimit": 0,
		"optimizeCountSql": true,
		"orders": [
			{
				"asc": true,
				"column": ""
			}
		],
		"pages": 0,
		"records": [
			{
				"createTime": "",
				"id": 0,
				"userAvatar": "",
				"userName": "",
				"userProfile": "",
				"userRole": ""
			}
		],
		"searchCount": true,
		"size": 0,
		"total": 0
	},
	"message": ""
}
```


## userLogin


**接口地址**:`/api/user/login`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "userAccount": "",
  "userPassword": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userLoginRequest|userLoginRequest|body|true|UserLoginRequest|UserLoginRequest|
|&emsp;&emsp;userAccount|||false|string||
|&emsp;&emsp;userPassword|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«LoginUserVO»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||LoginUserVO|LoginUserVO|
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;userName||string||
|&emsp;&emsp;userProfile||string||
|&emsp;&emsp;userRole||string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"createTime": "",
		"id": 0,
		"updateTime": "",
		"userAvatar": "",
		"userName": "",
		"userProfile": "",
		"userRole": ""
	},
	"message": ""
}
```


## userLoginByWxOpen


**接口地址**:`/api/user/login/wx_open`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|code|code|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«LoginUserVO»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||LoginUserVO|LoginUserVO|
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;userName||string||
|&emsp;&emsp;userProfile||string||
|&emsp;&emsp;userRole||string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"createTime": "",
		"id": 0,
		"updateTime": "",
		"userAvatar": "",
		"userName": "",
		"userProfile": "",
		"userRole": ""
	},
	"message": ""
}
```


## userLogout


**接口地址**:`/api/user/logout`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## userRegister


**接口地址**:`/api/user/register`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "checkPassword": "",
  "userAccount": "",
  "userPassword": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userRegisterRequest|userRegisterRequest|body|true|UserRegisterRequest|UserRegisterRequest|
|&emsp;&emsp;checkPassword|||false|string||
|&emsp;&emsp;userAccount|||false|string||
|&emsp;&emsp;userPassword|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«long»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||integer(int64)|integer(int64)|
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"message": ""
}
```


## updateUser


**接口地址**:`/api/user/update`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0,
  "userAvatar": "",
  "userName": "",
  "userProfile": "",
  "userRole": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userUpdateRequest|userUpdateRequest|body|true|UserUpdateRequest|UserUpdateRequest|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;userAvatar|||false|string||
|&emsp;&emsp;userName|||false|string||
|&emsp;&emsp;userProfile|||false|string||
|&emsp;&emsp;userRole|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## updateMyUser


**接口地址**:`/api/user/update/my`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "userAvatar": "",
  "userName": "",
  "userProfile": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userUpdateMyRequest|userUpdateMyRequest|body|true|UserUpdateMyRequest|UserUpdateMyRequest|
|&emsp;&emsp;userAvatar|||false|string||
|&emsp;&emsp;userName|||false|string||
|&emsp;&emsp;userProfile|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponse«boolean»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


# wx-mp-controller


## check


**接口地址**:`/api/`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|echostr|echostr|query|false|string||
|nonce|nonce|query|false|string||
|signature|signature|query|false|string||
|timestamp|timestamp|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## receiveMessage


**接口地址**:`/api/`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## setMenu


**接口地址**:`/api/setMenu`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


暂无


**响应示例**:
```javascript

```