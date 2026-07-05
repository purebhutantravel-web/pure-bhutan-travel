import Link from "next/link";
import { redirect } from "next/navigation";
import { createTestimonial } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function NewTestimonialPage({ searchParams }: Props) {
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
            <h1>Add new testimonial.</h1>
            <p>Create a traveler testimonial for the public website.</p>
          </div>

          <Link href="/admin/testimonials" className="button secondary">
            Back to Testimonials
          </Link>
        </div>
      </section>

      <section className="section container">
        <form action={createTestimonial} className="admin-edit-form">
          {status === "missing" && (
            <div className="form-message error">
              Guest name and message are required.
            </div>
          )}

          {status === "invalid-rating" && (
            <div className="form-message error">
              Rating must be between 1 and 5.
            </div>
          )}

          {status === "error" && (
            <div className="form-message error">
              Something went wrong while creating the testimonial.
            </div>
          )}

          <div className="form-grid-2">
            <label>
              Guest name
              <input
                name="guest_name"
                type="text"
                placeholder="Guest Traveller"
                required
              />
            </label>

            <label>
              Country
              <input name="country" type="text" placeholder="Singapore" />
            </label>
          </div>

          <label>
            Message
            <textarea
              name="message"
              placeholder="The journey was peaceful, well-organized, and deeply memorable."
              required
            />
          </label>

          <div className="form-grid-2">
            <label>
              Rating
              <input
                name="rating"
                type="number"
                min="1"
                max="5"
                placeholder="5"
              />
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
              placeholder="Leave blank for no image"
            />
          </label>

          <div className="checkbox-row">
            <label>
              <input name="is_approved" type="checkbox" defaultChecked />
              Approved on public website
            </label>

            <label>
              <input name="is_featured" type="checkbox" />
              Featured
            </label>
          </div>

          <button type="submit" className="button primary">
            Create Testimonial
          </button>
        </form>
      </section>
    </main>
  );
}