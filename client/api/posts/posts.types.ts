import { GetPostsParams, GetSearchPostParams, PostResult } from "@client/domain/posts/posts.model";

export type PostApi = {
  getPosts: (params: GetPostsParams) => Promise<PostResult>;
  searchPosts: (params: GetSearchPostParams) => Promise<PostResult>;
};
