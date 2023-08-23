import { UseCaseMultiParamsAndPromiseResult } from "@domain/use-cases.types";

import { NotionDatabasePagingInfo, NotionDatabases } from "./notion.model";
import { NotionRepository } from "./notion.repository";

type GetNotionDatabases = UseCaseMultiParamsAndPromiseResult<NotionDatabasePagingInfo, NotionDatabases>;
export const getNotionDatabasesUseCase = (notionRepository: NotionRepository): GetNotionDatabases => ({
  execute: (params) => {
    return notionRepository.getNotionDatabases(params);
  },
});
