import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

const ISSUER = "https://tcss-460-iam.onrender.com";
const TOKEN_URL = `${ISSUER}/v2/oauth/token`;

const config: NextAuthConfig = {
  debug: process.env.NODE_ENV === "development",
  providers: [
    {
      id: "tcss460",
      name: "TCSS 460",
      type: "oauth",
      clientId: process.env.AUTH_TCSS460_CLIENT_ID,
      clientSecret: process.env.AUTH_TCSS460_CLIENT_SECRET,
      issuer: ISSUER,
      authorization: {
        url: `${ISSUER}/v2/oauth/authorize`,
        params: {
          audience: process.env.AUTH_TCSS460_AUDIENCE,
          scope: "openid profile email",
          response_type: "code",
        },
      },
      // Auth² only supports client_secret_post. @auth/core defaults to
      // client_secret_basic (HTTP Basic auth), which causes a 500 from Auth².
      client: { token_endpoint_auth_method: "client_secret_post" },
      token: TOKEN_URL,
      userinfo: `${ISSUER}/v2/oauth/userinfo`,
      checks: ["state"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.email,
          email: profile.email,
          image: profile.picture ?? null,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
