// import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getClient } from '@/lib/auth';
 
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
 
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }
 
    const { user, error } = await getClient();
    if (error || !user?.clientProfile) {
      return NextResponse.json(
        { success: false, message: error || 'Unauthorized' },
        { status: 401 }
      );
    }
 
    // Fetch project with design system and image resources
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId: user.clientProfile.id
      },
      include: {
        designSystem: true,
        resources: {
          where: { type: 'IMAGE' },
          take: 5
        }
      }
    });
 
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found or unauthorized' },
        { status: 404 }
      );
    }
 
    // Format design preview data
    const designPreview = {
      projectTitle: project.title,
      designSystemAvailable: !!project.designSystem,
      design: project.designSystem
        ? {
            id: project.designSystem.id,
            brandName: project.designSystem.brandName,
            colors: project.designSystem.colors || [],
            theme: project.designSystem.theme || [],
            brandFeel: project.designSystem.brandFeel || 'modern'
          }
        : null,
      previewImages: project.resources.map(r => ({
        id: r.id,
        title: r.title,
        url: r.content,
        type: r.type,
        createdAt: r.createdAt.toISOString()
      }))
    };
 
    return NextResponse.json({
      success: true,
      data: designPreview
    });
 
  } catch (error) {
    console.error('Error fetching design preview:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch design preview' },
      { status: 500 }
    );
  }
}

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const projectId = formData.get("projectId") as string;
//     const type = formData.get("type") as string; // "design" or "preview"
//     const previewType = formData.get("previewType") as string; // "image", "figma", or "link"
//     const title = formData.get("title") as string;
//     const uploadedBy = formData.get("uploadedBy") as string;
//     const file = formData.get("file") as File;
//     const liveUrl = formData.get("liveUrl") as string;

//     if (!projectId || !type || !title) {
//       return NextResponse.json(
//         { success: false, message: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     let cloudinaryUrl = null;
//     let publicId = null;

//     // Upload file to Cloudinary if file provided (not for link type)
//     if (file && previewType !== "link") {
//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       const uploadResult = await new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//           {
//             resource_type: "auto",
//             folder: `projects/${projectId}/${type}`,
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         ).end(buffer);
//       }) as any;

//       cloudinaryUrl = uploadResult.secure_url;
//       publicId = uploadResult.public_id;
//     }

//     // Save to database
//     const asset = await db.asset.create({
//       data: {
//         type,
//         url: previewType === "link" ? liveUrl : (cloudinaryUrl || ""),
//         title,
//         uploadedBy,
//         projectId,
//         publicId,
//         liveUrl: previewType === "link" ? liveUrl : null,
//       },
//     });

//     return NextResponse.json({ success: true, data: asset });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { success: false, message: "Upload failed" },
//       { status: 500 }
//     );
//   }
// }
