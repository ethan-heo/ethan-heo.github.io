import type { BlogDomain } from "../domain/interfaces/domain.interface";
import type { BlogRepository } from "../repository/repository.interface";

export type BlogUseCase<P extends any[], R> = (
    domain: BlogDomain,
    repository: BlogRepository,
) => (...param: P) => R;
