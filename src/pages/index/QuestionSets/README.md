# 题单模块 (QuestionSet)

## 概述

题单模块允许用户创建、管理和练习题目集合。基于接口文档 `@doc\题目单接口文档.md` 实现。

## 功能特性

### 1. 题单列表页面 (`/question-sets`)

- **查看模式切换**：
  - `我的题单`：查看当前用户创建的题单
  - `全部题单`：查看所有公开题单（需登录才能查看详情）

- **搜索功能**：按标题模糊搜索题单

- **创建题单**：
  - 标题（必填，≤80字符）
  - 描述（选填，≤1024字符）
  - 标签（选填，支持多标签，按回车添加）

- **列表展示**：
  - 题单标题和图标
  - 题目数量、收藏数
  - 创建者信息和时间
  - 题单描述（带省略）
  - 标签展示
  - 操作按钮：查看详情、编辑、删除（仅本人）

### 2. 题单详情页面 (`/question-set/:id`)

- **基本信息展示**：
  - 题单标题、描述
  - 创建者信息（头像、用户名、简介）
  - 统计信息：题目数、收藏数、时间

- **题目列表**：
  - 显示所有题目（带编号、标题、标签）
  - 显示题目统计（提交数、通过率）
  - 点击题目跳转到 OJ 解题页面

- **操作功能**（仅创建者）：
  - 添加题目到题单
  - 从题单移除题目
  - 删除整个题单

- **添加题目模态框**：
  - 搜索可添加的题库题目
  - 多选模式确认添加
  - 自动过滤已存在的题目

### 3. 题单编辑页面 (`/question-set/edit/:id`)

- **预填数据**：自动加载原有信息
- **表单编辑**：
  - 修改标题
  - 修改描述
  - 管理标签（添加/删除）
- **实时验证**：字符长度限制

## 文件结构

```
src/pages/index/QuestionSets/
├── index.tsx                    # 题单列表页面
├── QuestionSets.css            # 列表页面样式
├── QuestionSetDetail/
│   ├── index.tsx               # 题单详情页面
│   └── QuestionSetDetail.css   # 详情页面样式
└── QuestionSetEdit/
    ├── index.tsx               # 题单编辑页面
    └── QuestionSetEdit.css     # 编辑页面样式

src/services/
└── questionSetService.ts       # 题单业务服务层

generated/
├── models/
│   ├── QuestionSet.ts          # 数据模型
│   ├── QuestionSetVO.ts        # 视图对象
│   ├── QuestionSetAddRequest.ts
│   ├── QuestionSetEditRequest.ts
│   ├── QuestionSetUpdateRequest.ts
│   ├── QuestionSetQueryRequest.ts
│   ├── QuestionSetItemAddRequest.ts
│   ├── QuestionSetItemRemoveRequest.ts
│   ├── Page_QuestionSetVO_.ts
│   ├── BaseResponse_QuestionSetVO_.ts
│   └── BaseResponse_Page_QuestionSetVO_.ts
└── services/
    └── QuestionSetControllerService.ts   # API 服务类
```

## 路由配置

在 `src/config/router.config.tsx` 中添加：

```typescript
// 题单模块
import QuestionSets from "../pages/index/QuestionSets";
import QuestionSetDetail from "../pages/index/QuestionSets/QuestionSetDetail";
import QuestionSetEdit from "../pages/index/QuestionSets/QuestionSetEdit";

// 在 OJIndex 的 children 中添加：
{
    path: "question-sets",
    element: <QuestionSets />
},
{
    path: "question-set/:id",
    element: <QuestionSetDetail />
},
{
    path: "question-set/edit/:id",
    element: <QuestionSetEdit />
}
```

## 导航菜单更新

在 `src/config/NavBarItem.config.tsx` 中添加：

```typescript
{
    key: '3',
    label: '题单',
    path: '/question-sets',
    icon: <BookOutlined />,
}
```

## 接口映射

| 功能 | API 路径 | 服务方法 |
|------|---------|---------|
| 创建题单 | `/api/questionSet/add` | `createQuestionSet` |
| 删除题单 | `/api/questionSet/delete` | `deleteQuestionSet` |
| 编辑题单 | `/api/questionSet/edit` | `editQuestionSet` |
| 我的题单列表 | `/api/questionSet/my/list/page/vo` | `getMyQuestionSets` |
| 全部题单列表 | `/api/questionSet/list/page/vo` | `getAllQuestionSets` |
| 题单详情 | `/api/questionSet/get/vo` | `getQuestionSetDetail` |
| 添加题目 | `/api/questionSet/item/add` | `addQuestionToSet` |
| 移除题目 | `/api/questionSet/item/remove` | `removeQuestionFromSet` |

## 状态管理

- **客户端状态**：使用 React Hooks (`useState`, `useEffect`)
- **Loading 状态**：列表加载、详情加载、提交状态
- **Modal 状态**：创建/编辑、添加题目、删除确认
- **分页状态**：当前页码、总数、页大小

## 样式设计

- **CSS 命名**：以 `qs-` 为前缀，遵循 BEM 规范
- **响应式布局**：支持移动端适配
- **主题颜色**：
  - 主色：`#1890ff` (蓝色)
  - 成功：`#52c41a` (绿色)
  - 警告：`#faad14` (黄色)
  - 危险：`#ff4d4f` (红色)

## 使用示例

### 访问题单列表
```
访问 /question-sets
```

### 查看题单详情
```
访问 /question-set/1
```

### 编辑题单
```
访问 /question-set/edit/1
（需登录且为创建者）
```

## 注意事项

1. **权限控制**：
   - 创建题单需要登录
   - 删除/编辑题单需要是创建者或管理员
   - 添加/移除题目需要是创建者或管理员

2. **标签处理**：
   - 输入时按回车添加标签
   - 点击 × 删除标签
   - 限制总长度 ≤ 8192 字符

3. **分页查询**：
   - 每页显示 10 条记录
   - 列表接口只返回部分题目作为预览
   - 详情接口返回完整题目列表

4. **错误处理**：
   - 40001: 参数错误
   - 40404: 资源不存在
   - 40303: 无权限
   - 40101: 未登录

## 待后端实现的接口

当前前端代码已准备就绪，需要后端提供以下接口：
- `POST /api/questionSet/add` - 创建题单
- `POST /api/questionSet/delete` - 删除题单
- `POST /api/questionSet/edit` - 编辑题单
- `POST /api/questionSet/list/page/vo` - 公开题单列表
- `POST /api/questionSet/my/list/page/vo` - 我的题单列表
- `GET /api/questionSet/get/vo` - 题单详情
- `POST /api/questionSet/item/add` - 添加题目
- `POST /api/questionSet/item/remove` - 移除题目

## 开发进度

- ✅ 类型定义
- ✅ API 服务类
- ✅ 业务服务层
- ✅ 题单列表页面
- ✅ 题单详情页面
- ✅ 题单编辑页面
- ✅ 路由配置
- ✅ 导航菜单
- ✅ CSS 样式
