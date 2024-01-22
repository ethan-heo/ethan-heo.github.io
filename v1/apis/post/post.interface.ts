import { GetPostParams, GetPostRes, GetPostsParams, GetPostsRes } from "@v1/domains/post/models/post.model"

export type PostApi = {
  getPosts: (params: GetPostsParams) => Promise<GetPostsRes>
  getPost: (params: GetPostParams) => Promise<GetPostRes>
}
