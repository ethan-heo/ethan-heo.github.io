import {
  NotionDatabaseParams,
  NotionDatabaseResult,
  NotionPageResponse,
  NotionSearchParams,
  NotionSearchResponse,
} from "@server/domain/notion/model";

export type PostResult = NotionDatabaseResult;

export type GetPostsParams = NotionDatabaseParams;

export type GetPostsResponse = NotionPageResponse;

export type GetSearchPostParams = NotionSearchParams;

export type GetSearchPostResponse = NotionSearchResponse;
