import Link from "next/link";

const TMDB_IMG = "https://image.tmdb.org/t/p/w300";

type Props = {
  id: number;
  title: string;
  posterPath: string | null;
  href: string;
};

export default function MediaCard({ title, posterPath, href }: Props) {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        background: "#f9fafb",
        cursor: "pointer",
      }}>
        {posterPath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${TMDB_IMG}${posterPath}`}
            alt={title}
            style={{ width: "100%", display: "block", aspectRatio: "2/3", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            width: "100%",
            aspectRatio: "2/3",
            background: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
            fontSize: "0.8rem",
          }}>
            No poster
          </div>
        )}
        <div style={{ padding: "8px", fontSize: "0.85rem", fontWeight: 500, lineHeight: 1.3 }}>
          {title}
        </div>
      </div>
    </Link>
  );
}
