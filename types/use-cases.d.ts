type UseCaseWithoutParamsAndPromiseResult<TResult> = {
  execute: () => Promise<TResult>;
};

type UseCaseMultiParamsAndPromiseResult<TParam, TResult> = {
  execute: (...params: TParam[]) => Promise<TResult>;
};
