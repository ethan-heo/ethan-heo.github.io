import { GetPostsParams, GetPostsRes } from "../models/post.model"
import { PostsRepository } from "../post.repository"

type GetPosts = UseCaseMultiParamsAndPromiseResult<GetPostsParams, GetPostsRes>

export const getPostsUseCase = (postsRepository: PostsRepository): GetPosts => ({
  execute: (params) => {
    return postsRepository.getPosts(params)
  },
})
