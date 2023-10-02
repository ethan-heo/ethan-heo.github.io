import {
  MyNotionBlockListResult,
  MyNotionDatabaseResult,
  MyNotionDatabaseStatus,
  MyNotionPageResult,
} from "./my-notion.model";
import { NotionNameProperty, NotionStatusProperty } from "./notion-types";
import {
  OriginalNotionBlockListParams,
  OriginalNotionBlockListResponse,
  OriginalNotionBlockResponse,
  OriginalNotionDatabaseParams,
  OriginalNotionDatabaseResponse,
  OriginalNotionPageParams,
  OriginalNotionPageResponse,
  OriginalNotionSearchParams,
  OriginalNotionSearchResponse,
} from "./original-notion.model";

export type NotionDatabaseProperties = NotionStatusProperty<MyNotionDatabaseStatus> & NotionNameProperty;

export type NotionDatabaseParams = OriginalNotionDatabaseParams;

export type NotionDatabaseResponse = OverrideObject<
  OriginalNotionDatabaseResponse,
  "results",
  {
    results: OverrideObject<
      OriginalNotionPageResponse,
      "properties",
      {
        properties: NotionDatabaseProperties;
      }
    >[];
  }
>;

export type NotionSearchParams = OriginalNotionSearchParams;

export type NotionSearchResponse = OverrideObject<
  OriginalNotionSearchResponse,
  "results",
  {
    results: OverrideObject<
      OriginalNotionPageResponse,
      "properties",
      {
        properties: NotionDatabaseProperties;
      }
    >[];
  }
>;

export type NotionPageParams = OriginalNotionPageParams;

export type NotionPageResponse = OriginalNotionPageResponse;

export type NotionDatabaseResult = MyNotionDatabaseResult;

export type NotionOnlyDatabaseResult = MyNotionDatabaseResult["databases"];

export type NotionPageResult = MyNotionPageResult;

export type NotionBlockListParams = OriginalNotionBlockListParams;

export type NotionBlockListResponse = OverrideObject<
  OriginalNotionBlockListResponse,
  "results",
  {
    results: OriginalNotionBlockResponse[];
  }
>;

export type NotionBlockListResult = MyNotionBlockListResult;
