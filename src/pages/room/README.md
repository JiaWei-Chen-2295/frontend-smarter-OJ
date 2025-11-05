# Room 模块

这是一个完整的房间管理系统，支持用户创建、加入、管理房间，适用于在线刷题、学习讨论等场景。

## 功能特性

### 🏠 房间列表页 (`/room`)
- 展示所有公开房间
- 支持按房间名称搜索
- 支持按房间状态筛选（公开/私密）
- 房间卡片显示：名称、描述、人数、队长、状态
- 一键加入房间（私密房间需输入密码）

### ➕ 创建房间页 (`/room/create`)
- 每用户限制创建1个房间
- 设置房间名称、描述、最大人数（2-20人）
- 选择房间类型（公开/私密）
- 私密房间需设置密码
- 创建成功后自动跳转到房间详情

### 🔍 房间详情页 (`/room/:roomId`)
- 查看房间完整信息
- 实时显示成员列表（包含队长标识）
- 支持加入/退出房间
- **队长专属权限**：
  - 编辑房间信息
  - 转让队长身份
  - 解散房间
- **成员权限**：
  - 退出房间

### 👤 我的房间页 (`/room/my`)
- 分Tab显示：我创建的房间 / 我加入的房间
- 快速操作：查看详情、编辑、退出、解散
- 显示房间状态和成员数量

## 技术实现

### 页面结构
```
src/pages/room/
├── RoomList/           # 房间列表页
│   ├── index.tsx
│   └── index.css
├── CreateRoom/         # 创建房间页
│   ├── index.tsx
│   └── index.css
├── RoomDetail/         # 房间详情页
│   ├── index.tsx
│   └── index.css
├── MyRooms/           # 我的房间页
│   ├── index.tsx
│   └── index.css
└── README.md
```

### API 服务封装
```typescript
// src/services/room.ts
export class RoomService {
  // 房间列表相关
  static async listRoomVOByPage(params: RoomQueryRequest)
  static async listMyRoomVOByPage(params: RoomQueryRequest)
  
  // 房间操作
  static async addRoom(params: RoomAddRequest)
  static async joinRoom(params: RoomJoinRequest)
  static async quitRoom(params: RoomQuitRequest)
  
  // 房间管理
  static async editRoom(params: RoomEditRequest)
  static async transferLeader(params: RoomTransferRequest)
  static async deleteRoom(id: number)
  
  // 工具方法
  static async canCreateRoom(): Promise<boolean>
}
```

### 路由配置
```typescript
// 主要路由
/room              -> RoomList      (房间列表)
/room/create       -> CreateRoom    (创建房间)
/room/my           -> MyRooms       (我的房间)
/room/:roomId      -> RoomDetail    (房间详情)
```

## 业务规则

### 权限控制
- **所有房间操作需要登录**
- **创建限制**：每用户最多创建1个房间
- **队长权限**：编辑房间、转让队长、解散房间
- **普通成员**：只能退出房间

### 房间状态
- **公开房间** (`status=0`)：任何人可直接加入
- **私密房间** (`status=1`)：需要密码才能加入

### 人数限制
- **最小人数**：2人
- **最大人数**：20人
- **动态调整**：编辑时不能少于当前人数

### 特殊逻辑
- **队长退出** = 解散整个房间
- **房间无人**时自动删除
- **转让队长**后原队长失去管理权限

## 样式设计

### 设计理念
- **现代化界面**：圆角、阴影、渐变色
- **响应式设计**：适配移动端和桌面端
- **一致性体验**：统一的色彩和交互

### 主要配色
- **主色调**：`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **成功色**：`#52c41a` (绿色)
- **警告色**：`#faad14` (金色)
- **危险色**：`#ff4d4f` (红色)

### 响应式断点
- **xs**: `< 576px` (手机)
- **sm**: `≥ 576px` (大手机)
- **md**: `≥ 768px` (平板)
- **lg**: `≥ 992px` (桌面)
- **xl**: `≥ 1200px` (大屏幕)

## 使用指南

### 基本流程
1. **浏览房间**：访问 `/room` 查看所有公开房间
2. **创建房间**：点击"创建房间"按钮，填写房间信息
3. **加入房间**：在房间卡片上点击"加入房间"
4. **管理房间**：队长可以编辑房间信息、管理成员
5. **查看我的**：访问 `/room/my` 管理自己的房间

### 注意事项
- 每个用户只能创建1个房间
- 私密房间需要密码才能加入
- 队长退出会解散整个房间
- 房间最多容纳20人

## 扩展建议

### 功能增强
- [ ] 房间内聊天系统
- [ ] 房间活动记录
- [ ] 房间标签分类
- [ ] 房间推荐算法
- [ ] 实时在线状态

### 性能优化
- [ ] 虚拟滚动（大量房间时）
- [ ] 图片懒加载
- [ ] 数据缓存策略
- [ ] WebSocket 实时更新

### 用户体验
- [ ] 房间收藏功能
- [ ] 最近访问记录
- [ ] 快捷操作菜单
- [ ] 键盘快捷键支持
