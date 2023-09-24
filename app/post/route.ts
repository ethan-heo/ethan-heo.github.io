import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

import { NotionModule } from "@server/adapter/notion.module";

import { NotionPageParams } from "@server/domain/notion/model/notion.model";

export async function GET(req: NextApiRequest) {
  const query = req.query as NotionPageParams;

  const page = await NotionModule.getNotionPage({
    ...query,
  });
  const blocks = await NotionModule.getNotionBlockList({
    block_id: page.id,
  });

  return NextResponse.json({
    page,
    blocks,
  });
}
