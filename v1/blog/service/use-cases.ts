import type { BlogUseCase } from "./use-case.interface";

type TransformBlogListToJSON = BlogUseCase<[string, string], void>;

export const transformBlogListToJSON: TransformBlogListToJSON =
    (domain, repository) => async (id, target) => {
        const blogList = await repository.getOriginalBlogList(id);

        repository.toJSON(domain.transformBlogItems(blogList), target);
    };
