import { getPartnerHotels } from "@/lib/data";

export const revalidate = 0;

export default async function HotelsPage() {
  const hotels = await getPartnerHotels();

  return (
    <main className="public-page">
      <section className="public-hero">
        <div className="container public-hero-grid">
          <div>
            <p className="travel-kicker">Partner Hotels</p>
            <h1>Comfortable stays for your Bhutan journey.</h1>
            <p>
              A selected list of partner hotels that can support cultural tours,
              family trips, and custom travel plans.
            </p>
          </div>

          <div className="public-hero-card">
            <span>Stay Well</span>
            <h2>Restful stays matched with your route.</h2>
            <p>
              Hotel recommendations can be adjusted based on destination, travel
              pace, and comfort preference.
            </p>
          </div>
        </div>
      </section>

      <section className="public-section container">
        {hotels.length === 0 ? (
          <p>No hotels found. Please check Supabase data.</p>
        ) : (
          <div className="public-card-grid">
            {hotels.map((hotel) => (
              <article key={hotel.id} className="public-listing-card">
                {hotel.image_url ? (
                  <img
                    src={hotel.image_url}
                    alt={hotel.name}
                    className="public-card-image"
                  />
                ) : (
                  <div className="public-card-image">Hotel Image</div>
                )}

                <div className="public-listing-body">
                  <p className="travel-card-meta">{hotel.location || "Bhutan"}</p>
                  <h2>{hotel.name}</h2>

                  {hotel.rating && (
                    <p className="public-price">Rating: {hotel.rating}/5</p>
                  )}

                  <p>{hotel.description}</p>

                  <div className="card-contact-list">
                    {hotel.phone && <p>Phone: {hotel.phone}</p>}
                    {hotel.email && <p>Email: {hotel.email}</p>}
                  </div>

                  {hotel.website_url && (
                    <a
                      href={hotel.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link"
                    >
                      Visit hotel website
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}