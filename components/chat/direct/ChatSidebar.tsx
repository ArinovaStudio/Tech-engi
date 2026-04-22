import React, { useEffect, useRef } from "react";
import { Search, User as UserIcon, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ChatSidebar({ 
  currentUser, contacts, selectedContact, setSelectedContact, liveUsers,
  activeTab, setActiveTab, search, setSearch,
  isLoading, isValidating, isReachingEnd, loadMore 
}: any) {

  // Intersection Observer for Infinite Scroll
  const observerTarget = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isReachingEnd && !isValidating) {
        loadMore();
      }
    }, { threshold: 1.0 });
    
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [isReachingEnd, isValidating, loadMore]);

  // Auto-select first contact
  useEffect(() => {
    if (!selectedContact && contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, selectedContact, setSelectedContact]);

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
        {isLoading ? (
          <div className="p-6 flex justify-center"><Loader2 className="animate-spin text-gray-400" size={24} /></div>
        ) : contacts.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400 font-inter">No contacts found.</div>
        ) : (
          contacts.map((contact: any) => {
            if (!contact || !contact.id) return null; // Safe guard against undefined objects

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
                  {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-sm text-[var(--text-primary)] truncate font-inter">{contact.name}</span>
                  </div>
                  
                  {/* Displays Project Name under the User's Name! */}
                  {contact.projectNames && (
                    <p className="text-[10px] text-[var(--primary)] font-semibold truncate mb-0.5">
                      {contact.projectNames}
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500 truncate font-inter">
                    {contact.lastMessage || `Start a conversation...`}
                  </p>
                </div>
              </button>
            );
          })
        )}
        {/* Infinite Scroll Loader Trigger */}
        <div ref={observerTarget} className="h-4 w-full flex justify-center mt-2">
          {isValidating && !isLoading && <Loader2 className="animate-spin text-gray-400" size={16} />}
        </div>
      </div>
    </div>
  );
}