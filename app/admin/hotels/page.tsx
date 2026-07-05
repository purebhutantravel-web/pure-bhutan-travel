import Link from "next/link";
import { redirect } from "next/navigation";
import { setPartnerHotelActive } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function AdminHotelsPage({ searchParams }: Props) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const status = params.status;

  const supabase = await createClient();

  const { data: hotels, error } = await supabase
    .from("partner_hotels")
    .select(
      "id, name, location, description, image_url, website_url, phone, email, rating, is_active, sort_order"
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Fetch hotels error:", error.message);
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Partner hotels.</h1>
            <p>Add, edit, activate, or hide partner hotels from the website.</p>
          </div>

          <div className="admin-actions-row">
            <Link href="/admin" className="button secondary">
              Back to Dashboard
            </Link>

            <Link href="/admin/hotels/new" className="button primary">
              Add New Hotel
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        {status === "created" && (
          <div className="form-message success admin-message">
            Hotel created successfully.
          </div>
        )}

        {status === "updated" && (
          <div className="form-message success admin-message">
            Hotel updated successfully.
          </div>
        )}

        {status === "error" && (
          <div className="form-message error admin-message">
            Something went wrong. Please try again.
          </div>
        )}

        {status === "invalid" && (
          <div className="form-message error admin-message">
            Invalid hotel selected.
          </div>
        )}

        {hotels?.length ? (
          <div className="admin-record-list">
            {hotels.map((hotel) => (
              <article key={hotel.id} className="admin-record-card">
                <div className="admin-package-row">
                  <div>
                    <p className="card-meta">
                      {hotel.is_active ? "Active" : "Inactive"} • Sort{" "}
                      {hotel.sort_order}
                    </p>

                    <h2>{hotel.name}</h2>

                    {hotel.location && <p>{hotel.location}</p>}

                    {hotel.rating && (
                      <p className="price">Rating: {hotel.rating}</p>
                    )}

                    <p>{hotel.description}</p>

                    {hotel.phone && <p>Phone: {hotel.phone}</p>}
                    {hotel.email && <p>Email: {hotel.email}</p>}
                  </div>

                  <div className="admin-package-actions">
                    <Link
                      href={`/admin/hotels/${hotel.id}/edit`}
                      className="button secondary"
                    >
                      Edit
                    </Link>

                    <form action={setPartnerHotelActive}>
                      <input type="hidden" name="id" value={hotel.id} />
                      <input
                        type="hidden"
                        name="is_active"
                        value={hotel.is_active ? "false" : "true"}
                      />

                      <button type="submit" className="button secondary">
                        {hotel.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>No partner hotels found.</p>
        )}
      </section>
    </main>
  );
}