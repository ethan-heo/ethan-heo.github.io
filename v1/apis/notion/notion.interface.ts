import {
  NormalizedNotionBlockListRes,
  NormalizedNotionDatabaseRes,
} from "@v1/domains/notion/models/normalized-notion.model"
import {
  NotionDatabaseParams,
  NotionListBlockChildrenParams,
  NotionPageParams,
  NotionPageRes,
} from "@v1/domains/notion/models/notion.model"

export type NotionApi = {
  getNotionPage: (params: NotionPageParams) => Promise<NotionPageRes>
  getNotionDatabases: (params: NotionDatabaseParams) => Promise<NormalizedNotionDatabaseRes>
  getNotionBlockList: (params: NotionListBlockChildrenParams) => Promise<NormalizedNotionBlockListRes>
}
