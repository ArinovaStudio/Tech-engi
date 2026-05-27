"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock3,
  ArrowLeft,
  FolderSearch,
  ArrowRight,
} from "lucide-react";

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL_USERS");
  const [engineers, setEngineers] = useState<any[]>([]);
  const [sendingLoader, setSendingLoader] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] =
    useState<any | null>(null);

  const columns = [
    {
      id: "ALL_USERS",
      title: "All Users",
      icon: Users,
      color: "blue",
    },
    {
      id: "WAITING",
      title: "Waiting",
      icon: Clock3,
      color: "yellow",
    },
    {
      id: "REJECTED",
      title: "Rejected",
      icon: XCircle,
      color: "red",
    },
    {
      id: "APPROVED",
      title: "Approved",
      icon: CheckCircle2,
      color: "green",
    },


  ];

  const getInvitationsByStatus = (status: string) => {
    if (status === "ALL_USERS") {
      return invitations;
    }

    if (status === "APPROVED") {
      return invitations.filter(
        (inv) => inv.status === "ACCEPTED"
      );
    }

    if (status === "REJECTED") {
      return invitations.filter(
        (inv) =>
          inv.status === "REJECTED" ||
          inv.status === "ADMIN_REJECTED"
      );
    }

    if (status === "WAITING") {
      return invitations.filter(
        (inv) =>
          inv.status === "PENDING_ADMIN" ||
          inv.status === "SENT"
      );
    }

    return [];
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/project/${projectId}/invitations`);
      const json = await res.json();

      setProject(json.project);

      setInvitations(json.invitations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEngineers = async () => {
    try {
      const res = await fetch("/api/users");

      const json = await res.json();


      setEngineers(json.engineers || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStart = (
    type: "ENGINEER" | "INVITATION",
    data: any,
    fromColumn: string
  ) => {
    setDraggedItem({
      type,
      data,
      fromColumn,
    });
  };

  const handleDragOver = (
    e: React.DragEvent
  ) => {
    e.preventDefault();
  };

  const handleSendInvitation = async (
    engineerId: string
  ) => {
    try {
      setSendingLoader(engineerId);
      await fetch(
        "/api/admin/invitations",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            projectId,
            engineerId,
          }),
        }
      );

      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setSendingLoader(null);
    }
  };

  const handleAction = async (
    invitationId: string,
    action: "APPROVE" | "REJECT"
  ) => {
    try {
      await fetch(`/api/admin/invitations/${invitationId}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });

      fetchData(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  // const handleDrop = async (
  //   newColumn: string
  // ) => {
  //   if (!draggedItem) return;

  //   const {
  //     type,
  //     data,
  //     fromColumn,
  //   } = draggedItem;
  //   console.log(fromColumn);
  //   console.log(newColumn);
  //   try {

  //     /*
  //     =====================================
  //     ENGINEER
  //     =====================================
  //     */

  //     if (type === "ENGINEER") {

  //       // ALL_USERS -> WAITING
  //       // ALL_USERS -> APPROVED
  //       // ALL_USERS -> REJECTED

  //       if (
  //         newColumn === "ALL_USERS"
  //       ) {
  //         return;
  //       }

  //       let status = "SENT";

  //       if (
  //         newColumn === "APPROVED"
  //       ) {
  //         status = "ACCEPTED";
  //       }

  //       if (
  //         newColumn === "REJECTED"
  //       ) {
  //         status = "REJECTED";
  //       }

  //       await fetch(
  //         "/api/admin/invitations",
  //         {
  //           method: "POST",

  //           headers: {
  //             "Content-Type":
  //               "application/json",
  //           },

  //           body: JSON.stringify({
  //             projectId,

  //             engineerId:
  //               data.engineerProfile.id,

  //             status,
  //           }),
  //         }
  //       );

  //       fetchData();
  //     }

  //     /*
  //     =====================================
  //     INVITATION
  //     =====================================
  //     */

  //     if (
  //       type === "INVITATION"
  //     ) {

  //       // WAITING -> ANYWHERE DISABLED
  //       if (
  //         fromColumn === "WAITING"
  //       ) {
  //         return;
  //       }

  //       // APPROVED -> ANYWHERE DISABLED
  //       if (
  //         fromColumn === "APPROVED"
  //       ) {
  //         return;
  //       }

  //       // REJECTED RULES
  //       if (
  //         fromColumn === "REJECTED"
  //       ) {

  //         // ONLY REJECTED -> WAITING
  //         if (
  //           newColumn !== "WAITING"
  //         ) {
  //           return;
  //         }
  //         console.log(data.id, "called from patch");

  //         const res = await fetch(
  //           `/api/admin/invitations/`,
  //           {
  //             method: "PATCH",

  //             headers: {
  //               "Content-Type":
  //                 "application/json",
  //             },

  //             body: JSON.stringify({
  //               status: "SENT",
  //               id: data.id
  //             }),
  //           }
  //         );
  //         console.log(res, "response in patch");

  //         fetchData();

  //         return;
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }

  //   setDraggedItem(null);
  // };

  const handleDrop = async (
    newColumn: string
  ) => {

    if (!draggedItem) return;

    const {
      type,
      data,
      fromColumn,
    } = draggedItem;

    // console.log(fromColumn);
    // console.log(newColumn);

    try {

      /*
      =====================================
      ENGINEER
      =====================================
      */

      if (type === "ENGINEER") {

        // ALL_USERS -> WAITING
        // ALL_USERS -> APPROVED
        // ALL_USERS -> REJECTED

        if (
          newColumn === "ALL_USERS"
        ) {
          return;
        }

        let status = "SENT";

        if (
          newColumn === "APPROVED"
        ) {
          status = "ACCEPTED";
        }

        if (
          newColumn === "REJECTED"
        ) {
          status = "REJECTED";
        }

        await fetch(
          "/api/admin/invitations",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              projectId,

              engineerId:
                data.engineerProfile.id,

              status,
            }),
          }
        );

        fetchData();
      }

      /*
      =====================================
      INVITATION
      =====================================
      */

      if (
        type === "INVITATION"
      ) {

        /*
        =====================================
        MOVE BACK TO ALL USERS
        =====================================
        */

        if (
          newColumn === "ALL_USERS"
        ) {

          await fetch(
            `/api/admin/invitations`,
            {
              method: "DELETE",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                id: data.id,
              }),
            }
          );
          fetchData();

          return;
        }

        /*
        =====================================
        WAITING RULES
        =====================================
        */

        if (
          fromColumn === "WAITING"
        ) {
          return;
        }

        /*
        =====================================
        APPROVED RULES
        =====================================
        */

        if (
          fromColumn === "APPROVED"
        ) {
          return;
        }

        /*
        =====================================
        REJECTED RULES
        =====================================
        */

        if (
          fromColumn === "REJECTED"
        ) {

          // ONLY REJECTED -> WAITING

          if (
            newColumn !== "WAITING"
          ) {
            return;
          }

          // console.log(
          //   data.id,
          //   "called from patch"
          // );

          const res = await fetch(
            `/api/admin/invitations/`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                status: "SENT",
                id: data.id,
              }),
            }
          );

          // console.log(
          //   res,
          //   "response in patch"
          // );

          fetchData();

          return;
        }
      }

    } catch (error) {

      console.error(error);

    }

    setDraggedItem(null);
  };

  useEffect(() => {
    fetchData();
    fetchEngineers();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[var(--bg)] p-6">

        {/* TOP NAV SKELETON */}
        <div className="flex items-center justify-between mb-6 bg-white border border-[var(--border)] rounded-2xl p-4 animate-pulse">

          <div className="h-11 w-28 rounded-xl bg-gray-200" />

          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-48 rounded-lg bg-gray-200" />
            <div className="h-4 w-36 rounded-lg bg-gray-100" />
          </div>

          <div className="w-28" />
        </div>

        {/* BOARD */}
        <div className="grid grid-cols-4 gap-6 h-[calc(100vh-140px)]">

          {[1, 2, 3, 4].map((col) => (
            <div
              key={col}
              className="
              rounded-3xl
              border
              border-[var(--border)]
              bg-white
              p-4
              flex
              flex-col
              animate-pulse
            "
            >

              {/* COLUMN HEADER */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-200" />
                  <div className="h-5 w-24 rounded-lg bg-gray-200" />
                </div>

                <div className="h-5 w-6 rounded bg-gray-200" />
              </div>

              {/* CARDS */}
              <div className="space-y-4">

                {[1, 2, 3, 4].map((card) => (
                  <div
                    key={card}
                    className="
                    rounded-2xl
                    border
                    border-gray-100
                    p-4
                    bg-[#fafafa]
                  "
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-full bg-gray-200" />

                      <div className="flex-1">
                        <div className="h-5 w-32 rounded bg-gray-200 mb-2" />
                        <div className="h-4 w-20 rounded bg-gray-100" />
                      </div>

                    </div>

                    <div className="flex gap-2 mt-4">
                      <div className="h-7 w-24 rounded-full bg-gray-100" />
                      <div className="h-7 w-20 rounded-full bg-gray-100" />
                    </div>

                  </div>
                ))}

              </div>
            </div>
          ))}

        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[var(--bg)] p-6">

        <div
          className="w-full max-w-md bg-white border border-[var(--border)] rounded-3xl shadow-sm p-8 text-center">

          {/* ICON */}
          <div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center bg-red-50 border border-red-100 mb-6">
            <FolderSearch className="w-10 h-10 text-red-500" />
          </div>

          {/* TITLE */}
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{
              color: "var(--text-primary)",
            }}
          >
            Project Not Found
          </h1>

          {/* DESCRIPTION */}
          <p
            className="text-sm leading-6 mt-3"
            style={{
              color: "var(--text-muted)",
            }}
          >
            The project you are trying to access
            does not exist or may have been removed.
          </p>

          {/* ACTIONS */}
          <div className="flex items-center justify-center gap-3 mt-8">

            <button
              onClick={() => router.back()}
              className="h-11 px-5 rounded-xl border border-[var(--border)] bg-white hover:bg-gray-50 transition-all text-sm font-medium"
              style={{
                color: "var(--text-primary)",
              }}
            >
              Go Back
            </button>

            <button
              onClick={() => router.push('/admin/projects')}
              className="h-11 px-5 rounded-xl bg-black hover:opacity-90 transition-all text-sm font-medium text-white">
              View Projects
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    // <DashboardShell>
    //   <div className="p-6 space-y-6">

    //     {/* PROJECT */}
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Project</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <h2 className="text-xl font-bold">{project.title}</h2>
    //         <p className="text-muted-foreground">{project.description}</p>

    //         <div className="flex gap-3 mt-3">
    //           <Badge>{project.status}</Badge>
    //           <Badge variant="outline">₹{project.budget}</Badge>
    //         </div>
    //       </CardContent>
    //     </Card>

    //     {/* INVITATIONS */}
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Invited Engineers</CardTitle>
    //       </CardHeader>

    //       <CardContent className="space-y-3">
    //         {invitations.length === 0 ? (
    //           <p className="text-sm text-muted-foreground">
    //             No invitations yet
    //           </p>
    //         ) : (
    //           invitations.map((inv) => (
    //             <div
    //               key={inv.id}
    //               className="flex justify-between items-center border p-3 rounded-lg"
    //             >
    //               <div>
    //                 <p className="font-medium">
    //                   {inv.engineer.user.name}
    //                 </p>
    //                 <p className="text-sm text-muted-foreground">
    //                   {inv.engineer.user.email}
    //                 </p>
    //               </div>

    //               <div className="flex items-center gap-3">
    //                 <Badge>{inv.status}</Badge>

    //                 {inv.status === "PENDING_ADMIN" && (
    //                   <>
    //                     <Button
    //                       size="sm"
    //                       onClick={() =>
    //                         handleAction(inv.id, "APPROVE")
    //                       }
    //                     >
    //                       Approve
    //                     </Button>

    //                     <Button
    //                       size="sm"
    //                       variant="destructive"
    //                       onClick={() =>
    //                         handleAction(inv.id, "REJECT")
    //                       }
    //                     >
    //                       Reject
    //                     </Button>
    //                   </>
    //                 )}
    //               </div>
    //             </div>
    //           ))
    //         )}
    //       </CardContent>
    //     </Card>

    //   </div>
    // </DashboardShell>
    <div className="p-6 h-full overflow-hidden">
      <div className=" relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#f7f5f5] rounded-2xl p-4 md:p-5">

        {/* PAGE TITLE */}
        <div className="flex flex-col min-w-0">

          <h1
            className="text-xl sm:text-2xl font-semibold tracking-tight break-words"
            style={{
              color: "var(--text-primary)",
            }}
          >
            Project Members
          </h1>

          <p
            className="text-sm mt-1 leading-relaxed"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Manage engineers and invitations
          </p>

        </div>

        {/* BACK BUTTON */}
        <div
          className="flex sm:block w-full sm:w-auto"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center cursor-pointer gap-2 w-full sm:w-auto px-4 h-11 rounded-xl border border-[var(--border)] bg-white hover:bg-gray-50 transition-all shadow-sm text-sm font-medium"
            style={{
              color: "var(--text-primary)",
            }}
          >

            <span>
              Back
            </span>

            <ArrowRight className="w-4 h-4 shrink-0" />

          </button>
        </div>

      </div>
      <div className="grid grid-cols-4 gap-6 h-screen mt-2 p-4 bg-[#f8f6f6] rounded-2xl">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-xl mb-4 p-3 bg-white border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div
                  className={`
                p-2
                rounded-lg
                ${column.color === "blue"
                      ? "bg-blue-50 text-blue-600"
                      : column.color === "green"
                        ? "bg-green-50 text-green-600"
                        : column.color === "red"
                          ? "bg-red-50 text-red-600"
                          : "bg-yellow-50 text-yellow-600"
                    }
              `}
                >
                  <column.icon className="w-5 h-5" />
                </div>

                <h2
                  className="font-semibold text-base"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  {column.title}
                </h2>
              </div>

              <span
                className="text-sm font-medium mr-2"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                {column.id === "ALL_USERS"
                  ? engineers
                    .filter(
                      (engineer) => engineer.engineerProfile
                    )
                    .filter((engineer) => {
                      const alreadyInvited =
                        invitations.some(
                          (invitation) =>
                            invitation.engineerId ===
                            engineer.engineerProfile.id
                        );

                      return !alreadyInvited;
                    }).length
                  : getInvitationsByStatus(column.id).length}
              </span>
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
              className={`flex-1 h-full min-h-0 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg)] p-2 transition-colors overflow-y-auto
                ${draggedItem
                  ? "bg-white"
                  : ""
                }
            `}
            >
              {column.id === "ALL_USERS" &&
                engineers
                  .filter(
                    (engineer) =>
                      engineer.engineerProfile
                  )
                  .filter((engineer) => {
                    const alreadyInvited =
                      invitations.some(
                        (invitation) =>
                          invitation.engineerId ===
                          engineer.engineerProfile.id
                      );

                    return !alreadyInvited;
                  })
                  .map((engineer) => (
                    <div
                      key={engineer.id}
                      draggable
                      onDragStart={() =>
                        handleDragStart(
                          "ENGINEER",
                          engineer,
                          "ALL_USERS"
                        )
                      }
                      className="bg-white border border-[var(--border)] rounded-2xl p-4 mb-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-sm">
                      {/* USER */}
                      <div className="flex items-center gap-3">

                        {/* IMAGE */}
                        {engineer.image ? (
                          <img
                            src={engineer.image}
                            alt={engineer.name}
                            className="
                              w-12
                              h-12
                              rounded-full
                              object-cover
                              "
                          />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                            style={{
                              background:
                                "var(--primary)",
                            }}
                          >
                            {engineer.name?.charAt(0)}
                          </div>
                        )}

                        {/* INFO */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h3
                              className="font-semibold text-[18px] truncate leading-tight tracking-[-0.02em]"
                              style={{
                                color: "var(--text-primary)",
                              }}
                            >
                              {engineer.name}
                            </h3>

                            {/* <span className="px-2.5py-1 rounded-full text-[12px] font-semibold bg-[#F5F5F5] border border-[#E8E8E8]"
                              style={{
                                color: "var(--text-secondary)",
                              }}
                            >
                              {engineer.engineerProfile?.qualification}
                            </span> */}
                            {/* INVITE BUTTON */}
                            <button
                              disabled={sendingLoader === engineer.engineerProfile.id}
                              onClick={() =>
                                handleSendInvitation(
                                  engineer.engineerProfile.id
                                )
                              }

                              className={`cursor-pointer shrink-0 h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-[#FFAE58] hover:opacity-90 transition-all text-white text-[11px] sm:text-[12px] font-semibold shadow-sm  ${sendingLoader === engineer.engineerProfile.id
                                ? "bg-[#FFC98F] cursor-not-allowed opacity-70"
                                : "bg-[#FFAE58] hover:opacity-90 cursor-pointer"
                                }`}>
                              {sendingLoader === engineer.engineerProfile.id? "Inviting..." : "Invite"}
                            </button>
                          </div>

                          <div
                            className="flex flex-wrap items-center gap-3 mt-3 mb-2">

                            {engineer.engineerProfile?.skills?.length > 0 && (
                              <div className="flex flex-wrap items-center gap-2">

                                {engineer.engineerProfile.skills
                                  ?.slice(0, 3)
                                  .map((skill: string, index: number) => (

                                    <span
                                      key={index}
                                      className="px-2.5 py-1 rounded-full text-[11px] sm:text-[12px] font-medium bg-[#FFF7ED] border border-[#FED7AA] whitespace-nowrap"
                                      style={{
                                        color: "#C2410C",
                                      }}
                                    >
                                      {skill}
                                    </span>

                                  ))}

                              </div>
                            )}
                          </div>
                          <span
                            className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#F8FAFC] border border-[#E2E8F0]"
                            style={{
                              color: "#475569",
                            }}
                          >
                            {engineer.engineerProfile?.yearsOfExperienceNumber || 0} years
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

              {column.id !== "ALL_USERS" &&
                getInvitationsByStatus(
                  column.id
                ).map((invitation) => (
                  <div
                    key={invitation.id}

                    draggable={
                      column.id === "REJECTED" || column.id === "WAITING" || column.id === "APPROVED"
                    }

                    onDragStart={() =>
                      handleDragStart(
                        "INVITATION",
                        invitation,
                        column.id
                      )
                    }

                    className="bg-white border border-[var(--border)] rounded-2xl p-4 mb-3 transition-all">

                    <div className="flex items-center gap-3">

                      {/* IMAGE */}
                      {invitation.engineer.user
                        .image ? (
                        <img
                          src={
                            invitation.engineer
                              .user.image
                          }
                          alt={
                            invitation.engineer
                              .user.name
                          }
                          className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                          style={{
                            background:
                              "var(--primary)",
                          }}
                        >
                          {invitation.engineer.user.name?.charAt(
                            0
                          )}
                        </div>
                      )}

                      {/* INFO */}
                      <div className="min-w-0 flex-1">

                        <h3
                          className="font-semibold text-[15px] truncate mb-1"
                          style={{
                            color:
                              "var(--text-primary)",
                          }}
                        >
                          {
                            invitation.engineer?.user?.name
                          }
                        </h3>

                        {/* <p
                          className="text-[11px] font-medium"
                          style={{
                            color:
                              "var(--text-muted)",
                          }}
                        >
                          {
                            invitation.engineer?.qualification
                          }
                        </p> */}

                        <div>
                          <div className="mb-3">
                            {invitation.engineer?.skills
                              ?.slice(0, 3)
                              .map((skill: string, index: number) => (

                                <span
                                  key={index}
                                  className="px-2.5 mr-2 py-1 rounded-full text-[11px] sm:text-[12px] font-medium bg-[#FFF7ED] border border-[#FED7AA] whitespace-nowrap"
                                  style={{
                                    color: "#C2410C",
                                  }}
                                >
                                  {skill}
                                </span>

                              ))}
                          </div>

                          <span
                            className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#F8FAFC] border border-[#E2E8F0]"
                            style={{
                              color: "#475569",
                            }}
                          >
                            {invitation.engineer?.yearsOfExperienceNumber || 0} years
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}