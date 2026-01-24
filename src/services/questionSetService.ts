import { QuestionSetControllerService } from '../../generated/services/QuestionSetControllerService';
import type { QuestionSetAddRequest } from '../../generated/models/QuestionSetAddRequest';
import type { QuestionSetEditRequest } from '../../generated/models/QuestionSetEditRequest';
import type { QuestionSetQueryRequest } from '../../generated/models/QuestionSetQueryRequest';
import type { QuestionSetItemAddRequest } from '../../generated/models/QuestionSetItemAddRequest';
import type { QuestionSetItemRemoveRequest } from '../../generated/models/QuestionSetItemRemoveRequest';
import type { DeleteRequest } from '../../generated/models/DeleteRequest';

// 创建题单
export const createQuestionSet = async (params: QuestionSetAddRequest) => {
  return await QuestionSetControllerService.addQuestionSetUsingPost(params);
};

// 删除题单
export const deleteQuestionSet = async (id: number) => {
  return await QuestionSetControllerService.deleteQuestionSetUsingPost({ id });
};

// 编辑题单
export const editQuestionSet = async (params: QuestionSetEditRequest) => {
  return await QuestionSetControllerService.editQuestionSetUsingPost(params);
};

// 获取我的题单列表
export const getMyQuestionSets = async (params: QuestionSetQueryRequest) => {
  return await QuestionSetControllerService.listMyQuestionSetVoByPageUsingPost(params);
};

// 获取所有题单列表（公开）
export const getAllQuestionSets = async (params: QuestionSetQueryRequest) => {
  return await QuestionSetControllerService.listQuestionSetVoByPageUsingPost(params);
};

// 获取题单详情
export const getQuestionSetDetail = async (id: string | number) => {
  return await QuestionSetControllerService.getQuestionSetVoByIdUsingGet(id);
};

// 向题单添加题目
export const addQuestionToSet = async (params: QuestionSetItemAddRequest) => {
  return await QuestionSetControllerService.addQuestionToSetUsingPost(params);
};

// 从题单移除题目
export const removeQuestionFromSet = async (params: QuestionSetItemRemoveRequest) => {
  return await QuestionSetControllerService.removeQuestionFromSetUsingPost(params);
};
