"use client";

import { StatsigProvider, useClientAsyncInit } from "@statsig/react-bindings";
import { StatsigSessionReplayPlugin } from "@statsig/session-replay";
import { StatsigAutoCapturePlugin } from "@statsig/web-analytics";
import { useMemo } from "react";

import { SITE } from "@/constants";

const STATSIG_USER_STORAGE_KEY = "iconiq:statsig-user-id";

function getStatsigUser() {
  if (typeof window === "undefined") {
    return { userID: "anonymous-ssr" };
  }

  let userID = window.localStorage.getItem(STATSIG_USER_STORAGE_KEY);

  if (!userID) {
    userID = crypto.randomUUID();
    window.localStorage.setItem(STATSIG_USER_STORAGE_KEY, userID);
  }

  return { userID };
}

export default function MyStatsig({ children }: { children: React.ReactNode }) {
  const user = useMemo(() => getStatsigUser(), []);

  const { client } = useClientAsyncInit(SITE.STATSIG_CLIENT_KEY, user, {
    plugins: [new StatsigAutoCapturePlugin(), new StatsigSessionReplayPlugin()],
  });

  return (
    <StatsigProvider client={client} loadingComponent={null}>
      {children}
    </StatsigProvider>
  );
}
