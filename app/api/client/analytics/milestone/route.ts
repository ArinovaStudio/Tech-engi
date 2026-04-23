
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
 
    // Verify project ownership
    const projectExists = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId: user.clientProfile.id
      },
      select: { id: true }
    });
 
    if (!projectExists) {
      return NextResponse.json(
        { success: false, error: 'Project not found or unauthorized' },
        { status: 404 }
      );
    }
 
    // Fetch milestones
    const milestones = await prisma.milestone.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
      include: {
        addedBy: { select: { name: true, image: true } }
      }
    });
 
    // Format response
    const formattedMilestones = milestones.map(m => ({
      id: m.id,
      title: m.title,
      type: m.type,
      content: m.content,
      completed: m.completed,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
      addedBy: m.addedBy?.name || 'Unknown'
    }));
 
    return NextResponse.json({
      success: true,
      data: formattedMilestones
    });
 
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch milestones' },
      { status: 500 }
    );
  }
}
 