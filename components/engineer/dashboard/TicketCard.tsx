"use client";

import {
    AlertCircle,
    Clock3,
    MessageSquareWarning,
} from "lucide-react";

interface Ticket {
    id: string;
    issueType: string;
    status: string;
    description: string;
    createdAt: string;
}

interface TicketCardProps {
    ticket: Ticket;
}

export default function TicketCard({ ticket, }: TicketCardProps) {
    const formattedDate = new Date(ticket.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const formattedTime = new Date(ticket.createdAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const statusStyles = {
        OPEN: "bg-[#FFF2E8] text-[#F97316]",
        CLOSED: "bg-[#EAFBF0] text-[#22C55E]",
        PENDING: "bg-[#EEF2FF] text-[#6366F1]",
    };

    return (
        <div className="flex items-center justify-between rounded-[26px] border border-[#F1F1F1] bg-white px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)]">

            {/* Left */}
            <div className="flex items-center gap-4">

                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3E8]">
                    <MessageSquareWarning
                        className="text-[#F59E0B]"
                        size={24}
                    />
                </div>

                {/* Content */}
                <div>
                    <div className="flex gap-4 items-center">
                        <h3 className="max-w-[220px] truncate text-[17px] font-semibold text-[#18181B]">
                            {ticket.issueType.replaceAll("_", " ")}
                        </h3>
                        <div
                            className={`rounded-full px-4 py-2 text-[12px] font-semibold
      ${statusStyles[
                                ticket.status as keyof typeof statusStyles
                                ] || "bg-[#F4F4F5] text-[#52525B]"
                                }
    `}
                        >
                            {ticket.status}
                        </div>

                    </div>

                    <p className="mt-1 max-w-[320px] truncate text-[13px] text-[#71717A]">
                        {ticket.description}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-[12px] text-[#A1A1AA]">
                        <Clock3 size={13} />

                        <span>
                            {formattedDate}, {formattedTime}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">

                {/* Resolve Button */}
                <button className="rounded-full cursor-pointer bg-[#D7F266] px-5 py-2 text-[12px] font-semibold text-[#111111] transition-all hover:scale-[1.03] hover:bg-[#CBEF4E]">
                    Resolve
                </button>
            </div>
        </div>
    );
}