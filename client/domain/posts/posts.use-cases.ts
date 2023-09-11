import { NotionDatabasePagingInfo } from "@server/domain/notion/notion.model";

import { GetSearchPagingInfo, Post } from "./posts.model";
import { PostsRepository } from "./posts.repository";

type GetPosts = UseCaseMultiParamsAndPromiseResult<NotionDatabasePagingInfo, Post>;

export const getPostsUseCase = (postsRepository: PostsRepository): GetPosts => ({
  execute: (params) => {
    return postsRepository.getPosts(params);
  },
});

type SearchPosts = UseCaseMultiParamsAndPromiseResult<GetSearchPagingInfo, Post>;

export const searchPostsUseCase = (postsRepository: PostsRepository): SearchPosts => ({
  execute: (params) => {
    return postsRepository.searchPosts(params);
  },
});
