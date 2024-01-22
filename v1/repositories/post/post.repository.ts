import { PostApi } from "@v1/apis/post/post.interface"

import { PostsRepository } from "@v1/domains/post/post.repository"

export const getPostsRepository = (postsApi: PostApi): PostsRepository => ({
  getPosts: (params) => {
    return postsApi.getPosts(params)
  },
  getPost: (params) => {
    return postsApi.getPost(params)
  },
})
