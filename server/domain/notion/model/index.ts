import { MyNotionDatabaseResult, MyNotionDatabaseStatus } from "./my-notion.model";
import { NotionNameProperty, NotionStatusProperty } from "./notion-types";
import {
  OriginalNotionDatabaseParams,
  OriginalNotionDatabaseResponse,
  OriginalNotionPageDatabaseResponse,
  OriginalNotionSearchDatabaseParams,
  OriginalNotionSearchDatabaseResponse,
} from "./notion.model";

export type NotionDatabaseProperties = NotionStatusProperty<MyNotionDatabaseStatus> & NotionNameProperty;

export type NotionDatabaseParams = OriginalNotionDatabaseParams;

export type NotionDatabaseResponse = OverrideObject<
  OriginalNotionDatabaseResponse,
  "results",
  {
    results: OverrideObject<
      OriginalNotionPageDatabaseResponse,
      "properties",
      {
        properties: NotionDatabaseProperties;
      }
    >[];
  }
>;

export type NotionSearchDatabaseParams = OriginalNotionSearchDatabaseParams;

export type NotionSearchDatabaseResponse = OverrideObject<
  OriginalNotionSearchDatabaseResponse,
  "results",
  {
    results: OverrideObject<
      OriginalNotionPageDatabaseResponse,
      "properties",
      {
        properties: NotionDatabaseProperties;
      }
    >[];
  }
>;

export type NotionPageDatabaseResponse = OriginalNotionPageDatabaseResponse;

export type NotionDatabaseResult = MyNotionDatabaseResult;

export type NotionSearchParams = {
  query?: string;
  start_cursor?: string;
  page_size?: number;
};
