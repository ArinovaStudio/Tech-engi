"use client";

import React, { useState, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { chatFetch, chatErrorMessage } from "@/lib/chat-fetch";
import { useAuth } from "@/hooks/useAuth";
import { globalSocket } from "@/components/SocketAnnouncer";
import ChatSidebar from "./direct/ChatSidebar";
import ChatArea from "./direct/ChatArea";
import { Loader2, Menu } from "lucide-react";

export default function DirectMessageUI() {
  const { user: currentUser } = useAuth();

  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [liveUsers, setLiveUsers] = useState<Record<string, boolean>>({});

  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ✅ MOBILE SIDEBAR STATE
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const getKey = (pageIndex: number, prev: any) => {
    if (prev && !prev.hasMore) return null;

    return `/api/chat/direct/contacts?search=${debouncedSearch}&role=${activeTab}&page=${pageIndex + 1}&limit=20`;
  };

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    (url: string) => chatFetch(url),
    {
      // Re-fetching page 1 on every "load more" is what kept the list spinning forever.
      revalidateFirstPage: false,
      errorRetryCount: 2,
    }
  );

  // A message for someone whose chat with the sender isn't open: refresh the list (last message, order).
  useEffect(() => {
    const onNotify = () => { mutate(); };
    globalSocket.on("new_dm_notification", onNotify);
    return () => { globalSocket.off("new_dm_notification", onNotify); };
  }, [mutate]);

  const contacts = data ? data.flatMap((p: any) => p.contacts || []) : [];
  const isLoadingInitialData = !data && !error;
  // The API tells us when the last page was reached; without this the sidebar's
  // scroll sentinel kept asking for page N+1 in an endless loop.
  const isReachingEnd = !!data && !data[data.length - 1]?.hasMore;
  const contactIdsKey = contacts.map((c: any) => c.id).join(",");

  // Online dots: ask the server who is connected, then follow live changes.
  // (liveUsers was declared but never filled, so everyone always showed offline.)
  useEffect(() => {
    const ids = contactIdsKey ? contactIdsKey.split(",") : [];
    const ask = () => {
      if (ids.length) globalSocket.emit("check_multiple_users_status", ids);
    };
    const onBulk = (statuses: Record<string, boolean>) => setLiveUsers((prev) => ({ ...prev, ...statuses }));
    const onChange = ({ userId, isOnline }: { userId: string; isOnline: boolean }) =>
      setLiveUsers((prev) => ({ ...prev, [userId]: isOnline }));

    globalSocket.on("multiple_users_status_result", onBulk);
    globalSocket.on("user_status_change", onChange);
    globalSocket.on("connect", ask); // statuses are stale after a reconnect
    ask();
    const t = setInterval(ask, 30000); // safety net for any missed event

    return () => {
      globalSocket.off("multiple_users_status_result", onBulk);
      globalSocket.off("user_status_change", onChange);
      globalSocket.off("connect", ask);
      clearInterval(t);
    };
  }, [contactIdsKey]);

  const loadError = error && contacts.length === 0 ? chatErrorMessage(error) : null;

  return (
    <div className="flex h-[90vh] w-full bg-white dark:bg-background overflow-hidden relative">

      {/* ✅ MOBILE TOP BAR */}
      <div className="md:hidden absolute top-2 left-2 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 bg-white dark:bg-card dark:text-slate-200 shadow rounded"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* SIDEBAR */}
      <ChatSidebar
        currentUser={currentUser}
        contacts={contacts}
        selectedContact={selectedContact}
        setSelectedContact={(c: any) => {
          setSelectedContact(c);
          setSidebarOpen(false); // close on mobile
        }}
        liveUsers={liveUsers}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        search={search}
        setSearch={setSearch}
        isLoading={isLoadingInitialData}
        isValidating={isValidating}
        isReachingEnd={isReachingEnd}
        loadError={loadError}
        onRetry={() => mutate()}
        loadMore={() => setSize(size + 1)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* CHAT AREA */}
      <div className="flex-1">
        <ChatArea
          currentUser={currentUser}
          selectedContact={selectedContact}
          isOnline={selectedContact ? liveUsers[selectedContact.id] : false}
          mutateContacts={mutate}
        />
      </div>
    </div>
  );
}