import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

import { NotionModule } from "@server/adapter/notion.module";

import { SearchQueryParams } from "@server/domain/notion/notion.model";

export async function GET(req: NextApiRequest) {
  const database = await NotionModule.searchNotionDatabases(req.query as SearchQueryParams);

  return NextResponse.json(database);
}
