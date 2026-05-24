import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

const config: NextAuthConfig = {
  providers: [
    {
      id: "tcss460",
      name: "TCSS 460",
      type: "oidc",
      issuer: process.env.AUTH_TCSS460_ISSUER,
      clientId: process.env.AUTH_TCSS460_CLIENT_ID,
      clientSecret: process.env.AUTH_TCSS460_CLIENT_SECRET,
      authorization: {
        params: {
          audience: process.env.AUTH_TCSS460_AUDIENCE,
          scope: "openid profile email",
        },
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      // On first sign-in, account is populated — save the tokens
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the access token to the client session
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);