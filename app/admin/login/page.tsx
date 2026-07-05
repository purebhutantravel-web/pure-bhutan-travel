import { loginAdmin } from "@/app/admin/actions";

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = params.status;

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Admin Login</p>
          <h1>Website management access.</h1>
          <p>
            Log in to view inquiries, booking requests, and later manage website
            content.
          </p>
        </div>
      </section>

      <section className="section container admin-login-wrap">
        <form action={loginAdmin} className="contact-form admin-login-form">
          {status === "missing" && (
            <div className="form-message error">
              Please enter your email and password.
            </div>
          )}

          {status === "error" && (
            <div className="form-message error">
              Login failed. Please check your email and password.
            </div>
          )}

          {status === "unauthorized" && (
            <div className="form-message error">
              Your account exists, but it is not approved as an admin.
            </div>
          )}

          {status === "logged-out" && (
            <div className="form-message success">
              You have been logged out successfully.
            </div>
          )}

          <label>
            Email address
            <input
              name="email"
              type="email"
              placeholder="admin@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              placeholder="Your password"
              required
            />
          </label>

          <button type="submit" className="button primary">
            Log In
          </button>
        </form>
      </section>
    </main>
  );
}