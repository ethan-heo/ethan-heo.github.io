import type {
    BlogContent,
    BlogItem,
    OriginalBlogContent,
    OriginalBlogItem,
    SearchedBlogItem,
} from "./model.interface";

export interface BlogDomain {
    transformBlogItems: (originalBlogItems: OriginalBlogItem[]) => BlogItem[];
    searchResult: (searchQuery: string, blogItems: BlogItem[]) => BlogItem[];
    validateSearchQuery: (str: string) => void;
    transformSearchResult: (blogItems: BlogItem[]) => SearchedBlogItem[];
    transformOriginalBlogContent: (
        originalBlogContent: OriginalBlogContent,
    ) => BlogContent;
}
