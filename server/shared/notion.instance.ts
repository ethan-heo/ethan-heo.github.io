import { Client } from "@notionhq/client";

const notionInstance = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_KEY,
});

export default notionInstance;
