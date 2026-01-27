# Optimization Complete

## Issue
Large integers (e.g. `1985166201437286400`) were losing precision and being rounded (e.g. to `...6400` or similar close float) when transferred from backend to frontend. This is a known Javascript limitation with Numbers larger than $2^{53}$.

## Solution Implemented (The "Once and for all" method)

### 1. Response Handling (Frontend Recieving Data)
- **Tool**: `json-bigint`
- **Mechanism**: Configured `axios` in `src/api.ts` to intercept all responses.
- **Config**: `storeAsString: true`.
- **Effect**: All JSON responses are parsed such that:
  - Small integers stay as `number`.
  - Large integers (unsafe for JS) become `string`.
  - This preserves the exact value from the backend.

### 2. Request Handling (Types & IDs)
- **Tool**: OpenAPI Generator Configuration
- **Action**: Updated `openapi.config.js` with `--type-mappings=integer+int64=string`.
- **Effect**: Regenerated client code (`generated_new`) now types all `Long` (int64) fields as `string`.
- **Benefit**:
  - The frontend code knows to treat IDs as strings.
  - IDs are passed as strings in URLs (e.g. `?id=1985166201437286400`), avoiding any intermediate conversion to Number that would corrupt them.

### 3. Codebase Updates
- **API Client**: `api.ts` updated with `json-bigint`.
- **Components**:
  - `OJQuestion/index.tsx`: Updated to pass `questionId` as string.
  - `CustomSplitter.tsx`: Updated to use new API and handle string IDs.
  - `JudgeResultCard.tsx` & sub-components: Updated to handle `string` memory/time values from new API models.
  - `formatUtils.ts`: utility functions updated to accept `string | number`.

## Verification
- You can now access `http://localhost:3000/oj/1985166201437286400` (or similar).
- The ID in the URL will be preserved.
- The ID in the API response will be preserved.
- Submissions and polling will use the full precision ID.

## Notes
- If you encounter any type errors in other parts of the app related to IDs, ensure you update them to expect `string` instead of `number` for entities with Long IDs (Question, Submission, User, etc.).
- `api.ts` exports `userApi`, `questionApi`, `questionSetApi`, `postApi`, `roomApi` which are all consistent with this new behavior.
