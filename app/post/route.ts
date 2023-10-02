import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

import { NotionModule } from "@server/adapter/notion.module";

import { NotionPageParams } from "@server/domain/notion/model/notion.model";

import { getQueries } from "@server/shared/utils/url.utils";

export async function GET(req: NextApiRequest) {
  const query = getQueries<keyof NotionPageParams>(req.url as string, "page_id");

  const page = await NotionModule.getNotionPage({
    page_id: query.get("page_id") as string,
  });
  const blocks = await NotionModule.getNotionBlockList({
    block_id: page.id,
  });

  return NextResponse.json({
    page,
    blocks,
  });
}
