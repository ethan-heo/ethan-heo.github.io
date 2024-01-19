import { NotionDatabase } from "../models/normalized-notion.model"
import { NotionDatabaseParams } from "../models/notion.model"
import { NotionRepository } from "../notion.repository"

type GetNotionDatabases = UseCaseMultiParamsAndPromiseResult<NotionDatabaseParams, NotionDatabase[]>

/**
 * @name getNotionDatabasesUseCase
 * @description 노션 데이터베이스의 모든 목록을 조회합니다.
 */
export const getNotionDatabaseAllUseCase = (notionRepository: NotionRepository): GetNotionDatabases => ({
  execute: (params) => {
    return notionRepository.getNotionDatabaseAll(params)
  },
})
