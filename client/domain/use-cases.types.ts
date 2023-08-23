export type UseCaseWithoutParamsAndPromiseResult<TResult> = {
    execute: () => Promise<TResult>;
}

export type UseCaseMultiParamsAndPromiseResult<TParam, TResult> = {
    execute: (...params: TParam[]) => Promise<TResult>
}