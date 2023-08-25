import { GetPostPagingInfo, Post } from "./posts.model";

export type PostsRepository = {
  getPosts: (params: GetPostPagingInfo) => Promise<Post>;
};
