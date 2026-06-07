"use client";
import { useEffect, useRef, useState } from "react";

export default function AuthPopupPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [error, setError] = useState(false);

  // Fetch CSRF token then auto-submit the form directly to the provider endpoint.
  // This skips the intermediate NextAuth sign-in page entirely.
  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { csrfToken: string }) => setCsrfToken(data.csrfToken))
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    if (csrfToken) {
      // Small delay so the form input value is committed before submit
      const t = setTimeout(() => formRef.current?.submit(), 80);
      return () => clearTimeout(t);
    }
  }, [csrfToken]);

  return (
    <div className="auth-popup-shell">
      <div className="auth-popup-card">
        <span className="auth-popup-icon" aria-hidden="true">◈</span>
        <p className="auth-popup-label">
          {error ? "Something went wrong. Please close this window and try again." : "Connecting…"}
        </p>

        {/* Hidden form — auto-submitted once we have the CSRF token */}
        <form ref={formRef} method="POST" action="/api/auth/signin/tcss460">
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <input type="hidden" name="callbackUrl" value="/auth-callback" />
          {/* Visible fallback button in case JS is slow */}
          {csrfToken && (
            <button type="submit" className="btn btn-primary" style={{ marginTop: "20px" }}>
              <span className="btn-shine" aria-hidden="true" />
              Continue to Sign In
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
