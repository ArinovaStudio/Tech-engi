"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  // FETCH PROJECTS
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/client/filter/projects");
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, []);

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatRole = (r?: string | null) => {
    if (!r) return "Guest";
    return r.charAt(0).toUpperCase() + r.slice(1).toLowerCase();
  };

  return (
    <header className="h-17 bg-white border-b border-[var(--border)] flex items-center px-6 gap-4 shrink-0 relative">
      <div className="flex-1" />

      {/* NOTIFICATION */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-[#fff4e6] hover:text-[#FFAE58] transition-all relative"
        >
          <Bell size={18} />

          {/* COUNT BADGE */}
          {projects.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1">
              {projects.length}
            </span>
          )}
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">

            <div className="p-3 border-b text-sm font-semibold">
              Projects ({projects.length})
            </div>

            <div className="max-h-80 overflow-y-auto">
              {projects.length === 0 ? (
                <p className="p-3 text-sm text-gray-500">
                  No projects found
                </p>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      console.log("clicked:", project.id);
                      window.location.href = `/client?projectId=${project.id}`;
                    }}
                    className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 transition"
                  >
                    <p className="text-sm font-medium">
                      {project.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {project.status}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* USER */}
      <button className="flex items-center gap-2.5 pl-3 border-l border-[var(--border)]">
        <div className="w-8 h-8 bg-[#FFAE58] flex items-center justify-center">
          <span className="text-white text-xs font-bold font-id">
            {isLoading ? "..." : getInitials(user?.name)}
          </span>
        </div>

        <div className="text-left">
          {isLoading ? (
            <>
              <div className="w-20 h-3 bg-gray-200 animate-pulse rounded mb-1" />
              <div className="w-12 h-2.5 bg-gray-200 animate-pulse rounded" />
            </>
          ) : (
            <>
              <p className="text-xs font-bold text-[var(--text-primary)]">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] text-[var(--text-muted)]">
                {formatRole(role)}
              </p>
            </>
          )}
        </div>
      </button>
    </header>
  );
}