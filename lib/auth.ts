import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        accessToken: {},
        refreshToken: {},
        callbackType: {},
      },
      async authorize(credentials) {
        // Magic link / Google OAuth callback — tokens already issued by backend
        if ((credentials.callbackType === "magic" || credentials.callbackType === "google") && credentials.accessToken) {
          const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${credentials.accessToken}` },
          });
          if (!res.ok) return null;
          const user = await res.json();
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatarUrl ?? null,
            role: user.role,
            emailVerified: user.emailVerified ?? true,
            accessToken: credentials.accessToken as string,
            refreshToken: credentials.refreshToken as string,
          };
        }

        // Email / password login
        console.log(`[NEXT-AUTH] Authorize attempt for: ${credentials.email}`);
        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log(`[NEXT-AUTH] Backend response status: ${res.status}`);

          if (!res.ok) {
            const errorText = await res.text();
            console.error(`[NEXT-AUTH] Login failed: ${errorText}`);
            return null;
          }

          const data = await res.json();
          console.log(`[NEXT-AUTH] Login success for user: ${data.user.email}`);
          
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.avatarUrl ?? null,
            role: data.user.role,
            emailVerified: data.user.emailVerified ?? false,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error(`[NEXT-AUTH] Fetch error:`, error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const u = user as any;
        token.role = u.role;
        (token as any).emailVerified = u.emailVerified ?? false;
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      (session.user as any).emailVerified = token.emailVerified;
      session.user.accessToken = token.accessToken as string;
      session.user.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
});
