import { PostControllerService } from '../../generated/services/PostControllerService';
import { PostThumbControllerService } from '../../generated/services/PostThumbControllerService';
import { PostFavourControllerService } from '../../generated/services/PostFavourControllerService';
import type { PostAddRequest } from '../../generated/models/PostAddRequest';
import type { PostQueryRequest } from '../../generated/models/PostQueryRequest';

let thumbTimer: number | null = null;
let favourTimer: number | null = null;

export const createPost = async (params: PostAddRequest) => {
  return await PostControllerService.addPostUsingPost(params);
};

export const thumbPost = (postId: string | number, callback?: () => void) => {
  if (thumbTimer) clearTimeout(thumbTimer);
  thumbTimer = setTimeout(async () => {
    await PostThumbControllerService.doThumbUsingPost({ postId });
    callback?.();
  }, 300);
};

export const favourPost = (postId: string | number, callback?: () => void) => {
  if (favourTimer) clearTimeout(favourTimer);
  favourTimer = setTimeout(async () => {
    await PostFavourControllerService.doPostFavourUsingPost({ postId });
    callback?.();
  }, 300);
};

export const getMyPosts = async (params: PostQueryRequest) => {
  return await PostControllerService.listMyPostVoByPageUsingPost(params);
};

export const getAllPosts = async (params: PostQueryRequest) => {
  return await PostControllerService.listPostByPageUsingPost(params);
};
