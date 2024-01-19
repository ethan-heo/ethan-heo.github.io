import { getPostsRepository } from "@client/repository/posts/posts.repository"

import { getPostApi } from "@client/api/posts/posts.api"

import { getPostUseCase, getPostsUseCase } from "@client/domain/posts/posts.use-cases"

import axiosInstance from "@client/shared/axios.instance"

const postsApi = getPostApi(axiosInstance)
const postsRepository = getPostsRepository(postsApi)

export const PostsModule = {
  getPosts: getPostsUseCase(postsRepository).execute,
  getPost: getPostUseCase(postsRepository).execute,
}
