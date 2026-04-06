import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/uploads";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ resourceId: string }> }) {
  try {
    const { user, error } = await getUser();
    if (error || !user){
        return NextResponse.json({ success: false, message: error ||"Unauthorized" }, { status: 401 });
    }

    const { resourceId } = await params;
    const existingResource = await prisma.projectResource.findUnique({ where: { id: resourceId } });

    if (!existingResource){
        return NextResponse.json({ success: false, message: "Resource not found" }, { status: 404 });
    }

    if (existingResource.addedById !== user.id) {
      return NextResponse.json({ success: false, message: "You can only edit your own resources" }, { status: 403 });
    }

    const formData = await req.formData();
    const newTitle = formData.get("title") as string;
    let newContent = existingResource.content;

    if (existingResource.type === "FILE" || existingResource.type === "IMAGE") {
      const newFile = formData.get("file") as File;
      if (newFile && newFile.size > 0) {
        await deleteFile(existingResource.content);
        newContent = await uploadFile(newFile, "resources");
      }
    } else {
      const updatedTextContent = formData.get("content") as string;
      if (updatedTextContent) newContent = updatedTextContent;
    }

    const updatedResource = await prisma.projectResource.update({
      where: { id: resourceId },
      data: {
        title: newTitle || existingResource.title,
        content: newContent
      }
    });

    return NextResponse.json({ success: true, message: "Resource updated", resource: updatedResource }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ resourceId: string }> }) {
  try {
    const { user, error } = await getUser();
    if (error || !user){
        return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { resourceId } = await params;
    const existingResource = await prisma.projectResource.findUnique({ where: { id: resourceId } });

    if (!existingResource){
        return NextResponse.json({ success: false, message: "Resource not found" }, { status: 404 });
    }

    if (existingResource.addedById !== user.id) {
      return NextResponse.json({ success: false, message: "You can only delete your own resources" }, { status: 403 });
    }

    if (existingResource.type === "FILE" || existingResource.type === "IMAGE") {
      await deleteFile(existingResource.content);
    }

    await prisma.projectResource.delete({ where: { id: resourceId } });

    return NextResponse.json({ success: true, message: "Resource deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server error" }, { status: 500 });
  }
}