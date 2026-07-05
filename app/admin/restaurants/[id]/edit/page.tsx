import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateRestaurant } from "@/app/admin/actions";
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

export default async function EditRestaurantPage({
  params,
  searchParams,
}: Props) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const query = await searchParams;
  const status = query.status;

  const supabase = await createClient();

  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Fetch restaurant for edit error:", error.message);
  }

  if (!restaurant) {
    notFound();
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Edit restaurant.</h1>
            <p>Update restaurant details shown on the website.</p>
          </div>

          <Link href="/admin/restaurants" className="button secondary">
            Back to Restaurants
          </Link>
        </div>
      </section>

      <section className="section container">
        <form action={updateRestaurant} className="admin-edit-form">
          <input type="hidden" name="id" value={restaurant.id} />

          {status === "missing" && (
            <div className="form-message error">
              Restaurant name and description are required.
            </div>
          )}

          {status === "error" && (
            <div className="form-message error">
              Something went wrong while updating the restaurant.
            </div>
          )}

          <div className="form-grid-2">
            <label>
              Restaurant name
              <input
                name="name"
                type="text"
                defaultValue={restaurant.name || ""}
                required
              />
            </label>

            <label>
              Location
              <input
                name="location"
                type="text"
                defaultValue={restaurant.location || ""}
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Cuisine type
              <input
                name="cuisine_type"
                type="text"
                defaultValue={restaurant.cuisine_type || ""}
              />
            </label>

            <label>
              Sort order
              <input
                name="sort_order"
                type="number"
                defaultValue={restaurant.sort_order || 0}
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              name="description"
              defaultValue={restaurant.description || ""}
              required
            />
          </label>

          <div className="form-grid-2">
            <label>
              Image URL
              <input
                name="image_url"
                type="text"
                defaultValue={restaurant.image_url || ""}
              />
            </label>

            <label>
              Website URL
              <input
                name="website_url"
                type="text"
                defaultValue={restaurant.website_url || ""}
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Phone
              <input
                name="phone"
                type="text"
                defaultValue={restaurant.phone || ""}
              />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                defaultValue={restaurant.email || ""}
              />
            </label>
          </div>

          <div className="checkbox-row">
            <label>
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={restaurant.is_active}
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