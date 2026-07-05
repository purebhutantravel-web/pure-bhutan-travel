import { getRestaurants } from "@/lib/data";

export const revalidate = 0;

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();

  return (
    <main className="public-page">
      <section className="public-hero">
        <div className="container public-hero-grid">
          <div>
            <p className="travel-kicker">Restaurants</p>
            <h1>Dining stops and local food experiences.</h1>
            <p>
              Recommended food places for travelers who want to experience
              Bhutanese meals, cafés, and relaxed dining stops.
            </p>
          </div>

          <div className="public-hero-card">
            <span>Food & Culture</span>
            <h2>Taste Bhutan at a slower, warmer pace.</h2>
            <p>
              Add dining stops to your itinerary for local meals, cafés, and
              Bhutanese food experiences.
            </p>
          </div>
        </div>
      </section>

      <section className="public-section container">
        {restaurants.length === 0 ? (
          <p>No restaurants found. Please check Supabase data.</p>
        ) : (
          <div className="public-card-grid">
            {restaurants.map((restaurant) => (
              <article key={restaurant.id} className="public-listing-card">
                {restaurant.image_url ? (
                  <img
                    src={restaurant.image_url}
                    alt={restaurant.name}
                    className="public-card-image"
                  />
                ) : (
                  <div className="public-card-image">Restaurant Image</div>
                )}

                <div className="public-listing-body">
                  <p className="travel-card-meta">
                    {restaurant.location || "Bhutan"}
                    {restaurant.cuisine_type
                      ? ` • ${restaurant.cuisine_type}`
                      : ""}
                  </p>

                  <h2>{restaurant.name}</h2>
                  <p>{restaurant.description}</p>

                  <div className="card-contact-list">
                    {restaurant.phone && <p>Phone: {restaurant.phone}</p>}
                    {restaurant.email && <p>Email: {restaurant.email}</p>}
                  </div>

                  {restaurant.website_url && (
                    <a
                      href={restaurant.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link"
                    >
                      Visit restaurant website
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