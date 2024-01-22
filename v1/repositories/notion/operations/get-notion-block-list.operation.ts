import { NotionApi } from "@v1/apis/notion/notion.interface"

import { NotionBlockList } from "@v1/domains/notion/models/normalized-notion.model"
import { NotionListBlockChildrenParams } from "@v1/domains/notion/models/notion.model"

export async function getNotionBlockList(notionApi: NotionApi, params: NotionListBlockChildrenParams) {
  let isStopGettingBlockList = true
  let _params = params
  const blocks: NotionBlockList = []

  while (isStopGettingBlockList) {
    const originalBlockList = await notionApi.getNotionBlockList(_params)

    isStopGettingBlockList = originalBlockList.has_more
    _params = {
      ..._params,
      start_cursor: originalBlockList.next_cursor as string,
    }
    blocks.push(...originalBlockList.results.map((result) => ({ ...result, children: [] })))
  }

  const results = Promise.all(
    blocks.map(async (block) => {
      if (block.has_children) {
        const children = (await getNotionBlockList(notionApi, {
          block_id: block.id,
        })) as NotionBlockList
        return {
          ...block,
          children,
        }
      } else {
        return block
      }
    }),
  )

  return results
}
