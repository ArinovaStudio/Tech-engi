"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Loader2, X, Plus, Upload, FileText } from "lucide-react";

const QUALIFICATIONS = [
  { value: "UG", label: "Under Graduate (Student)" },
  { value: "EMPLOYED", label: "Employed" },
  { value: "UNEMPLOYED", label: "Unemployed" },
];

const ID_TYPES: Record<string, string[]> = {
  UG: ["STUDENT_ID","AADHAAR", "PAN"],
  EMPLOYED: ["AADHAAR", "PAN", "PAY_SLIP"],
  UNEMPLOYED: ["AADHAAR", "PAN"],
};

const ID_LABELS: Record<string, string> = {
  STUDENT_ID: "Student ID",
  AADHAAR: "Aadhaar Card",
  PAN: "PAN Card",
  PAY_SLIP: "Pay Slip",
};

interface CertificateData {
  name: string;
  file: File;
}

export default function EngineerFormPage() {
  const router = useRouter();
  const [qualification, setQualification] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  
  const [certifications, setCertifications] = useState<CertificateData[]>([]);
  const [certInput, setCertInput] = useState("");
  const [certFile, setCertFile] = useState<File | null>(null);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addSkill = () => {
    const val = skillInput.trim();
    if (val && !skills.includes(val)) setSkills([...skills, val]);
    setSkillInput("");
  };

  const addCertificate = () => {
    const val = certInput.trim();
    if (!val) {
      setError("Please enter the certificate name.");
      return;
    }
    if (!certFile) {
      setError("Please upload the proof document for the certificate.");
      return;
    }
    setError("");
    setCertifications([...certifications, { name: val, file: certFile }]);
    setCertInput("");
    setCertFile(null);
  };

  const removeCertificate = (indexToRemove: number) => {
    setCertifications(certifications.filter((_, idx) => idx !== indexToRemove));
  };

  const handleQualificationChange = (val: string) => {
    setQualification(val);
    setIdType("");
    setIdNumber("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!idFile) { setError("Please upload your ID document"); return; }
    if (skills.length === 0) { setError("Please add at least one skill"); return; }

    const cleanedId = idNumber.replace(/\s+/g, '').toUpperCase();

    if (idType === "PAN") {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(cleanedId)) {
        setError("Invalid PAN format. It should be 5 letters, 4 numbers, and 1 letter (e.g., ABCDE1234F)");
        return;
      }
    }

    if (idType === "AADHAAR") {
      const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
      if (!aadhaarRegex.test(cleanedId)) {
        setError("Invalid Aadhaar format. It must be exactly 12 digits and cannot start with 0 or 1.");
        return;
      }
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("qualification", qualification);
      formData.append("idType", idType);
      formData.append("idNumber", cleanedId);
      formData.append("file", idFile);
      formData.append("skills", JSON.stringify(skills));
      
      const mappedCertifications = certifications.map((cert, index) => {
        formData.append(`certFile_${index}`, cert.file);
        return { name: cert.name, fileIndex: index };
      });
      formData.append("certifications", JSON.stringify(mappedCertifications));

      const res = await fetch("/api/engineer/profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      router.push("/form/payout");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-[#f0b31e] shadow-lg shadow-yellow-500/30 mx-auto mb-4">
            <Wrench className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Complete Your Profile</h1>
          <p className="text-gray-500 mt-2 text-sm">We need a few details to verify your account</p>
        </div>

        {error && (
          <div className="mb-6 text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Qualification */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 ml-1">Qualification</label>
            <div className="flex gap-2">
              {QUALIFICATIONS.map((q) => (
                <button
                  key={q.value}
                  type="button"
                  onClick={() => handleQualificationChange(q.value)}
                  className={`flex-1 py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                    qualification === q.value
                      ? "bg-[#f0b31e] text-white border-[#f0b31e] shadow-sm"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#f0b31e]"
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* ID Type */}
          {qualification && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 ml-1">ID Type</label>
              <div className="flex flex-wrap gap-2">
                {ID_TYPES[qualification].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setIdType(type); setIdNumber(""); setError(""); }}
                    className={`py-2 px-4 text-xs font-semibold rounded-xl border transition-all ${
                      idType === type
                        ? "bg-[#f0b31e] text-white border-[#f0b31e] shadow-sm"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#f0b31e]"
                    }`}
                  >
                    {ID_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ID Number */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 ml-1">ID Number</label>
            <input
              type="text"
              required
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
              placeholder={idType === "PAN" ? "ABCDE1234F" : idType === "AADHAAR" ? "12 Digit Number" : "Enter your ID number"}
              className="w-full px-4 h-12 rounded-xl border border-gray-200 bg-transparent focus:bg-white focus:border-[#f0b31e] focus:ring-1 focus:ring-[#f0b31e] outline-none transition-all text-sm text-black uppercase"
            />
          </div>

          {/* ID File Upload */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 ml-1">Upload ID Document</label>
            <label className="flex items-center gap-3 w-full h-12 px-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:border-[#f0b31e] hover:bg-yellow-50 cursor-pointer transition-all">
              <Upload className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-500 truncate">
                {idFile ? idFile.name : "Click to upload (JPG, PNG, PDF)"}
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => setIdFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* Skills */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 ml-1">Skills</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                placeholder="e.g. Arduino, PCB Design"
                className="flex-1 px-4 h-12 rounded-xl border border-gray-200 bg-transparent focus:bg-white focus:border-[#f0b31e] focus:ring-1 focus:ring-[#f0b31e] outline-none transition-all text-sm text-black"
              />
              <button
                type="button"
                onClick={addSkill}
                className="h-12 w-12 flex items-center justify-center rounded-xl bg-[#f0b31e] text-white hover:bg-[#e0a61a] transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-medium rounded-full">
                    {tag}
                    <button type="button" onClick={() => setSkills(skills.filter(t => t !== tag))}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Certifications & Proofs */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 ml-1">Certifications & Proofs</label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder="e.g. AWS Certified Developer"
                className="w-full px-4 h-12 rounded-xl border border-gray-200 bg-transparent focus:bg-white focus:border-[#f0b31e] focus:ring-1 focus:ring-[#f0b31e] outline-none transition-all text-sm text-black"
              />
              <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:border-[#f0b31e] hover:bg-yellow-50 cursor-pointer transition-all px-4 overflow-hidden">
                  <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-500 truncate">
                    {certFile ? certFile.name : "Upload Proof (PDF/JPG)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                  />
                </label>
                <button
                  type="button"
                  onClick={addCertificate}
                  className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Display Added Certifications */}
            {certifications.length > 0 && (
              <div className="flex flex-col gap-2 mt-3">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-gray-700 truncate">{cert.name}</span>
                      <span className="text-[10px] text-gray-400 truncate">{cert.file.name}</span>
                    </div>
                    <button type="button" onClick={() => removeCertificate(idx)} className="p-1 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !qualification || !idType}
            className="w-full h-12 mt-2 bg-[#f0b31e] hover:bg-[#e0a61a] text-white rounded-xl text-base font-semibold shadow-md shadow-yellow-500/20 transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit for Review"}
          </button>
        </form>
      </div>
    </div>
  );
}