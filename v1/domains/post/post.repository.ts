import { GetPostParams, GetPostRes, GetPostsParams, GetPostsRes } from "./models/post.model"

export type PostsRepository = {
  getPosts: (params: GetPostsParams) => Promise<GetPostsRes>
  getPost: (params: GetPostParams) => Promise<GetPostRes>
}
