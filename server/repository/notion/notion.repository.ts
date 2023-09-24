import { NotionApi } from "@server/api/notion/notion.types";

import { NotionRepository } from "@server/domain/notion/notion.repository";

import { formatNotionDatabases } from "./operations/format-notion-databases";
import { formatNotionPage } from "./operations/format-notion-page";
import { getNotionBlockList } from "./operations/get-notion-block-list";

export const getNotionRepository = (notionApi: NotionApi): NotionRepository => ({
  getNotionDatabases: async (params) => {
    const originalDatabase = await notionApi.getNotionDatabases(params);

    return formatNotionDatabases(originalDatabase);
  },
  searchNotionDatabases: async (params) => {
    const searchedDatabase = await notionApi.searchNotionDatabases(params);

    return formatNotionDatabases(searchedDatabase);
  },
  getNotionPage: async (params) => {
    const originalPage = await notionApi.getNotionPage(params);

    return formatNotionPage(originalPage);
  },
  getNotionBlockList: async (params) => {
    return await getNotionBlockList(notionApi, params);
  },
});
