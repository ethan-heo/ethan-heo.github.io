import { NotionApi } from "@server/api/notion/notion.types";

import { NotionDatabaseParams, NotionOnlyDatabaseResult } from "@server/domain/notion/model/notion.model";

import { formatNotionDatabases } from "./format-notion-databases";

const getNotionDatabaseAll = async (notionApi: NotionApi, params: NotionDatabaseParams) => {
  const databases: NotionOnlyDatabaseResult = [];
  let _params = params;
  let isStopGettingDatabases = true;

  while (isStopGettingDatabases) {
    const result = await notionApi.getNotionDatabases(_params);
    const { nextCursor, hasMore, databases } = formatNotionDatabases(result);

    isStopGettingDatabases = hasMore;
    _params = {
      ..._params,
      start_cursor: nextCursor as string,
    };
    databases.push(...databases);
  }

  return databases;
};

export default getNotionDatabaseAll;
