"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { io, type Socket } from "socket.io-client";

let realSocket: Socket | null = null;

function ensureSocket(): Socket {
  if (!realSocket) {
    realSocket = io({ reconnectionDelayMax: 5000 });
    // Visible in the browser console when chat "doesn't go live" (e.g. no socket server running).
    realSocket.on("connect", () => console.info("[socket] connected", realSocket?.id));
    realSocket.on("disconnect", (reason) => console.warn("[socket] disconnected:", reason));
    realSocket.on("connect_error", (err) => console.warn("[socket] connect_error:", err.message));
  }
  return realSocket;
}

export const isSocketConnected = () => realSocket?.connected ?? false;

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

    // Announce now and again after every reconnect: the server forgets us when the link drops.
    const announce = () => globalSocket.emit("user_connected", userId);
    announce();
    globalSocket.on("connect", announce);

    return () => {
      globalSocket.off("connect", announce);
    };
  }, [status, userId]);

  return null;
}