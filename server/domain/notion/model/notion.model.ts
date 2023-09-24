import {
  GetPageParameters,
  PageObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
  SearchParameters,
  SearchResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type OriginalNotionDatabaseParams = QueryDatabaseParameters;

export type OriginalNotionDatabaseResponse = QueryDatabaseResponse;

export type OriginalNotionSearchParams = SearchParameters;

export type OriginalNotionSearchResponse = SearchResponse;

export type OriginalNotionPageParams = GetPageParameters;

export type OriginalNotionPageResponse = PageObjectResponse;
