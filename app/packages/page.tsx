import Link from "next/link";
import { getTourPackages } from "@/lib/data";

export const revalidate = 0;

export default async function PackagesPage() {
  const packages = await getTourPackages();

  return (
    <main className="public-page">
      <section className="public-hero">
        <div className="container public-hero-grid">
          <div>
            <p className="travel-kicker">Tour Packages</p>
            <h1>Curated Bhutan journeys for culture, nature, and comfort.</h1>
            <p>
              Choose from cultural journeys, classic western Bhutan routes, and
              nature-focused travel experiences.
            </p>
          </div>

          <div className="public-hero-card">
            <span>Plan Better</span>
            <h2>Start with a route, then customize your journey.</h2>
            <p>
              Each package can be shaped around your travel dates, group size,
              interests, and preferred pace.
            </p>
          </div>
        </div>
      </section>

      <section className="public-section container">
        {packages.length === 0 ? (
          <p>No packages found. Please check Supabase data.</p>
        ) : (
          <div className="public-card-grid">
            {packages.map((item) => (
              <article key={item.id} className="public-listing-card">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="public-card-image"
                  />
                ) : (
                  <div className="public-card-image">Package Image</div>
                )}

                <div className="public-listing-body">
                  <p className="travel-card-meta">
                    {item.duration_days} Days / {item.duration_nights} Nights •{" "}
                    {item.difficulty}
                  </p>

                  <h2>{item.title}</h2>
                  <p>{item.short_description}</p>

                  {item.price_from_usd && (
                    <p className="public-price">
                      From USD {item.price_from_usd}
                    </p>
                  )}

                  <Link href={`/packages/${item.slug}`} className="text-link">
                    View itinerary
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}