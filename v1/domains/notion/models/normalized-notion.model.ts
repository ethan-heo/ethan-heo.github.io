import { NotionBlockObjectRes, NotionDatabaseRes, NotionListBlockChildrenRes } from "./notion.model"

export type NotionDatabaseStatusProperty = "Ready" | "Doing" | "Done"

export type NotionBlockList = (NotionBlockObjectRes & {
  children: NotionBlockList
})[]

export type NormalizedNotionDatabaseRes = Pick<
  OverrideObject<
    NotionDatabaseRes,
    "results",
    {
      results: Extract<ArrayType<NotionDatabaseRes["results"]>, { title: any[] }>
    }
  >,
  "has_more" | "next_cursor" | "results"
>

export type NotionDatabase = NormalizedNotionDatabaseRes["results"]

export type NormalizedNotionBlockListRes = OverrideObject<
  NotionListBlockChildrenRes,
  "results",
  {
    results: Extract<ArrayType<NotionListBlockChildrenRes["results"]>, { type: string }>[]
  }
>
