import { getPostsRepository } from "@v1/repositories/post/post.repository"

import { getPostApi } from "@v1/apis/post/post.api"

import { getPostUseCase } from "@v1/domains/post/use-cases/get-post.use-case"
import { getPostsUseCase } from "@v1/domains/post/use-cases/get-posts.use-case"

import axiosInstance from "@v1/shared/axios.instance"

const postsApi = getPostApi(axiosInstance)
const postsRepository = getPostsRepository(postsApi)

export const PostsModule = {
  getPosts: getPostsUseCase(postsRepository).execute,
  getPost: getPostUseCase(postsRepository).execute,
}
