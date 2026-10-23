'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  Link as LinkIcon,
  Mail,
  Copy,
  Check,
  Send,
  Loader2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Share2,
  UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Invitation {
  id: string;
  status: string;
  createdAt: string;
  engineer?: {
    id: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  } | null;
}

interface FoundEngineer {
  id: string;
  engineerProfileId: string;
  name: string;
  email: string;
  image: string | null;
  skills: string[];
  status: string;
  completedProjects?: number;
  alreadyAssigned?: boolean;
  alreadyInvited?: boolean;
}

interface InviteEngineerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName?: string;
  projectBudget?: number;
  assignedEngineer?: string | null;
}

const getInitials = (name?: string | null, emailFallback?: string): string => {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (emailFallback && emailFallback.trim()) {
    return emailFallback.trim().slice(0, 2).toUpperCase();
  }
  return 'EN';
};

function EngineerAvatar({
  image,
  name,
  email,
  size = 'md',
}: {
  image?: string | null;
  name?: string | null;
  email?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [imgError, setImgError] = useState(false);
  const sizeClasses =
    size === 'sm'
      ? 'w-8 h-8 text-xs'
      : size === 'lg'
      ? 'w-12 h-12 text-sm'
      : 'w-10 h-10 text-xs';

  if (image && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name || 'Engineer'}
        onError={() => setImgError(true)}
        className={`${sizeClasses} rounded-full object-cover border border-emerald-500/30 shrink-0 shadow-xs`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center uppercase shrink-0 shadow-xs border border-emerald-400/30`}
    >
      {getInitials(name, email)}
    </div>
  );
}

export default function InviteEngineerModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  projectBudget,
  assignedEngineer,
}: InviteEngineerModalProps) {
  const [activeTab, setActiveTab] = useState<'link' | 'email'>('link');
  const [email, setEmail] = useState('');
  const [debouncedEmail, setDebouncedEmail] = useState('');
  const [engineersList, setEngineersList] = useState<FoundEngineer[]>([]);
  const [selectedEngineers, setSelectedEngineers] = useState<FoundEngineer[]>([]);
  const [isSearchingEngineer, setIsSearchingEngineer] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [note, setNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  const inviteUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/invite/project/${projectId}`
      : `/invite/project/${projectId}`;

  const fetchInvitations = useCallback(async () => {
    if (!projectId) return;
    setLoadingInvites(true);
    try {
      const res = await fetch(`/api/client/projects/${projectId}/invitations`);
      const data = await res.json();
      if (data.success) {
        setInvitations(data.invitations || []);
      }
    } catch {
      // silent
    } finally {
      setLoadingInvites(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchInvitations();
    }
  }, [isOpen, projectId, fetchInvitations]);

  // Click outside listener for the floating box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce email input (350ms)
  useEffect(() => {
    const trimmed = email.trim();
    if (!trimmed) {
      setDebouncedEmail('');
      setEngineersList([]);
      setSearchError(null);
      setIsSearchingEngineer(false);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedEmail(trimmed);
    }, 350);

    return () => clearTimeout(timer);
  }, [email]);

  // Lookup engineers when debounced email updates
  useEffect(() => {
    if (!debouncedEmail) {
      setEngineersList([]);
      setSearchError(null);
      setIsSearchingEngineer(false);
      return;
    }

    let isMounted = true;
    setIsSearchingEngineer(true);
    setSearchError(null);
    setShowDropdown(true);

    fetch(
      `/api/client/engineers/lookup?q=${encodeURIComponent(
        debouncedEmail
      )}&projectId=${projectId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.engineers && data.engineers.length > 0) {
          setEngineersList(data.engineers);
          setSearchError(null);
        } else {
          setEngineersList([]);
          setSearchError('No Engineer is available with this email');
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setEngineersList([]);
        setSearchError('No Engineer is available with this email');
      })
      .finally(() => {
        if (isMounted) setIsSearchingEngineer(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedEmail, projectId]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success('Invite link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleSelectEngineer = (eng: FoundEngineer) => {
    if (selectedEngineers.some((e) => e.id === eng.id || e.email.toLowerCase() === eng.email.toLowerCase())) {
      toast.error(`${eng.name} is already selected`);
      return;
    }

    if (selectedEngineers.length >= 3) {
      toast.error('Maximum 3 engineers can be selected');
      return;
    }

    if (eng.alreadyAssigned) {
      toast.error(`${eng.name} is already assigned to this project`);
      return;
    }

    setSelectedEngineers((prev) => [...prev, eng]);
    setEmail('');
    setShowDropdown(false);
    setSearchError(null);
  };

  const handleRemoveEngineer = (engId: string) => {
    setSelectedEngineers((prev) => prev.filter((e) => e.id !== engId));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (engineersList.length > 0) {
        // Find first eligible engineer
        const eligible = engineersList.find(
          (eng) => !eng.alreadyAssigned && !selectedEngineers.some((s) => s.id === eng.id)
        );
        if (eligible) {
          handleSelectEngineer(eligible);
        }
      }
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedEngineers.length < 1) {
      toast.error('Please select at least 1 engineer to invite');
      return;
    }

    if (selectedEngineers.length > 3) {
      toast.error('Maximum 3 engineers can be selected');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch(`/api/client/projects/${projectId}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'EMAIL',
          emails: selectedEngineers.map((e) => e.email),
          note: note.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Invitations sent successfully!');
        setEmail('');
        setDebouncedEmail('');
        setSelectedEngineers([]);
        setEngineersList([]);
        setSearchError(null);
        setShowDropdown(false);
        setNote('');
        fetchInvitations();
      } else {
        toast.error(data.message || 'Failed to send invitations');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleRevokeInvite = async (invitationId: string) => {
    setRevokingId(invitationId);
    try {
      const res = await fetch(`/api/client/projects/${projectId}/invitations`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Invitation revoked');
        setInvitations((prev) => prev.filter((i) => i.id !== invitationId));
      } else {
        toast.error(data.message || 'Failed to revoke invitation');
      }
    } catch {
      toast.error('Failed to revoke invitation');
    } finally {
      setRevokingId(null);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! I would like to invite you to work on "${projectName || 'our project'}" on Tech-Engi. Check out the project details and accept the invitation here: ${inviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareMailto = () => {
    const subject = encodeURIComponent(`Project Invitation: ${projectName || 'New Project'}`);
    const body = encodeURIComponent(
      `Hi,\n\nI would love to invite you to collaborate as an engineer on "${projectName || 'our project'}" on Tech-Engi.\n\nYou can review the project scope and guaranteed payout here:\n${inviteUrl}\n\nBest regards!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                <Share2 size={18} />
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invite Engineer</h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
              {projectName ? `Project: ${projectName}` : 'Invite engineers to lead this project'}
              {projectBudget ? ` • Payout: ₹${Math.floor(projectBudget * 0.7).toLocaleString('en-IN')}` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Assigned Status Notice if already assigned */}
        {assignedEngineer && assignedEngineer !== 'Unassigned' && (
          <div className="mx-6 mt-4 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-2.5 text-xs text-blue-800 dark:text-blue-300">
            <UserCheck size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
            <span>
              This project is currently assigned to <strong>{assignedEngineer}</strong>. Inviting a new engineer will prepare them to be matched or assigned if current assignment changes.
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-100 dark:border-gray-800 flex gap-2">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'link'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <LinkIcon size={16} />
            Share Link
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Mail size={16} />
            Send Email
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'link' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Shareable Invite Link
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      readOnly
                      value={inviteUrl}
                      className="w-full pl-3 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono text-gray-700 dark:text-gray-200 truncate focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-white" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Share Buttons */}
              <div className="pt-1">
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  Or share directly via:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex-1 py-2 px-3 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>💬</span> WhatsApp
                  </button>
                  <button
                    onClick={handleShareMailto}
                    className="flex-1 py-2 px-3 border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>✉️</span> Default Mail
                  </button>
                  <a
                    href={inviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0"
                    title="Preview invite page"
                  >
                    <ExternalLink size={14} /> Preview
                  </a>
                </div>
              </div>

              {/* Info card */}
              <div className="p-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl flex items-start gap-3">
                <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Engineers opening this link will see your project scope, requirements, and payout. Only approved engineers can officially accept the project.
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div ref={dropdownContainerRef} className="relative">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Search Engineer by Email or Name <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    Selected: <strong className="text-emerald-600 dark:text-emerald-400">{selectedEngineers.length}</strong> / 3 (Min 1, Max 3)
                  </span>
                </div>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                  />
                  <input
                    type="text"
                    disabled={selectedEngineers.length >= 3}
                    placeholder={
                      selectedEngineers.length >= 3
                        ? 'Maximum 3 engineers selected (remove one to add another)'
                        : 'Type an engineer email or name...'
                    }
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setShowDropdown(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (email.trim().length > 0 && selectedEngineers.length < 3) {
                        setShowDropdown(true);
                      }
                    }}
                    className={`w-full pl-9 pr-9 py-2.5 bg-white dark:bg-gray-800 border rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      selectedEngineers.length >= 3
                        ? 'opacity-60 cursor-not-allowed border-gray-200 dark:border-gray-700'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  />
                  {email && (
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('');
                        setEngineersList([]);
                        setSearchError(null);
                        setShowDropdown(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* Floating GitHub-style Collaborator List Dropdown Box */}
                {showDropdown && email.trim().length > 0 && selectedEngineers.length < 3 && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-150">
                    {isSearchingEngineer ? (
                      <div className="p-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Loader2 size={15} className="animate-spin text-emerald-600 dark:text-emerald-400" />
                        <span>Searching engineers...</span>
                      </div>
                    ) : engineersList.length === 0 ? (
                      <div className="p-4 text-center text-xs text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col items-center justify-center gap-1.5">
                        <AlertCircle size={18} className="text-amber-500 dark:text-amber-400" />
                        <span className="font-medium">No Engineer is available with this email</span>
                      </div>
                    ) : (
                      <div className="py-1">
                        <div className="px-3.5 py-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                          Matching Engineers ({engineersList.length})
                        </div>
                        {engineersList.map((eng) => {
                          const isAlreadySelected = selectedEngineers.some(
                            (s) => s.id === eng.id || s.email.toLowerCase() === eng.email.toLowerCase()
                          );

                          return (
                            <button
                              key={eng.id}
                              type="button"
                              disabled={isAlreadySelected || eng.alreadyAssigned}
                              onClick={() => handleSelectEngineer(eng)}
                              className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 transition-colors border-b border-gray-50 dark:border-gray-800/40 last:border-0 ${
                                isAlreadySelected
                                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 opacity-70 cursor-default'
                                  : eng.alreadyAssigned
                                  ? 'opacity-60 cursor-not-allowed'
                                  : 'hover:bg-emerald-50 dark:hover:bg-gray-800/80 cursor-pointer group'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <EngineerAvatar
                                  image={eng.image}
                                  name={eng.name}
                                  email={eng.email}
                                  size="sm"
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold text-xs text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {eng.name}
                                  </p>
                                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                    {eng.email}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 flex items-center gap-1.5">
                                {isAlreadySelected ? (
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                    <Check size={11} /> Added
                                  </span>
                                ) : eng.alreadyAssigned ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                    Assigned
                                  </span>
                                ) : eng.alreadyInvited ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                    Invited
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 group-hover:underline">
                                    Select
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Engineers List (1 to 3 engineers) */}
              {selectedEngineers.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Selected Engineers ({selectedEngineers.length}/3)
                    </span>
                    {selectedEngineers.length >= 3 && (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                        Maximum 3 reached
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {selectedEngineers.map((eng) => (
                      <div
                        key={eng.id}
                        className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between gap-3 animate-in fade-in duration-200 shadow-xs"
                      >
                        {/* Profile: Small Profile Image / Circular Initial, Name, Email only (NO bio/description) */}
                        <div className="flex items-center gap-3 min-w-0">
                          <EngineerAvatar
                            image={eng.image}
                            name={eng.name}
                            email={eng.email}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                              {eng.name}
                            </h4>
                            <p className="text-[11px] text-gray-600 dark:text-gray-300 truncate mt-0.5">
                              {eng.email}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {eng.alreadyInvited && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-[10px] font-semibold rounded-md border border-amber-200 dark:border-amber-800">
                              Invite Pending
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveEngineer(eng.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                            title={`Remove ${eng.name}`}
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notice if search had error and dropdown is closed and no engineer found */}
              {!showDropdown && searchError && selectedEngineers.length === 0 && (
                <div className="flex items-center gap-2.5 p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 animate-in fade-in duration-150">
                  <AlertCircle size={17} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-medium">{searchError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Personal Note <span className="text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Hey, we'd love for you to engineer this hardware project! Let me know if you have questions."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSending || selectedEngineers.length < 1 || selectedEngineers.length > 3}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                {isSending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending Invitations...
                  </>
                ) : selectedEngineers.length === 0 ? (
                  <>
                    <Send size={16} />
                    Select 1 to 3 Engineers to Invite
                  </>
                ) : selectedEngineers.length === 1 ? (
                  <>
                    <Send size={16} />
                    Send Project Invitation to {selectedEngineers[0].name}
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Project Invitations to {selectedEngineers.length} Engineers
                  </>
                )}
              </button>
            </form>
          )}

          {/* Previous Invitations */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Invitations Sent ({invitations.length})
              </h3>
              {loadingInvites && <Loader2 size={14} className="animate-spin text-gray-400" />}
            </div>

            {loadingInvites && invitations.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-400">Loading invitations...</div>
            ) : invitations.length === 0 ? (
              <div className="py-6 text-center bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                <AlertCircle size={24} className="mx-auto text-gray-400 mb-1.5" />
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">No invitations sent yet</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                  Share the link or enter an email above to invite an engineer.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {invitations.map((inv) => {
                  const statusColors: Record<string, string> = {
                    SENT: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
                    ACCEPTED: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
                    REJECTED: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
                    EXPIRED: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
                    PENDING_ADMIN: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
                  };

                  const statusClass = statusColors[inv.status] || statusColors.EXPIRED;
                  const engineerName = inv.engineer?.user?.name || inv.engineer?.user?.email || 'Invited Candidate';
                  const engineerEmail = inv.engineer?.user?.email;

                  return (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80 rounded-xl text-xs"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {engineerName}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusClass}`}
                          >
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {engineerEmail ? `${engineerEmail} • ` : ''}
                          {new Date(inv.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </div>

                      {inv.status === 'SENT' && (
                        <button
                          onClick={() => handleRevokeInvite(inv.id)}
                          disabled={revokingId === inv.id}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Revoke invitation"
                        >
                          {revokingId === inv.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
