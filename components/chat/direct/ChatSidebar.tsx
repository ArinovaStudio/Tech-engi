"use client";

import React, { useEffect, useRef } from "react";
import { Search, User as UserIcon, Loader2, X } from "lucide-react";
import Image from "next/image";

export default function ChatSidebar({
  currentUser,
  contacts,
  selectedContact,
  setSelectedContact,
  liveUsers,
  activeTab,
  setActiveTab,
  search,
  setSearch,
  isLoading,
  isValidating,
  isReachingEnd,
  loadMore,

  isOpen,
  onClose,
}: any) {
  const observerTarget = useRef<HTMLDivElement>(null);

  // infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isReachingEnd && !isValidating) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    const el = observerTarget.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [isReachingEnd, isValidating, loadMore]);

  useEffect(() => {
    if (!selectedContact && contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, selectedContact]);

  const getTabs = () => {
    if (currentUser?.role === "ADMIN") return ["ALL", "CLIENT", "ENGINEER"];
    if (currentUser?.role === "CLIENT") return ["ALL", "ADMIN", "ENGINEER"];
    if (currentUser?.role === "ENGINEER") return ["ALL", "ADMIN", "CLIENT"];
    return ["ALL"];
  };

  return (
    <>
      {/* 🔥 OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* 🔥 SIDEBAR */}
      <div
        className={`
          fixed md:static top-0 left-0 z-50
          h-full w-[85%] max-w-[320px]
          bg-white dark:bg-card border-r border-gray-200 dark:border-slate-800
          flex flex-col overflow-hidden

          transform transition-transform duration-300 ease-in-out

          md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* 🔥 HEADER (mobile) */}
        <div className="md:hidden flex items-center justify-between p-3 border-b dark:border-slate-700">
          <h2 className="font-bold text-lg">Messages</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* SEARCH */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFAE58]"
            />
          </div>
        </div>

        {/* TITLE */}
        <div className="px-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-slate-100">Messages</h2>
        </div>

        {/* TABS */}
        <div className="px-3 mb-3">
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
            {getTabs().map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === tab
                    ? "bg-[#FFAE58] text-white"
                    : "text-gray-500 dark:text-slate-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* CONTACT LIST */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2">
          {isLoading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="animate-spin text-[#FFAE58]" />
            </div>
          ) : (
            contacts.map((contact: any) => {
              const isOnline = liveUsers[contact.id];
              const isSelected = selectedContact?.id === contact.id;

              return (
                <button
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    onClose?.(); // close on mobile
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${
                    isSelected
                      ? "border-[#FFAE58] bg-white dark:bg-slate-700"
                      : "border-transparent bg-gray-50 dark:bg-slate-800"
                  }`}
                >
                  {/* avatar */}
                  <div className="relative w-10 h-10">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                      {contact.image ? (
                        <Image
                          src={contact.image}
                          alt="user"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <UserIcon size={18} />
                      )}
                    </div>

                    {isOnline && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-card rounded-full" />
                    )}
                  </div>

                  {/* info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-semibold text-sm truncate">
                      {contact.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 truncate">
                      {contact.lastMessage || "Start chatting..."}
                    </div>
                  </div>
                </button>
              );
            })
          )}

          {/* loader */}
          <div ref={observerTarget} className="h-6 flex justify-center">
            {isValidating && !isLoading && (
              <Loader2 size={16} className="animate-spin text-gray-400" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}