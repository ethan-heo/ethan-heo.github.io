import type {
    BlogItem,
    OriginalBlogContent,
    OriginalBlogItem,
} from "../domain/interfaces/model.interface.ts";

export interface BlogRepository {
    getOriginalBlogItemAll: (id: string) => Promise<OriginalBlogItem[]>;
    getOriginalContentAll: (id: string) => Promise<OriginalBlogContent[]>;
    getBlogList: (page: number, size?: number) => BlogItem[];
    toJSON: (blogItems: BlogItem[], target: string) => void;
}
