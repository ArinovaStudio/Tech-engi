"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { Send, X, CheckSquare, Trash2, Loader2, ChevronUp } from "lucide-react";
import { globalSocket } from "@/components/SocketAnnouncer";
import MessageItem from "../chat/direct/MessageItem";

export default function ChatTab({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  const [roomParticipants, setRoomParticipants] = useState<{ clientId: string, engineerId: string } | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch Chat History & Participants
  const loadMessages = useCallback(async (cursor?: string) => {
    try {
      const url = `/api/chat/${projectId}${cursor ? `?cursor=${cursor}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        if (cursor) {
          setMessages((prev) => [...data.messages, ...prev]);
        } else {
          setMessages(data.messages);
          if (data.clientUserId && data.engineerUserId) {
            setRoomParticipants({ clientId: data.clientUserId, engineerId: data.engineerUserId });
          }
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
        setNextCursor(data.nextCursor);

        if (!isAdmin && user) {
          data.messages.forEach((msg: any) => {
            if (msg.senderId !== user.id && !msg.isRead) {
              globalSocket.emit("mark_dm_read", { messageId: msg.id, readerId: user.id });
            }
          });
        }
      }
    } catch (err) {
      console.error("Failed to load project chat", err);
    } finally {
      setLoadingInitial(false);
      setLoadingMore(false);
    }
  }, [projectId, user, isAdmin]);

  // Initial Load
  useEffect(() => {
    if (user && projectId) {
      loadMessages();
    }
  }, [user, projectId, loadMessages]);

  // Join Socket Room & Listen to Events
  useEffect(() => {
    if (!roomParticipants || !user) return;

    globalSocket.emit("join_dm", { 
      currentUserId: roomParticipants.clientId, 
      targetUserId: roomParticipants.engineerId 
    });

    const handleReceiveMessage = (msg: any) => {
      setMessages((prev) => {
        if (msg.senderId === user.id) {
          const pendingIdx = prev.findIndex(m => m.isPending);
          if (pendingIdx !== -1) {
            const newArr = [...prev];
            newArr[pendingIdx] = msg;
            return newArr;
          }
        }
        return [...prev, msg];
      });
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

      if (!isAdmin && msg.senderId !== user.id) {
        globalSocket.emit("mark_dm_read", { messageId: msg.id, readerId: user.id });
      }
    };

    const handleMessageEdited = (updated: any) => setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    const handleMessageDeleted = ({ messageId }: { messageId: string }) => setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, isDeleted: true, content: "" } : m)));
    const handleMassDeleted = ({ messageIds }: { messageIds: string[] }) => {
      setMessages(prev => prev.map(m => messageIds.includes(m.id) ? { ...m, isDeleted: true, content: "" } : m));
      setSelectedMessageIds(prev => prev.filter(id => !messageIds.includes(id)));
    };
    const handleReadReceipt = ({ messageId }: { messageId: string }) => {
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m)));
    };
    
    const handleDmError = ({ message }: { message: string }) => {
      setError(message);
      setTimeout(() => setError(null), 4000);
    };

    globalSocket.on("receive_dm", handleReceiveMessage);
    globalSocket.on("dm_edited", handleMessageEdited);
    globalSocket.on("dm_deleted", handleMessageDeleted);
    globalSocket.on("mass_dm_deleted", handleMassDeleted);
    globalSocket.on("dm_read_receipt", handleReadReceipt);
    globalSocket.on("dm_error", handleDmError);

    return () => {
      globalSocket.off("receive_dm", handleReceiveMessage);
      globalSocket.off("dm_edited", handleMessageEdited);
      globalSocket.off("dm_deleted", handleMessageDeleted);
      globalSocket.off("mass_dm_deleted", handleMassDeleted);
      globalSocket.off("dm_read_receipt", handleReadReceipt);
      globalSocket.off("dm_error", handleDmError);
    };
  }, [roomParticipants, user, isAdmin]);

  const receiverId = user?.id === roomParticipants?.clientId ? roomParticipants?.engineerId : roomParticipants?.clientId;

  // Action Handlers
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !user || !receiverId || isAdmin) return;
    setError(null);

    if (editingMessage) {
      globalSocket.emit("edit_dm", { messageId: editingMessage.id, senderId: user.id, content: inputMessage.trim() });
      setMessages(prev => prev.map(m => m.id === editingMessage.id ? { ...m, content: inputMessage.trim(), isEdited: true } : m));
      setEditingMessage(null);
    } else {
      const tempMessage = { id: `temp_${Date.now()}`, senderId: user.id, content: inputMessage.trim(), createdAt: new Date().toISOString(), isPending: true };
      setMessages(prev => [...prev, tempMessage]);
      globalSocket.emit("send_dm", { senderId: user.id, receiverId, content: inputMessage.trim() });
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
    setInputMessage("");
  };

  const handleMassDelete = () => {
    if (selectedMessageIds.length === 0 || !user || !receiverId) return;
    setError(null);
    setMessages(prev => prev.map(m => selectedMessageIds.includes(m.id) ? { ...m, isDeleted: true, content: "" } : m));
    globalSocket.emit("mass_delete_dm", { messageIds: selectedMessageIds, senderId: user.id, receiverId });
    setIsSelectMode(false);
    setSelectedMessageIds([]);
  };

  const toggleSelectMessage = (id: string) => setSelectedMessageIds(prev => prev.includes(id) ? prev.filter(msgId => msgId !== id) : [...prev, id]);

  if (loadingInitial) {
    return <div className="flex items-center justify-center h-[500px] bg-white border border-[var(--border)]"><Loader2 className="animate-spin text-[var(--primary)]" /></div>;
  }

  return (
    <div className="flex flex-col bg-white border border-[var(--border)] relative" style={{ height: "calc(100vh - 220px)" }}>
      
      {/* Header Actions (For Mass Delete) - Hidden from Admin */}
      {!isAdmin && (
        <div className="absolute top-4 right-6 z-10">
          {isSelectMode ? (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">
              <button onClick={() => { setIsSelectMode(false); setSelectedMessageIds([]); }} className="text-xs font-medium text-gray-500 hover:text-gray-700 px-2 py-1">Cancel</button>
              <button onClick={handleMassDelete} disabled={selectedMessageIds.length === 0} className="text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded disabled:opacity-50 flex items-center gap-1 transition-colors">
                <Trash2 size={12} /> Delete {selectedMessageIds.length > 0 && `(${selectedMessageIds.length})`}
              </button>
            </div>
          ) : (
             <button onClick={() => setIsSelectMode(true)} className="text-xs font-medium text-gray-400 hover:text-[var(--primary)] flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm border border-gray-100 transition-colors">
              <CheckSquare size={14} /> Select
            </button>
          )}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#f0f2f5] space-y-2">
        {nextCursor && (
          <div className="flex justify-center mb-4">
            <button onClick={() => { setLoadingMore(true); loadMessages(nextCursor); }} disabled={loadingMore} className="flex items-center gap-1 text-xs font-inter text-[var(--text-muted)] bg-white px-3 py-1.5 rounded-full shadow-sm hover:text-[var(--primary)] transition-colors">
              {loadingMore ? <Loader2 size={14} className="animate-spin" /> : <><ChevronUp size={14} /> Load older messages</>}
            </button>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full"><p className="text-sm font-inter text-[var(--text-muted)]">No messages yet.</p></div>
        )}

        {messages.map((msg, index) => {
          const isMine = isAdmin ? msg.sender?.role === "ENGINEER" : msg.senderId === user?.id; 

          const showAdminLabel = isAdmin && (index === 0 || messages[index - 1].senderId !== msg.senderId);

          return (
            <div key={msg.id} className="flex flex-col w-full">
              {/* Admin UI Labels */}
              {showAdminLabel && (
                <span className={`text-[10px] font-semibold text-gray-400 mb-1 px-3 ${isMine ? 'text-right' : 'text-left'}`}>
                  {msg.sender?.name} ({msg.sender?.role === "ENGINEER" ? "Engineer" : "Client"})
                </span>
              )}
              
              <MessageItem 
                msg={msg} 
                isMine={isMine}
                onEdit={(m: any) => { setEditingMessage(m); setInputMessage(m.content); }}
                onDelete={(id: string) => globalSocket.emit("delete_dm", { messageId: id, senderId: user?.id })}
                isSelectMode={isSelectMode && isMine && !isAdmin} 
                isSelected={selectedMessageIds.includes(msg.id)}
                onToggleSelect={toggleSelectMessage}
              />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Error Banner Display */}
      {error && (
        <div className="mx-5 mb-2 mt-2 px-3 py-2 bg-red-50 border border-red-200 flex items-center justify-between rounded-md">
          <p className="text-xs font-inter text-red-600 font-medium">{error}</p>
          <button onClick={() => setError(null)}><X size={13} className="text-red-400 hover:text-red-600" /></button>
        </div>
      )}

      {/* Input Area */}
      {isAdmin ? (
        <div className="p-4 bg-gray-50 border-t border-[var(--border)] flex justify-center">
          <p className="text-xs font-inter text-gray-500 font-medium">You are viewing this project chat as an Admin (Read-Only).</p>
        </div>
      ) : (
        <div className={`p-4 bg-white border-t border-[var(--border)] transition-opacity ${isSelectMode ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {editingMessage && (
            <div className="flex items-center justify-between bg-orange-50 px-4 py-2 rounded-t-lg border-b border-orange-100 text-sm text-orange-800">
              <span>Editing message...</span>
              <button onClick={() => { setEditingMessage(null); setInputMessage(""); }}><X size={16} /></button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] font-inter text-gray-900"
            />
            <button type="submit" disabled={!inputMessage.trim()} className="w-11 h-11 shrink-0 bg-[#FFAE58] text-white rounded-full flex items-center justify-center hover:bg-[#e89b45] disabled:opacity-50">
              <Send size={18} className="ml-1" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}