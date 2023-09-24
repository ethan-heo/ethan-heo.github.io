import { GetPostParams, GetPostResponse, GetPostsParams, GetPostsResponse, GetSearchPostParams } from "./posts.model";

export type PostsRepository = {
  getPosts: (params: GetPostsParams) => Promise<GetPostsResponse>;
  searchPosts: (params: GetSearchPostParams) => Promise<GetPostsResponse>;
  getPost: (params: GetPostParams) => Promise<GetPostResponse>;
};
