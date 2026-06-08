import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Lumière",
  description:
    "Meet the team behind Lumière and learn what powers the movie and television discovery experience.",
};

const TEAM = [
  {
    name: "Luke Willis",
    roles: [
      "Back-End API",
      "Database Design",
      "Front-End Lead",
      "Deployment",
      "Authentication",
    ],
  },
  {
    name: "Jayda Minks",
    roles: [
      "Back-End API",
      "Front-End Design Lead",
      "Front-End UI",
      "Testing",
      "User Experience",
    ],
  },
  {
    name: "Connor Willis",
    roles: [
      "Back-End Lead",
      "Data Modeling",
      "Front-End Components",
      "Reviews",
      "Deployment",
    ],
  },
  {
    name: "John Diego",
    roles: [
      "Back-End API",
      "Sprint Planning",
      "Front-End Design",
      "Styling",
      "Team Accounting",
    ],
  },
];

const SERVICES = [
  {
    name: "TMDB",
    description:
      "The Movie Database — the source of all movie and television metadata: titles, posters, cast, ratings, and more.",
    url: "https://www.themoviedb.org",
  },
  {
    name: "Auth²",
    description:
      "The course OAuth2 identity provider (tcss-460-iam.onrender.com) that handles secure sign-in without storing passwords.",
    url: null,
  },
  {
    name: "Group 5 API",
    description:
      "Our upstream partner group's back-end, built on the TMDB data — it powers every browse, search, detail, rating, and review request in this app.",
    url: null,
  },
];

function Divider() {
  return (
    <div
      aria-hidden="true"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        margin: "2rem 0",
      }}
    >
      <div
        style={{ flex: 1, height: "1px", background: "var(--gold-border)" }}
      />
      <span
        style={{
          color: "var(--gold)",
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
        }}
      >
        ◈
      </span>
      <div
        style={{ flex: 1, height: "1px", background: "var(--gold-border)" }}
      />
    </div>
  );
}

export default function AboutPage() {
  return (
    <main
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "3rem 1.5rem 5rem",
        color: "var(--text)",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <p
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "0.7rem",
            letterSpacing: "0.35em",
            color: "var(--gold)",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          TCSS 460 · Spring 2026 · Group 6
        </p>
        <h1
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700,
            color: "var(--gold)",
            margin: "0 0 1rem",
            letterSpacing: "0.05em",
          }}
        >
          About Lumière
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            maxWidth: "540px",
            margin: "0 auto",
          }}
        >
          Lumière is a cinema and television discovery app built by four
          students at the University of Washington - Tacoma over ten weeks of
          TCSS 460 — Client/Server Programming.
        </p>
      </div>

      <Divider />

      {/* Team */}
      <section aria-labelledby="team-heading">
        <h2
          id="team-heading"
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "var(--gold)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          The Team
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          {TEAM.map((member) => (
            <div
              key={member.name}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--gold-border)",
                borderRadius: "var(--radius)",
                padding: "1.25rem 1.5rem",
                flex: "0 0 220px",
              }}
            >
              <p
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--gold-bright)",
                  margin: "0 0 0.25rem",
                }}
              >
                {member.name}
              </p>
              <ul
                style={{
                  margin: 0,
                  padding: "0 0 0 1rem",
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.3rem",
                }}
              >
                {member.roles.map((role) => (
                  <li
                    key={role}
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <span
                      style={{ color: "var(--gold)", fontSize: "0.6rem" }}
                      aria-hidden="true"
                    >
                      ◆
                    </span>
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: "1.25rem",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            lineHeight: 1.7,
          }}
        >
          <strong style={{ color: "var(--text)" }}>Sprints 1–5</strong> were
          spent building the back-end: REST API, database schema, authentication
          middleware, TMDB integration with transformed routes, and the
          bug-tracker interface that downstream partners used to file issues and
          feature requests.{" "}
          <strong style={{ color: "var(--text)" }}>Sprints 6–8 </strong> shifted
          to the consumer-facing front-end — this app — built with Next.js 15,
          React 19, and Tailwind CSS v4 built upon Group 5&apos;s backend API.
          Along with teamwork, cohesion, and communication within our own group,
          we had to work closely as the recipients of another group&apos;s work,
          teaching us how to work with unknown APIs and when to point out bugs
          vs. work around intended behavior.
        </p>
      </section>

      <Divider />

      {/* Powered by */}
      <section aria-labelledby="services-heading">
        <h2
          id="services-heading"
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "var(--gold)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          Powered By
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {SERVICES.map((svc) => (
            <div
              key={svc.name}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--gold-border)",
                borderRadius: "var(--radius)",
                padding: "1.25rem 1.5rem",
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  color: "var(--gold)",
                  fontSize: "1.1rem",
                  marginTop: "2px",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                ◈
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "var(--text)",
                    margin: "0 0 0.35rem",
                  }}
                >
                  {svc.url ? (
                    <a
                      href={svc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {svc.name}
                    </a>
                  ) : (
                    svc.name
                  )}
                </p>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--text-muted)",
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  {svc.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Build story */}
      <section aria-labelledby="story-heading">
        <h2
          id="story-heading"
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "var(--gold)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          The Build
        </h2>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-muted)",
            lineHeight: 1.8,
            margin: "0 0 1rem",
          }}
        >
          We started the quarter designing a REST API in isolation — then
          watched it become real infrastructure the moment Group 7 started
          building their consumer app on top of it. That handoff taught us more
          about API design than any spec could: every ambiguous field name,
          every missing error code, every undocumented constraint became a bug
          report in our queue. Moreso, we learned how to adapt to feature
          requests, triage reports, and deliver clear, consistent, and
          well-built APIs back to the client team.
        </p>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-muted)",
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          On the front-end side, building a consumer app against someone
          else&apos;s API gave us the reverse perspective. The biggest surprise
          was how much of the UX lives in the client — loading states, error
          messages, empty states — none of that is in the API contract. We
          learned the dance between the client and the server, and how to build
          a strong front-end held up by an ambiguous (to us) back-end.
          Lumière&apos;s art deco aesthetic came from the desire for the app to
          feel as cinematic as the content it surfaces.
        </p>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-muted)",
            lineHeight: 1.8,
            margin: "0 0 1rem",
          }}
        >
          We are proud of the design, implementation, and execution of this
          project.
        </p>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-muted)",
            lineHeight: 1.8,
            margin: "0 0 1rem",
          }}
        >
          We hope you enjoy our content to your hearts content.
        </p>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-muted)",
            lineHeight: 1.8,
            margin: 0,
            textAlign: "center",
          }}
        >
          Much love,
          <br />
          Group 6.
        </p>
      </section>

      <Divider />

      {/* Footer note */}
      <p
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
        }}
      >
        University of Washington Tacoma · School of Engineering and Technology ·
        Group 6 - TCSS 460 Spring 2026
      </p>
    </main>
  );
}
