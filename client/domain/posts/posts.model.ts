import {
  NotionBlockListResult,
  NotionDatabaseParams,
  NotionDatabaseResult,
  NotionPageParams,
  NotionPageResponse,
  NotionPageResult,
  NotionSearchParams,
  NotionSearchResponse,
} from "@server/domain/notion/model/notion.model";

export type GetPostsParams = NotionDatabaseParams;

export type GetPostsResponse = NotionDatabaseResult;

export type GetSearchPostParams = NotionSearchParams;

export type GetSearchPostResponse = NotionSearchResponse;

export type GetPostParams = NotionPageParams;

export type GetPostResponse = {
  page: NotionPageResult;
  blocks: NotionBlockListResult;
};
