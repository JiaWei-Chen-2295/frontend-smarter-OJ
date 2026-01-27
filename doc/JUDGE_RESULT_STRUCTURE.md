
# Judge Execution Result Structure

This document describes the structure of the execution result returned by the Judge system.

```json
{
  "message": "String (e.g., Execution successful)",
  "status": "Integer (Success/Fail status code)",
  "outputList": [ "String (Output of each test case)" ],
  "judgeInfo": {
    "message": "String (Detailed message or JSON of ExecuteMessages)",
    "time": "Long (Maximum execution time in Milliseconds)",
    "memory": "Long (Maximum memory usage in Bytes)"
  }
}
```
