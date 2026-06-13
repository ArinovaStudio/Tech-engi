import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEngineer } from "@/lib/auth";
import { getUser } from "@/lib/auth";
import z from "zod";

const engineerUpdateSchema = z.object({
  progress: z.number().min(0).max(99, "Only the client can mark the project as 100% complete").optional(),
  repository: z.string().url("Please provide a valid repository URL").optional().nullable()
});

export async function PUT(req: NextRequest) {
  try {
    const { user, error } = await getUser();

    // if (error || !user?.engineerProfile) {
    //   return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    // }

    // const { projectId } = await params;
    const body = await req.json();
    if (body.action === "UPDATE_PROGRESS") {
      // Progress logic
      const { user, error } = await getUser();

      // if (error || !user?.engineerProfile) {
      //   return NextResponse.json(
      //     {
      //       success: false,
      //       message: error || "Unauthorized",
      //     },
      //     {
      //       status: 401,
      //     }
      //   );
      // }

      const {
        technology,
        designSystem,
        projectId,
      } = body;

      const project = await prisma.project.findUnique({
        where: {
          id: projectId,
        },
      });

      if (!project) {
        return NextResponse.json(
          {
            success: false,
            message: "Project not found",
          },
          {
            status: 404,
          }
        );
      }

      const projectUpdate =
        await prisma.project.update({
          where: {
            id: projectId,
          },
          data: {
            technology,
          },
        });

      let savedDesignSystem = null;

      if (designSystem) {
        savedDesignSystem =
          await prisma.designSystem.upsert({
            where: {
              projectId,
            },

            update: {
              brandName:
                designSystem.brandName,

              colors:
                designSystem.colors,

              fonts:
                designSystem.fonts,

              designType:
                designSystem.designType,

              layoutStyle:
                designSystem.layoutStyle,

              contentTone:
                designSystem.contentTone,

              visualGuidelines:
                designSystem.visualGuidelines,

              theme:
                designSystem.theme,

              brandFeel:
                designSystem.brandFeel,

              keyPages:
                designSystem.keyPages,

              uniqueness:
                designSystem.uniqueness,
            },

            create: {
              projectId,

              brandName:
                designSystem.brandName,

              colors:
                designSystem.colors,

              fonts:
                designSystem.fonts,

              designType:
                designSystem.designType,

              layoutStyle:
                designSystem.layoutStyle,

              contentTone:
                designSystem.contentTone,

              visualGuidelines:
                designSystem.visualGuidelines,

              theme:
                designSystem.theme,

              brandFeel:
                designSystem.brandFeel,

              keyPages:
                designSystem.keyPages,

              uniqueness:
                designSystem.uniqueness,
            },
          });
      }
      

      return NextResponse.json(
        {
          success: true,
          message:
            "Project updated successfully",
          project: projectUpdate,
          designSystem:
            savedDesignSystem,
        },
        {
          status: 200,
        }
      );

    } else {
      return NextResponse.json({ success: true, message: "Project updated successfully" }, { status: 200 });
    }

  } catch (error:any) {
    
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}