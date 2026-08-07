import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = !nextUrl.pathname.startsWith("/login") && !nextUrl.pathname.startsWith("/signup");
      if (isOnProtectedRoute) return isLoggedIn;
      return true;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;
