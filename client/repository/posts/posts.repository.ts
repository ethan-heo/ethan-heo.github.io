import { PostApi } from "@client/api/posts/posts.types";

import { PostsRepository } from "@client/domain/posts/posts.repository";

export const getPostsRepository = (postsApi: PostApi): PostsRepository => ({
  getPosts: (params) => {
    return postsApi.getPosts(params);
  },
  searchPosts: (params) => {
    return postsApi.searchPosts(params);
  },
  getPost: (params) => {
    return postsApi.getPost(params);
  },
});
