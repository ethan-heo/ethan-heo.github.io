import type {
    BlogItem,
    OriginalBlogContent,
    OriginalBlogItem,
} from "../domain/domain.interface";

export interface BlogRepository {
    getOriginalBlogList: (id: string) => Promise<OriginalBlogItem[]>;
    getOriginalContents: (id: string) => Promise<OriginalBlogContent[]>;
    getBlogList: (page: number, size: number) => BlogItem[];
}
