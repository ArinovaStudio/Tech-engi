"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardShell from "@/components/layout/DashboardShell";
import { StatusBadge } from "@/components/project/ProjectUI";

type Invitation = {
  id: string;
  project: {
    id: string;
    title: string;
    budget: number;
    status: string;
  };
  engineer: {
    user: {
      name: string;
      email: string;
      image?: string;
    };
  };
};

export default function InvitationsManagementPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        // Projects come from the projects API so that projects with no
        // invitations yet still show up; invitations only supply the counts.
        const projectsRes = await fetch("/api/admin/project?limit=200");
        const projectsData = await projectsRes.json();

        if (!projectsRes.ok || !projectsData.success) {
          console.error("Failed to load projects:", projectsData);
          setError(projectsData?.message || "Failed to load projects");
          return;
        }

        const counts: Record<string, number> = {};
        const engineersByProject: Record<string, any[]> = {};

        // Invitation counts are optional: don't let a failure here hide projects.
        try {
          const invitationsRes = await fetch("/api/admin/invitations");
          const invitationsData = await invitationsRes.json();

          if (invitationsData.success) {
            invitationsData.invitations.forEach((inv: Invitation) => {
              const projectId = inv.project?.id;
              if (!projectId) return;
              counts[projectId] = (counts[projectId] || 0) + 1;
              (engineersByProject[projectId] ||= []).push(inv.engineer);
            });
          }
        } catch (err) {
          console.error("Failed to load invitation counts:", err);
        }

        setProjects(
          projectsData.projects.map((project: any) => ({
            id: project.id,
            title: project.title,
            budget: project.budget,
            status: project.status,
            invitationsCount: counts[project.id] || 0,
            engineers: engineersByProject[project.id] || [],
          }))
        );
      } catch (err) {
        console.error(err);
        setError("Could not load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardShell>
        <div className="space-y-6 animate-pulse">

          {/* HEADER */}
          <div>
            <div className="h-8 w-72 rounded-xl bg-gray-200 mb-3 dark:bg-slate-800" />
            <div className="h-4 w-96 rounded-lg bg-gray-100 dark:bg-slate-800" />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className=" rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm  dark:bg-card"
              >

                {/* TOP */}
                <div className="flex items-center justify-between mb-6">

                  <div className="h-6 w-40 rounded-lg bg-gray-200 dark:bg-slate-800" />

                  <div className="h-7 w-20 rounded-full bg-gray-100 dark:bg-slate-800" />

                </div>

                {/* AVATARS */}
                <div className="flex -space-x-2 mb-6">
                  {[1, 2, 3].map((avatar) => (
                    <div
                      key={avatar}
                      className=" w-10 h-10 rounded-full bg-gray-200 border-2 border-white  dark:bg-slate-800"
                    />
                  ))}
                </div>

                {/* DETAILS */}
                <div className="space-y-4">

                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 rounded bg-gray-100 dark:bg-slate-800" />
                    <div className="h-4 w-16 rounded bg-gray-200 dark:bg-slate-800" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="h-4 w-32 rounded bg-gray-100 dark:bg-slate-800" />
                    <div className="h-4 w-10 rounded bg-gray-200 dark:bg-slate-800" />
                  </div>

                </div>

              </div>
            ))}

          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              Invitations Management
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Select a project to manage engineer invitations
            </p>
          </div>

          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className=" h-11 w-full md:w-80 px-4 rounded-xl border border-[var(--border)] bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400  dark:bg-card" />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!error && filteredProjects.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">No projects found.</p>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              onClick={() =>
                router.push(`/admin/invitations-management/${project.id}`)
              }
              className="cursor-pointer hover:shadow-lg transition-all border-[var(--border)]"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  {project.title}
                </CardTitle>

                {/* <Badge variant="secondary">
                  {project.status.replaceAll("_", " ")}
                </Badge> */}
                <StatusBadge status={project.status} />
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Engineers Preview */}
                {/* <div className="flex -space-x-2">
                  {project.engineers.slice(0, 3).map((eng: any, i: number) => (
                    <Avatar key={i} >
                      {eng.user.image ? (
                        <AvatarImage src={eng.user.image} className="border bg-blue-200" />
                      ) : (
                        <AvatarFallback className="border border-[#FCD9B6] bg-gradient-to-r from-[#FFAE58] via-[#FFBE73] to-[#FFD8A8] text-gray-800 dark:text-slate-200">
                          {eng.user.name?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  ))}

                  {project.engineers.length > 3 && (
                    <div className="text-xs bg-muted px-2 py-1 rounded-full">
                      +{project.engineers.length - 3}
                    </div>
                  )}
                </div> */}

                {/* Budget */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">
                    ₹{project.budget}
                  </span>
                </div>

                {/* Invitations */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Invitations Sent
                  </span>
                  <span className="font-medium">
                    {project.invitationsCount}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}