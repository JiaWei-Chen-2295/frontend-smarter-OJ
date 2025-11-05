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
  NOTIFICATION = 'notification'
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
  data?: any;
  userName?: string;
  userAvatar?: string;
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
  private heartbeatInterval: NodeJS.Timeout | null = null;
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
   * 发送消息
   */
  private sendMessage(message: WebSocketMessage) {
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
    console.log('收到 WebSocket 消息:', message);
    
    switch (message.type) {
      case MessageType.ONLINE_LIST:
        // 处理在线用户列表更新
        if (message.data && Array.isArray(message.data)) {
          this.callbacks.onOnlineListUpdate?.(message.data);
        }
        break;
        
      case MessageType.HEARTBEAT:
        // 心跳响应，不需要特殊处理
        break;
        
      case MessageType.ERROR:
        console.error('服务器错误:', message.content);
        this.callbacks.onError?.(new Event(message.content));
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
           this.currentUserId && 
           this.currentRoomId;
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

export const webSocketManager = new WebSocketServiceManager();
