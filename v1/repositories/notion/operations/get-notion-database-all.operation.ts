import { NotionApi } from "@v1/apis/notion/notion.interface"

import { NotionDatabase } from "@v1/domains/notion/models/normalized-notion.model"
import { NotionDatabaseParams } from "@v1/domains/notion/models/notion.model"

const getNotionDatabaseAll = async (notionApi: NotionApi, params: NotionDatabaseParams) => {
  const databases: NotionDatabase[] = []
  let _params = params
  let isStopGettingDatabases = true

  while (isStopGettingDatabases) {
    const { next_cursor, has_more, results } = await notionApi.getNotionDatabases(_params)

    isStopGettingDatabases = has_more
    _params = {
      ..._params,
      start_cursor: next_cursor as string,
    }
    databases.push(...results)
  }

  return databases
}

export default getNotionDatabaseAll
