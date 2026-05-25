import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div style={{ maxWidth: "720px" }}>
      <h1>Profile</h1>

      <section>
        <h2>Signed-in user</h2>
        <p><strong>Email:</strong> {session.user?.email}</p>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2>Access token</h2>
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          Copy this and paste it into{" "}
          <a href="https://jwt.io" target="_blank" rel="noreferrer">jwt.io</a>{" "}
          to verify <code>iss</code> and <code>aud</code> are correct.
        </p>
        <ul style={{ color: "#6b7280", fontSize: "0.9rem", marginTop: "8px" }}>
          <li>
            <code>iss</code> should be{" "}
            <code>https://tcss-460-iam.onrender.com</code>
          </li>
          <li>
            <code>aud</code> should be <code>group-5-api</code>
          </li>
        </ul>
        <textarea
          readOnly
          defaultValue={session.accessToken ?? "(no token)"}
          style={{
            width: "100%",
            minHeight: "120px",
            fontFamily: "monospace",
            fontSize: "0.75rem",
            padding: "8px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
          }}
        />
      </section>
    </div>
  );
}