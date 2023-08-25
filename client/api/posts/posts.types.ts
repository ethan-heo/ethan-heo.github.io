import { GetPostPagingInfo, Post } from "@client/domain/posts/posts.model";

export type PostApi = {
  getPosts: (params: GetPostPagingInfo) => Promise<Post>;
};
