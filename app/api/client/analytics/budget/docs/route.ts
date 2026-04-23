import db from "@/lib/client";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(req: Request) {
  try {
    const { docIds } = await req.json();

    if (!docIds || !Array.isArray(docIds) || docIds.length === 0) {
      return NextResponse.json({ success: false, message: "No document IDs provided" }, { status: 400 });
    }

    // Get documents to delete (to extract cloudinary public IDs)
    const docs = await db.docs.findMany({
      where: { id: { in: docIds } },
      select: { id: true, fileUrl: true }
    });

    // Delete from cloudinary
    for (const doc of docs) {
      try {
        const publicId = doc.fileUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (err) {
        console.error('Cloudinary deletion error:', err);
      }
    }

    // Delete from database
    await db.docs.deleteMany({
      where: { id: { in: docIds } }
    });

    return NextResponse.json({ success: true, message: "Documents deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to delete documents" }, { status: 500 });
  }
}
