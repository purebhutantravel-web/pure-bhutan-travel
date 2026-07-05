import Link from "next/link";
import { redirect } from "next/navigation";
import { setFaqActive } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function AdminFaqsPage({ searchParams }: Props) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const status = params.status;

  const supabase = await createClient();

  const { data: faqs, error } = await supabase
    .from("faqs")
    .select("id, question, answer, category, is_active, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Fetch FAQs error:", error.message);
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>FAQs.</h1>
            <p>Add, edit, activate, or hide frequently asked questions.</p>
          </div>

          <div className="admin-actions-row">
            <Link href="/admin" className="button secondary">
              Back to Dashboard
            </Link>

            <Link href="/admin/faqs/new" className="button primary">
              Add New FAQ
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        {status === "created" && (
          <div className="form-message success admin-message">
            FAQ created successfully.
          </div>
        )}

        {status === "updated" && (
          <div className="form-message success admin-message">
            FAQ updated successfully.
          </div>
        )}

        {status === "error" && (
          <div className="form-message error admin-message">
            Something went wrong. Please try again.
          </div>
        )}

        {status === "invalid" && (
          <div className="form-message error admin-message">
            Invalid FAQ selected.
          </div>
        )}

        {faqs?.length ? (
          <div className="admin-record-list">
            {faqs.map((faq) => (
              <article key={faq.id} className="admin-record-card">
                <div className="admin-package-row">
                  <div>
                    <p className="card-meta">
                      {faq.is_active ? "Active" : "Inactive"} • Sort{" "}
                      {faq.sort_order}
                    </p>

                    <h2>{faq.question}</h2>

                    {faq.category && <p className="price">{faq.category}</p>}

                    <p>{faq.answer}</p>
                  </div>

                  <div className="admin-package-actions">
                    <Link
                      href={`/admin/faqs/${faq.id}/edit`}
                      className="button secondary"
                    >
                      Edit
                    </Link>

                    <form action={setFaqActive}>
                      <input type="hidden" name="id" value={faq.id} />
                      <input
                        type="hidden"
                        name="is_active"
                        value={faq.is_active ? "false" : "true"}
                      />

                      <button type="submit" className="button secondary">
                        {faq.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>No FAQs found.</p>
        )}
      </section>
    </main>
  );
}