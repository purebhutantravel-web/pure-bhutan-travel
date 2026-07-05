import Link from "next/link";
import { redirect } from "next/navigation";
import { createRestaurant } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function NewRestaurantPage({ searchParams }: Props) {
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
            <h1>Add new restaurant.</h1>
            <p>Create a restaurant listing for the public website.</p>
          </div>

          <Link href="/admin/restaurants" className="button secondary">
            Back to Restaurants
          </Link>
        </div>
      </section>

      <section className="section container">
        <form action={createRestaurant} className="admin-edit-form">
          {status === "missing" && (
            <div className="form-message error">
              Restaurant name and description are required.
            </div>
          )}

          {status === "error" && (
            <div className="form-message error">
              Something went wrong while creating the restaurant.
            </div>
          )}

          <div className="form-grid-2">
            <label>
              Restaurant name
              <input
                name="name"
                type="text"
                placeholder="Local Bhutanese Restaurant"
                required
              />
            </label>

            <label>
              Location
              <input name="location" type="text" placeholder="Thimphu" />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Cuisine type
              <input
                name="cuisine_type"
                type="text"
                placeholder="Bhutanese"
              />
            </label>

            <label>
              Sort order
              <input name="sort_order" type="number" placeholder="1" />
            </label>
          </div>

          <label>
            Description
            <textarea
              name="description"
              placeholder="Describe the restaurant..."
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
                placeholder="restaurant@example.com"
              />
            </label>
          </div>

          <div className="checkbox-row">
            <label>
              <input name="is_active" type="checkbox" defaultChecked />
              Active on public website
            </label>
          </div>

          <button type="submit" className="button primary">
            Create Restaurant
          </button>
        </form>
      </section>
    </main>
  );
}