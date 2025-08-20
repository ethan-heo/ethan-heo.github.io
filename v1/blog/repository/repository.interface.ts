import type {
    BlogItem,
    OriginalBlogContentWithChildren,
    OriginalBlogItem,
} from "../domain/interfaces/model.interface.ts";

export interface BlogRepository {
    notion: {
        init: (apiKey: string) => void;
        getOriginalBlogItemAll: (id: string) => Promise<OriginalBlogItem[]>;
        getOriginalContentAll: (
            id: string,
        ) => Promise<OriginalBlogContentWithChildren[]>;
    };
    blog: {
        getBlogList: (page: number, size?: number) => BlogItem[];
        hasNextBlogList: (page: number, size?: number) => boolean;
        toJSON: (blogItems: BlogItem[], target: string) => void;
    };
}
