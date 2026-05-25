import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="page-container">
      <div className="page-card">
        <h1 className="section-title">Profile</h1>
        <p className="section-subtitle">
          Manage your session and verify authorization details.
        </p>

        <section>
          <h2>Signed-in user</h2>
          <p>
            <strong>Email:</strong> {session.user?.email}
          </p>
        </section>

        <section className="page-section profile-section">
          <h2>Access token</h2>
          <p className="subtitle-text">
            Copy this and paste it into{" "}
            <a href="https://jwt.io" target="_blank" rel="noreferrer">
              jwt.io
            </a>{" "}
            to verify <code>iss</code> and <code>aud</code> are correct.
          </p>
          <ul className="profile-list">
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
            className="textarea"
          />
        </section>
      </div>
    </div>
  );
}
