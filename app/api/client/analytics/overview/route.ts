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
 
    // Fetch project with engineer, transactions, and team
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId: user.clientProfile.id
      },
      include: {
        engineer: {
          include: {
            user: { select: { name: true, email: true } }
          }
        },
        transactions: {
          where: { status: 'SUCCESS' }
        },
        invitations: {
          where: { status: 'ACCEPTED' }
        }
      }
    });
 
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found or unauthorized' },
        { status: 404 }
      );
    }
 
    // Calculate financial data
    const advanceAmount = project.transactions
      .filter(t => t.type === 'ADVANCE_PAYMENT')
      .reduce((sum, t) => sum + t.amount, 0);
 
    const finalAmount = project.transactions
      .filter(t => t.type === 'FINAL_PAYMENT')
      .reduce((sum, t) => sum + t.amount, 0);
 
    const totalPaid = advanceAmount + finalAmount;
 
    // Calculate days remaining
    const daysRemaining = project.endDate
      ? Math.max(0, Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
      : 0;
 
    const projectOverview = {
      project: {
        id: project.id,
        name: project.title,
        description: project.description,
        type: project.currentPhase || 'Design',
        budget: project.budget,
        currency: 'INR',
        status: project.status,
        priority: project.priority
      },
      timeline: {
        startDate: project.startDate?.toISOString() || new Date().toISOString(),
        deadline: project.endDate?.toISOString() || new Date().toISOString(),
        daysRemaining
      },
      team: {
        projectManager: project.engineer?.user?.name || 'Not Assigned',
        projectManagerEmail: project.engineer?.user?.email || null,
        teamSize: project.invitations.length + (project.engineer ? 1 : 0)
      },
      progress: {
        overall: project.progress || 0,
        advancePaid: project.advancePaid,
        finalPaymentMade: project.isFinalPaymentMade,
        advanceAmount: Math.round(advanceAmount * 100) / 100,
        finalAmount: Math.round(finalAmount * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        remainingAmount: Math.round((project.budget - totalPaid) * 100) / 100
      }
    };
 
    return NextResponse.json({
      success: true,
      data: projectOverview
    });
 
  } catch (error) {
    console.error('Error fetching project overview:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project overview' },
      { status: 500 }
    );
  }
}