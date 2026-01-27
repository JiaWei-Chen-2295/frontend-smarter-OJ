import { postApi } from '../api';
import type { PostAddRequest } from '../../generated_new/post';
import type { PostQueryRequest } from '../../generated_new/post';

let thumbTimer: number | null = null;
let favourTimer: number | null = null;

export const createPost = async (params: PostAddRequest) => {
  const res = await postApi.addPost(params);
  return res.data;
};

export const thumbPost = (postId: string | number, callback?: () => void) => {
  if (thumbTimer) clearTimeout(thumbTimer);
  // @ts-ignore
  thumbTimer = setTimeout(async () => {
    // Cast postId to number if needed, assuming API expects number. 
    // generated_new's doThumb takes PostThumbAddRequest which likely has postId as number.
    // The old code passed { postId }.
    await postApi.doThumb({ postId: Number(postId) });
    callback?.();
  }, 300);
};

export const favourPost = (postId: string | number, callback?: () => void) => {
  if (favourTimer) clearTimeout(favourTimer);
  // @ts-ignore
  favourTimer = setTimeout(async () => {
    await postApi.doPostFavour({ postId: Number(postId) });
    callback?.();
  }, 300);
};

export const getMyPosts = async (params: PostQueryRequest) => {
  const res = await postApi.listMyPostVOByPage(params);
  return res.data;
};

export const getAllPosts = async (params: PostQueryRequest) => {
  const res = await postApi.listPostByPage(params);
  return res.data;
};
