import type {
    BlogContent,
    BlogItem,
    HeadingInfo,
    OriginalBlogContentWithChildren,
    OriginalBlogItem,
    SearchedBlogItem,
} from "./model.interface.ts";
import type { NotionBlogContent } from "./notion-blog-block.interface.ts";

export interface BlogDomain {
    transformBlogItem: (originalBlogItem: OriginalBlogItem) => BlogItem;
    searchResult: (searchQuery: string, blogItems: BlogItem[]) => BlogItem[];
    validateSearchQuery: (str: string) => boolean;
    transformSearchResult: (blogItems: BlogItem[]) => SearchedBlogItem[];
    transformOriginalBlogContent: (
        originalBlogContent: OriginalBlogContentWithChildren,
    ) => NotionBlogContent;
    transformNestedBlockContent: (
        blogContents: NotionBlogContent[],
    ) => BlogContent[];
    findHeadingNodesToDOM: (node: Element) => Element[];
    transformHeadingNodeAttrToHeadingInfo: (
        headingNodes: Element[],
    ) => HeadingInfo[];
}
