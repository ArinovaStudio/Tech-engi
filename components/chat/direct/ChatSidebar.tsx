import React, { useState } from "react";
import { Search, User as UserIcon } from "lucide-react";
import Image from "next/image";

export default function ChatSidebar({ currentUser, contacts, selectedContact, setSelectedContact, liveUsers }: any) {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter((c: any) => {
    const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === "ALL") return true;
    return c.role === activeTab;
  });

  const getTabs = () => {
    if (currentUser?.role === "ADMIN") return ["ALL", "CLIENT", "ENGINEER"];
    if (currentUser?.role === "CLIENT") return ["ALL", "ADMIN", "ENGINEER"];
    if (currentUser?.role === "ENGINEER") return ["ALL", "ADMIN", "CLIENT"];
    return ["ALL"];
  };

  return (
    <div className="w-[320px] shrink-0 border-r border-[var(--border)] flex flex-col bg-gray-50/30">
      <div className="p-4 border-b border-[var(--border)] bg-white">
        <h2 className="font-bold font-id text-xl text-[var(--text-primary)] mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] font-inter"
          />
        </div>
      </div>

      <div className="flex p-2 gap-1 bg-white border-b border-[var(--border)]">
        {getTabs().map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md font-inter transition-colors ${
              activeTab === tab ? "bg-[#FFAE58] text-white" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab === "ALL" ? "All" : tab === "ENGINEER" ? "Engineers" : tab === "CLIENT" ? "Clients" : "Admins"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400 font-inter">No contacts found.</div>
        ) : (
          filteredContacts.map((contact: any) => {
            const isOnline = liveUsers[contact.id] || false;
            return (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full flex items-center gap-3 p-3 border-b border-gray-100 transition-colors text-left hover:bg-gray-50 ${
                  selectedContact?.id === contact.id ? "bg-[#fff4e6]" : ""
                }`}
              >
                <div className="relative w-10 h-10 shrink-0 rounded-full bg-gray-200 flex items-center justify-center border border-gray-200">
                  {contact.image ? (
                    <Image src={contact.image} alt={contact.name} width={40} height={40} className="object-cover rounded-full" />
                  ) : (
                    <UserIcon size={20} className="text-gray-500" />
                  )}
                  {/* Real-time Green Dot */}
                  {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-sm text-[var(--text-primary)] truncate font-inter">{contact.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate font-inter">
                    {contact.lastMessage || `Start a conversation...`}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}