"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  status: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  progress: number;
  createdAt: string;
}

interface ProjectCollaborationCardProps {
  projects: Project[];
}

const STATUS_STYLES = {
  SEARCHING: {
    bg: "bg-[#FFF7E8]",
    text: "text-[#D97706]",
  },

  ACTIVE: {
    bg: "bg-[#EEF9F1]",
    text: "text-[#238B57]",
  },

  COMPLETED: {
    bg: "bg-[#EEF4FF]",
    text: "text-[#2563EB]",
  },
};

const PRIORITY_COLORS = {
  LOW: "bg-[#238B57]",
  MEDIUM: "bg-[#D97706]",
  HIGH: "bg-[#E5484D]",
};

export default function ProjectCollaborationCard({
  projects,
}: ProjectCollaborationCardProps) {
  const router = useRouter();

  // ONLY LATEST 3 PROJECTS
  const latestProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <div
      className="
        bg-white dark:bg-card
        w-full
        h-full
        rounded-[28px]
        border border-[#ECECEC] dark:border-slate-800
        p-5
        overflow-hidden
      "
    >

      {/* HEADER */}

      <div className="flex items-center justify-between mb-5">

        <div>
          <h2 className="text-[1.1rem] font-semibold text-[#111] dark:text-slate-100">
            Latest Projects
          </h2>

          <p className="text-[12px] text-[#8A8A8A] dark:text-slate-400 mt-1">
            Recently created
          </p>
        </div>

        <div
          className="
            px-3 py-1.5
            rounded-full
            bg-[#F7F7F7] dark:bg-slate-800
            text-[12px]
            font-medium
            text-[#111] dark:text-slate-100
          "
        >
          {latestProjects.length}
        </div>

      </div>

      {/* EMPTY STATE */}

      {latestProjects.length === 0 && (
        <div className="flex items-center justify-center py-16 text-center">
          <div>
            <h3 className="text-[14px] font-semibold text-[#111] dark:text-slate-100">
              No Projects Found
            </h3>
            <p className="text-[12px] text-[#8A8A8A] dark:text-slate-400 mt-1">
              Create a project to start collaboration
            </p>
          </div>
        </div>
      )}

      {/* LIST */}

      <div className="flex flex-col gap-3">

        {latestProjects.map((project) => {

          const statusStyle =
            STATUS_STYLES[
              project.status as keyof typeof STATUS_STYLES
            ] || STATUS_STYLES.SEARCHING;

          return (
            <div
              key={project.id}
              onClick={() => router.push(`/admin/project/${project.id}`)}
              className="
                group
                border border-[#F1F1F1] dark:border-slate-800
                rounded-[18px]
                p-4
                transition-all
                hover:border-[#E4E4E4] dark:hover:border-slate-700
                hover:shadow-sm
                cursor-pointer
              "
            >

              {/* TOP */}

              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0 flex-1">

                  {/* TITLE */}

                  <div className="flex items-center gap-2">

                    <div
                      className={`
                        w-2 h-2
                        rounded-full
                        ${
                          PRIORITY_COLORS[
                            project.priority
                          ]
                        }
                      `}
                    />

                    <h3
                      className="
                        text-[14px]
                        font-semibold
                        text-[#111] dark:text-slate-100
                        truncate
                      "
                    >
                      {project.title}
                    </h3>

                  </div>

                  {/* META */}

                  <div className="flex items-center gap-2 mt-3">

                    {/* STATUS */}

                    <div
                      className={`
                        px-2 py-1
                        rounded-full
                        text-[10px]
                        font-medium
                        ${statusStyle.bg}
                        ${statusStyle.text}
                      `}
                    >
                      {project.status}
                    </div>

                    {/* PROGRESS */}

                    <p className="text-[11px] text-[#777] dark:text-slate-400">
                      {project.progress}%
                    </p>

                  </div>

                </div>

                {/* BUTTON */}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/admin/project/${project.id}`);
                  }}
                  className="
                    w-8 h-8
                    rounded-full
                    border border-[#ECECEC] dark:border-slate-700
                    flex items-center justify-center
                    opacity-0
                    group-hover:opacity-100
                    transition-all
                    shrink-0
                  "
                >
                  <ArrowUpRight size={14} />
                </button>

              </div>

              {/* PROGRESS BAR */}

              <div className="mt-4">

                <div
                  className="
                    w-full
                    h-1.5
                    rounded-full
                    bg-[#F1F1F1] dark:bg-slate-700
                    overflow-hidden
                  "
                >

                  <div
                    className={`
                      h-full
                      rounded-full
                      ${
                        PRIORITY_COLORS[
                          project.priority
                        ]
                      }
                    `}
                    style={{
                      width: `${project.progress}%`,
                    }}
                  />

                </div>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}