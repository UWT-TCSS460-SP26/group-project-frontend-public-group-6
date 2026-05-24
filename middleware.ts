export { auth as middleware } from "@/auth";

export const config = {
  // Don't run middleware on static files or the NextAuth routes themselves
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};