import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateTourPackage } from "@/app/admin/actions";
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

export default async function EditPackagePage({ params, searchParams }: Props) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const query = await searchParams;
  const status = query.status;

  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from("tour_packages")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Fetch package for edit error:", error.message);
  }

  if (!item) {
    notFound();
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Edit tour package.</h1>
            <p>Update package information shown on the public website.</p>
          </div>

          <Link href="/admin/packages" className="button secondary">
            Back to Packages
          </Link>
        </div>
      </section>

      <section className="section container">
        <form action={updateTourPackage} className="admin-edit-form">
          <input type="hidden" name="id" value={item.id} />

          {status === "missing" && (
            <div className="form-message error">
              Slug, title, and short description are required.
            </div>
          )}

          {status === "duplicate" && (
            <div className="form-message error">
              This slug already exists. Please use a unique slug.
            </div>
          )}

          {status === "error" && (
            <div className="form-message error">
              Something went wrong while updating the package.
            </div>
          )}

          <div className="form-grid-2">
            <label>
              Package title
              <input
                name="title"
                type="text"
                defaultValue={item.title || ""}
                required
              />
            </label>

            <label>
              Slug
              <input
                name="slug"
                type="text"
                defaultValue={item.slug || ""}
                required
              />
            </label>
          </div>

          <label>
            Subtitle
            <input
              name="subtitle"
              type="text"
              defaultValue={item.subtitle || ""}
            />
          </label>

          <label>
            Short description
            <textarea
              name="short_description"
              defaultValue={item.short_description || ""}
              required
            />
          </label>

          <label>
            Overview
            <textarea name="overview" defaultValue={item.overview || ""} />
          </label>

          <div className="form-grid-2">
            <label>
              Duration days
              <input
                name="duration_days"
                type="number"
                min="1"
                defaultValue={item.duration_days || ""}
              />
            </label>

            <label>
              Duration nights
              <input
                name="duration_nights"
                type="number"
                min="0"
                defaultValue={item.duration_nights || ""}
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Difficulty
              <input
                name="difficulty"
                type="text"
                defaultValue={item.difficulty || ""}
              />
            </label>

            <label>
              Price from USD
              <input
                name="price_from_usd"
                type="number"
                min="0"
                step="0.01"
                defaultValue={item.price_from_usd || ""}
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Image URL
              <input
                name="image_url"
                type="text"
                defaultValue={item.image_url || ""}
              />
            </label>

            <label>
              Sort order
              <input
                name="sort_order"
                type="number"
                defaultValue={item.sort_order || 0}
              />
            </label>
          </div>

          <div className="checkbox-row">
            <label>
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={item.is_active}
              />
              Active
            </label>

            <label>
              <input
                name="is_featured"
                type="checkbox"
                defaultChecked={item.is_featured}
              />
              Featured on homepage
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