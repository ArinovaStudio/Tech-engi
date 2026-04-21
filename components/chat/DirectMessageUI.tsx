"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useAuth } from "@/app/hooks/useAuth";
import { globalSocket } from "@/components/SocketAnnouncer";
import ChatSidebar from "./direct/ChatSidebar";
import ChatArea from "./direct/ChatArea";

export default function DirectMessageUI() {
  const { user: currentUser } = useAuth();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [liveUsers, setLiveUsers] = useState<Record<string, boolean>>({});

  const { data: contactsData, mutate: mutateContacts } = useSWR("/api/chat/direct/contacts", fetcher);
  const contacts = contactsData?.contacts || [];

  useEffect(() => {
    if (contacts.length === 0) return;

    // Ask server who is online out of our contacts
    const userIds = contacts.map((c: any) => c.id);
    globalSocket.emit("check_multiple_users_status", userIds);

    const handleBulkStatus = (statuses: Record<string, boolean>) => {
      setLiveUsers(prev => ({ ...prev, ...statuses }));
    };

    const handleStatusChange = ({ userId, isOnline }: { userId: string, isOnline: boolean }) => {
      setLiveUsers(prev => ({ ...prev, [userId]: isOnline }));
    };

    globalSocket.on("multiple_users_status_result", handleBulkStatus);
    globalSocket.on("user_status_change", handleStatusChange);

    return () => {
      globalSocket.off("multiple_users_status_result", handleBulkStatus);
      globalSocket.off("user_status_change", handleStatusChange);
    };
  }, [contacts]);

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
      <ChatSidebar 
        currentUser={currentUser} 
        contacts={contacts} 
        selectedContact={selectedContact} 
        setSelectedContact={setSelectedContact}
        liveUsers={liveUsers}
      />
      <ChatArea 
        currentUser={currentUser} 
        selectedContact={selectedContact} 
        isOnline={selectedContact ? liveUsers[selectedContact.id] : false}
        mutateContacts={mutateContacts}
      />
    </div>
  );
}