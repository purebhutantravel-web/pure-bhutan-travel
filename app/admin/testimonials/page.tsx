import Link from "next/link";
import { redirect } from "next/navigation";
import {
  setTestimonialApproved,
  setTestimonialFeatured,
} from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function AdminTestimonialsPage({ searchParams }: Props) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const status = params.status;

  const supabase = await createClient();

  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select(
      "id, guest_name, country, message, rating, image_url, is_featured, is_approved, sort_order"
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Fetch testimonials error:", error.message);
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Testimonials.</h1>
            <p>Add, edit, approve, or feature traveler testimonials.</p>
          </div>

          <div className="admin-actions-row">
            <Link href="/admin" className="button secondary">
              Back to Dashboard
            </Link>

            <Link href="/admin/testimonials/new" className="button primary">
              Add New Testimonial
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        {status === "created" && (
          <div className="form-message success admin-message">
            Testimonial created successfully.
          </div>
        )}

        {status === "updated" && (
          <div className="form-message success admin-message">
            Testimonial updated successfully.
          </div>
        )}

        {status === "error" && (
          <div className="form-message error admin-message">
            Something went wrong. Please try again.
          </div>
        )}

        {status === "invalid" && (
          <div className="form-message error admin-message">
            Invalid testimonial selected.
          </div>
        )}

        {testimonials?.length ? (
          <div className="admin-record-list">
            {testimonials.map((item) => (
              <article key={item.id} className="admin-record-card">
                <div className="admin-package-row">
                  <div>
                    <p className="card-meta">
                      {item.is_approved ? "Approved" : "Not Approved"} •{" "}
                      {item.is_featured ? "Featured" : "Not Featured"} • Sort{" "}
                      {item.sort_order}
                    </p>

                    <h2>{item.guest_name}</h2>

                    {item.country && <p>{item.country}</p>}

                    {item.rating && (
                      <p className="price">Rating: {item.rating}/5</p>
                    )}

                    <p>{item.message}</p>
                  </div>

                  <div className="admin-package-actions">
                    <Link
                      href={`/admin/testimonials/${item.id}/edit`}
                      className="button secondary"
                    >
                      Edit
                    </Link>

                    <form action={setTestimonialApproved}>
                      <input type="hidden" name="id" value={item.id} />
                      <input
                        type="hidden"
                        name="is_approved"
                        value={item.is_approved ? "false" : "true"}
                      />

                      <button type="submit" className="button secondary">
                        {item.is_approved ? "Unapprove" : "Approve"}
                      </button>
                    </form>

                    <form action={setTestimonialFeatured}>
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
          <p>No testimonials found.</p>
        )}
      </section>
    </main>
  );
}