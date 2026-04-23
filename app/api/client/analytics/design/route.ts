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
 
    // Verify client owns this project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId: user.clientProfile.id
      },
      include: {
        designSystem: true
      }
    });
 
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found or unauthorized' },
        { status: 404 }
      );
    }
 
    const designSystem = project.designSystem;
    const currentPhase = project.currentPhase ?? 'Design';
    const daysRemaining = project.endDate
      ? Math.max(0, Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
      : 0;
 
    // Phase completion logic
    const phases = [
      {
        name: 'Design',
        icon: 'palette',
        completed: ['Code', 'Testing', 'Deployment'].includes(currentPhase) || currentPhase === 'Design'
      },
      {
        name: 'Code',
        icon: 'code',
        completed: ['Testing', 'Deployment'].includes(currentPhase) || currentPhase === 'Code'
      },
      {
        name: 'Testing',
        icon: 'test',
        completed: currentPhase === 'Deployment' || currentPhase === 'Testing'
      },
      {
        name: 'Deployment',
        icon: 'deploy',
        completed: currentPhase === 'Deployment'
      }
    ];
 
    const designData = {
      id: designSystem?.id || null,
      projectId: designSystem?.projectId || projectId,
      brandName: designSystem?.brandName || 'Your Brand',
      colors: designSystem?.colors || [],
      fonts: designSystem?.fonts || { primary: 'sans-serif', secondary: 'serif' },
      designType: designSystem?.designType || [],
      layoutStyle: designSystem?.layoutStyle || { primary: 'flex' },
      contentTone: designSystem?.contentTone || [],
      visualGuidelines: designSystem?.visualGuidelines || { primary: 'light' },
      theme: designSystem?.theme || ['light'],
      brandFeel: designSystem?.brandFeel || 'modern',
      keyPages: designSystem?.keyPages || [],
      uniqueness: designSystem?.uniqueness || { primary: 'unique' },
      createdAt: designSystem?.createdAt?.toISOString() || null,
      updatedAt: designSystem?.updatedAt?.toISOString() || null,
      projectPhase: {
        current: currentPhase,
        daysRemaining,
        phases
      },
      technology: project.instruments || []
    };
 
    return NextResponse.json({
      success: true,
      data: designData
    });
 
  } catch (error) {
    console.error('Error fetching design data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}