import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "tcss460",
      name: "TCSS 460",
      type: "oidc",
      issuer: "https://tcss-460-iam.onrender.com",
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      authorization: {
        params: {
          audience: process.env.AUTH_TCSS460_AUDIENCE,
        },
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
        token.id_token = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).access_token = token.access_token;
      return session;
    },
  },
});
