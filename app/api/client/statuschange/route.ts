import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import sendEmail from "@/lib/email";

export async function PATCH(request: NextRequest) {
    const { user, error } = await getUser();
    const body = await request.json();

    const { projectId, status } = body as any;

    // get project + user emails (needed for mail)
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            client: true,
        },
    });

    const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { email: true },
    });

    if (status == "AWAITING_FINAL_PAYMENT") {
        await prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                status: status,
            },
        });

        // EMAIL → client
        if (user?.email) {
            await sendEmail(
               user?.email,
                "Payment Status Updated",
                `Your project "${project?.title}" is now awaiting final payment. Please pay remaning amount to complete the project.`
            );
        }

        // EMAIL → admins
        await Promise.all(
            admins.map((admin) =>
                sendEmail(
                    admin.email,
                    "Project Payment Update",
                    `Project "${project?.title}" moved to AWAITING_FINAL_PAYMENT`
                )
            )
        );

        return NextResponse.json(
            { success: true, message: "Payment verified successfully" },
            { status: 200 }
        );
    }

    await prisma.project.update({
        where: {
            id: projectId,
        },
        data: {
            status: status,
        },
    });

    // EMAIL → client
    if (user?.email) {
        await sendEmail(
            user?.email,
            "Project Status Updated",
            `Your project "${project?.title}" status changed to ${status}.`
        );
    }

    // EMAIL → admins
    await Promise.all(
        admins.map((admin) =>
            sendEmail(
                admin.email,
                "Project Status Changed",
                `Project "${project?.title}" status changed to ${status}`
            )
        )
    );

    return NextResponse.json(
        { success: true, message: "Status changed successfully" },
        { status: 200 }
    );
}