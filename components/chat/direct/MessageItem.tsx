import React, { useState } from "react";
import { Check, CheckCheck, Clock, MoreVertical, Edit2, Trash2 } from "lucide-react";

export default function MessageItem({ msg, isMine, onEdit, onDelete }: any) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} group relative`}>
      <div 
        className={`max-w-[70%] rounded-2xl px-4 py-2 font-inter text-[15px] shadow-sm relative ${
          isMine 
            ? "bg-[#FFAE58] text-white rounded-br-none" 
            : "bg-white text-[var(--text-primary)] border border-gray-200 rounded-bl-none"
        } ${msg.isPending ? "opacity-70" : "opacity-100"}`}
      >
        {/* Message Content */}
        {msg.isDeleted ? (
          <span className="italic text-sm opacity-80">🚫 This message was deleted</span>
        ) : (
          <div className="break-words pr-4">{msg.content}</div>
        )}

        {/* Timestamp & Status */}
        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isMine ? "text-white/80" : "text-gray-400"}`}>
          {msg.isEdited && <span className="italic mr-1">edited</span>}
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          
          {isMine && !msg.isDeleted && (
            <span className="ml-1">
              {msg.isPending ? <Clock size={10} /> : msg.isRead ? <CheckCheck size={12} className="text-blue-500" /> : <Check size={12} />}
            </span>
          )}
        </div>

        {/* Action Menu (Only show if it's my message, not pending, and not deleted) */}
        {isMine && !msg.isPending && !msg.isDeleted && (
          <div className="absolute top-2 -left-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-sm border border-gray-100">
              <MoreVertical size={14} />
            </button>
            
            {showMenu && (
              <div className="absolute top-6 right-0 bg-white shadow-lg border border-gray-100 rounded-lg py-1 w-24 z-20 flex flex-col">
                <button onClick={() => { setShowMenu(false); onEdit(msg); }} className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-50 text-gray-700">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => { setShowMenu(false); onDelete(msg.id); }} className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-red-50 text-red-600">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}