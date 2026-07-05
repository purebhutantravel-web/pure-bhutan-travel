import Link from "next/link";
import { redirect } from "next/navigation";
import { createPartnerHotel } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function NewHotelPage({ searchParams }: Props) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const status = params.status;

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Add new hotel.</h1>
            <p>Create a partner hotel record for the public website.</p>
          </div>

          <Link href="/admin/hotels" className="button secondary">
            Back to Hotels
          </Link>
        </div>
      </section>

      <section className="section container">
        <form action={createPartnerHotel} className="admin-edit-form">
          {status === "missing" && (
            <div className="form-message error">
              Hotel name and description are required.
            </div>
          )}

          {status === "error" && (
            <div className="form-message error">
              Something went wrong while creating the hotel.
            </div>
          )}

          <div className="form-grid-2">
            <label>
              Hotel name
              <input
                name="name"
                type="text"
                placeholder="Partner Hotel in Thimphu"
                required
              />
            </label>

            <label>
              Location
              <input name="location" type="text" placeholder="Thimphu" />
            </label>
          </div>

          <label>
            Description
            <textarea
              name="description"
              placeholder="Describe the hotel..."
              required
            />
          </label>

          <div className="form-grid-2">
            <label>
              Image URL
              <input
                name="image_url"
                type="text"
                placeholder="Leave blank for placeholder image"
              />
            </label>

            <label>
              Website URL
              <input
                name="website_url"
                type="text"
                placeholder="https://example.com"
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Phone
              <input name="phone" type="text" placeholder="+975..." />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                placeholder="hotel@example.com"
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
                placeholder="4.5"
              />
            </label>

            <label>
              Sort order
              <input name="sort_order" type="number" placeholder="1" />
            </label>
          </div>

          <div className="checkbox-row">
            <label>
              <input name="is_active" type="checkbox" defaultChecked />
              Active on public website
            </label>
          </div>

          <button type="submit" className="button primary">
            Create Hotel
          </button>
        </form>
      </section>
    </main>
  );
}