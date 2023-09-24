import {
  NotionDatabaseParams,
  NotionDatabaseResult,
  NotionPageDatabaseResponse,
  NotionSearchDatabaseParams,
  NotionSearchDatabaseResponse,
} from "@server/domain/notion/model";

export type PostResult = NotionDatabaseResult;

export type GetPostsParams = NotionDatabaseParams;

export type GetPostsResponse = NotionPageDatabaseResponse;

export type GetSearchPostParams = NotionSearchDatabaseParams;

export type GetSearchPostResponse = NotionSearchDatabaseResponse;
