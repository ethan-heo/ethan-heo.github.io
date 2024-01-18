import {
  BlockObjectResponse,
  GetPageParameters,
  ListBlockChildrenParameters,
  ListBlockChildrenResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints"

export type NotionDatabaseParams = QueryDatabaseParameters

export type NotionDatabaseRes = QueryDatabaseResponse

export type NotionListBlockChildrenParams = ListBlockChildrenParameters

export type NotionListBlockChildrenRes = ListBlockChildrenResponse

export type NotionBlockObjectRes = BlockObjectResponse

export type NotionPageParams = GetPageParameters

export type NotionPageRes = PageObjectResponse
