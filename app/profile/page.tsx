import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");

  return (
    <Suspense>
      <ProfileClient
        userEmail={session.user?.email ?? ""}
        userName={session.user?.name ?? null}
        memberSince={null}
        accessToken={session.accessToken ?? ""}
      />
    </Suspense>
  );
}
