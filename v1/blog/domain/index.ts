import transformBlogItem from "./transform-blog-item.ts";
import searchResult from "./search-result.ts";
import validateSearchQuery from "./validate-search-query.ts";
import transformSearchResult from "./transform-search-result.ts";
import transformOriginalBlogContent from "./transform-original-blog-content.ts";
import transformNestedBlockContent from "./transform-nested-block-content.ts";
import findHeadingBlock from "./find-heading-block.ts";
import transformHeadingBlockToHeadingInfo from "./transform-heading-block-to-heading-info.ts";
import findRelatedBlogItems from "./find-related-blog-item.ts";

const blogDomain = {
    transformBlogItem,
    searchResult,
    validateSearchQuery,
    transformSearchResult,
    transformOriginalBlogContent,
    transformNestedBlockContent,
    findHeadingBlock,
    transformHeadingBlockToHeadingInfo,
    findRelatedBlogItems,
};

export default blogDomain;

export type BlogDomain = typeof blogDomain;
