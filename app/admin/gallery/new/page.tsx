import Link from "next/link";
import { redirect } from "next/navigation";
import { createGalleryImage } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function NewGalleryItemPage({ searchParams }: Props) {
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
            <h1>Add gallery item.</h1>
            <p>Create a gallery item for the public gallery page.</p>
          </div>

          <Link href="/admin/gallery" className="button secondary">
            Back to Gallery
          </Link>
        </div>
      </section>

      <section className="section container">
        <form action={createGalleryImage} className="admin-edit-form">
          {status === "missing" && (
            <div className="form-message error">
              Gallery title is required.
            </div>
          )}

          {status === "error" && (
            <div className="form-message error">
              Something went wrong while creating the gallery item.
            </div>
          )}

          <div className="form-grid-2">
            <label>
              Title
              <input
                name="title"
                type="text"
                placeholder="Tiger’s Nest Monastery"
                required
              />
            </label>

            <label>
              Category
              <input name="category" type="text" placeholder="Culture" />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Location
              <input name="location" type="text" placeholder="Paro" />
            </label>

            <label>
              Sort order
              <input name="sort_order" type="number" placeholder="1" />
            </label>
          </div>

          <label>
            Image URL
            <input
              name="image_url"
              type="text"
              placeholder="Leave blank for placeholder image"
            />
          </label>

          <label>
            Alt text
            <input
              name="alt_text"
              type="text"
              placeholder="Tiger’s Nest Monastery in Paro"
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              placeholder="A short description of this gallery item..."
            />
          </label>

          <div className="checkbox-row">
            <label>
              <input name="is_active" type="checkbox" defaultChecked />
              Active on public website
            </label>
          </div>

          <button type="submit" className="button primary">
            Create Gallery Item
          </button>
        </form>
      </section>
    </main>
  );
}