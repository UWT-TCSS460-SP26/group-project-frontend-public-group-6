import Link from "next/link";

const TMDB_IMG = "https://image.tmdb.org/t/p/w300";

type Props = {
  id: number;
  title: string;
  posterPath: string | null;
  href: string;
  subtitle?: string;
};

export default function MediaCard({ title, posterPath, href, subtitle }: Props) {
  return (
    <Link href={href} className="media-card">
      {posterPath ? (
        <div className="media-card__thumb">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${TMDB_IMG}${posterPath}`} alt={title} />
        </div>
      ) : (
        <div className="media-card__thumb media-card__thumb--empty">
          No poster available
        </div>
      )}
      <div className="media-card__title">{title}</div>
      {subtitle && <div className="media-card__subtitle">{subtitle}</div>}
    </Link>
  );
}
