'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  instruments?: string[];
  priority: string;
  status: string;
  advancePaid: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  clientName: string;
  clientImage?: string;
  earnings: number;
  isAssigned: boolean;
}

export default function InviteProjectPage() {
  const params = useParams();
  const { data: session } = useSession();

  const projectId = params?.projectId as string;
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [acceptedSuccess, setAcceptedSuccess] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    fetch(`/api/invite/project/${projectId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setProject(res.project);
        } else {
          setError(res.message || 'Project not found or invitation expired');
        }
      })
      .catch(() => setError('Failed to load project details'))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleAccept = async () => {
    if (!projectId) return;
    setAccepting(true);

    try {
      const res = await fetch(`/api/invite/project/${projectId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Project accepted successfully!');
        setAcceptedSuccess(true);
      } else {
        toast.error(data.message || 'Failed to accept invitation');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-600 dark:text-emerald-400 mx-auto mb-3" size={40} />
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Loading invitation details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center shadow-xl">
          <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invitation Unavailable</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {error || 'This project invitation is no longer active or could not be found.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={16} /> Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isEngineer = session?.user?.role === 'ENGINEER';
  const isClient = session?.user?.role === 'CLIENT';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Navbar Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <Layers size={20} />
            </span>
            Tech-Engi
          </Link>

          {session ? (
            <Link
              href={isEngineer ? '/engineer' : isClient ? '/client' : '/admin'}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Dashboard <ArrowRight size={14} />
            </Link>
          ) : (
            <div className="flex items-center gap-3 text-xs">
              <Link
                href={`/login?callbackUrl=/invite/project/${projectId}`}
                className="font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-600"
              >
                Sign In
              </Link>
              <Link
                href={`/register?callbackUrl=/invite/project/${projectId}`}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Accepted Success Banner */}
        {acceptedSuccess ? (
          <div className="bg-white dark:bg-gray-900 border border-emerald-300 dark:border-emerald-800 rounded-3xl p-8 text-center shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              You&apos;re Officially Assigned! 🎉
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
              Congratulations! You are now the lead engineer on <strong>{project.title}</strong>. Access your engineer dashboard to view milestones, credentials, and client communications.
            </p>
            <div className="pt-2">
              <Link
                href="/engineer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-emerald-600/20"
              >
                Open Engineer Dashboard <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Project Hero Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              {/* Badge & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                  <Sparkles size={13} />
                  Direct Project Invitation
                </span>

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <User size={14} />
                  <span>Invited by <strong className="text-gray-900 dark:text-white">{project.clientName}</strong></span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  {project.title}
                </h1>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              {/* Earnings Spotlight Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg space-y-1">
                <p className="text-xs uppercase tracking-wider font-semibold opacity-90">
                  Guaranteed Engineer Earnings
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    ₹{project.earnings.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs opacity-80 font-medium">(70% of total budget)</span>
                </div>
                <p className="text-xs text-emerald-100 pt-1">
                  Protected milestone payouts via Tech-Engi platform escrow.
                </p>
              </div>

              {/* Required Skills / Instruments */}
              {project.instruments && project.instruments.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Required Skills & Instruments
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.instruments.map((inst, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700"
                      >
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Info */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700/80">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <Calendar size={14} /> Start Date
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString('en-IN') : 'Flexible'}
                  </p>
                </div>
                <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700/80">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <Calendar size={14} /> Target Deadline
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {project.endDate ? new Date(project.endDate).toLocaleDateString('en-IN') : 'To be discussed'}
                  </p>
                </div>
              </div>

              {/* CTA Action Area */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                {project.isAssigned ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-center">
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                      Project Already Assigned
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      This project has already been claimed by an engineer or is no longer open for assignment.
                    </p>
                  </div>
                ) : !project.advancePaid ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-center">
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                      Awaiting Client Advance Payment
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      The client has invited you, but the 40% escrow advance is pending. Once paid, you can accept and begin execution.
                    </p>
                  </div>
                ) : !session ? (
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-center space-y-3">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Ready to build this project?
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                      Log in to your engineer account or register as a new engineer to accept this invitation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                      <Link
                        href={`/login?callbackUrl=/invite/project/${projectId}`}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md"
                      >
                        Sign In as Engineer
                      </Link>
                      <Link
                        href={`/register?callbackUrl=/invite/project/${projectId}`}
                        className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Create Engineer Account
                      </Link>
                    </div>
                  </div>
                ) : isEngineer ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleAccept}
                      disabled={accepting}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-base transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer"
                    >
                      {accepting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Accepting Project...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          Accept Project Invitation
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                      By accepting, you commit to leading the engineering deliverables within the agreed timeline.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-center">
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-200">
                      Logged in as {session.user.role}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      To accept this project, please sign in with an Engineer account.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Guarantee Footer Note */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>Payments secured by Tech-Engi Escrow • Milestone-based disbursements</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
