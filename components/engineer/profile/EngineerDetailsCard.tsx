"use client";

import React, { useState } from "react";
import { Edit2, Eye } from "lucide-react";
import EngineerDetailsModal from "./modals/EngineerDetailsModal";

export default function EngineerDetailsCard({ profile, onUpdate }: { profile: any, onUpdate: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="p-6 border border-[var(--border)] rounded-2xl bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-[var(--border)] pb-4">
          <h4 className="text-lg font-bold font-inter text-[var(--text-primary)]">Professional Details</h4>
          <button onClick={() => setIsOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold hover:bg-gray-50 transition-colors">
            <Edit2 size={14} /> Edit
          </button>
        </div>

        {!profile ? (
          <p className="text-sm font-semibold text-orange-600 bg-orange-50 p-4 rounded-lg">Please add your professional details.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="text-xs text-[var(--text-muted)] font-semibold mb-1 uppercase tracking-wider">Qualification</p>
              <p className="font-semibold text-sm text-[var(--text-primary)]">{profile.qualification}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] font-semibold mb-1 uppercase tracking-wider">Approval Status</p>
              <span className={`px-2.5 py-1 rounded text-xs font-bold tracking-wider ${profile.status === 'APPROVED' ? 'bg-green-100 text-green-700' : profile.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {profile.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] font-semibold mb-1 uppercase tracking-wider">ID Document Type</p>
              <p className="font-semibold text-sm text-[var(--text-primary)]">{profile.idType}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] font-semibold mb-1 uppercase tracking-wider">ID Number</p>
              <div className="flex items-center gap-3">
                <p className="font-mono text-sm text-[var(--text-primary)] font-semibold bg-gray-100 px-2 py-0.5 rounded border border-[var(--border)]">{profile.idNumber}</p>
                {profile.idFile && (
                  <a href={profile.idFile} target="_blank" rel="noreferrer" className="text-[var(--primary)] hover:underline flex items-center gap-1 text-xs font-bold">
                    <Eye size={12}/> View Proof
                  </a>
                )}
              </div>
            </div>

            <div className="md:col-span-2 pt-2 border-t border-dashed border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)] font-semibold mb-2 uppercase tracking-wider">Skills</p>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((s: string) => <span key={s} className="bg-gray-100 border border-[var(--border)] text-[var(--text-secondary)] text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm">{s}</span>)}
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-[var(--text-muted)] font-semibold mb-2 uppercase tracking-wider">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {profile.certifications?.length > 0 
                  ? profile.certifications.map((c: string) => <span key={c} className="bg-[#fff4e6] border border-[#ffd9a8] text-[var(--primary)] text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm">{c}</span>)
                  : <span className="text-sm text-gray-400 italic">None added</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      <EngineerDetailsModal isOpen={isOpen} onClose={() => setIsOpen(false)} profile={profile} onUpdate={onUpdate} />
    </>
  );
}