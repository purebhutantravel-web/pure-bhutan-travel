import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateFaq } from "@/app/admin/actions";
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

export default async function EditFaqPage({ params, searchParams }: Props) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const query = await searchParams;
  const status = query.status;

  const supabase = await createClient();

  const { data: faq, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Fetch FAQ for edit error:", error.message);
  }

  if (!faq) {
    notFound();
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Edit FAQ.</h1>
            <p>Update FAQ details shown on the public website.</p>
          </div>

          <Link href="/admin/faqs" className="button secondary">
            Back to FAQs
          </Link>
        </div>
      </section>

      <section className="section container">
        <form action={updateFaq} className="admin-edit-form">
          <input type="hidden" name="id" value={faq.id} />

          {status === "missing" && (
            <div className="form-message error">
              Question and answer are required.
            </div>
          )}

          {status === "error" && (
            <div className="form-message error">
              Something went wrong while updating the FAQ.
            </div>
          )}

          <label>
            Question
            <input
              name="question"
              type="text"
              defaultValue={faq.question || ""}
              required
            />
          </label>

          <label>
            Answer
            <textarea name="answer" defaultValue={faq.answer || ""} required />
          </label>

          <div className="form-grid-2">
            <label>
              Category
              <input
                name="category"
                type="text"
                defaultValue={faq.category || ""}
              />
            </label>

            <label>
              Sort order
              <input
                name="sort_order"
                type="number"
                defaultValue={faq.sort_order || 0}
              />
            </label>
          </div>

          <div className="checkbox-row">
            <label>
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={faq.is_active}
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