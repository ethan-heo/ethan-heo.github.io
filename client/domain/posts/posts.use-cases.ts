import { NotionDatabasePagingInfo } from "@server/domain/notion/notion.model";

import { Post } from "./posts.model";
import { PostsRepository } from "./posts.repository";

type GetPosts = UseCaseMultiParamsAndPromiseResult<NotionDatabasePagingInfo, Post>;

export const getPostsUseCase = (postsRepository: PostsRepository): GetPosts => ({
  execute: (params) => {
    return postsRepository.getPosts(params);
  },
});
