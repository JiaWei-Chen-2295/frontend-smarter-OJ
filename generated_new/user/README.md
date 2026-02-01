## user@v0

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
npm install user@v0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://172.24.80.1:8201/api/user*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*InnerUserControllerApi* | [**getById**](docs/InnerUserControllerApi.md#getbyid) | **GET** /inner/get/id | 
*InnerUserControllerApi* | [**listByIds**](docs/InnerUserControllerApi.md#listbyids) | **GET** /inner/list/id | 
*UserControllerApi* | [**addUser**](docs/UserControllerApi.md#adduser) | **POST** /add | 
*UserControllerApi* | [**deleteUser**](docs/UserControllerApi.md#deleteuser) | **POST** /delete | 
*UserControllerApi* | [**getCaptcha**](docs/UserControllerApi.md#getcaptcha) | **POST** /captcha/fetch | 
*UserControllerApi* | [**getLoginUser**](docs/UserControllerApi.md#getloginuser) | **GET** /get/login | 
*UserControllerApi* | [**getUserById**](docs/UserControllerApi.md#getuserbyid) | **GET** /get | 
*UserControllerApi* | [**getUserVOById**](docs/UserControllerApi.md#getuservobyid) | **GET** /get/vo | 
*UserControllerApi* | [**listUserByPage**](docs/UserControllerApi.md#listuserbypage) | **POST** /list/page | 
*UserControllerApi* | [**listUserVOByPage**](docs/UserControllerApi.md#listuservobypage) | **POST** /list/page/vo | 
*UserControllerApi* | [**sendSmsCaptcha**](docs/UserControllerApi.md#sendsmscaptcha) | **POST** /captcha/sms | 
*UserControllerApi* | [**updateMyUser**](docs/UserControllerApi.md#updatemyuser) | **POST** /update/my | 
*UserControllerApi* | [**updateUser**](docs/UserControllerApi.md#updateuser) | **POST** /update | 
*UserControllerApi* | [**userLogin**](docs/UserControllerApi.md#userlogin) | **POST** /login | 
*UserControllerApi* | [**userLoginByPhone**](docs/UserControllerApi.md#userloginbyphone) | **POST** /login/phone | 
*UserControllerApi* | [**userLogout**](docs/UserControllerApi.md#userlogout) | **POST** /logout | 
*UserControllerApi* | [**userRegister**](docs/UserControllerApi.md#userregister) | **POST** /register | 


### Documentation For Models

 - [BaseResponseBoolean](docs/BaseResponseBoolean.md)
 - [BaseResponseLoginUserVO](docs/BaseResponseLoginUserVO.md)
 - [BaseResponseLong](docs/BaseResponseLong.md)
 - [BaseResponsePageUser](docs/BaseResponsePageUser.md)
 - [BaseResponsePageUserVO](docs/BaseResponsePageUserVO.md)
 - [BaseResponseString](docs/BaseResponseString.md)
 - [BaseResponseUser](docs/BaseResponseUser.md)
 - [BaseResponseUserVO](docs/BaseResponseUserVO.md)
 - [DeleteRequest](docs/DeleteRequest.md)
 - [LoginUserVO](docs/LoginUserVO.md)
 - [OrderItem](docs/OrderItem.md)
 - [PageUser](docs/PageUser.md)
 - [PageUserVO](docs/PageUserVO.md)
 - [SmsCaptchaRequest](docs/SmsCaptchaRequest.md)
 - [User](docs/User.md)
 - [UserAddRequest](docs/UserAddRequest.md)
 - [UserLoginRequest](docs/UserLoginRequest.md)
 - [UserPhoneLoginRequest](docs/UserPhoneLoginRequest.md)
 - [UserQueryRequest](docs/UserQueryRequest.md)
 - [UserRegisterRequest](docs/UserRegisterRequest.md)
 - [UserUpdateMyRequest](docs/UserUpdateMyRequest.md)
 - [UserUpdateRequest](docs/UserUpdateRequest.md)
 - [UserVO](docs/UserVO.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization

Endpoints do not require authorization.

