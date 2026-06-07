"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const POPUP_W = 480;
const POPUP_H = 660;

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export default function SignInButton() {
  const [signingIn, setSigningIn] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  const handleMessage = useCallback(
    (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== "LUMIERE_AUTH_COMPLETE") return;
      if (pollRef.current) clearInterval(pollRef.current);
      popupRef.current = null;
      setSigningIn(false);
      router.refresh();
    },
    [router],
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  function handleClick() {
    // Mobile: can't do real popups — redirect with callbackUrl
    if (isMobile()) {
      window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(
        window.location.pathname + window.location.search,
      )}`;
      return;
    }

    const left = Math.round(screen.width / 2 - POPUP_W / 2);
    const top = Math.round(screen.height / 2 - POPUP_H / 2);
    const features = [
      `width=${POPUP_W}`,
      `height=${POPUP_H}`,
      `left=${left}`,
      `top=${top}`,
      "toolbar=no",
      "menubar=no",
      "location=no",
      "status=no",
      "scrollbars=yes",
      "resizable=yes",
    ].join(",");

    const popup = window.open("/auth-popup", "lumiere-signin", features);

    if (!popup || popup.closed) {
      // Popup blocked: redirect with callbackUrl back to current page
      window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(
        window.location.pathname + window.location.search,
      )}`;
      return;
    }

    popupRef.current = popup;
    setSigningIn(true);

    pollRef.current = setInterval(() => {
      if (popup.closed) {
        if (pollRef.current) clearInterval(pollRef.current);
        popupRef.current = null;
        setSigningIn(false);
      }
    }, 600);
  }

  return (
    <button
      className="btn btn-primary btn-sm"
      style={{ width: "100%" }}
      onClick={handleClick}
      disabled={signingIn}
      aria-busy={signingIn}
    >
      {signingIn ? "Signing in…" : "Sign In"}
    </button>
  );
}
