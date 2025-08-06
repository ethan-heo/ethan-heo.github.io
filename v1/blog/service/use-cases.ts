import type {
    BlogContent,
    BlogItem,
} from "../domain/interfaces/model.interface";
import type { BlogUseCase } from "./use-case.interface";

type TransformBlogListToJSON = BlogUseCase<[string, string], void>;

export const transformBlogListToJSON: TransformBlogListToJSON =
    (domain, repository) => async (id, target) => {
        const blogList = await repository.getOriginalBlogList(id);

        repository.toJSON(domain.transformBlogItems(blogList), target);
    };

type GetBlogContents = BlogUseCase<[string], Promise<BlogContent[]>>;

export const getBlogContents: GetBlogContents =
    (domain, repository) => async (id) => {
        const originalContents = await repository.getOriginalContents(id);

        return originalContents.map(domain.transformOriginalBlogContent);
    };

type GetBlogList = BlogUseCase<[number, number], BlogItem[]>;

export const getBlogList: GetBlogList = (_, repository) => (page, size) => {
    return repository.getBlogList(page, size);
};
