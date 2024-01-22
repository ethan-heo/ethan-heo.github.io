import { GetPostParams, GetPostRes } from "../models/post.model"
import { PostsRepository } from "../post.repository"

type GetPostUseCase = UseCaseMultiParamsAndPromiseResult<GetPostParams, GetPostRes>

export const getPostUseCase = (postsRepository: PostsRepository): GetPostUseCase => ({
  execute: (params) => {
    return postsRepository.getPost(params)
  },
})
