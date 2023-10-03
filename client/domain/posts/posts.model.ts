import {
  NotionBlock,
  NotionBlockListResult,
  NotionDatabaseParams,
  NotionDatabaseResult,
  NotionPageParams,
  NotionPageResult,
  NotionSearchParams,
  NotionSearchResponse,
} from "@server/domain/notion/model/notion.model"

export type GetPostsParams = NotionDatabaseParams

export type GetPostsResponse = NotionDatabaseResult

export type GetSearchPostParams = NotionSearchParams

export type GetSearchPostResponse = NotionSearchResponse

export type GetPostParams = NotionPageParams

export type GetPostResponse = {
  page: NotionPageResult
  blocks: NotionBlockListResult
}

export type PostContent = NotionBlock

export type PickPostContent<K extends PostContent["type"]> = Extract<PostContent, { type: K }>

export type PostContentAnnotation = {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
}
