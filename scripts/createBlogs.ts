import BlogAdapter from "../src/modules/blog.ts";
import Notion from "../src/modules/notion.ts";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const { NOTION_API_KEY, NOTION_DATABASE_ID } = process.env;

const notion = new Notion(NOTION_API_KEY as string);
const { getBlogs } = BlogAdapter(notion);

const blogs = await getBlogs({
    database_id: NOTION_DATABASE_ID as string,
});

fs.writeFileSync(
    path.resolve(__dirname, "../src/assets/blogs.json"),
    JSON.stringify(blogs)
);
