import Link from "next/link";
import { redirect } from "next/navigation";
import { createTourPackage } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function NewPackagePage({ searchParams }: Props) {
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
            <h1>Add new tour package.</h1>
            <p>Create a new package that can appear on the public website.</p>
          </div>

          <Link href="/admin/packages" className="button secondary">
            Back to Packages
          </Link>
        </div>
      </section>

      <section className="section container">
        <form action={createTourPackage} className="admin-edit-form">
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
              Something went wrong while creating the package.
            </div>
          )}

          <div className="form-grid-2">
            <label>
              Package title
              <input
                name="title"
                type="text"
                placeholder="Bhutan Cultural Journey"
                required
              />
            </label>

            <label>
              Slug
              <input
                name="slug"
                type="text"
                placeholder="bhutan-cultural-journey"
                required
              />
            </label>
          </div>

          <label>
            Subtitle
            <input
              name="subtitle"
              type="text"
              placeholder="A gentle introduction to Bhutan..."
            />
          </label>

          <label>
            Short description
            <textarea
              name="short_description"
              placeholder="Short package summary shown on cards..."
              required
            />
          </label>

          <label>
            Overview
            <textarea
              name="overview"
              placeholder="Longer package overview shown on the detail page..."
            />
          </label>

          <div className="form-grid-2">
            <label>
              Duration days
              <input name="duration_days" type="number" min="1" placeholder="6" />
            </label>

            <label>
              Duration nights
              <input
                name="duration_nights"
                type="number"
                min="0"
                placeholder="5"
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Difficulty
              <input name="difficulty" type="text" placeholder="Easy" />
            </label>

            <label>
              Price from USD
              <input
                name="price_from_usd"
                type="number"
                min="0"
                step="0.01"
                placeholder="1250"
              />
            </label>
          </div>

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
              Sort order
              <input name="sort_order" type="number" placeholder="1" />
            </label>
          </div>

          <div className="checkbox-row">
            <label>
              <input name="is_active" type="checkbox" defaultChecked />
              Active
            </label>

            <label>
              <input name="is_featured" type="checkbox" />
              Featured on homepage
            </label>
          </div>

          <button type="submit" className="button primary">
            Create Package
          </button>
        </form>
      </section>
    </main>
  );
}