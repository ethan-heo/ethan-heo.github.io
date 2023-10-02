import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

import { NotionModule } from "@server/adapter/notion.module";

export async function GET(req: NextApiRequest) {
  const database = await NotionModule.getNotionDatabases({
    database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID as string,
  });

  return NextResponse.json(database);
}
