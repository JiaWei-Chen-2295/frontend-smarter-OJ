# API Migration Status

## Overview
We are migrating from the old `generated` folder (openapi-typescript-codegen) to `generated_new` (openapi-generator typescript-axios).
The new generation structure is being populated dynamically via `openapi.config.js` fetching from the Gateway.

## Completed Migrations
- [x] **User Service** (`userApi`)
  - `UserControllerService` migrated.
- [x] **Post Service** (`postApi`)
  - `PostControllerService` migrated.
- [x] **Question Service** (`questionApi` and `questionSetApi`)
  - `QuestionControllerService` migrated.
  - `QuestionSetControllerService` migrated.
- [x] **Room Service** (`roomApi`)
  - `RoomControllerService` migrated.
  - Handled large integer IDs by sticking to `roomApi` (axios handles strings in query/body).

## Pending Migrations
The following services are used in the code but are currently **missing** from the `generated_new` output. This likely means they are not exposed via the Gateway's `/v3/api-docs` or are configured differently in the backend.

### 1. FileControllerService
- **Used in:** `src/pages/user/Profile/index.tsx`
- **Function:** `uploadFileUsingPost` (/api/file/upload)
- **Status:** Not found in `generated_new`.
- **Action:** Continue using `generated/services/FileControllerService.ts` until backend exposes this service in OpenAPI V3.

### 2. WxMpControllerService
- **Used in:** `src/pages/user/Login/index.tsx` (implied usage for WeChat login if any)
- **Status:** Not found in `generated_new`.

### 3. WsMessageControllerService
- **Used in:** `src/services/ws.ts` (if exists) or other WebSocket related files.
- **Reference:** `d:\a_project_with_yupi\d-smarterOJ\frontend-smarter-OJ\generated\services\WsMessageControllerService.ts`
- **Status:** Not found in `generated_new`. (WebSockets might not be fully OpenAPI documented).

## Next Steps
1. Verify if `File`, `WxMp`, and `WsMessage` services can be exposed via Gateway.
2. If exposed, re-run `node openapi.config.js` to generate them.
3. Update `src/api.ts` to include them.
4. Migrate remaining usages.
