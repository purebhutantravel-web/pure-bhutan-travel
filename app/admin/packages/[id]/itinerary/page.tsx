import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  createPackageItinerary,
  deletePackageItinerary,
  updatePackageItinerary,
} from "@/app/admin/actions";
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

export default async function PackageItineraryPage({
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

  const { data: packageData, error: packageError } = await supabase
    .from("tour_packages")
    .select("id, slug, title, duration_days, duration_nights")
    .eq("id", id)
    .maybeSingle();

  if (packageError) {
    console.error("Fetch package for itinerary error:", packageError.message);
  }

  if (!packageData) {
    notFound();
  }

  const { data: itineraries, error: itineraryError } = await supabase
    .from("package_itineraries")
    .select("id, day_number, title, description, overnight, sort_order")
    .eq("package_id", id)
    .order("sort_order", { ascending: true })
    .order("day_number", { ascending: true });

  if (itineraryError) {
    console.error("Fetch itineraries error:", itineraryError.message);
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Manage itinerary.</h1>
            <p>
              Add and edit day-by-day itinerary for{" "}
              <strong>{packageData.title}</strong>.
            </p>
          </div>

          <div className="admin-actions-row">
            <Link href="/admin/packages" className="button secondary">
              Back to Packages
            </Link>

            <Link
              href={`/packages/${packageData.slug}`}
              className="button secondary"
            >
              View Public Page
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        {status === "created" && (
          <div className="form-message success admin-message">
            Itinerary day added successfully.
          </div>
        )}

        {status === "updated" && (
          <div className="form-message success admin-message">
            Itinerary day updated successfully.
          </div>
        )}

        {status === "deleted" && (
          <div className="form-message success admin-message">
            Itinerary day deleted successfully.
          </div>
        )}

        {status === "missing" && (
          <div className="form-message error admin-message">
            Day number, title, and description are required.
          </div>
        )}

        {status === "invalid" && (
          <div className="form-message error admin-message">
            Invalid itinerary item selected.
          </div>
        )}

        {status === "error" && (
          <div className="form-message error admin-message">
            Something went wrong. Please try again.
          </div>
        )}

        <div className="admin-itinerary-layout">
          <section className="admin-panel">
            <h2>Add itinerary day</h2>

            <form action={createPackageItinerary} className="admin-mini-form">
              <input type="hidden" name="package_id" value={packageData.id} />

              <div className="form-grid-2">
                <label>
                  Day number
                  <input
                    name="day_number"
                    type="number"
                    min="1"
                    placeholder="1"
                    required
                  />
                </label>

                <label>
                  Sort order
                  <input
                    name="sort_order"
                    type="number"
                    placeholder="1"
                    defaultValue={itineraries?.length ? itineraries.length + 1 : 1}
                  />
                </label>
              </div>

              <label>
                Title
                <input
                  name="title"
                  type="text"
                  placeholder="Arrival in Paro"
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  placeholder="Describe the activities for this day..."
                  required
                />
              </label>

              <label>
                Overnight
                <input
                  name="overnight"
                  type="text"
                  placeholder="Thimphu"
                />
              </label>

              <button type="submit" className="button primary">
                Add Itinerary Day
              </button>
            </form>
          </section>

          <section className="admin-panel">
            <h2>Existing itinerary</h2>

            {itineraries?.length ? (
              <div className="admin-itinerary-list">
                {itineraries.map((day) => (
                  <article key={day.id} className="admin-itinerary-card">
                    <form
                      action={updatePackageItinerary}
                      className="admin-mini-form"
                    >
                      <input type="hidden" name="id" value={day.id} />
                      <input
                        type="hidden"
                        name="package_id"
                        value={packageData.id}
                      />

                      <div className="form-grid-2">
                        <label>
                          Day number
                          <input
                            name="day_number"
                            type="number"
                            min="1"
                            defaultValue={day.day_number}
                            required
                          />
                        </label>

                        <label>
                          Sort order
                          <input
                            name="sort_order"
                            type="number"
                            defaultValue={day.sort_order}
                          />
                        </label>
                      </div>

                      <label>
                        Title
                        <input
                          name="title"
                          type="text"
                          defaultValue={day.title}
                          required
                        />
                      </label>

                      <label>
                        Description
                        <textarea
                          name="description"
                          defaultValue={day.description}
                          required
                        />
                      </label>

                      <label>
                        Overnight
                        <input
                          name="overnight"
                          type="text"
                          defaultValue={day.overnight || ""}
                        />
                      </label>

                      <button type="submit" className="button primary">
                        Save Day
                      </button>
                    </form>

                    <form action={deletePackageItinerary}>
                      <input type="hidden" name="id" value={day.id} />
                      <input
                        type="hidden"
                        name="package_id"
                        value={packageData.id}
                      />

                      <button type="submit" className="button danger">
                        Delete Day
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            ) : (
              <p>No itinerary days have been added for this package yet.</p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}