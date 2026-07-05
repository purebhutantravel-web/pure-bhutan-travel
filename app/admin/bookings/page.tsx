import Link from "next/link";
import { redirect } from "next/navigation";
import { updateBookingRequestStatus } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function AdminBookingsPage({ searchParams }: Props) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const status = params.status;

  const supabase = await createClient();

  const { data: bookings, error } = await supabase
    .from("booking_requests")
    .select(
      "id, package_title, full_name, email, phone, country, travel_date, number_of_travelers, message, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch bookings error:", error.message);
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Booking requests.</h1>
            <p>Review package booking requests submitted by visitors.</p>
          </div>

          <Link href="/admin" className="button secondary">
            Back to Dashboard
          </Link>
        </div>
      </section>

      <section className="section container">
        {status === "updated" && (
          <div className="form-message success admin-message">
            Booking status updated successfully.
          </div>
        )}

        {status === "error" && (
          <div className="form-message error admin-message">
            Something went wrong while updating the booking request.
          </div>
        )}

        {status === "invalid" && (
          <div className="form-message error admin-message">
            Invalid booking request or status selected.
          </div>
        )}

        {bookings?.length ? (
          <div className="admin-record-list">
            {bookings.map((item) => (
              <article key={item.id} className="admin-record-card">
                <div className="admin-record-main">
                  <div>
                    <p className="card-meta">{item.status}</p>
                    <h2>{item.full_name}</h2>
                    <p>{item.email}</p>
                    {item.phone && <p>{item.phone}</p>}
                    {item.country && <p>Country: {item.country}</p>}
                    {item.package_title && (
                      <h3>Package: {item.package_title}</h3>
                    )}
                    {item.travel_date && (
                      <p>Preferred travel date: {item.travel_date}</p>
                    )}
                    {item.number_of_travelers && (
                      <p>Travelers: {item.number_of_travelers}</p>
                    )}
                    {item.message && <p>{item.message}</p>}
                    <small>
                      Submitted:{" "}
                      {new Date(item.created_at).toLocaleString("en-US")}
                    </small>
                  </div>

                  <form
                    action={updateBookingRequestStatus}
                    className="admin-status-form"
                  >
                    <input type="hidden" name="id" value={item.id} />

                    <label>
                      Status
                      <select name="status" defaultValue={item.status}>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </label>

                    <button type="submit" className="button primary">
                      Update
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>No booking requests found.</p>
        )}
      </section>
    </main>
  );
}