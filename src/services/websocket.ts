/**
 * WebSocket 消息类型
 */
export enum MessageType {
  CHAT = 'chat',
  SYSTEM = 'system', 
  JOIN = 'join',
  LEAVE = 'leave',
  ONLINE_LIST = 'online_list',
  HEARTBEAT = 'heartbeat',
  ERROR = 'error',
  NOTIFICATION = 'notification',
  // 代码协作相关
  CODE_CHANGE = 'code_change',
  CODE_CURSOR = 'code_cursor',
  CODE_SELECTION = 'code_selection',
  CODE_SHARE_START = 'code_share_start',
  CODE_SHARE_END = 'code_share_end',
  CODE_SYNC = 'code_sync',
  // 代码差异显示
  CODE_DIFF = 'code_diff',
  CODE_LINE_CHANGE = 'code_line_change'
}

/**
 * 消息发送状态
 */
export enum MessageStatus {
  SENDING = 'sending',     // 发送中
  SENT = 'sent',           // 已发送
  DELIVERED = 'delivered'  // 已送达（收到ACK）
}

/**
 * WebSocket 消息接口
 */
export interface WebSocketMessage {
  type: MessageType | string;
  content: string;
  userId?: string;
  roomId?: string;
  timestamp?: number;
  data?: Record<string, unknown> & { messageId?: number };
  userName?: string;
  userAvatar?: string;
  status?: MessageStatus;  // 消息状态
}

/**
 * 在线用户信息
 */
export interface OnlineUser {
  userId: string;
  userName: string;
  userAvatar?: string;
  joinTime?: string;
}

/**
 * 代码编辑变更信息
 */
export interface CodeChangeInfo {
  range: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  };
  text: string;
  rangeLength: number;
}

/**
 * 光标位置信息
 */
export interface CursorInfo {
  lineNumber: number;
  column: number;
}

/**
 * 代码选择信息
 */
export interface CodeSelectionInfo {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

/**
 * 代码行变更信息
 */
export interface CodeLineChange {
  lineNumber: number;
  changeType: 'added' | 'modified' | 'deleted';
  oldContent?: string;
  newContent: string;
  timestamp: number;
}

/**
 * 代码差异信息
 */
export interface CodeDiffInfo {
  changes: CodeLineChange[];
  totalLines: number;
  changeId: string; // 用于追踪和清除
}

/**
 * WebSocket 连接状态
 */
export enum ConnectionStatus {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR'
}

/**
 * WebSocket 事件回调
 */
export interface WebSocketCallbacks {
  onMessage?: (message: WebSocketMessage) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
  onError?: (error: Event) => void;
  onOnlineListUpdate?: (users: OnlineUser[]) => void;
  // 代码协作回调
  onCodeChange?: (userId: string, changeInfo: CodeChangeInfo) => void;
  onCodeCursor?: (userId: string, cursorInfo: CursorInfo) => void;
  onCodeSelection?: (userId: string, selectionInfo: CodeSelectionInfo) => void;
  onCodeShareStart?: (userId: string, language?: string, initialCode?: string) => void;
  onCodeShareEnd?: (userId: string) => void;
  onCodeSync?: (code: string, language?: string) => void;
  // 代码差异回调
  onCodeDiff?: (userId: string, diffInfo: CodeDiffInfo) => void;
  onCodeLineChange?: (userId: string, lineChanges: CodeLineChange[]) => void;
}

/**
 * WebSocket 聊天服务
 */
export class WebSocketChatService {
  private ws: WebSocket | null = null;
  private callbacks: WebSocketCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectInterval = 3000;
  private heartbeatInterval: number | null = null;
  private heartbeatIntervalMs = 30000; // 30秒心跳
  
  private currentUserId: string | null = null;
  private currentRoomId: string | null = null;
  private connectionStatus = ConnectionStatus.DISCONNECTED;

  constructor(callbacks: WebSocketCallbacks = {}) {
    this.callbacks = callbacks;
  }

  /**
   * 连接 WebSocket
   */
  connect(roomId: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.disconnect();
        }

        this.currentRoomId = roomId;
        this.currentUserId = userId;
        
        // 构建 WebSocket URL
        const wsUrl = `ws://localhost:83?userId=${userId}&roomId=${roomId}`;
        this.ws = new WebSocket(wsUrl);
        
        this.setConnectionStatus(ConnectionStatus.CONNECTING);

        // 连接成功
        this.ws.onopen = () => {
          console.log('WebSocket 连接成功');
          this.setConnectionStatus(ConnectionStatus.CONNECTED);
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        // 接收消息
        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('解析 WebSocket 消息失败:', error);
          }
        };

        // 连接关闭
        this.ws.onclose = (event) => {
          console.log('WebSocket 连接关闭', event.code, event.reason);
          this.setConnectionStatus(ConnectionStatus.DISCONNECTED);
          this.stopHeartbeat();
          
          // 如果不是主动关闭，尝试重连
          if (event.code !== 1000 && this.shouldReconnect()) {
            this.attemptReconnect();
          }
        };

        // 连接错误
        this.ws.onerror = (error) => {
          console.error('WebSocket 连接错误:', error);
          this.setConnectionStatus(ConnectionStatus.ERROR);
          this.callbacks.onError?.(error);
          reject(error);
        };
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'User disconnect');
      this.ws = null;
    }
    this.stopHeartbeat();
    this.setConnectionStatus(ConnectionStatus.DISCONNECTED);
    this.currentUserId = null;
    this.currentRoomId = null;
  }

  /**
   * 发送聊天消息
   */
  sendChatMessage(content: string, userName?: string, userAvatar?: string) {
    const message: WebSocketMessage = {
      type: MessageType.CHAT,
      content,
      timestamp: Date.now(),
      userName,
      userAvatar
    };
    this.sendMessage(message);
  }

  /**
   * 发送心跳消息
   */
  sendHeartbeat() {
    const message: WebSocketMessage = {
      type: MessageType.HEARTBEAT,
      content: 'ping',
      timestamp: Date.now()
    };
    this.sendMessage(message);
  }

  /**
   * 发送代码变更
   */
  sendCodeChange(changeInfo: CodeChangeInfo) {
    const message: WebSocketMessage = {
      type: MessageType.CODE_CHANGE,
      content: JSON.stringify(changeInfo),
      timestamp: Date.now(),
      userId: this.currentUserId || undefined,
      data: changeInfo
    };
    this.sendMessage(message);
  }

  /**
   * 发送光标位置
   */
  sendCodeCursor(cursorInfo: CursorInfo) {
    const message: WebSocketMessage = {
      type: MessageType.CODE_CURSOR,
      content: JSON.stringify(cursorInfo),
      timestamp: Date.now(),
      userId: this.currentUserId || undefined,
      data: cursorInfo
    };
    this.sendMessage(message);
  }

  /**
   * 发送代码选择范围
   */
  sendCodeSelection(selectionInfo: CodeSelectionInfo) {
    const message: WebSocketMessage = {
      type: MessageType.CODE_SELECTION,
      content: JSON.stringify(selectionInfo),
      timestamp: Date.now(),
      userId: this.currentUserId || undefined,
      data: selectionInfo
    };
    this.sendMessage(message);
  }

  /**
   * 开始代码分享
   */
  sendCodeShareStart(language?: string, initialCode?: string) {
    const message: WebSocketMessage = {
      type: MessageType.CODE_SHARE_START,
      content: `开始分享代码${language ? ` (${language})` : ''}`,
      timestamp: Date.now(),
      userId: this.currentUserId || undefined,
      data: { language, initialCode }
    };
    this.sendMessage(message);
  }

  /**
   * 结束代码分享
   */
  sendCodeShareEnd() {
    const message: WebSocketMessage = {
      type: MessageType.CODE_SHARE_END,
      content: '结束代码分享',
      timestamp: Date.now(),
      userId: this.currentUserId || undefined
    };
    this.sendMessage(message);
  }

  /**
   * 同步代码内容
   */
  sendCodeSync(code: string, language?: string) {
    const message: WebSocketMessage = {
      type: MessageType.CODE_SYNC,
      content: '代码同步',
      timestamp: Date.now(),
      userId: this.currentUserId || undefined, // 重要：设置发送者ID
      data: { code, language }
    };
    this.sendMessage(message);
  }

  /**
   * 发送代码差异信息
   */
  sendCodeDiff(diffInfo: CodeDiffInfo) {
    const message: WebSocketMessage = {
      type: MessageType.CODE_DIFF,
      content: `代码变更 - ${diffInfo.changes.length} 行修改`,
      timestamp: Date.now(),
      userId: this.currentUserId || undefined,
      data: diffInfo
    };
    this.sendMessage(message);
  }

  /**
   * 发送行级变更信息
   */
  sendCodeLineChange(lineChanges: CodeLineChange[]) {
    const message: WebSocketMessage = {
      type: MessageType.CODE_LINE_CHANGE,
      content: `行变更 - ${lineChanges.length} 行`,
      timestamp: Date.now(),
      userId: this.currentUserId || undefined,
      data: lineChanges
    };
    this.sendMessage(message);
  }

  /**
   * 发送消息
   */
  private sendMessage(message: WebSocketMessage) {
    // 更精确类型，让TS通过
    let dataObj: Record<string, unknown> = {};
    if (typeof message.data === 'object' && message.data !== null) {
      dataObj = message.data as Record<string, unknown>;
    } else {
      dataObj = {};
    }
    if (!('messageId' in dataObj) && message.type !== 'ack') {
      // 👇仅赋数字类型
      dataObj.messageId = genMessageId();
    }
    message.data = dataObj;
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('发送消息失败:', error);
      }
    } else {
      console.warn('WebSocket 连接未就绪，无法发送消息');
    }
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(message: WebSocketMessage) {
    // 过滤掉心跳和ACK消息的日志
    if (message.type !== MessageType.HEARTBEAT && message.type !== 'ack') {
      console.log('收到 WebSocket 消息:', message);
    }
    
    // ACK逻辑更安全，data为Record<string,unknown>
    let dataObj: Record<string, unknown> = {};
    if (typeof message.data === 'object' && message.data !== null) {
      dataObj = message.data as Record<string, unknown>;
    }
    // 👇 仅在 messageId 为数字时处理，且跳过心跳和ACK消息
    const shouldSendAck = typeof dataObj.messageId === 'number' && 
                          message.type !== 'ack' && 
                          message.type !== MessageType.HEARTBEAT;
    
    if (shouldSendAck) {
      const ackMsg: WebSocketMessage = {
        type: 'ack',
        content: 'ack',
        timestamp: Date.now(),
        roomId: message.roomId,
        userId: this.currentUserId || undefined,
        data: { messageId: dataObj.messageId }
      };
      this.sendMessage(ackMsg);
    }

    switch (message.type) {
      case MessageType.ONLINE_LIST:
        // 处理在线用户列表更新
        if (message.data && Array.isArray(message.data)) {
          this.callbacks.onOnlineListUpdate?.(message.data);
        }
        break;
        
      case MessageType.HEARTBEAT:
        // 心跳响应，不需要特殊处理，不显示任何提示
        break;
        
      case 'ack':
        // ACK消息不显示在聊天窗口，只用于更新消息状态
        // 通过onMessage传递给上层，由上层决定如何处理（如更新消息状态）
        this.callbacks.onMessage?.(message);
        break;
      case MessageType.SYSTEM:
      case MessageType.NOTIFICATION:
        // SYSTEM和NOTIFICATION消息不显示在UI中，避免干扰用户体验
        // 包括"服务器已收到消息"等自动提示
        // 不调用 onMessage，不在聊天窗口显示
        break;
      case MessageType.ERROR:
        // ERROR消息只在发生错误时通知，不显示在聊天窗口
        if (message.content) {
          console.error('[错误] ' + message.content);
        }
        this.callbacks.onError?.(new Event(message.content));
        // 不调用 onMessage，不在聊天窗口显示
        break;

      // 代码协作消息处理
      case MessageType.CODE_CHANGE:
        if (message.userId && message.data && message.userId !== this.currentUserId) {
          console.log(`处理来自用户 ${message.userId} 的代码变更`);
          this.callbacks.onCodeChange?.(message.userId, message.data as unknown as CodeChangeInfo);
        }
        break;

      case MessageType.CODE_CURSOR:
        if (message.userId && message.data && message.userId !== this.currentUserId) {
          this.callbacks.onCodeCursor?.(message.userId, message.data as unknown as CursorInfo);
        }
        break;

      case MessageType.CODE_SELECTION:
        if (message.userId && message.data && message.userId !== this.currentUserId) {
          this.callbacks.onCodeSelection?.(message.userId, message.data as unknown as CodeSelectionInfo);
        }
        break;

      case MessageType.CODE_SHARE_START:
        if (message.userId) {
          const data = message.data as { language?: string; initialCode?: string } | undefined;
          this.callbacks.onCodeShareStart?.(
            message.userId, 
            data?.language, 
            data?.initialCode
          );
        }
        break;

      case MessageType.CODE_SHARE_END:
        if (message.userId) {
          this.callbacks.onCodeShareEnd?.(message.userId);
        }
        break;

      case MessageType.CODE_SYNC:
        if (message.data && message.userId !== this.currentUserId) {
          // 只处理来自其他用户的代码同步
          console.log(`处理来自用户 ${message.userId} 的代码同步`);
          const data = message.data as { code: string; language?: string };
          this.callbacks.onCodeSync?.(data.code, data.language);
        } else if (message.userId === this.currentUserId) {
          console.log('忽略自己发送的代码同步消息');
        }
        break;

      // 代码差异消息处理
      case MessageType.CODE_DIFF:
        if (message.userId && message.data && message.userId !== this.currentUserId) {
          console.log(`处理来自用户 ${message.userId} 的代码差异`);
          this.callbacks.onCodeDiff?.(message.userId, message.data as unknown as CodeDiffInfo);
        }
        break;

      case MessageType.CODE_LINE_CHANGE:
        if (message.userId && message.data && message.userId !== this.currentUserId) {
          console.log(`处理来自用户 ${message.userId} 的行变更`);
          this.callbacks.onCodeLineChange?.(message.userId, message.data as unknown as CodeLineChange[]);
        }
        break;
        
      default:
        // 其他类型消息传递给回调
        this.callbacks.onMessage?.(message);
        break;
    }
  }

  /**
   * 设置连接状态
   */
  private setConnectionStatus(status: ConnectionStatus) {
    this.connectionStatus = status;
    this.callbacks.onStatusChange?.(status);
  }

  /**
   * 获取连接状态
   */
  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * 是否应该重连
   */
  private shouldReconnect(): boolean {
    return this.reconnectAttempts < this.maxReconnectAttempts && 
           !!this.currentUserId && 
           !!this.currentRoomId;
  }

  /**
   * 尝试重连
   */
  private attemptReconnect() {
    if (!this.shouldReconnect()) return;
    
    this.reconnectAttempts++;
    console.log(`尝试第 ${this.reconnectAttempts} 次重连...`);
    
    setTimeout(() => {
      if (this.currentRoomId && this.currentUserId) {
        this.connect(this.currentRoomId, this.currentUserId).catch(() => {
          console.log('重连失败');
        });
      }
    }, this.reconnectInterval);
  }

  /**
   * 开始心跳
   */
  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, this.heartbeatIntervalMs);
  }

  /**
   * 停止心跳
   */
  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * 是否已连接
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 获取当前房间ID
   */
  getCurrentRoomId(): string | null {
    return this.currentRoomId;
  }

  /**
   * 获取当前用户ID
   */
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  /**
   * 更新回调函数
   */
  updateCallbacks(callbacks: Partial<WebSocketCallbacks>) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }
}

/**
 * WebSocket 服务单例
 */
class WebSocketServiceManager {
  private services: Map<string, WebSocketChatService> = new Map();

  /**
   * 获取或创建房间的 WebSocket 服务
   */
  getService(roomId: string, callbacks?: WebSocketCallbacks): WebSocketChatService {
    let service = this.services.get(roomId);
    
    if (!service) {
      service = new WebSocketChatService(callbacks);
      this.services.set(roomId, service);
    } else if (callbacks) {
      service.updateCallbacks(callbacks);
    }
    
    return service;
  }

  /**
   * 移除房间的 WebSocket 服务
   */
  removeService(roomId: string) {
    const service = this.services.get(roomId);
    if (service) {
      service.disconnect();
      this.services.delete(roomId);
    }
  }

  /**
   * 清理所有服务
   */
  cleanup() {
    this.services.forEach(service => service.disconnect());
    this.services.clear();
  }
}

// 👇 1. 辅助方法：生成唯一数字型 messageId
function genMessageId(): number {
  // 13位毫秒时间戳+5位随机，18位整数，兼容java long
  return Date.now() * 100000 + Math.floor(Math.random() * 100000);
}

export const webSocketManager = new WebSocketServiceManager();
