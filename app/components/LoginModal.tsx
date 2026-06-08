"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const POPUP_W = 480;
const POPUP_H = 660;

function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth < 768 ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  );
}

export default function LoginModal() {
  const [open, setOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  // Show / hide the <dialog>
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open) {
      d.showModal();
    } else if (d.open) {
      d.close();
    }
  }, [open]);

  // Receive "done" postMessage from /auth-callback inside the popup
  const handleMessage = useCallback(
    (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== "LUMIERE_AUTH_COMPLETE") return;
      if (pollRef.current) clearInterval(pollRef.current);
      popupRef.current = null;
      setSigningIn(false);
      setPopupBlocked(false);
      setOpen(false);
      router.refresh(); // re-render server components with the new session
    },
    [router],
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  function openSignInPopup() {
    setPopupBlocked(false);

    // ── Mobile: can't do real popups — redirect with callbackUrl so user
    //    returns to the same page after OAuth completes.
    if (isMobileDevice()) {
      const back = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/api/auth/signin?callbackUrl=${back}`;
      return;
    }

    // ── Desktop: open a small popup window
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
      // Popup was blocked by the browser
      setPopupBlocked(true);
      return;
    }

    popupRef.current = popup;
    setSigningIn(true);

    // Detect if user manually closes the popup before finishing
    pollRef.current = setInterval(() => {
      if (popup.closed) {
        if (pollRef.current) clearInterval(pollRef.current);
        popupRef.current = null;
        setSigningIn(false);
      }
    }, 600);
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setOpen(false);
    }
  }

  return (
    <>
      <button
        className="btn btn-secondary"
        onClick={() => {
          setPopupBlocked(false);
          setOpen(true);
        }}
        aria-haspopup="dialog"
      >
        Sign in to rate or review
      </button>

      <dialog
        ref={dialogRef}
        className="login-modal"
        onClose={() => setOpen(false)}
        onClick={handleBackdropClick}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-desc"
      >
        <div
          className="login-modal__inner"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="login-modal__close icon-btn"
            onClick={() => setOpen(false)}
            aria-label="Close sign-in dialog"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="20" height="20">
              <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          <div className="login-modal__icon" aria-hidden="true">
            <svg viewBox="0 0 60 60" fill="none" width="56" height="56">
              <polygon
                points="30,4 36,21 54,21 40,32 45,49 30,39 15,49 20,32 6,21 24,21"
                stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
              />
              <polygon
                points="30,12 34,22 45,22 36,29 39,40 30,34 21,40 24,29 15,22 26,22"
                stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" opacity="0.3"
              />
            </svg>
          </div>

          <h2 id="login-modal-title" className="login-modal__title">Sign In</h2>
          <p id="login-modal-desc" className="login-modal__desc">
            Sign in to rate and review films and television.
          </p>

          {signingIn && (
            <p className="login-modal__status" aria-live="polite">
              A sign-in window has opened — complete the process there.
            </p>
          )}

          {popupBlocked && (
            <p className="login-modal__status login-modal__status--warn" role="alert">
              Your browser blocked the sign-in popup. Please allow popups for
              this site, or{" "}
              <a
                href={`/api/auth/signin?callbackUrl=${encodeURIComponent(
                  typeof window !== "undefined"
                    ? window.location.pathname + window.location.search
                    : "/"
                )}`}
                className="login-modal__fallback-link"
              >
                click here to sign in on this page
              </a>
              .
            </p>
          )}

          <div className="login-modal__actions">
            <button
              className="btn btn-primary login-modal__btn"
              onClick={openSignInPopup}
              disabled={signingIn}
              aria-busy={signingIn}
            >
              {!signingIn && <span className="btn-shine" aria-hidden="true" />}
              {signingIn ? "Sign-in window open…" : "Sign In"}
            </button>
            <button
              className="btn btn-ghost login-modal__btn"
              onClick={() => setOpen(false)}
            >
              Not now
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
