import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/auth";

interface Params {
  params: Promise<{
    id: string;
  }>;
}


export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getAdmin();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");
    // console.log(projectId, status, "params");


    const whereClause: any = {};
    if (projectId) {
      whereClause.projectId = projectId;
    }

    if (status && ["PENDING_ADMIN", "SENT", "ACCEPTED", "REJECTED", "ADMIN_REJECTED", "EXPIRED", "DROPPED"].includes(status)) {
      whereClause.status = status;
    }

    const invitations = await prisma.projectInvitation.findMany({
      where: whereClause,
      include: {
        project: {
          select: { id: true, title: true, budget: true, status: true }
        },
        engineer: {
          include: { user: { select: { name: true, email: true, image: true } } }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const formattedInvitations = invitations.map(inv => ({
      ...inv,
      engineerCut: inv.project.budget * 0.7,
      platformProfit: inv.project.budget * 0.3
    }));

    return NextResponse.json({ success: true, invitations: formattedInvitations }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json();

    const { projectId, engineerId, status, } = body;

    // VALIDATION
    if (!projectId || !engineerId) {
      return NextResponse.json({
        success: false, message: "Project ID and Engineer ID are required",
      },
        { status: 400, }
      );
    }

    // CHECK EXISTING INVITATION
    const existingInvitation = await prisma.projectInvitation.findUnique({
      where: {
        projectId_engineerId: {
          projectId,
          engineerId,
        },
      },
    }
    );

    console.log(existingInvitation);


    if (existingInvitation) {
      return NextResponse.json(
        { success: false, message: "Invitation already exists", },
        {
          status: 409,
        }
      );
    }

    // CREATE INVITATION
    const invitation = await prisma.projectInvitation.create({
      data: {
        projectId,
        engineerId,

        status: status || "SENT",
      },

      include: {
        engineer: {
          include: {
            user: true,
          },
        },

        project: true,
      },
    }
    );

    return NextResponse.json(
      { success: true, invitation, },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE_INVITATION_ERROR", error);

    return NextResponse.json(
      { success: false, message: "Failed to create invitation", },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      status,
      action,
      id
    } = body;

    // VALIDATION
    if (!status) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Status is required",
        },
        {
          status: 400,
        }
      );
    }

    // CHECK INVITATION
    const existingInvitation =
      await prisma.projectInvitation.findUnique(
        {
          where: {
            id,
          },
        }
      );

    if (!existingInvitation) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invitation not found",
        },
        {
          status: 404,
        }
      );
    }

    // UPDATE STATUS
    const updatedInvitation =
      await prisma.projectInvitation.update(
        {
          where: {
            id,
          },

          data: {
            status,
          },

          include: {
            engineer: {
              include: {
                user: true,
              },
            },

            project: true,
          },
        }
      );

    return NextResponse.json(
      {
        success: true,
        invitation:
          updatedInvitation,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "UPDATE_INVITATION_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update invitation",
      },
      {
        status: 500,
      }
    );
  }
}

/*
=====================================
DELETE INVITATION
=====================================
*/

export async function DELETE(req: NextRequest) {

  try {
    const body = await req.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Invitation id required", }, { status: 400, });
    }

    const invitation =
      await prisma.projectInvitation.findUnique({
        where: {
          id,
        },
      });

    if (!invitation) {

      return NextResponse.json(
        { success: false, message: "Invitation not found", }, { status: 404, });
    }

    await prisma.projectInvitation.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { success: true, message: "Invitation deleted successfully", }, { status: 200, }
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { success: false, message: "Internal server error", }, { status: 500, }
    );
  }
}