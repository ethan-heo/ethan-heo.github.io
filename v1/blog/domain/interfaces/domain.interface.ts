import type {
    BlogContent,
    BlogItem,
    OriginalBlogContent,
    OriginalBlogItem,
    SearchedBlogItem,
} from "./model.interface.ts";

export interface BlogDomain {
    transformBlogItem: (originalBlogItem: OriginalBlogItem) => BlogItem;
    searchResult: (searchQuery: string, blogItems: BlogItem[]) => BlogItem[];
    validateSearchQuery: (str: string) => void;
    transformSearchResult: (blogItems: BlogItem[]) => SearchedBlogItem[];
    transformOriginalBlogContent: (
        originalBlogContent: OriginalBlogContent,
    ) => BlogContent;
}
