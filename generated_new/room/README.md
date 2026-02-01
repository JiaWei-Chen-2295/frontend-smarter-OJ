## room@v0

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
npm install room@v0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://172.24.80.1:8205/api/room*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*RoomControllerApi* | [**addRoom**](docs/RoomControllerApi.md#addroom) | **POST** /add | 
*RoomControllerApi* | [**auth**](docs/RoomControllerApi.md#auth) | **POST** /auth | 
*RoomControllerApi* | [**deleteRoom**](docs/RoomControllerApi.md#deleteroom) | **POST** /delete | 
*RoomControllerApi* | [**editRoom**](docs/RoomControllerApi.md#editroom) | **POST** /edit | 
*RoomControllerApi* | [**generateAuthToken**](docs/RoomControllerApi.md#generateauthtoken) | **GET** /auth/token | 
*RoomControllerApi* | [**getRoomById**](docs/RoomControllerApi.md#getroombyid) | **GET** /get | 
*RoomControllerApi* | [**getRoomVOById**](docs/RoomControllerApi.md#getroomvobyid) | **GET** /get/vo | 
*RoomControllerApi* | [**joinRoom**](docs/RoomControllerApi.md#joinroom) | **POST** /join | 
*RoomControllerApi* | [**listMyRoomVOByPage**](docs/RoomControllerApi.md#listmyroomvobypage) | **POST** /my/list/page/vo | 
*RoomControllerApi* | [**listRoomByPage**](docs/RoomControllerApi.md#listroombypage) | **POST** /list/page | 
*RoomControllerApi* | [**listRoomVOByPage**](docs/RoomControllerApi.md#listroomvobypage) | **POST** /list/page/vo | 
*RoomControllerApi* | [**quitRoom**](docs/RoomControllerApi.md#quitroom) | **POST** /quit | 
*RoomControllerApi* | [**transferLeader**](docs/RoomControllerApi.md#transferleader) | **POST** /transfer | 
*RoomControllerApi* | [**updateRoom**](docs/RoomControllerApi.md#updateroom) | **POST** /update | 


### Documentation For Models

 - [BaseResponseBoolean](docs/BaseResponseBoolean.md)
 - [BaseResponseLong](docs/BaseResponseLong.md)
 - [BaseResponsePageRoom](docs/BaseResponsePageRoom.md)
 - [BaseResponsePageRoomVO](docs/BaseResponsePageRoomVO.md)
 - [BaseResponseRoom](docs/BaseResponseRoom.md)
 - [BaseResponseRoomAuthRequest](docs/BaseResponseRoomAuthRequest.md)
 - [BaseResponseRoomVO](docs/BaseResponseRoomVO.md)
 - [DeleteRequest](docs/DeleteRequest.md)
 - [OrderItem](docs/OrderItem.md)
 - [PageRoom](docs/PageRoom.md)
 - [PageRoomVO](docs/PageRoomVO.md)
 - [Room](docs/Room.md)
 - [RoomAddRequest](docs/RoomAddRequest.md)
 - [RoomAuthRequest](docs/RoomAuthRequest.md)
 - [RoomEditRequest](docs/RoomEditRequest.md)
 - [RoomJoinRequest](docs/RoomJoinRequest.md)
 - [RoomMemberVO](docs/RoomMemberVO.md)
 - [RoomQueryRequest](docs/RoomQueryRequest.md)
 - [RoomQuitRequest](docs/RoomQuitRequest.md)
 - [RoomTransferRequest](docs/RoomTransferRequest.md)
 - [RoomUpdateRequest](docs/RoomUpdateRequest.md)
 - [RoomVO](docs/RoomVO.md)
 - [UserVO](docs/UserVO.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization

Endpoints do not require authorization.

