export const getQueries = <T = string>(url: string, ...params: T[]) => {
  const { searchParams } = new URL(url);

  return params.reduce((acc, param) => {
    acc.set(param, searchParams.get(param as string));

    return acc;
  }, new Map<T, string | null>());
};
