# 房间聊天系统

## 🚀 功能概述

基于 WebSocket 的实时房间聊天系统，支持多人在线聊天、在线用户列表、消息类型识别等功能。

## 📁 文件结构

```
src/
├── services/
│   └── websocket.ts           # WebSocket 服务管理
├── components/
│   ├── ChatMessage/           # 聊天消息组件
│   │   ├── index.tsx
│   │   └── index.css
│   ├── OnlineUserList/        # 在线用户列表组件
│   │   ├── index.tsx
│   │   └── index.css
│   └── RoomChat/              # 房间聊天主组件
│       ├── index.tsx
│       ├── index.css
│       └── README.md
└── pages/room/
    └── RoomChat/              # 独立聊天页面
        ├── index.tsx
        └── index.css
```

## 🎯 核心功能

### 1. 实时消息传输
- **发送消息**：支持文本消息发送
- **接收消息**：实时接收房间内所有用户消息
- **消息类型**：支持聊天、系统、加入/离开等多种消息类型

### 2. 在线用户管理
- **用户列表**：实时显示房间内在线用户
- **用户状态**：区分队长、普通成员、当前用户
- **状态更新**：用户加入/离开时自动更新列表

### 3. 连接状态管理
- **自动重连**：连接断开时自动尝试重连（最多3次）
- **心跳机制**：每30秒发送心跳包保持连接
- **状态显示**：实时显示连接状态（已连接/连接中/未连接/错误）

### 4. 用户体验优化
- **消息动画**：消息出现时的滑入动画
- **自动滚动**：新消息自动滚动到底部
- **响应式设计**：适配桌面和移动设备
- **键盘快捷键**：Enter 发送，Shift+Enter 换行

## 💻 使用方法

### 基本使用

```typescript
import RoomChat from '../../../components/RoomChat';

// 在组件中使用
<RoomChat
  roomId="123"
  roomLeaderId="456" 
  visible={true}
/>
```

### 独立聊天页面

访问 `/room/:roomId/chat` 即可进入独立的聊天页面。

### 集成到其他页面

```typescript
import { webSocketManager } from '../../../services/websocket';

// 获取房间的聊天服务
const chatService = webSocketManager.getService(roomId, {
  onMessage: (message) => {
    console.log('收到消息:', message);
  },
  onStatusChange: (status) => {
    console.log('连接状态变化:', status);
  },
  onOnlineListUpdate: (users) => {
    console.log('在线用户更新:', users);
  }
});

// 连接聊天室
await chatService.connect(roomId, userId);

// 发送消息
chatService.sendChatMessage('Hello World!');

// 断开连接
chatService.disconnect();
```

## 🔧 配置说明

### WebSocket 连接配置

```typescript
// WebSocket 服务器地址配置
const WS_BASE_URL = 'ws://localhost:83';

// 连接参数
const connectParams = {
  userId: 'user123',    // 用户ID
  roomId: 'room456'     // 房间ID
};

// 最终连接URL
const wsUrl = `${WS_BASE_URL}?userId=${userId}&roomId=${roomId}`;
```

### 消息格式

```typescript
interface WebSocketMessage {
  type: string;         // 消息类型
  content: string;      // 消息内容  
  userId?: string;      // 发送用户ID
  roomId?: string;      // 房间ID
  timestamp?: number;   // 时间戳
  data?: any;          // 额外数据
  userName?: string;    // 用户名称
  userAvatar?: string;  // 用户头像
}
```

### 支持的消息类型

| 类型 | 说明 | 用途 |
|------|------|------|
| `chat` | 聊天消息 | 用户发送的普通文本消息 |
| `system` | 系统消息 | 系统通知、公告等 |
| `join` | 用户加入 | 有用户加入房间时的通知 |
| `leave` | 用户离开 | 有用户离开房间时的通知 |
| `online_list` | 在线列表 | 在线用户列表更新 |
| `heartbeat` | 心跳 | 保持连接活跃 |
| `error` | 错误消息 | 服务器错误或警告 |
| `notification` | 通知消息 | 一般性通知 |

## 🎨 样式特性

### 设计风格
- **现代化界面**：圆角、阴影、渐变色
- **消息气泡**：类似微信的聊天气泡设计
- **状态指示**：丰富的状态图标和颜色
- **响应式布局**：完美适配移动端

### 主要配色
- **主色调**：`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **成功色**：`#52c41a` (在线状态、加入消息)
- **警告色**：`#faad14` (队长标识)
- **错误色**：`#ff4d4f` (错误消息、离开消息)
- **中性色**：`#8c8c8c` (时间、辅助信息)

## 🔒 权限控制

### 访问权限
- **房间成员**：只有房间成员才能访问聊天功能
- **登录验证**：必须登录才能使用聊天功能
- **房间验证**：后端会验证用户是否有权限加入指定房间

### 操作权限
- **发送消息**：所有房间成员都可以发送消息
- **查看历史**：可以查看当前会话的历史消息
- **在线列表**：可以查看房间内所有在线用户

## 🛡️ 错误处理

### 连接错误
- **网络断开**：自动重连机制（最多3次）
- **服务器错误**：显示友好的错误提示
- **权限拒绝**：跳转到权限说明页面

### 消息错误
- **发送失败**：重试机制和错误提示
- **解析错误**：忽略无效消息并记录日志
- **长度限制**：前端限制消息长度

## 🔄 状态管理

### 连接状态
```typescript
enum ConnectionStatus {
  CONNECTING = 'CONNECTING',    // 连接中
  CONNECTED = 'CONNECTED',      // 已连接
  DISCONNECTED = 'DISCONNECTED', // 已断开
  ERROR = 'ERROR'               // 连接错误
}
```

### 状态流转
```
DISCONNECTED -> CONNECTING -> CONNECTED
     ↑              ↓              ↓
     └──────────────┴──────── ERROR
```

## ⚡ 性能优化

### 消息处理
- **消息限制**：最多保存500条历史消息，自动清理旧消息
- **重复检测**：避免重复添加相同消息
- **批量更新**：合并状态更新减少渲染次数

### 内存管理
- **服务复用**：同一房间共享 WebSocket 连接
- **自动清理**：组件卸载时自动断开连接
- **垃圾回收**：定期清理无效连接和服务

### 网络优化
- **心跳机制**：定期发送心跳包保持连接
- **断线重连**：网络异常时自动重连
- **连接池**：复用 WebSocket 连接

## 🧪 测试建议

### 功能测试
1. **基础功能**：消息发送/接收、在线列表更新
2. **权限测试**：非成员访问、登录状态验证
3. **异常处理**：网络断开、服务器错误
4. **多用户测试**：多个用户同时在线聊天

### 性能测试
1. **大量消息**：发送大量消息测试界面流畅度
2. **多房间切换**：快速切换不同房间的聊天
3. **长时间连接**：测试长时间连接的稳定性
4. **并发连接**：多个标签页同时连接

## 🔮 扩展建议

### 功能扩展
- [ ] 消息撤回功能
- [ ] 消息@功能
- [ ] 表情符号支持  
- [ ] 文件传输
- [ ] 消息搜索
- [ ] 聊天记录导出

### 性能优化
- [ ] 消息懒加载
- [ ] 虚拟滚动
- [ ] WebRTC 音视频
- [ ] 消息压缩
- [ ] CDN 加速

### 用户体验
- [ ] 消息状态（已送达/已读）
- [ ] 输入状态提示
- [ ] 聊天背景主题
- [ ] 字体大小调节
- [ ] 夜间模式
