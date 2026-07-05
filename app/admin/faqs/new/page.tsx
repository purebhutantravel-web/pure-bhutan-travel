import Link from "next/link";
import { redirect } from "next/navigation";
import { createFaq } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin";

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function NewFaqPage({ searchParams }: Props) {
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
            <h1>Add new FAQ.</h1>
            <p>Create a frequently asked question for the public website.</p>
          </div>

          <Link href="/admin/faqs" className="button secondary">
            Back to FAQs
          </Link>
        </div>
      </section>

      <section className="section container">
        <form action={createFaq} className="admin-edit-form">
          {status === "missing" && (
            <div className="form-message error">
              Question and answer are required.
            </div>
          )}

          {status === "error" && (
            <div className="form-message error">
              Something went wrong while creating the FAQ.
            </div>
          )}

          <label>
            Question
            <input
              name="question"
              type="text"
              placeholder="Can you customize Bhutan tours?"
              required
            />
          </label>

          <label>
            Answer
            <textarea
              name="answer"
              placeholder="Yes. We can customize tours based on travel dates, interests, group size, and preferred pace."
              required
            />
          </label>

          <div className="form-grid-2">
            <label>
              Category
              <input name="category" type="text" placeholder="Booking" />
            </label>

            <label>
              Sort order
              <input name="sort_order" type="number" placeholder="1" />
            </label>
          </div>

          <div className="checkbox-row">
            <label>
              <input name="is_active" type="checkbox" defaultChecked />
              Active on public website
            </label>
          </div>

          <button type="submit" className="button primary">
            Create FAQ
          </button>
        </form>
      </section>
    </main>
  );
}