import {
  PageObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
  SearchParameters,
  SearchResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type NotionDatabaseStatus = "Ready" | "Doing" | "Done";

export type NotionDatabases = {
  hasMore: boolean;
  nextCursor: string | null;
  databases: {
    status: NotionDatabaseStatus;
    name: string;
    id: string;
    url: string;
    lastEditedTime: string;
  }[];
};

export type NotionDatabasePagingInfo = QueryDatabaseParameters;

export type NotionDatabaseProperties = {
  Status: {
    id: string;
    type: "status";
    status: {
      id: string;
      name: NotionDatabaseStatus;
      color: string;
    };
  };
  Name: {
    title: {
      plain_text: string;
    }[];
  };
};

export type NotionDatabaseResult = OverrideObject<
  QueryDatabaseResponse,
  "results",
  {
    results: OverrideObject<
      PageObjectResponse,
      "properties",
      {
        properties: NotionDatabaseProperties;
      }
    >[];
  }
>;

export type OriginalNotionDatabaseResult = QueryDatabaseResponse;

export type SearchNotionDatabasePagingInfo = SearchParameters;

export type SearchNotionDatabaseResult = SearchResponse;

export type SearchQueryParams = {
  query?: string;
  start_cursor?: string;
  page_size?: number;
};
