import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import blogController from "../v1/blog/controller.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { NOTION_API_KEY, NOTION_DATABASE_ID } = process.env;

blogController.notion.init(NOTION_API_KEY as string);
blogController.blog.createBlogListToJSON(
    await blogController.notion.getBlogItemAll(NOTION_DATABASE_ID as string),
    path.resolve(__dirname, "../src/assets/blogs.json"),
);
