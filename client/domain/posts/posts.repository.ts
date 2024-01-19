import { GetPostParams, GetPostResponse, GetPostsParams, GetPostsResponse } from "./posts.model"

export type PostsRepository = {
  getPosts: (params: GetPostsParams) => Promise<GetPostsResponse>
  getPost: (params: GetPostParams) => Promise<GetPostResponse>
}
