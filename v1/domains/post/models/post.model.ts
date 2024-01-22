import { NormalizedNotionDatabaseRes, NotionBlockList } from "@v1/domains/notion/models/normalized-notion.model"
import { NotionDatabaseParams, NotionPageParams, NotionPageRes } from "@v1/domains/notion/models/notion.model"

export type GetPostsParams = NotionDatabaseParams

export type GetPostsRes = NormalizedNotionDatabaseRes

export type GetPostParams = NotionPageParams

export type GetPostRes = {
  page: NotionPageRes
  blocks: NotionBlockList
}

export type PostContent = ArrayElement<NotionBlockList>

export type PickPostContent<K extends PostContent["type"]> = Extract<PostContent, { type: K }>

export type PostContentAnnotation = {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
}
