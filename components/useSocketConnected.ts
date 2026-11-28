"use client";

import { useSyncExternalStore } from "react";
import { globalSocket, isSocketConnected } from "@/components/SocketAnnouncer";

/** True while the websocket is connected. Re-renders on connect/disconnect. SSR-safe (false on the server). */
export function useSocketConnected(): boolean {
  return useSyncExternalStore(
    (notify) => {
      globalSocket.on("connect", notify);
      globalSocket.on("disconnect", notify);
      return () => {
        globalSocket.off("connect", notify);
        globalSocket.off("disconnect", notify);
      };
    },
    isSocketConnected,
    () => false,
  );
}
