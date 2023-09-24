import {
  PageObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
  SearchParameters,
  SearchResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type OriginalNotionDatabaseParams = QueryDatabaseParameters;

export type OriginalNotionDatabaseResponse = QueryDatabaseResponse;

export type OriginalNotionSearchDatabaseParams = SearchParameters;

export type OriginalNotionSearchDatabaseResponse = SearchResponse;

export type OriginalNotionPageDatabaseResponse = PageObjectResponse;
