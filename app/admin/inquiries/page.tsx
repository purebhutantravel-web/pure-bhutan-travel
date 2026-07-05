import Link from "next/link";
import { redirect } from "next/navigation";
import { updateContactInquiryStatus } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function AdminInquiriesPage({ searchParams }: Props) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const status = params.status;

  const supabase = await createClient();

  const { data: inquiries, error } = await supabase
    .from("contact_inquiries")
    .select("id, full_name, email, phone, subject, message, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch inquiries error:", error.message);
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Contact inquiries.</h1>
            <p>Review messages submitted through the public contact form.</p>
          </div>

          <Link href="/admin" className="button secondary">
            Back to Dashboard
          </Link>
        </div>
      </section>

      <section className="section container">
        {status === "updated" && (
          <div className="form-message success admin-message">
            Inquiry status updated successfully.
          </div>
        )}

        {status === "error" && (
          <div className="form-message error admin-message">
            Something went wrong while updating the inquiry.
          </div>
        )}

        {status === "invalid" && (
          <div className="form-message error admin-message">
            Invalid inquiry or status selected.
          </div>
        )}

        {inquiries?.length ? (
          <div className="admin-record-list">
            {inquiries.map((item) => (
              <article key={item.id} className="admin-record-card">
                <div className="admin-record-main">
                  <div>
                    <p className="card-meta">{item.status}</p>
                    <h2>{item.full_name}</h2>
                    <p>{item.email}</p>
                    {item.phone && <p>{item.phone}</p>}
                    {item.subject && <h3>{item.subject}</h3>}
                    <p>{item.message}</p>
                    <small>
                      Submitted:{" "}
                      {new Date(item.created_at).toLocaleString("en-US")}
                    </small>
                  </div>

                  <form
                    action={updateContactInquiryStatus}
                    className="admin-status-form"
                  >
                    <input type="hidden" name="id" value={item.id} />

                    <label>
                      Status
                      <select name="status" defaultValue={item.status}>
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="archived">Archived</option>
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
          <p>No contact inquiries found.</p>
        )}
      </section>
    </main>
  );
}