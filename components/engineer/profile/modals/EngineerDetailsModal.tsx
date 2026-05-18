"use client";

import React, { useState, useEffect } from "react";
import EngineerModal from "./EngineerModal";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";

export default function EngineerDetailsModal({ isOpen, onClose, profile, onUpdate }: { isOpen: boolean, onClose: () => void, profile: any, onUpdate: () => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const [qualification, setQualification] = useState("UG");
  const [idType, setIdType] = useState("AADHAAR");
  const [idNumber, setIdNumber] = useState("");
  
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  
  const [certs, setCerts] = useState<string[]>([]);
  const [certInput, setCertInput] = useState("");
  
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQualification(profile?.qualification || "UG");
      setIdType(profile?.idType || "AADHAAR");
      setIdNumber(profile?.idNumber || "");
      setSkills(profile?.skills || []);
      setCerts(profile?.certifications || []);
      setFile(null);
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
    const formData = new FormData();
    formData.append("qualification", qualification);
    formData.append("idType", idType);
    formData.append("idNumber", idNumber);
    formData.append("skills", JSON.stringify(skills));
    formData.append("certifications", JSON.stringify(certs));
    if (file) formData.append("idFile", file);

    try {
      const res = await fetch("/api/engineer/profile", { method: "PUT", body: formData });
      const data = await res.json();
      if (data.success) { 
        toast.success("Details saved"); 
        onUpdate(); 
        onClose(); 
      } else {
        toast.error(data.message);
      }
    } catch { 
      toast.error("Failed to save details"); 
    } finally { 
      setIsSaving(false); 
    }
  };

  return (
    <EngineerModal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
      <div className="p-8">
        <h4 className="text-2xl font-bold font-inter text-[var(--text-primary)] mb-2">Professional Details</h4>
        <p className="text-sm text-[var(--text-muted)] font-inter mb-6">Complete your profile to get approved for projects.</p>

        <form onSubmit={handleSave} className="grid grid-cols-2 gap-5">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Qualification *</label>
            <select value={qualification} onChange={e => setQualification(e.target.value)} className="w-full border border-[var(--border)] rounded-lg p-3 outline-none focus:border-[var(--primary)] bg-gray-50/50">
              <option value="UG">Undergraduate (UG)</option>
              <option value="EMPLOYED">Employed</option>
              <option value="UNEMPLOYED">Unemployed</option>
            </select>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">ID Type *</label>
            <select value={idType} onChange={e => setIdType(e.target.value)} className="w-full border border-[var(--border)] rounded-lg p-3 outline-none focus:border-[var(--primary)] bg-gray-50/50">
              <option value="AADHAAR">Aadhaar Card</option>
              <option value="PAN">PAN Card</option>
              <option value="STUDENT_ID">Student ID</option>
              <option value="PAY_SLIP">Pay Slip</option>
            </select>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">ID Number *</label>
            <input required value={idNumber} onChange={e => setIdNumber(e.target.value)} className="w-full border border-[var(--border)] rounded-lg p-3 outline-none focus:border-[var(--primary)] bg-gray-50/50" />
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Upload ID Document</label>
            <label className="flex items-center gap-2 border border-dashed border-[var(--border)] rounded-lg p-3 bg-gray-50/50 hover:border-[var(--primary)] cursor-pointer text-sm w-full truncate transition-colors">
              <Upload size={16} className="shrink-0 text-[var(--primary)]"/>
              <span>{file ? file.name : profile?.idFile ? "Change File" : "Select File"}</span>
              <input type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" />
            </label>
          </div>
          
          {/* Skills List UI */}
          <div className="col-span-2">
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
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-[var(--border)] font-semibold hover:bg-gray-50 transition-colors text-[var(--text-primary)]">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white font-semibold disabled:opacity-50 transition-opacity">
              {isSaving ? "Saving..." : "Save Details"}
            </button>
          </div>
        </form>
      </div>
    </EngineerModal>
  );
}