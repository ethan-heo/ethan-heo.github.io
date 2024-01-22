import { Hydrate, dehydrate } from "@tanstack/react-query";
import React from "react";

import getQueryClient from "./getQueryClient";

type ReactQueryPrefetch = {
  key: string | string[];
  callback: () => Promise<any>;
};

function withReactQueryHydration(Component: React.FunctionComponent, prefetch: ReactQueryPrefetch) {
  async function WithReactQueryHydration({ ...props }: any) {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery([prefetch.key], prefetch.callback);
    const dehydratedState = dehydrate(queryClient);

    return (
      <Hydrate state={dehydratedState}>
        <Component {...props} />
      </Hydrate>
    );
  }

  WithReactQueryHydration.displayName = WithReactQueryHydration;

  return WithReactQueryHydration;
}

export default withReactQueryHydration;
