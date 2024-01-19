import { NotionPageParams, NotionPageRes } from "../models/notion.model"
import { NotionRepository } from "../notion.repository"

type GetNotionPageUseCase = UseCaseMultiParamsAndPromiseResult<NotionPageParams, NotionPageRes>

export const getNotionPageUseCase = (notionRepository: NotionRepository): GetNotionPageUseCase => ({
  execute: (params) => {
    return notionRepository.getNotionPage(params)
  },
})
