import { UseCaseMultiParamsAndPromiseResult } from "@domain/use-cases.types";
import { NotionRepository } from "./notion.repository";
import { NotionDatabases, NotionDatabasePagingInfo } from "./notion.model";


type GetNotionDatabases = UseCaseMultiParamsAndPromiseResult<NotionDatabasePagingInfo, NotionDatabases>
export const getNotionDatabasesUseCase = (notionRepository: NotionRepository): GetNotionDatabases => ({
    execute: (params) => {
        return notionRepository.getNotionDatabases(params)
    }
})