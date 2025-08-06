import type { BlogContent } from "../domain/interfaces/model.interface";
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
