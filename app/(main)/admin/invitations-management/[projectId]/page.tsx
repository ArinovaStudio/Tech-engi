"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

export default function ProjectDetailsPage() {
  const { projectId } = useParams();

  const [project, setProject] = useState<any>(null);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL_USERS");
  const [engineers, setEngineers] = useState<any[]>([]);
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
      id: "APPROVED",
      title: "Approved",
      icon: CheckCircle2,
      color: "green",
    },
    {
      id: "REJECTED",
      title: "Rejected",
      icon: XCircle,
      color: "red",
    },
    {
      id: "WAITING",
      title: "Waiting",
      icon: Clock3,
      color: "yellow",
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

  if (loading) return <p className="p-6">Loading...</p>;
  if (!project) return <p className="p-6">Project not found</p>;

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
    <div className="p-6 h-screen overflow-hidden">
      <div className="grid grid-cols-4 gap-6 h-full">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* HEADER */}
            <div className="
              sticky
              top-0
              z-10
              flex
              items-center
              justify-between
              mb-4
              pb-3
              bg-white
              border-b
              border-[var(--border)]
            ">
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
                0
              </span>
            </div>

            {/* EMPTY COLUMN */}
            {/* <div
              className="
            flex-1
            min-h-[500px]
            rounded-2xl
            border-2
            border-dashed
            border-[var(--border)]
            bg-[var(--bg)]
          "
            /> */}
            <div
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
              className={`
                flex-1
                h-full
                min-h-0
                rounded-2xl
                border-2
                border-dashed
                border-[var(--border)]
                bg-[var(--bg)]
                p-2
                transition-colors
                overflow-y-auto
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
                      className="
          bg-white
          border
          border-[var(--border)]
          rounded-2xl
          p-4
          mb-3
          cursor-grab
          active:cursor-grabbing
          transition-all
          hover:shadow-sm
        "
                    >
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
                            className="
                w-12
                h-12
                rounded-full
                flex
                items-center
                justify-center
                text-white
                font-semibold
                text-sm
              "
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
                          <h3
                            className="
                font-semibold
                text-[15px]
                truncate
                mb-1
              "
                            style={{
                              color:
                                "var(--text-primary)",
                            }}
                          >
                            {engineer.name}
                          </h3>

                          <p
                            className="
                text-[11px]
                font-medium
              "
                            style={{
                              color:
                                "var(--text-muted)",
                            }}
                          >
                            {
                              engineer
                                .engineerProfile
                                ?.qualification
                            }
                          </p>
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

                    className="
        bg-white
        border
        border-[var(--border)]
        rounded-2xl
        p-4
        mb-3
        transition-all
      "
                  >

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
                          className="
              w-12
              h-12
              rounded-full
              object-cover
            "
                        />
                      ) : (
                        <div
                          className="
              w-12
              h-12
              rounded-full
              flex
              items-center
              justify-center
              text-white
              font-semibold
              text-sm
            "
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
                          className="
              font-semibold
              text-[15px]
              truncate
              mb-1
            "
                          style={{
                            color:
                              "var(--text-primary)",
                          }}
                        >
                          {
                            invitation.engineer
                              .user.name
                          }
                        </h3>

                        <p
                          className="
              text-[11px]
              font-medium
            "
                          style={{
                            color:
                              "var(--text-muted)",
                          }}
                        >
                          {
                            invitation.engineer
                              .qualification
                          }
                        </p>

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