import { notFound } from "next/navigation";
import { getTourPackageBySlug } from "@/lib/data";
import { submitBookingRequest } from "@/app/actions";

export const revalidate = 0;

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    booking?: string;
  }>;
};
type PackageItineraryDay = {
  id: string;
  day_number: number;
  title: string;
  description: string;
  overnight: string | null;
  sort_order?: number | null;
};

export default async function PackageDetailPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const bookingStatus = query.booking;

  const item = await getTourPackageBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="public-page">
      <section className="public-hero">
        <div className="container public-hero-grid">
          <div>
            <p className="travel-kicker">Tour Package</p>
            <h1>{item.title}</h1>
            <p>{item.short_description}</p>
          </div>

          <div className="public-hero-card">
            <span>Package Summary</span>
            <h2>
              {item.duration_days} Days / {item.duration_nights} Nights
            </h2>
            <p>Difficulty: {item.difficulty || "Flexible"}</p>

            {item.price_from_usd && (
              <p className="public-price">From USD {item.price_from_usd}</p>
            )}
          </div>
        </div>
      </section>

      <section className="public-section container public-detail-layout">
        <div>
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="public-large-image"
            />
          ) : (
            <div className="public-large-image">Package Image</div>
          )}

          <div className="public-content-block">
            <p className="travel-kicker">Overview</p>
            <h2>What this journey offers.</h2>
            <p>{item.overview}</p>
          </div>

          <div className="public-content-block">
            <p className="travel-kicker">Itinerary</p>
            <h2>Day-by-day plan.</h2>

            {item.package_itineraries?.length ? (
              <div className="public-itinerary-list">
                {item.package_itineraries.map((day: PackageItineraryDay) => (
                  <article key={day.id} className="public-itinerary-card">
                    <span>Day {day.day_number}</span>
                    <h3>{day.title}</h3>
                    <p>{day.description}</p>
                    {day.overnight && <p>Overnight: {day.overnight}</p>}
                  </article>
                ))}
              </div>
            ) : (
              <p>No itinerary has been added for this package yet.</p>
            )}
          </div>
        </div>

        <aside className="public-booking-panel">
          <h3>Request this package</h3>
          <p>
            Send your preferred travel dates and group details. We will help
            refine the itinerary.
          </p>

          {bookingStatus === "success" && (
            <div className="form-message success">
              Thank you. Your booking request has been submitted.
            </div>
          )}

          {bookingStatus === "missing" && (
            <div className="form-message error">
              Please fill in your full name and email address.
            </div>
          )}

          {bookingStatus === "invalid-travelers" && (
            <div className="form-message error">
              Number of travelers must be greater than zero.
            </div>
          )}

          {bookingStatus === "error" && (
            <div className="form-message error">
              Something went wrong while submitting your booking request.
            </div>
          )}

          <form action={submitBookingRequest} className="booking-form">
            <input type="hidden" name="package_id" value={item.id} />
            <input type="hidden" name="package_title" value={item.title} />
            <input type="hidden" name="redirect_slug" value={item.slug} />

            <label>
              Full name
              <input name="full_name" type="text" required />
            </label>

            <label>
              Email address
              <input name="email" type="email" required />
            </label>

            <label>
              Phone / WhatsApp
              <input name="phone" type="text" />
            </label>

            <label>
              Country
              <input name="country" type="text" />
            </label>

            <label>
              Preferred travel date
              <input name="travel_date" type="date" />
            </label>

            <label>
              Number of travelers
              <input name="number_of_travelers" type="number" min="1" />
            </label>

            <label>
              Message
              <textarea name="message" />
            </label>

            <button type="submit" className="travel-button primary">
              Submit Booking Request
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}