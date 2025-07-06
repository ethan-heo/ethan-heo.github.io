/**
 * 아티클 데이터 모델링
 *
 * 1. 요구사항
 *  - 메인 페이지
 *    - 최소 6개의 인기있는 아티클을 보여주기
 *  - 아티클 페이지
 *    - Infinite scrolling
 *    - 아티클 검색
 *    - 모든 카테고리 가져오기
 *  - notion 데이터 normalize
 *    - databases 목록
 *    - block 데이터
 * 2. 필요 데이터
 *  - 아티클: 식별자, 제목, 생성 날짜, 배경, Properties(연관된 페이지, 카테고리, 읽는 시간, 간략한 설명), 컨텐츠,
 * 3. 인터페이스
 *  - 인기 아티클 가져오기
 *  - 아티클 가져오기
 *  - 아티클 검색하기
 *  - 모든 카테고리 가져오기
 *  - databases 목록 일반화
 *  - block 데이터 일반화
 */

import type {
    ListBlockChildrenParameters,
    QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";
import type { DatabaseResult, NotionAPI } from "./notion";
import type { BlockResult } from "./notion-block-normalizer";

type CreateBlogAPI<Params, Result, API = NotionAPI> = (
    notionApi: API,
) => (params: Params) => Result;

type CreateBlogAPIWithMultiParams<
    Params extends any[],
    Result,
    API = NotionAPI,
> = (notionApi: API) => (...params: Params) => Result;

type GetBlogs = CreateBlogAPI<QueryDatabaseParameters, Promise<BlogItem[]>>;

/**
 * @description 블로그 목록 정보를 가져오기 위한 기능
 */
const getBlogs: GetBlogs = (notionApi) => async (params) => {
    const databases = await notionApi.getDatabaseAll(params);

    return databases.map(normalizeDatabases);
};

type GetCategories = CreateBlogAPI<BlogItem[], BlogCategories, void>;

/**
 * @description 데이터 베이스의 모든 카테고리를 수집하기 위한 기능
 */
const getCategories: GetCategories = () => (blogItems) => {
    return [
        ...blogItems.reduce((categories, blogItem) => {
            for (const category of blogItem.categories)
                categories.add(category);
            return categories;
        }, new Set<string>()),
    ];
};

type GetContents = CreateBlogAPI<
    ListBlockChildrenParameters,
    Promise<BlockResult[]>
>;

/**
 * @description 노션 페이지의 컨텐츠를 불러오기 위한 기능
 */
const getContents: GetContents = (notionApi) => (params) => {
    return notionApi.getBlockAll(params);
};

type SearchBlog = CreateBlogAPIWithMultiParams<
    [BlogItem[], string],
    BlogItem[],
    void
>;

/**
 * @description 블로그 목록에서 검색한 단어와 일치하는 목록을 반환하기 위한 기능
 */
const searchBlog: SearchBlog = () => (blogs, searchText) => {
    return blogs.filter((blog) => blog.title.includes(searchText));
};

// Notion API의 실제 데이터와 타입이 맞지 않는 이슈로
// @notionhp/client 패키지를 사용하는게 아닌 Web API를 사용하는 방식으로 변경할 수 있어
// Adapter를 통해 결합도를 줄이는 방향으로 정함.
const blogAdapter = (api: NotionAPI) => ({
    getBlogs: getBlogs(api),
    getCategories: getCategories(),
    getContents: getContents(api),
    searchBlog: searchBlog(),
});

export default blogAdapter;

interface BlogModel {
    id: string;
    title: string;
    createdDate: string;
    backgroundImage: string;
    categories: string[];
    related: string[];
    readTime: number;
    description: string;
    contents: any[];
    popular: number;
    url: string;
}

type BlogItem = Pick<
    BlogModel,
    | "id"
    | "title"
    | "readTime"
    | "createdDate"
    | "backgroundImage"
    | "categories"
    | "description"
    | "related"
>;

type BlogCategories = BlogModel["categories"];

function normalizeDatabases(data: DatabaseResult): BlogItem {
    return {
        id: data.id,
        title: data.properties.Name.title[0].plain_text,
        readTime: data.properties.readTime.number,
        createdDate: data.created_time,
        categories: data.properties.category.multi_select.map(
            (option) => option.name,
        ),
        backgroundImage:
            data.cover.type === "external"
                ? data.cover.external.url
                : data.cover.file.url,
        description: data.properties.description.rich_text[0].plain_text,
        related: data.properties.related.relation.map(
            (relation) => relation.id,
        ),
    };
}
