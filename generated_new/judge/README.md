## judge@v0

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
npm install judge@v0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://172.19.0.8:8203/api/judge*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*InnerJudgeControllerApi* | [**doJudge**](docs/InnerJudgeControllerApi.md#dojudge) | **POST** /inner/do | 


### Documentation For Models

 - [CodeTemplate](docs/CodeTemplate.md)
 - [JudgeConfig](docs/JudgeConfig.md)
 - [JudgeInfo](docs/JudgeInfo.md)
 - [JudgeRequest](docs/JudgeRequest.md)
 - [QuestionSubmitVO](docs/QuestionSubmitVO.md)
 - [QuestionVO](docs/QuestionVO.md)
 - [User](docs/User.md)
 - [UserVO](docs/UserVO.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization

Endpoints do not require authorization.

