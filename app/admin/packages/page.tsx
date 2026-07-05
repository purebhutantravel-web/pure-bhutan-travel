import Link from "next/link";
import { redirect } from "next/navigation";
import {
  setTourPackageActive,
  setTourPackageFeatured,
} from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function AdminPackagesPage({ searchParams }: Props) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const status = params.status;

  const supabase = await createClient();

  const { data: packages, error } = await supabase
    .from("tour_packages")
    .select(
      "id, slug, title, short_description, duration_days, duration_nights, difficulty, price_from_usd, is_featured, is_active, sort_order, created_at"
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Fetch packages error:", error.message);
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Tour packages.</h1>
            <p>Create, edit, feature, activate, or deactivate website packages.</p>
          </div>

          <div className="admin-actions-row">
            <Link href="/admin" className="button secondary">
              Back to Dashboard
            </Link>

            <Link href="/admin/packages/new" className="button primary">
              Add New Package
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        {status === "created" && (
          <div className="form-message success admin-message">
            Package created successfully.
          </div>
        )}

        {status === "updated" && (
          <div className="form-message success admin-message">
            Package updated successfully.
          </div>
        )}

        {status === "error" && (
          <div className="form-message error admin-message">
            Something went wrong. Please try again.
          </div>
        )}

        {status === "invalid" && (
          <div className="form-message error admin-message">
            Invalid package selected.
          </div>
        )}

        {packages?.length ? (
          <div className="admin-record-list">
            {packages.map((item) => (
              <article key={item.id} className="admin-record-card">
                <div className="admin-package-row">
                  <div>
                    <p className="card-meta">
                      {item.is_active ? "Active" : "Inactive"} •{" "}
                      {item.is_featured ? "Featured" : "Not Featured"}
                    </p>

                    <h2>{item.title}</h2>
                    <p>{item.short_description}</p>

                    <p>
                      {item.duration_days || 0} Days /{" "}
                      {item.duration_nights || 0} Nights •{" "}
                      {item.difficulty || "Difficulty not set"}
                    </p>

                    {item.price_from_usd && (
                      <p className="price">From USD {item.price_from_usd}</p>
                    )}

                    <small>Slug: {item.slug}</small>
                  </div>

                  <div className="admin-package-actions">
                    <Link
                      href={`/admin/packages/${item.id}/edit`}
                      className="button secondary"
                    >
                      Edit
                    </Link>

                    <form action={setTourPackageActive}>
                      <input type="hidden" name="id" value={item.id} />
                      <input
                        type="hidden"
                        name="is_active"
                        value={item.is_active ? "false" : "true"}
                      />
                    <Link
                     href={`/admin/packages/${item.id}/itinerary`}
                       className="button secondary"
                      >
                        Itinerary
                    </Link>

                      <button type="submit" className="button secondary">
                        {item.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </form>

                    <form action={setTourPackageFeatured}>
                      <input type="hidden" name="id" value={item.id} />
                      <input
                        type="hidden"
                        name="is_featured"
                        value={item.is_featured ? "false" : "true"}
                      />

                      <button type="submit" className="button secondary">
                        {item.is_featured ? "Unfeature" : "Feature"}
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>No tour packages found.</p>
        )}
      </section>
    </main>
  );
}