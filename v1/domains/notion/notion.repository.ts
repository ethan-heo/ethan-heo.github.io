import { NotionBlockListParams } from "@server/domain/notion/model/notion.model"

import { NormalizedNotionDatabaseRes, NotionBlockList } from "./models/normalized-notion.model"
import { NotionDatabaseParams, NotionPageParams, NotionPageRes } from "./models/notion.model"

export type NotionRepository = {
  getNotionDatabases: (params: NotionDatabaseParams) => Promise<NormalizedNotionDatabaseRes>
  getNotionPage: (params: NotionPageParams) => Promise<NotionPageRes>
  getNotionBlocks: (params: NotionBlockListParams) => Promise<NotionBlockList>
}
