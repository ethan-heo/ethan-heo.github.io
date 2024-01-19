import { NextResponse } from "next/server"

import { NotionModule } from "@v1/adapters/notion.module"

export async function GET() {
  const database = await NotionModule.getNotionDatabases({
    database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID as string,
  })

  return NextResponse.json(database)
}
