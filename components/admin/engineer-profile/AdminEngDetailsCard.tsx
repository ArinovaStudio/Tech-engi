"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Eye, X } from "lucide-react";
import EngineerModal from "@/components/engineer/profile/modals/EngineerModal";
import toast from "react-hot-toast";

export default function AdminEngDetailsCard({ profile, user, onUpdate }: { profile: any, user: any, onUpdate: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [qualification, setQualification] = useState("UG");
  const [idType, setIdType] = useState("AADHAAR");
  const [idNumber, setIdNumber] = useState("");
  
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  
  const [certs, setCerts] = useState<string[]>([]);
  const [certInput, setCertInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setQualification(profile?.qualification || "UG");
      setIdType(profile?.idType || "AADHAAR");
      setIdNumber(profile?.idNumber || "");
      setSkills(profile?.skills || []);
      setCerts(profile?.certifications || []);
      setSkillInput("");
      setCertInput("");
    }
  }, [profile, isOpen]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = input.trim();
      if (value && !list.includes(value)) {
        setList([...list, value]);
      }
      setInput("");
    }
  };

  const removeTag = (
    indexToRemove: number,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(list.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (skills.length === 0) {
      toast.error("Please add at least one skill.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        qualification,
        idType,
        idNumber,
        skills,
        certifications: certs
      };
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) { 
        toast.success("Updated successfully"); 
        onUpdate(); 
        setIsOpen(false); 
      }
      else toast.error(data.message || "Update failed");
    } catch { 
      toast.error("Error occurred"); 
    }
    finally { 
      setIsSaving(false); 
    }
  };

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
          <p className="text-sm font-semibold text-orange-600 bg-orange-50 p-4 rounded-lg">Engineer has not submitted professional details yet.</p>
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

      <EngineerModal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-[700px]">
        <div className="p-8">
          <h4 className="text-2xl font-bold font-inter text-[var(--text-primary)] mb-6">Edit Professional Details</h4>
          
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-5">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Qualification *</label>
              <select value={qualification} onChange={e => setQualification(e.target.value)} className="w-full border border-[var(--border)] rounded-lg p-3 outline-none focus:border-[var(--primary)] bg-gray-50/50">
                <option value="UG">UG</option>
                <option value="EMPLOYED">Employed</option>
                <option value="UNEMPLOYED">Unemployed</option>
              </select>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">ID Type *</label>
              <select value={idType} onChange={e => setIdType(e.target.value)} className="w-full border border-[var(--border)] rounded-lg p-3 outline-none focus:border-[var(--primary)] bg-gray-50/50">
                <option value="AADHAAR">Aadhaar</option>
                <option value="PAN">PAN</option>
                <option value="STUDENT_ID">Student ID</option>
              </select>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">ID Number *</label>
              <input required value={idNumber} onChange={e => setIdNumber(e.target.value)} className="w-full border border-[var(--border)] rounded-lg p-3 outline-none focus:border-[var(--primary)] bg-gray-50/50" />
            </div>

            {/* Skills List UI */}
            <div className="col-span-2 pt-2">
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Skills *</label>
              <div className="flex flex-wrap items-center gap-2 w-full border border-[var(--border)] rounded-lg p-2 focus-within:border-[var(--primary)] bg-gray-50/50 min-h-[50px]">
                {skills.map((skill, index) => (
                  <span key={index} className="flex items-center gap-1.5 px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium rounded-md">
                    {skill}
                    <button type="button" onClick={() => removeTag(index, skills, setSkills)} className="hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <input 
                  value={skillInput} 
                  onChange={e => setSkillInput(e.target.value)} 
                  onKeyDown={e => handleKeyDown(e, skillInput, setSkillInput, skills, setSkills)}
                  placeholder={skills.length === 0 ? "Type a skill and press Enter" : ""}
                  className="flex-1 bg-transparent outline-none min-w-[150px] p-1 text-sm text-[var(--text-primary)]" 
                />
              </div>
            </div>
            
            {/* Certifications List UI */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Certifications</label>
              <div className="flex flex-wrap items-center gap-2 w-full border border-[var(--border)] rounded-lg p-2 focus-within:border-[var(--primary)] bg-gray-50/50 min-h-[50px]">
                {certs.map((cert, index) => (
                  <span key={index} className="flex items-center gap-1.5 px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium rounded-md">
                    {cert}
                    <button type="button" onClick={() => removeTag(index, certs, setCerts)} className="hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <input 
                  value={certInput} 
                  onChange={e => setCertInput(e.target.value)} 
                  onKeyDown={e => handleKeyDown(e, certInput, setCertInput, certs, setCerts)}
                  placeholder={certs.length === 0 ? "Type a certification and press Enter" : ""}
                  className="flex-1 bg-transparent outline-none min-w-[200px] p-1 text-sm text-[var(--text-primary)]" 
                />
              </div>
            </div>
            
            <div className="col-span-2 flex justify-end gap-3 pt-6 border-t border-[var(--border)] mt-4">
              <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] font-semibold hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white font-semibold disabled:opacity-50">
                {isSaving ? "Saving..." : "Save Details"}
              </button>
            </div>
          </form>
        </div>
      </EngineerModal>
    </>
  );
}