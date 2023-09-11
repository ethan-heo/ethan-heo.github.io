import { NotionDatabasePagingInfo, NotionDatabases, SearchQueryParams } from "@server/domain/notion/notion.model";

export type Post = NotionDatabases;

export type GetPostPagingInfo = NotionDatabasePagingInfo;

export type GetSearchPagingInfo = SearchQueryParams;
