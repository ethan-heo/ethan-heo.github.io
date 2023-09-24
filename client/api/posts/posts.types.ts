import {
  GetPostParams,
  GetPostResponse,
  GetPostsParams,
  GetPostsResponse,
  GetSearchPostParams,
} from "@client/domain/posts/posts.model";

export type PostApi = {
  getPosts: (params: GetPostsParams) => Promise<GetPostsResponse>;
  searchPosts: (params: GetSearchPostParams) => Promise<GetPostsResponse>;
  getPost: (params: GetPostParams) => Promise<GetPostResponse>;
};
