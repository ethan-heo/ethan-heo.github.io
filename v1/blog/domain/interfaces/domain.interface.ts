import type {
    BlogContent,
    BlogItem,
    OriginalBlogContentWithChildren,
    OriginalBlogItem,
    SearchedBlogItem,
} from "./model.interface.ts";

export interface BlogDomain {
    transformBlogItem: (originalBlogItem: OriginalBlogItem) => BlogItem;
    searchResult: (searchQuery: string, blogItems: BlogItem[]) => BlogItem[];
    validateSearchQuery: (str: string) => boolean;
    transformSearchResult: (blogItems: BlogItem[]) => SearchedBlogItem[];
    transformOriginalBlogContent: (
        originalBlogContent: OriginalBlogContentWithChildren,
    ) => BlogContent;
}
