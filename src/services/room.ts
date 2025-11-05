import { message } from 'antd';
import { RoomControllerService } from '../../generated';
import type {
  RoomAddRequest,
  RoomEditRequest,
  RoomJoinRequest,
  RoomQueryRequest,
  RoomQuitRequest,
  RoomTransferRequest,
  BaseResponse_Page_RoomVO_,
  BaseResponse_RoomVO_,
  BaseResponse_boolean_,
  BaseResponse_long_,
  RoomUpdateRequest
} from '../../generated';

/**
 * Room 服务类
 */
export class RoomService {

  /**
   * 获取房间列表
   */
  static async listRoomVOByPage(params: RoomQueryRequest) {
    try {
      const response = await RoomControllerService.listRoomVoByPageUsingPost(params);
      return response as BaseResponse_Page_RoomVO_;
    } catch (error) {
      message.error('获取房间列表失败');
      throw error;
    }
  }

  /**
   * 获取我的房间列表
   */
  static async listMyRoomVOByPage(params: RoomQueryRequest) {
    try {
      const response = await RoomControllerService.listMyRoomVoByPageUsingPost(params);
      return response as BaseResponse_Page_RoomVO_;
    } catch (error) {
      message.error('获取我的房间列表失败');
      throw error;
    }
  }

  /**
   * 根据ID获取房间详情
   * 为了避免大整数精度丢失，使用安全的方式处理ID
   */
  static async getRoomVOById(id: string | number) {
    try {
      // 对于大整数，直接传递字符串形式，让axios处理
      // 检查是否为安全整数
      let safeId: number;
      if (typeof id === 'string') {
        const parsed = Number(id);
        // 如果超出安全整数范围，使用BigInt进行验证
        if (!Number.isSafeInteger(parsed)) {
          console.warn('房间ID超出JavaScript安全整数范围，使用字符串形式处理');
          // 创建一个自定义请求来处理大整数ID
          return this.getRoomVOByIdWithString(id);
        }
        safeId = parsed;
      } else {
        safeId = id;
      }
      
      const response = await RoomControllerService.getRoomVoByIdUsingGet(safeId);
      return response as BaseResponse_RoomVO_;
    } catch (error) {
      message.error('获取房间详情失败');
      throw error;
    }
  }

  /**
   * 使用字符串ID获取房间详情（处理大整数）
   */
  private static async getRoomVOByIdWithString(id: string): Promise<BaseResponse_RoomVO_> {
    const { request } = await import('../../generated/core/request');
    const { OpenAPI } = await import('../../generated/core/OpenAPI');
    
    const response = await request(OpenAPI, {
      method: 'GET',
      url: '/api/room/get/vo',
      query: {
        'id': id  // 直接使用字符串，让axios序列化
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
    
    return response as BaseResponse_RoomVO_;
  }

  /**
   * 创建房间
   */
  static async addRoom(params: RoomAddRequest) {
    try {
      const response = await RoomControllerService.addRoomUsingPost(params);
      message.success('房间创建成功');
      return response as BaseResponse_long_;
    } catch (error) {
      const errorMessage = (error as Error)?.message || '房间创建失败';
      message.error(errorMessage);
      throw error;
    }
  }

  /**
   * 编辑房间
   */
  static async editRoom(params: RoomEditRequest) {
    try {
      const response = await RoomControllerService.editRoomUsingPost(params);
      message.success('房间编辑成功');
      return response as BaseResponse_boolean_;
    } catch (error) {
      const errorMessage = (error as Error)?.message || '房间编辑失败';
      message.error(errorMessage);
      throw error;
    }
  }

  /**
   * 更新房间
   */
  static async updateRoom(params: RoomUpdateRequest) {
    try {
      const response = await RoomControllerService.updateRoomUsingPost(params);
      message.success('房间更新成功');
      return response as BaseResponse_boolean_;
    } catch (error) {
      const errorMessage = (error as Error)?.message || '房间更新失败';
      message.error(errorMessage);
      throw error;
    }
  }

  /**
   * 加入房间
   */
  static async joinRoom(params: RoomJoinRequest & { roomId?: string | number }) {
    try {
      // 处理大整数roomId
      const processedParams = { ...params };
      if (typeof params.roomId === 'string') {
        const parsed = Number(params.roomId);
        if (!Number.isSafeInteger(parsed)) {
          console.warn('房间ID超出JavaScript安全整数范围');
          return this.joinRoomWithString(params.roomId, params.password || '');
        }
        processedParams.roomId = parsed;
      }
      
      const response = await RoomControllerService.joinRoomUsingPost(processedParams);
      message.success('加入房间成功');
      return response as BaseResponse_boolean_;
    } catch (error) {
      const errorMessage = (error as Error)?.message || '加入房间失败';
      message.error(errorMessage);
      throw error;
    }
  }

  /**
   * 使用字符串ID加入房间（处理大整数）
   */
  private static async joinRoomWithString(roomId: string, password: string): Promise<BaseResponse_boolean_> {
    const { request } = await import('../../generated/core/request');
    const { OpenAPI } = await import('../../generated/core/OpenAPI');
    
    const response = await request(OpenAPI, {
      method: 'POST',
      url: '/api/room/join',
      body: { roomId, password },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
    
    return response as BaseResponse_boolean_;
  }

  /**
   * 退出房间
   */
  static async quitRoom(params: RoomQuitRequest & { roomId?: string | number }) {
    try {
      // 处理大整数roomId
      const processedParams = { ...params };
      if (typeof params.roomId === 'string') {
        const parsed = Number(params.roomId);
        if (!Number.isSafeInteger(parsed)) {
          console.warn('房间ID超出JavaScript安全整数范围');
          return this.quitRoomWithString(params.roomId);
        }
        processedParams.roomId = parsed;
      }
      
      const response = await RoomControllerService.quitRoomUsingPost(processedParams);
      message.success('退出房间成功');
      return response as BaseResponse_boolean_;
    } catch (error) {
      const errorMessage = (error as Error)?.message || '退出房间失败';
      message.error(errorMessage);
      throw error;
    }
  }

  /**
   * 使用字符串ID退出房间（处理大整数）
   */
  private static async quitRoomWithString(roomId: string): Promise<BaseResponse_boolean_> {
    const { request } = await import('../../generated/core/request');
    const { OpenAPI } = await import('../../generated/core/OpenAPI');
    
    const response = await request(OpenAPI, {
      method: 'POST',
      url: '/api/room/quit',
      body: { roomId },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
    
    return response as BaseResponse_boolean_;
  }

  /**
   * 转让队长
   */
  static async transferLeader(params: RoomTransferRequest & { roomId?: string | number }) {
    try {
      // 处理大整数roomId
      const processedParams = { ...params };
      if (typeof params.roomId === 'string') {
        const parsed = Number(params.roomId);
        if (!Number.isSafeInteger(parsed)) {
          console.warn('房间ID超出JavaScript安全整数范围');
          return this.transferLeaderWithString(params.roomId, params.newLeaderUserId || 0);
        }
        processedParams.roomId = parsed;
      }
      
      const response = await RoomControllerService.transferLeaderUsingPost(processedParams);
      message.success('转让队长成功');
      return response as BaseResponse_boolean_;
    } catch (error) {
      const errorMessage = (error as Error)?.message || '转让队长失败';
      message.error(errorMessage);
      throw error;
    }
  }

  /**
   * 使用字符串ID转让队长（处理大整数）
   */
  private static async transferLeaderWithString(roomId: string, newLeaderUserId: number): Promise<BaseResponse_boolean_> {
    const { request } = await import('../../generated/core/request');
    const { OpenAPI } = await import('../../generated/core/OpenAPI');
    
    const response = await request(OpenAPI, {
      method: 'POST',
      url: '/api/room/transfer',
      body: { roomId, newLeaderUserId },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
    
    return response as BaseResponse_boolean_;
  }

  /**
   * 删除房间
   */
  static async deleteRoom(id: string | number) {
    try {
      // 处理大整数ID
      let safeId: number;
      if (typeof id === 'string') {
        const parsed = Number(id);
        if (!Number.isSafeInteger(parsed)) {
          console.warn('房间ID超出JavaScript安全整数范围');
          // 对于超大整数，使用自定义请求
          return this.deleteRoomWithString(id);
        }
        safeId = parsed;
      } else {
        safeId = id;
      }
      
      const response = await RoomControllerService.deleteRoomUsingPost({ id: safeId });
      message.success('房间删除成功');
      return response as BaseResponse_boolean_;
    } catch (error) {
      const errorMessage = (error as Error)?.message || '房间删除失败';
      message.error(errorMessage);
      throw error;
    }
  }

  /**
   * 使用字符串ID删除房间（处理大整数）
   */
  private static async deleteRoomWithString(id: string): Promise<BaseResponse_boolean_> {
    const { request } = await import('../../generated/core/request');
    const { OpenAPI } = await import('../../generated/core/OpenAPI');
    
    const response = await request(OpenAPI, {
      method: 'POST',
      url: '/api/room/delete',
      body: { id },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
    
    return response as BaseResponse_boolean_;
  }

  /**
   * 检查用户是否可以创建房间
   */
  static async canCreateRoom(currentUserId?: number): Promise<boolean> {
    if (!currentUserId) {
      return false; // 未登录不能创建
    }
    
    try {
      const response = await this.listMyRoomVOByPage({
        current: 1,
        pageSize: 50, // 增加页面大小以确保获取所有房间
        sortField: 'createTime',
        sortOrder: 'desc'
      });
      
      if (response.code === 0 && response.data) {
        // 检查是否有创建的房间
        const myCreatedRooms = response.data.records?.filter(room => 
          room.userId === currentUserId
        );
        return (myCreatedRooms?.length ?? 0) === 0;
      }
      return true;
    } catch (error) {
      console.error('检查创建权限失败:', error);
      return true; // 默认允许创建
    }
  }
}

export default RoomService;
