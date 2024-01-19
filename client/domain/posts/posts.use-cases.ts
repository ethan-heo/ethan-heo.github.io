import { GetPostParams, GetPostResponse, GetPostsParams, GetPostsResponse } from "./posts.model"
import { PostsRepository } from "./posts.repository"

type GetPosts = UseCaseMultiParamsAndPromiseResult<GetPostsParams, GetPostsResponse>

export const getPostsUseCase = (postsRepository: PostsRepository): GetPosts => ({
  execute: (params) => {
    return postsRepository.getPosts(params)
  },
})

type GetPostUseCase = UseCaseMultiParamsAndPromiseResult<GetPostParams, GetPostResponse>

export const getPostUseCase = (postsRepository: PostsRepository): GetPostUseCase => ({
  execute: (params) => {
    return postsRepository.getPost(params)
  },
})
