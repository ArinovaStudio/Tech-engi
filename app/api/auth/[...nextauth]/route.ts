import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { AUTH_ERROR } from "@/lib/auth-errors";

export const authOptions: NextAuthOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || process.env.GITHUB_ID || "github_placeholder_id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || process.env.GITHUB_SECRET || "github_placeholder_secret",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) {
          throw new Error(AUTH_ERROR.MISSING);
        }

        // Case-insensitive so "Name@Mail.com" finds the account registered as "name@mail.com".
        const user = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });

        if (!user) throw new Error(AUTH_ERROR.EMAIL_NOT_FOUND);
        if (user.isSuspended) throw new Error(AUTH_ERROR.SUSPENDED);
        if (user.password === null) throw new Error(AUTH_ERROR.NO_PASSWORD);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error(AUTH_ERROR.WRONG_PASSWORD);

        // Only the fields the JWT needs. Never hand the password hash to NextAuth.
        return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        if (!user.email) {
          throw new Error("No email returned from provider. Please ensure your account has a public/verified email.");
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (existingUser) {
          if (existingUser.isSuspended) {
            throw new Error("Your account has been suspended.");
          }
        }
        else {
          const cookieStore = await cookies();
          // Came from the LOGIN screen: don't silently create a (client) account.
          if (cookieStore.get("oauth_mode")?.value === "login") {
            return "/register?error=NoAccount";
          }
          const intendedRole = cookieStore.get("oauth_role")?.value;

          const finalRole = intendedRole === "ENGINEER" ? "ENGINEER" : "CLIENT";

          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: finalRole,
              emailVerified: new Date(),
            }
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      if (!token.id && token.sub) {
        token.id = token.sub;
      }

      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: String(token.id) },
            select: { role: true },
          });
          if (dbUser) token.role = dbUser.role;
        } catch (error) {
          // A DB hiccup (e.g. Neon cold start) must not invalidate a good session:
          // throwing here made getServerSession() return null => "Unauthorized".
          console.error("JWT CALLBACK ERROR:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id ?? token.sub) as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };