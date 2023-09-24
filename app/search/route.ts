import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

import { NotionModule } from "@server/adapter/notion.module";

import { NotionSearchParams } from "@server/domain/notion/model/notion.model";

export async function GET(req: NextApiRequest) {
  const database = await NotionModule.searchNotionDatabases(req.query as NotionSearchParams);

  return NextResponse.json(database);
}
