import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email){
    return { user: null, error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { clientProfile: true, engineerProfile: true }
  });
  
  if (!user){
    return { user: null, error: "User not found" };
  }

  //   if (!user.emailVerified){
  //   return { user: null, error: "Please verify your email first" };
  // }

  if (user.isSuspended) {
    return { user: null, error: "Your account has been suspended by the administrator" };
  }

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  if (user.lastActiveAt < twentyFourHoursAgo) {
    prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() }
    });
  }

  return { user, error: null };
}

export async function getAdmin() {
  const { user, error } = await getUser();

  if (!user || error){
    return { user: null, error };
  }

  if (user.role !== "ADMIN"){
    return { user: null, error: "Admin access required" };
  }

  return { user, error: null };
}


export async function getClient() {
  const { user, error } = await getUser();

  if (!user || error){
    return { user: null, error };
  }

  if (user.role !== "CLIENT"){
    return { user: null, error: "Client access required" };
  }

  return { user, error: null };
}

export async function getEngineer(requireApproval = true) {
  const { user, error } = await getUser();

  if (!user || error){
    return { user: null, error };
  }

  if (user.role !== "ENGINEER"){
    return { user: null, error: "Engineer access required" };
  }

  if (requireApproval) {
    if (!user.engineerProfile) {
      return { user: null, error: "Please complete your profile first" };
    }
    if (user.engineerProfile.status === "PENDING") {
      return { user: null, error: "Account is pending Admin approval" };
    }
    if (user.engineerProfile.status === "REJECTED") {
      return { user: null, error: `Account rejected: ${user.engineerProfile.rejectionReason}` };
    }
  }

  return { user, error: null };
}

/**
 * Resolves the user who owns a project being hired for: a CLIENT, or an
 * approved ENGINEER using "Hire Engineer". Engineers get a hiring-side
 * ClientProfile created on first use so the existing Project/payment/matching
 * code (which keys off project.clientId) works unchanged.
 */
export async function getProjectOwner() {
  const { user, error } = await getUser();

  if (!user || error) {
    return { user: null, error };
  }

  if (user.role === "CLIENT") {
    return { user, error: null };
  }

  if (user.role === "ENGINEER") {
    if (user.engineerProfile?.status !== "APPROVED") {
      return { user: null, error: "Only approved engineers can hire engineers" };
    }
    const clientProfile =
      user.clientProfile ??
      (await prisma.clientProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id },
      }));
    return { user: { ...user, clientProfile }, error: null };
  }

  return { user: null, error: "Client or engineer access required" };
}
