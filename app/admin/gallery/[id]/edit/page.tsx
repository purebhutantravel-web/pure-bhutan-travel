import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateGalleryImage } from "@/app/admin/actions";
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

export default async function EditGalleryItemPage({
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

  const { data: item, error } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Fetch gallery item for edit error:", error.message);
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
            <h1>Edit gallery item.</h1>
            <p>Update gallery item details shown on the public website.</p>
          </div>

          <Link href="/admin/gallery" className="button secondary">
            Back to Gallery
          </Link>
        </div>
      </section>

      <section className="section container">
        <form action={updateGalleryImage} className="admin-edit-form">
          <input type="hidden" name="id" value={item.id} />

          {status === "missing" && (
            <div className="form-message error">
              Gallery title is required.
            </div>
          )}

          {status === "error" && (
            <div className="form-message error">
              Something went wrong while updating the gallery item.
            </div>
          )}

          <div className="form-grid-2">
            <label>
              Title
              <input
                name="title"
                type="text"
                defaultValue={item.title || ""}
                required
              />
            </label>

            <label>
              Category
              <input
                name="category"
                type="text"
                defaultValue={item.category || ""}
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Location
              <input
                name="location"
                type="text"
                defaultValue={item.location || ""}
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

          <label>
            Image URL
            <input
              name="image_url"
              type="text"
              defaultValue={item.image_url || ""}
            />
          </label>

          <label>
            Alt text
            <input
              name="alt_text"
              type="text"
              defaultValue={item.alt_text || ""}
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              defaultValue={item.description || ""}
            />
          </label>

          <div className="checkbox-row">
            <label>
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={item.is_active}
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