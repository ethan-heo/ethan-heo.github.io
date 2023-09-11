import { GetPostPagingInfo, GetSearchPagingInfo, Post } from "./posts.model";

export type PostsRepository = {
  getPosts: (params: GetPostPagingInfo) => Promise<Post>;
  searchPosts: (params: GetSearchPagingInfo) => Promise<Post>;
};
