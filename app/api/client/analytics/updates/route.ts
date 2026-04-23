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
 
    // Fetch latest updates
    const updates = await prisma.latestUpdate.findMany({
      where: {
        projectId,
        project: {
          clientId: user.clientProfile.id
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
 
    // Format response
    const formattedUpdates = updates.map(u => ({
      id: u.id,
      title: u.title,
      date: u.date,
      createdAt: u.createdAt.toISOString()
    }));
 
    return NextResponse.json({
      success: true,
      data: formattedUpdates
    });
 
  } catch (error) {
    console.error('Error fetching updates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch updates' },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const { title, date, projectId, createdBy } = await req.json();

    const update = await db.latestUpdate.create({
      data: {
        title,
        date,
        projectId,
        createdBy
      }
    });

    return NextResponse.json({ success: true, data: update });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to create update" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, date } = await req.json();

    const update = await db.latestUpdate.update({
      where: { id },
      data: { title, date }
    });

    return NextResponse.json({ success: true, data: update });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await db.latestUpdate.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Update deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}