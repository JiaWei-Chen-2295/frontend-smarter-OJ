import { questionSetApi } from '../api';
import type { QuestionSetAddRequest, QuestionSetEditRequest, QuestionSetQueryRequest, QuestionSetItemAddRequest, QuestionSetItemRemoveRequest, DeleteRequest } from '../../generated_new/question';

// 创建题单
export const createQuestionSet = async (params: QuestionSetAddRequest) => {
  const res = await questionSetApi.addQuestionSet(params);
  return res.data;
};

// 删除题单
export const deleteQuestionSet = async (id: string) => {
  const res = await questionSetApi.deleteQuestionSet({ id });
  return res.data;
};

// 编辑题单
export const editQuestionSet = async (params: QuestionSetEditRequest) => {
  const res = await questionSetApi.editQuestionSet(params);
  return res.data;
};

// 获取我的题单列表
export const getMyQuestionSets = async (params: QuestionSetQueryRequest) => {
  const res = await questionSetApi.listMyQuestionSetVOByPage(params);
  return res.data;
};

// 获取所有题单列表（公开）
export const getAllQuestionSets = async (params: QuestionSetQueryRequest) => {
  const res = await questionSetApi.listQuestionSetVOByPage(params);
  return res.data;
};

// 获取题单详情
export const getQuestionSetDetail = async (id: string) => {
  // @ts-ignore
  const res = await questionSetApi.getQuestionSetVOById(id);
  return res.data;
};

// 向题单添加题目
export const addQuestionToSet = async (params: QuestionSetItemAddRequest) => {
  const res = await questionSetApi.addQuestionToSet(params);
  return res.data;
};

// 从题单移除题目
export const removeQuestionFromSet = async (params: QuestionSetItemRemoveRequest) => {
  const res = await questionSetApi.removeQuestionFromSet(params);
  return res.data;
};
