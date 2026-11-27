import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getEngineer } from "@/lib/auth";
import sendEmail from "@/lib/email";
import { projectInvitationTemplate } from "@/lib/templates";

const inviteSchema = z
  .object({
    invitationId: z.string().min(1).optional(), // an engineer from the matched list
    engineerId: z.string().min(1).optional(), // an engineer found through search
  })
  .refine((d) => d.invitationId || d.engineerId, { message: "Engineer is required" });

// Statuses from which an invitation can (re)start: not invited yet, matched, or lapsed.
const INVITABLE = ["PENDING_ADMIN", "EXPIRED", "DROPPED"];

// Engineer who created the project (hire flow) sends the invitation to one of the matched engineers.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { user, error } = await getEngineer();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const parsed = inviteSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 });
    }

    // Only the owner of the hire project can invite
    const project = await prisma.project.findFirst({
      where: { id: projectId, client: { userId: user.id } },
    });
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }
    if (!project.advancePaid) {
      return NextResponse.json({ success: false, message: "Pay the advance to unlock and invite engineers" }, { status: 400 });
    }
    if (project.engineerId) {
      return NextResponse.json({ success: false, message: "This project already has an assigned engineer" }, { status: 400 });
    }

    const engineerInclude = {
      engineer: { include: { user: { select: { id: true, name: true, email: true } } } },
    } as const;

    let invitation = parsed.data.invitationId
      ? await prisma.projectInvitation.findUnique({
          where: { id: parsed.data.invitationId },
          include: engineerInclude,
        })
      : await prisma.projectInvitation.findUnique({
          where: { projectId_engineerId: { projectId, engineerId: parsed.data.engineerId! } },
          include: engineerInclude,
        });

    if (invitation && invitation.projectId !== projectId) {
      return NextResponse.json({ success: false, message: "Invitation not found" }, { status: 404 });
    }

    // Engineer found through search and never matched/invited: validate, then create the invitation
    if (!invitation) {
      const profile = await prisma.engineerProfile.findUnique({
        where: { id: parsed.data.engineerId! },
        include: { user: { select: { id: true, name: true, email: true } } },
      });
      if (!profile || profile.status !== "APPROVED") {
        return NextResponse.json({ success: false, message: "Engineer not found" }, { status: 404 });
      }
      if (profile.user.id === user.id) {
        return NextResponse.json({ success: false, message: "You cannot invite yourself" }, { status: 400 });
      }
      invitation = await prisma.projectInvitation.create({
        data: { projectId, engineerId: profile.id, status: "PENDING_ADMIN" },
        include: engineerInclude,
      });
    }

    if (!invitation.engineer) {
      return NextResponse.json({ success: false, message: "Invitation not found" }, { status: 404 });
    }
    if (invitation.engineer.user.id === user.id) {
      return NextResponse.json({ success: false, message: "You cannot invite yourself" }, { status: 400 });
    }
    if (invitation.status === "SENT") {
      return NextResponse.json({ success: false, message: "Invitation already sent to this engineer" }, { status: 400 });
    }
    if (invitation.status === "REJECTED") {
      return NextResponse.json({ success: false, message: "This engineer has already declined this project" }, { status: 400 });
    }
    if (!INVITABLE.includes(invitation.status)) {
      return NextResponse.json({ success: false, message: "This engineer cannot be invited right now" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.projectInvitation.update({
        where: { id: invitation.id },
        data: { status: "SENT" },
      }),
      ...(project.status === "DRAFT"
        ? [prisma.project.update({ where: { id: projectId }, data: { status: "SEARCHING" } })]
        : []),
    ]);

    if (invitation.engineer.user.email) {
      const emailHtml = projectInvitationTemplate(
        invitation.engineer.user.name || "Engineer",
        project.title,
        project.description || "No description provided.",
        Math.floor(project.budget * 0.7)
      );
      await sendEmail(invitation.engineer.user.email, `New Project Match: ${project.title}`, emailHtml);
    }

    return NextResponse.json({ success: true, message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Error in POST /api/engineer/hire/[projectId]/invite:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
