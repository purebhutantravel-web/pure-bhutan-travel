import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updatePartnerHotel } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function EditHotelPage({ params, searchParams }: Props) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const query = await searchParams;
  const status = query.status;

  const supabase = await createClient();

  const { data: hotel, error } = await supabase
    .from("partner_hotels")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Fetch hotel for edit error:", error.message);
  }

  if (!hotel) {
    notFound();
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Edit hotel.</h1>
            <p>Update partner hotel details shown on the website.</p>
          </div>

          <Link href="/admin/hotels" className="button secondary">
            Back to Hotels
          </Link>
        </div>
      </section>

      <section className="section container">
        <form action={updatePartnerHotel} className="admin-edit-form">
          <input type="hidden" name="id" value={hotel.id} />

          {status === "missing" && (
            <div className="form-message error">
              Hotel name and description are required.
            </div>
          )}

          {status === "error" && (
            <div className="form-message error">
              Something went wrong while updating the hotel.
            </div>
          )}

          <div className="form-grid-2">
            <label>
              Hotel name
              <input
                name="name"
                type="text"
                defaultValue={hotel.name || ""}
                required
              />
            </label>

            <label>
              Location
              <input
                name="location"
                type="text"
                defaultValue={hotel.location || ""}
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              name="description"
              defaultValue={hotel.description || ""}
              required
            />
          </label>

          <div className="form-grid-2">
            <label>
              Image URL
              <input
                name="image_url"
                type="text"
                defaultValue={hotel.image_url || ""}
              />
            </label>

            <label>
              Website URL
              <input
                name="website_url"
                type="text"
                defaultValue={hotel.website_url || ""}
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Phone
              <input
                name="phone"
                type="text"
                defaultValue={hotel.phone || ""}
              />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                defaultValue={hotel.email || ""}
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Rating
              <input
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                defaultValue={hotel.rating || ""}
              />
            </label>

            <label>
              Sort order
              <input
                name="sort_order"
                type="number"
                defaultValue={hotel.sort_order || 0}
              />
            </label>
          </div>

          <div className="checkbox-row">
            <label>
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={hotel.is_active}
              />
              Active on public website
            </label>
          </div>

          <button type="submit" className="button primary">
            Save Changes
          </button>
        </form>
      </section>
    </main>
  );
}