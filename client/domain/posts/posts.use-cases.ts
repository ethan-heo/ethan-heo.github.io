import { GetPostParams, GetPostResponse, GetPostsParams, GetPostsResponse, GetSearchPostParams } from "./posts.model";
import { PostsRepository } from "./posts.repository";

type GetPosts = UseCaseMultiParamsAndPromiseResult<GetPostsParams, GetPostsResponse>;

export const getPostsUseCase = (postsRepository: PostsRepository): GetPosts => ({
  execute: (params) => {
    return postsRepository.getPosts(params);
  },
});

type SearchPosts = UseCaseMultiParamsAndPromiseResult<GetSearchPostParams, GetPostsResponse>;

export const searchPostsUseCase = (postsRepository: PostsRepository): SearchPosts => ({
  execute: (params) => {
    return postsRepository.searchPosts(params);
  },
});

type GetPostUseCase = UseCaseMultiParamsAndPromiseResult<GetPostParams, GetPostResponse>;

export const getPostUseCase = (postsRepository: PostsRepository): GetPostUseCase => ({
  execute: (params) => {
    return postsRepository.getPost(params);
  },
});
