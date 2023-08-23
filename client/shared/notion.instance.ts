import { Client } from "@notionhq/client";

const notionInstance = new Client({
    auth: process.env.NOTION_KEY
})

export default notionInstance
