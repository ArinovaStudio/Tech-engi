"use client";

import React, { useState, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "@/lib/fetcher";
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

  const { data, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    fetcher
  );

  const contacts = data ? data.flatMap(p => p.contacts || []) : [];
  const isLoadingInitialData = !data && isValidating;

  return (
    <div className="flex h-[90vh] w-full bg-white overflow-hidden relative">

      {/* ✅ MOBILE TOP BAR */}
      <div className="md:hidden absolute top-2 left-2 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 bg-white shadow rounded"
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
        isReachingEnd={false}
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