import React, { useState } from "react";
import { Check, CheckCheck, Clock, ChevronDown, Edit2, Trash2 } from "lucide-react";

export default function MessageItem({ 
  msg, isMine, onEdit, onDelete, isSelectMode = false, isSelected = false, onToggleSelect 
}: any) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div 
      onClick={() => {
        if (isSelectMode && onToggleSelect && !msg.isDeleted) onToggleSelect(msg.id);
      }}
      className={`flex items-center w-full mb-2 ${isSelectMode && !msg.isDeleted ? "cursor-pointer hover:bg-gray-50/50" : ""} ${isMine ? "justify-end" : "justify-start"} group relative`}
    >
      
      {/* Checkbox for Select Mode */}
      {isSelectMode && !msg.isDeleted && (
        <div className="mr-3 ml-2 shrink-0">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={() => {}}
            className="w-5 h-5 accent-[#FFAE58] cursor-pointer pointer-events-none" 
          />
        </div>
      )}

      <div 
        className={`max-w-[70%] rounded-2xl px-4 py-2 font-inter text-[15px] shadow-sm relative ${
          isMine 
            ? "bg-[#FFAE58] text-white rounded-br-none" 
            : "bg-white text-[var(--text-primary)] border border-gray-200 rounded-bl-none"
        } ${msg.isPending ? "opacity-70" : "opacity-100"}`}
      >
        
        {/* WhatsApp-Style Action Menu */}
        {isMine && !msg.isPending && !msg.isDeleted && !isSelectMode && (
          <div className={`absolute top-1 right-1 z-10 transition-opacity ${showMenu ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} 
              className={`p-[2px] rounded-full transition-colors ${
                isMine ? "text-white/90 hover:bg-white/20 bg-[#FFAE58]" : "text-gray-500 hover:bg-gray-100 bg-white"
              }`}
            >
              <ChevronDown size={18} />
            </button>
            
            {showMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white shadow-lg border border-gray-100 rounded-lg py-1 w-28 z-20 flex flex-col overflow-hidden">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(msg); }} 
                  className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(msg.id); }} 
                  className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-red-50 text-red-600 transition-colors"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        )}

        <div className={`break-words ${isMine && !msg.isDeleted ? "pr-6" : ""}`}>
          {msg.isDeleted ? (
            <span className="italic text-sm opacity-80">🚫 This message was deleted</span>
          ) : (
            msg.content
          )}
        </div>

        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isMine ? "text-white/80" : "text-gray-400"}`}>
          {msg.isEdited && <span className="italic mr-1">edited</span>}
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          
          {isMine && !msg.isDeleted && (
            <span className="ml-1">
              {msg.isPending ? <Clock size={10} /> : msg.isRead ? <CheckCheck size={12} className="text-blue-500" /> : <Check size={12} />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}