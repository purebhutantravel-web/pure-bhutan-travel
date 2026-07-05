import { redirect } from "next/navigation";
import { logoutAdmin } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const supabase = await createClient();

  const { count: contactCount } = await supabase
    .from("contact_inquiries")
    .select("*", { count: "exact", head: true });

  const { count: bookingCount } = await supabase
    .from("booking_requests")
    .select("*", { count: "exact", head: true });

  const { data: latestContacts } = await supabase
    .from("contact_inquiries")
    .select("id, full_name, email, subject, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: latestBookings } = await supabase
    .from("booking_requests")
    .select("id, package_title, full_name, email, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin Dashboard</p>
            <h1>Website control room.</h1>
            <p>
              Logged in as {currentAdmin.admin.email}. You can now view website
              inquiries and booking requests.
            </p>
          </div>

          <form action={logoutAdmin}>
            <button type="submit" className="button secondary">
              Log Out
            </button>
          </form>
        </div>
      </section>

      <section className="section container">
        <div className="admin-stats">
          <article className="admin-stat-card">
            <p>Total Contact Inquiries</p>
            <strong>{contactCount ?? 0}</strong>
          </article>

          <article className="admin-stat-card">
            <p>Total Booking Requests</p>
            <strong>{bookingCount ?? 0}</strong>
          </article>
        </div>

        <div className="admin-quick-links">
          <a href="/admin/inquiries" className="admin-quick-link">
            <span>Manage</span>
            <strong>Contact Inquiries</strong>
            <p>View and update inquiry status.</p>
          </a>

          <a href="/admin/bookings" className="admin-quick-link">
            <span>Manage</span>
            <strong>Booking Requests</strong>
            <p>View and update booking status.</p>
          </a>
	  <a href="/admin/packages" className="admin-quick-link">
            <span>Manage</span>
            <strong>Tour Packages</strong>
            <p>Create, edit, feature, activate, or deactivate travel packages.</p>
          </a>
          <a href="/admin/hotels" className="admin-quick-link">
            <span>Manage</span>
            <strong>Partner Hotels</strong>
            <p>Add, edit, activate, or hide hotel listings.</p>
          </a>
          <a href="/admin/restaurants" className="admin-quick-link">
            <span>Manage</span>
            <strong>Restaurants</strong>
            <p>Add, edit, activate, or hide restaurant listings.</p>
          </a>
          <a href="/admin/faqs" className="admin-quick-link">
            <span>Manage</span>
            <strong>FAQs</strong>
            <p>Add, edit, activate, or hide frequently asked questions.</p>
          </a>
          <a href="/admin/testimonials" className="admin-quick-link">
            <span>Manage</span>
            <strong>Testimonials</strong>
            <p>Add, edit, approve, or feature traveler testimonials.</p>
          </a>
          <a href="/admin/gallery" className="admin-quick-link">
            <span>Manage</span>
            <strong>Gallery</strong>
            <p>Add, edit, activate, or hide gallery items.</p>
          </a>

        </div>

        <div className="admin-grid">
          <section className="admin-panel">
            <h2>Latest Contact Inquiries</h2>

            {latestContacts?.length ? (
              <div className="admin-table">
                {latestContacts.map((item) => (
                  <article key={item.id}>
                    <div>
                      <strong>{item.full_name}</strong>
                      <p>{item.email}</p>
                      <p>{item.subject || "No subject"}</p>
                    </div>

                    <span>{item.status}</span>
                  </article>
                ))}
              </div>
            ) : (
              <p>No contact inquiries yet.</p>
            )}
          </section>

          <section className="admin-panel">
            <h2>Latest Booking Requests</h2>

            {latestBookings?.length ? (
              <div className="admin-table">
                {latestBookings.map((item) => (
                  <article key={item.id}>
                    <div>
                      <strong>{item.full_name}</strong>
                      <p>{item.email}</p>
                      <p>{item.package_title || "No package selected"}</p>
                    </div>

                    <span>{item.status}</span>
                  </article>
                ))}
              </div>
            ) : (
              <p>No booking requests yet.</p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}