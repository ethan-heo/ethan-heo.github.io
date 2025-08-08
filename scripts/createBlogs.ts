import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import createBlogController from "../v1/blog/controller.ts";
import createNotionAPI from "../v1/blog/apis/notion.ts";
import createBlogAPI from "../v1/blog/apis/blog.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { NOTION_API_KEY, NOTION_DATABASE_ID } = process.env;
const controller = createBlogController(createNotionAPI(), createBlogAPI());

controller.notion.init(NOTION_API_KEY as string);

controller.blog.createBlogListToJSON(
    await controller.notion.getBlogItemAll(NOTION_DATABASE_ID as string),
    path.resolve(__dirname, "../src/assets/blogs.json"),
);
