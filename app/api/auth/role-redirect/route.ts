import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { CALLBACK_COOKIE, safeCallbackPath } from "@/lib/safe-redirect";

export async function GET(req: Request) {
  const base = process.env.NEXTAUTH_URL || new URL(req.url).origin;
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.redirect(new URL("/login", base));
  }

  const cookieStore = await cookies();
  const callback =
    safeCallbackPath(new URL(req.url).searchParams.get("callbackUrl")) ??
    safeCallbackPath(decodeURIComponent(cookieStore.get(CALLBACK_COOKIE)?.value ?? ""));
  // Only send them on once their account is set up; the cookie survives the profile form.
  const done = (fallback: string) => {
    const res = NextResponse.redirect(new URL(callback ?? fallback, base));
    if (callback) res.cookies.delete(CALLBACK_COOKIE);
    return res;
  };

  const role = session.user.role;
  const userId = session.user.id;

  if (role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", base));
  }

  if (role === "ENGINEER") {
    const profile = await prisma.engineerProfile.findUnique({ where: { userId: userId } });

    if (profile) {
      return done("/engineer");
    }
    return NextResponse.redirect(new URL("/form/engineer", base));
  }

  if (role === "CLIENT") {
    const profile = await prisma.clientProfile.findUnique({ where: { userId: userId } });

    if (profile) {
      return done("/client");
    }
    return NextResponse.redirect(new URL("/form/client", base));
  }

  return NextResponse.redirect(new URL("/", base));
}