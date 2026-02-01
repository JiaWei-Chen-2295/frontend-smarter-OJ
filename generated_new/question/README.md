## question@v0

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
npm install question@v0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://172.24.80.1:8202/api/question*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*DefaultApi* | [**addQuestion**](docs/DefaultApi.md#addquestion) | **POST** /add | 
*DefaultApi* | [**deleteQuestion**](docs/DefaultApi.md#deletequestion) | **POST** /delete | 
*DefaultApi* | [**doQuestionSubmit**](docs/DefaultApi.md#doquestionsubmit) | **POST** /submit | 
*DefaultApi* | [**editQuestion**](docs/DefaultApi.md#editquestion) | **POST** /edit | 
*DefaultApi* | [**getAllQuestionSubmitByList**](docs/DefaultApi.md#getallquestionsubmitbylist) | **GET** /submit/admin/list | 
*DefaultApi* | [**getQuestionById1**](docs/DefaultApi.md#getquestionbyid1) | **GET** /get/all | 
*DefaultApi* | [**getQuestionList**](docs/DefaultApi.md#getquestionlist) | **POST** /list/admin-page | 
*DefaultApi* | [**getQuestionVOById**](docs/DefaultApi.md#getquestionvobyid) | **GET** /get/vo | 
*DefaultApi* | [**getSubmit**](docs/DefaultApi.md#getsubmit) | **GET** /submit/getSubmitStatus | 
*DefaultApi* | [**getSubmitHeatmap**](docs/DefaultApi.md#getsubmitheatmap) | **GET** /submit/heatmap | 获取用户提交热力图
*DefaultApi* | [**importQuestions**](docs/DefaultApi.md#importquestions) | **POST** /import | 批量导入题目
*DefaultApi* | [**listMyQuestionVOByPage**](docs/DefaultApi.md#listmyquestionvobypage) | **POST** /my/list/page/vo | 
*DefaultApi* | [**listQuestionByPage**](docs/DefaultApi.md#listquestionbypage) | **POST** /list/page | 
*DefaultApi* | [**listQuestionSubmitByPage**](docs/DefaultApi.md#listquestionsubmitbypage) | **POST** /submit/admin/page | 
*DefaultApi* | [**listQuestionVOByPage**](docs/DefaultApi.md#listquestionvobypage) | **POST** /list/page/vo | 
*DefaultApi* | [**updateQuestion**](docs/DefaultApi.md#updatequestion) | **POST** /update | 
*InnerQuestionControllerApi* | [**getQuestionById**](docs/InnerQuestionControllerApi.md#getquestionbyid) | **GET** /inner/get/id | 
*InnerQuestionControllerApi* | [**getQuestionSubmitById**](docs/InnerQuestionControllerApi.md#getquestionsubmitbyid) | **GET** /inner/submit/update/id | 
*InnerQuestionControllerApi* | [**getQuestionSubmitVO**](docs/InnerQuestionControllerApi.md#getquestionsubmitvo) | **POST** /inner/submit/get/vo | 
*InnerQuestionControllerApi* | [**updateQuestionSubmitById**](docs/InnerQuestionControllerApi.md#updatequestionsubmitbyid) | **POST** /inner/submit/update | 
*QuestionSetControllerApi* | [**addQuestionSet**](docs/QuestionSetControllerApi.md#addquestionset) | **POST** /questionSet/add | 
*QuestionSetControllerApi* | [**addQuestionToSet**](docs/QuestionSetControllerApi.md#addquestiontoset) | **POST** /questionSet/item/add | 
*QuestionSetControllerApi* | [**deleteQuestionSet**](docs/QuestionSetControllerApi.md#deletequestionset) | **POST** /questionSet/delete | 
*QuestionSetControllerApi* | [**editQuestionSet**](docs/QuestionSetControllerApi.md#editquestionset) | **POST** /questionSet/edit | 
*QuestionSetControllerApi* | [**getQuestionSetById**](docs/QuestionSetControllerApi.md#getquestionsetbyid) | **GET** /questionSet/get | 
*QuestionSetControllerApi* | [**getQuestionSetVOById**](docs/QuestionSetControllerApi.md#getquestionsetvobyid) | **GET** /questionSet/get/vo | 
*QuestionSetControllerApi* | [**listMyQuestionSetVOByPage**](docs/QuestionSetControllerApi.md#listmyquestionsetvobypage) | **POST** /questionSet/my/list/page/vo | 
*QuestionSetControllerApi* | [**listQuestionSetByPage**](docs/QuestionSetControllerApi.md#listquestionsetbypage) | **POST** /questionSet/list/page | 
*QuestionSetControllerApi* | [**listQuestionSetVOByPage**](docs/QuestionSetControllerApi.md#listquestionsetvobypage) | **POST** /questionSet/list/page/vo | 
*QuestionSetControllerApi* | [**redirectDocHtml**](docs/QuestionSetControllerApi.md#redirectdochtml) | **GET** /questionSet/doc.html | 
*QuestionSetControllerApi* | [**redirectOpenApiDocs**](docs/QuestionSetControllerApi.md#redirectopenapidocs) | **GET** /questionSet/v3/api-docs | 
*QuestionSetControllerApi* | [**removeQuestionFromSet**](docs/QuestionSetControllerApi.md#removequestionfromset) | **POST** /questionSet/item/remove | 
*QuestionSetControllerApi* | [**updateQuestionSet**](docs/QuestionSetControllerApi.md#updatequestionset) | **POST** /questionSet/update | 


### Documentation For Models

 - [BaseResponseBoolean](docs/BaseResponseBoolean.md)
 - [BaseResponseListQuestionSubmit](docs/BaseResponseListQuestionSubmit.md)
 - [BaseResponseLong](docs/BaseResponseLong.md)
 - [BaseResponsePageQuestion](docs/BaseResponsePageQuestion.md)
 - [BaseResponsePageQuestionSet](docs/BaseResponsePageQuestionSet.md)
 - [BaseResponsePageQuestionSetVO](docs/BaseResponsePageQuestionSetVO.md)
 - [BaseResponsePageQuestionSubmitVO](docs/BaseResponsePageQuestionSubmitVO.md)
 - [BaseResponsePageQuestionVO](docs/BaseResponsePageQuestionVO.md)
 - [BaseResponseQuestion](docs/BaseResponseQuestion.md)
 - [BaseResponseQuestionBatchImportResponse](docs/BaseResponseQuestionBatchImportResponse.md)
 - [BaseResponseQuestionSet](docs/BaseResponseQuestionSet.md)
 - [BaseResponseQuestionSetVO](docs/BaseResponseQuestionSetVO.md)
 - [BaseResponseQuestionSubmitVO](docs/BaseResponseQuestionSubmitVO.md)
 - [BaseResponseQuestionVO](docs/BaseResponseQuestionVO.md)
 - [BaseResponseSubmitHeatmapVO](docs/BaseResponseSubmitHeatmapVO.md)
 - [CodeTemplate](docs/CodeTemplate.md)
 - [DailySubmitCount](docs/DailySubmitCount.md)
 - [DeleteRequest](docs/DeleteRequest.md)
 - [JudgeCase](docs/JudgeCase.md)
 - [JudgeConfig](docs/JudgeConfig.md)
 - [JudgeInfo](docs/JudgeInfo.md)
 - [OrderItem](docs/OrderItem.md)
 - [PageQuestion](docs/PageQuestion.md)
 - [PageQuestionSet](docs/PageQuestionSet.md)
 - [PageQuestionSetVO](docs/PageQuestionSetVO.md)
 - [PageQuestionSubmitVO](docs/PageQuestionSubmitVO.md)
 - [PageQuestionVO](docs/PageQuestionVO.md)
 - [Question](docs/Question.md)
 - [QuestionAddRequest](docs/QuestionAddRequest.md)
 - [QuestionBatchImportResponse](docs/QuestionBatchImportResponse.md)
 - [QuestionEditRequest](docs/QuestionEditRequest.md)
 - [QuestionImportResult](docs/QuestionImportResult.md)
 - [QuestionQueryRequest](docs/QuestionQueryRequest.md)
 - [QuestionSet](docs/QuestionSet.md)
 - [QuestionSetAddRequest](docs/QuestionSetAddRequest.md)
 - [QuestionSetEditRequest](docs/QuestionSetEditRequest.md)
 - [QuestionSetItemAddRequest](docs/QuestionSetItemAddRequest.md)
 - [QuestionSetItemRemoveRequest](docs/QuestionSetItemRemoveRequest.md)
 - [QuestionSetQueryRequest](docs/QuestionSetQueryRequest.md)
 - [QuestionSetUpdateRequest](docs/QuestionSetUpdateRequest.md)
 - [QuestionSetVO](docs/QuestionSetVO.md)
 - [QuestionSubmit](docs/QuestionSubmit.md)
 - [QuestionSubmitAddRequest](docs/QuestionSubmitAddRequest.md)
 - [QuestionSubmitQueryRequest](docs/QuestionSubmitQueryRequest.md)
 - [QuestionSubmitVO](docs/QuestionSubmitVO.md)
 - [QuestionUpdateRequest](docs/QuestionUpdateRequest.md)
 - [QuestionVO](docs/QuestionVO.md)
 - [SubmitHeatmapVO](docs/SubmitHeatmapVO.md)
 - [User](docs/User.md)
 - [UserVO](docs/UserVO.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization

Endpoints do not require authorization.

