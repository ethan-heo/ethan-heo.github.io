import { NextRequest, NextResponse } from "next/server"

import { NotionModule } from "@v1/adapters/notion.module"

import { NotionPageParams } from "@v1/domains/notion/models/notion.model"

import { getQueries } from "@v1/shared/utils/url.utils"

export async function GET(req: NextRequest) {
  const query = getQueries<keyof NotionPageParams>(req.url as string, "page_id")

  const page = await NotionModule.getNotionPage({
    page_id: query.get("page_id") as string,
  })
  const blocks = await NotionModule.getNotionBlocks({
    block_id: page.id,
  })

  return NextResponse.json({
    page,
    blocks,
  })
}
