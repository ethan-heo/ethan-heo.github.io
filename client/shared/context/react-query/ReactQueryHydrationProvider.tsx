import React from "react";
import { Hydrate, dehydrate } from "react-query";

import getQueryClient from "./getQueryClient";

type ReactQueryPrefetch = {
  key: string | string[];
  callback: () => Promise<any>;
};

type Props = {
  children: React.ReactNode;
  prefetch: ReactQueryPrefetch;
};

async function ReactQueryHydrationProvider({ prefetch, children }: Props) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(prefetch.key, prefetch.callback);
  const dehydratedState = dehydrate(queryClient);

  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}

export default ReactQueryHydrationProvider;
