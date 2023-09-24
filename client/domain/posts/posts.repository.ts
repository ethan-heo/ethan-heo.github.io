import { GetPostsParams, GetSearchPostParams, PostResult } from "./posts.model";

export type PostsRepository = {
  getPosts: (params: GetPostsParams) => Promise<PostResult>;
  searchPosts: (params: GetSearchPostParams) => Promise<PostResult>;
};
