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

All URIs are relative to *http://192.168.254.1:8202/api/question*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*InnerQuestionControllerApi* | [**getQuestionById**](docs/InnerQuestionControllerApi.md#getquestionbyid) | **GET** /inner/get/id | 
*InnerQuestionControllerApi* | [**getQuestionSubmitById**](docs/InnerQuestionControllerApi.md#getquestionsubmitbyid) | **GET** /inner/submit/update/id | 
*InnerQuestionControllerApi* | [**getQuestionSubmitVO**](docs/InnerQuestionControllerApi.md#getquestionsubmitvo) | **POST** /inner/submit/get/vo | 
*InnerQuestionControllerApi* | [**updateQuestionSubmitById**](docs/InnerQuestionControllerApi.md#updatequestionsubmitbyid) | **POST** /inner/submit/update | 
*QuestionControllerApi* | [**addQuestion**](docs/QuestionControllerApi.md#addquestion) | **POST** /add | 
*QuestionControllerApi* | [**deleteQuestion**](docs/QuestionControllerApi.md#deletequestion) | **POST** /delete | 
*QuestionControllerApi* | [**doQuestionSubmit**](docs/QuestionControllerApi.md#doquestionsubmit) | **POST** /submit | 
*QuestionControllerApi* | [**editQuestion**](docs/QuestionControllerApi.md#editquestion) | **POST** /edit | 
*QuestionControllerApi* | [**getAllQuestionSubmitByList**](docs/QuestionControllerApi.md#getallquestionsubmitbylist) | **GET** /submit/admin/list | 
*QuestionControllerApi* | [**getQuestionById1**](docs/QuestionControllerApi.md#getquestionbyid1) | **GET** /get/all | 
*QuestionControllerApi* | [**getQuestionList**](docs/QuestionControllerApi.md#getquestionlist) | **POST** /list/admin-page | 
*QuestionControllerApi* | [**getQuestionVOById**](docs/QuestionControllerApi.md#getquestionvobyid) | **GET** /get/vo | 
*QuestionControllerApi* | [**getSubmit**](docs/QuestionControllerApi.md#getsubmit) | **GET** /submit/getSubmitStatus | 
*QuestionControllerApi* | [**listMyQuestionVOByPage**](docs/QuestionControllerApi.md#listmyquestionvobypage) | **POST** /my/list/page/vo | 
*QuestionControllerApi* | [**listQuestionByPage**](docs/QuestionControllerApi.md#listquestionbypage) | **POST** /list/page | 
*QuestionControllerApi* | [**listQuestionSubmitByPage**](docs/QuestionControllerApi.md#listquestionsubmitbypage) | **POST** /submit/admin/page | 
*QuestionControllerApi* | [**listQuestionVOByPage**](docs/QuestionControllerApi.md#listquestionvobypage) | **POST** /list/page/vo | 
*QuestionControllerApi* | [**updateQuestion**](docs/QuestionControllerApi.md#updatequestion) | **POST** /update | 
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
 - [BaseResponseQuestionSet](docs/BaseResponseQuestionSet.md)
 - [BaseResponseQuestionSetVO](docs/BaseResponseQuestionSetVO.md)
 - [BaseResponseQuestionSubmitVO](docs/BaseResponseQuestionSubmitVO.md)
 - [BaseResponseQuestionVO](docs/BaseResponseQuestionVO.md)
 - [CodeTemplate](docs/CodeTemplate.md)
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
 - [QuestionEditRequest](docs/QuestionEditRequest.md)
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
 - [User](docs/User.md)
 - [UserVO](docs/UserVO.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization

Endpoints do not require authorization.

