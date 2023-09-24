import { GetPostsParams, GetSearchPostParams, PostResult } from "./posts.model";
import { PostsRepository } from "./posts.repository";

type GetPosts = UseCaseMultiParamsAndPromiseResult<GetPostsParams, PostResult>;

export const getPostsUseCase = (postsRepository: PostsRepository): GetPosts => ({
  execute: (params) => {
    return postsRepository.getPosts(params);
  },
});

type SearchPosts = UseCaseMultiParamsAndPromiseResult<GetSearchPostParams, PostResult>;

export const searchPostsUseCase = (postsRepository: PostsRepository): SearchPosts => ({
  execute: (params) => {
    return postsRepository.searchPosts(params);
  },
});
