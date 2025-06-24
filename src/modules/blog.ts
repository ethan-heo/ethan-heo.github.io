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

import type { BlockResult, DatabaseResult } from "./notion";

interface BlogModel {
    id: string;
    title: string;
    createdDate: string;
    backgroundImage: string;
    categories: string[];
    related: BlogModel[];
    readTime: string;
    description: string;
    contents: any[];
    popular: number;
}

type BlogItem = Pick<
    BlogModel,
    "id" | "title" | "readTime" | "createdDate" | "backgroundImage"
>;

type BlogContents = any;

type BlogCategories = BlogModel["categories"];

interface GetBlogParams {
    cursor?: string;
    limit: number;
    hasMore: boolean;
}

const getBlogs = (params: GetBlogParams): BlogItem => {
    return void 0 as any;
};

const getPopularBlogs = (): BlogItem => {
    return void 0 as any;
};

const searchBlogs = (searchItem: string): BlogItem => {
    return void 0 as any;
};

const getAllCategories = (): BlogCategories => {
    return void 0 as any;
};

const normalizeDatabases = (data: DatabaseResult): BlogItem => {
    return void 0 as any;
};

const normalizeBlocks = (data: BlockResult): BlogContents => {
    return void 0 as any;
};
