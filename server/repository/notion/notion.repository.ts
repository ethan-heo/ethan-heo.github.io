import { NotionApi } from "@server/api/notion/notion.types";

import { NotionRepository } from "@server/domain/notion/notion.repository";

import { formatNotionDatabases } from "./operations/format-notion-databases";

export const getNotionRepository = (notionApi: NotionApi): NotionRepository => ({
  getNotionDatabases: async (params) => {
    const originalDatabase = await notionApi.getNotionDatabases(params);

    return formatNotionDatabases(originalDatabase);
  },
});
