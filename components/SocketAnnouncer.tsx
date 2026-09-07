"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { io, type Socket } from "socket.io-client";

let realSocket: Socket | null = null;

function ensureSocket(): Socket {
  if (!realSocket) {
    realSocket = io();
  }
  return realSocket;
}

// Behaves exactly like a Socket to every existing caller, but doesn't
// actually open a connection until the socket is first used.
export const globalSocket: Socket = new Proxy({} as Socket, {
  get(_target, prop, receiver) {
    const socket = ensureSocket();
    const value = Reflect.get(socket, prop, socket);
    return typeof value === "function" ? value.bind(socket) : value;
  },
});

export default function SocketAnnouncer() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (status !== "authenticated" || !userId) return;

    globalSocket.emit("user_connected", userId);

    return () => {
      globalSocket.off("user_connected");
    };
  }, [status, userId]);

  return null;
}