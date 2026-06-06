"use client";

import type { Statsig } from "@flags-sdk/statsig";
import {
  StatsigProvider,
  useClientBootstrapInit,
} from "@statsig/react-bindings";
import { StatsigAutoCapturePlugin } from "@statsig/web-analytics";

export function DynamicStatsigProvider({
  children,
  datafile,
}: {
  children: React.ReactNode;
  datafile: NonNullable<
    Awaited<ReturnType<typeof Statsig.getClientInitializeResponse>>
  >;
}) {
  const client = useClientBootstrapInit(
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY as string,
    datafile.user,
    JSON.stringify(datafile),
    {
      environment: { tier: "production" },
      plugins: [new StatsigAutoCapturePlugin()],
    }
  );

  return (
    <StatsigProvider client={client} user={datafile.user}>
      {children}
    </StatsigProvider>
  );
}
