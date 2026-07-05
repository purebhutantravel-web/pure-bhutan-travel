import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateTestimonial } from "@/app/admin/actions";
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

export default async function EditTestimonialPage({
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

  const { data: testimonial, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Fetch testimonial for edit error:", error.message);
  }

  if (!testimonial) {
    notFound();
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Edit testimonial.</h1>
            <p>Update traveler testimonial details shown on the website.</p>
          </div>

          <Link href="/admin/testimonials" className="button secondary">
            Back to Testimonials
          </Link>
        </div>
      </section>

      <section className="section container">
        <form action={updateTestimonial} className="admin-edit-form">
          <input type="hidden" name="id" value={testimonial.id} />

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
              Something went wrong while updating the testimonial.
            </div>
          )}

          <div className="form-grid-2">
            <label>
              Guest name
              <input
                name="guest_name"
                type="text"
                defaultValue={testimonial.guest_name || ""}
                required
              />
            </label>

            <label>
              Country
              <input
                name="country"
                type="text"
                defaultValue={testimonial.country || ""}
              />
            </label>
          </div>

          <label>
            Message
            <textarea
              name="message"
              defaultValue={testimonial.message || ""}
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
                defaultValue={testimonial.rating || ""}
              />
            </label>

            <label>
              Sort order
              <input
                name="sort_order"
                type="number"
                defaultValue={testimonial.sort_order || 0}
              />
            </label>
          </div>

          <label>
            Image URL
            <input
              name="image_url"
              type="text"
              defaultValue={testimonial.image_url || ""}
            />
          </label>

          <div className="checkbox-row">
            <label>
              <input
                name="is_approved"
                type="checkbox"
                defaultChecked={testimonial.is_approved}
              />
              Approved on public website
            </label>

            <label>
              <input
                name="is_featured"
                type="checkbox"
                defaultChecked={testimonial.is_featured}
              />
              Featured
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