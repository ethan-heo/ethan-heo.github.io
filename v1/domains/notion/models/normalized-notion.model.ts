import { NotionDatabaseRes, NotionListBlockChildrenRes } from "./notion.model"

export type NotionDatabaseStatusProperty = "Ready" | "Doing" | "Done"

export type NormalizedNotionDatabaseRes = Pick<
  OverrideObject<
    NotionDatabaseRes,
    "results",
    {
      results: Extract<ArrayElement<NotionDatabaseRes["results"]>, { title: any[] }>
    }
  >,
  "has_more" | "next_cursor" | "results"
>

export type NotionDatabase = NormalizedNotionDatabaseRes["results"]

export type NormalizedNotionBlockListRes = OverrideObject<
  NotionListBlockChildrenRes,
  "results",
  {
    results: Extract<ArrayElement<NotionListBlockChildrenRes["results"]>, { type: string }>[]
  }
>

export type NotionBlockList = (ArrayElement<NormalizedNotionBlockListRes["results"]> & {
  children: NotionBlockList
})[]
