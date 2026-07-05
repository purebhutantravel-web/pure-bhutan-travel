import Link from "next/link";
import { redirect } from "next/navigation";
import { setGalleryImageActive } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function AdminGalleryPage({ searchParams }: Props) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const status = params.status;

  const supabase = await createClient();

  const { data: galleryItems, error } = await supabase
    .from("gallery_images")
    .select(
      "id, title, image_url, alt_text, category, location, description, is_active, sort_order"
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Fetch gallery items error:", error.message);
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Gallery.</h1>
            <p>Add, edit, activate, or hide gallery items from the website.</p>
          </div>

          <div className="admin-actions-row">
            <Link href="/admin" className="button secondary">
              Back to Dashboard
            </Link>

            <Link href="/admin/gallery/new" className="button primary">
              Add New Gallery Item
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        {status === "created" && (
          <div className="form-message success admin-message">
            Gallery item created successfully.
          </div>
        )}

        {status === "updated" && (
          <div className="form-message success admin-message">
            Gallery item updated successfully.
          </div>
        )}

        {status === "error" && (
          <div className="form-message error admin-message">
            Something went wrong. Please try again.
          </div>
        )}

        {status === "invalid" && (
          <div className="form-message error admin-message">
            Invalid gallery item selected.
          </div>
        )}

        {galleryItems?.length ? (
          <div className="admin-record-list">
            {galleryItems.map((item) => (
              <article key={item.id} className="admin-record-card">
                <div className="admin-package-row">
                  <div>
                    <p className="card-meta">
                      {item.is_active ? "Active" : "Inactive"} • Sort{" "}
                      {item.sort_order}
                    </p>

                    <h2>{item.title}</h2>

                    {item.category && <p className="price">{item.category}</p>}

                    {item.location && <p>{item.location}</p>}

                    {item.description && <p>{item.description}</p>}

                    {item.image_url && (
                      <small>Image URL: {item.image_url}</small>
                    )}
                  </div>

                  <div className="admin-package-actions">
                    <Link
                      href={`/admin/gallery/${item.id}/edit`}
                      className="button secondary"
                    >
                      Edit
                    </Link>

                    <form action={setGalleryImageActive}>
                      <input type="hidden" name="id" value={item.id} />
                      <input
                        type="hidden"
                        name="is_active"
                        value={item.is_active ? "false" : "true"}
                      />

                      <button type="submit" className="button secondary">
                        {item.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>No gallery items found.</p>
        )}
      </section>
    </main>
  );
}