import Link from "next/link";
import { redirect } from "next/navigation";
import { setRestaurantActive } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function AdminRestaurantsPage({ searchParams }: Props) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const status = params.status;

  const supabase = await createClient();

  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select(
      "id, name, location, cuisine_type, description, image_url, website_url, phone, email, is_active, sort_order"
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Fetch restaurants error:", error.message);
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Restaurants.</h1>
            <p>
              Add, edit, activate, or hide restaurant listings from the website.
            </p>
          </div>

          <div className="admin-actions-row">
            <Link href="/admin" className="button secondary">
              Back to Dashboard
            </Link>

            <Link href="/admin/restaurants/new" className="button primary">
              Add New Restaurant
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        {status === "created" && (
          <div className="form-message success admin-message">
            Restaurant created successfully.
          </div>
        )}

        {status === "updated" && (
          <div className="form-message success admin-message">
            Restaurant updated successfully.
          </div>
        )}

        {status === "error" && (
          <div className="form-message error admin-message">
            Something went wrong. Please try again.
          </div>
        )}

        {status === "invalid" && (
          <div className="form-message error admin-message">
            Invalid restaurant selected.
          </div>
        )}

        {restaurants?.length ? (
          <div className="admin-record-list">
            {restaurants.map((restaurant) => (
              <article key={restaurant.id} className="admin-record-card">
                <div className="admin-package-row">
                  <div>
                    <p className="card-meta">
                      {restaurant.is_active ? "Active" : "Inactive"} • Sort{" "}
                      {restaurant.sort_order}
                    </p>

                    <h2>{restaurant.name}</h2>

                    {restaurant.location && <p>{restaurant.location}</p>}

                    {restaurant.cuisine_type && (
                      <p className="price">{restaurant.cuisine_type}</p>
                    )}

                    <p>{restaurant.description}</p>

                    {restaurant.phone && <p>Phone: {restaurant.phone}</p>}
                    {restaurant.email && <p>Email: {restaurant.email}</p>}
                  </div>

                  <div className="admin-package-actions">
                    <Link
                      href={`/admin/restaurants/${restaurant.id}/edit`}
                      className="button secondary"
                    >
                      Edit
                    </Link>

                    <form action={setRestaurantActive}>
                      <input type="hidden" name="id" value={restaurant.id} />
                      <input
                        type="hidden"
                        name="is_active"
                        value={restaurant.is_active ? "false" : "true"}
                      />

                      <button type="submit" className="button secondary">
                        {restaurant.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>No restaurants found.</p>
        )}
      </section>
    </main>
  );
}