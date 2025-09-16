import transformBlogItem from "./transformBlogItem.ts";
import searchResult from "./searchResult.ts";
import validateSearchQuery from "./validateSearchQuery.ts";
import transformSearchResult from "./transformSearchResult.ts";
import transformOriginalBlogContent from "./transformOriginalBlogContent.ts";
import transformNestedBlockContent from "./transformNestedBlockContent.ts";
import findHeadingBlock from "./findHeadingBlock.ts";
import transformHeadingBlockToHeadingInfo from "./transformHeadingBlockToHeadingInfo.ts";
import findRelatedBlogItems from "./findRelatedBlogItem.ts";

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
