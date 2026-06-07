"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(
        { type: "LUMIERE_AUTH_COMPLETE" },
        window.location.origin
      );
      window.close();
    } else {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="page-container">
      <div className="page-card" style={{ textAlign: "center", padding: "56px 40px" }}>
        <p className="section-title" style={{ fontSize: "1rem", marginBottom: "12px" }}>
          Signing in…
        </p>
        <p className="subtitle-text">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
}
