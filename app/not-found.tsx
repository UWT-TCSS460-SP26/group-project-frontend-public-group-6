import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-container">
      <div className="page-card not-found-card">
        <div className="not-found-ornament" aria-hidden="true">◈</div>
        <p className="not-found-code">404</p>
        <h1 className="not-found-title">Scene Not Found</h1>
        <p className="not-found-copy">
          The reel you&rsquo;re looking for has gone missing from our vault.
          Perhaps it was misplaced, or it never existed at all.
        </p>
        <div className="not-found-divider" aria-hidden="true" />
        <Link href="/" className="btn btn-primary">
          <span className="btn-shine" aria-hidden="true" />
          Return to the Lobby
        </Link>
      </div>
    </div>
  );
}
