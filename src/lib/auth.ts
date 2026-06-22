import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

// Only register a provider when both its credentials are present, so a
// half-configured provider never produces a broken sign-in button.
export const githubEnabled = !!(
  process.env.GITHUB_ID && process.env.GITHUB_SECRET
);
export const googleEnabled = !!(
  process.env.GOOGLE_ID && process.env.GOOGLE_SECRET
);

const providers: NextAuthConfig["providers"] = [];

if (githubEnabled) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })
  );
}

if (googleEnabled) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
