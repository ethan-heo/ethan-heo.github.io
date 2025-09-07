import type { BlogDomain } from "../domain/index.ts";
import type { BlogRepository } from "../repository/repository.interface.ts";

export type BlogUseCase<P extends any[], R> = (
    domain: BlogDomain,
    repository: BlogRepository,
) => (...param: P) => R;
