import { GetPostParams, GetPostResponse, GetPostsParams, GetPostsResponse } from "@client/domain/posts/posts.model"

export type PostApi = {
  getPosts: (params: GetPostsParams) => Promise<GetPostsResponse>
  getPost: (params: GetPostParams) => Promise<GetPostResponse>
}
