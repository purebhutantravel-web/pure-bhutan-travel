import Link from "next/link";
import {
  getFaqs,
  getFeaturedTourPackages,
  getTestimonials,
} from "@/lib/data";

export const revalidate = 0;

// Later, replace this empty string with your YouTube embed link.
// Example: "https://www.youtube.com/embed/VIDEO_ID"
const youtubeEmbedUrl = "https://www.youtube.com/embed/3sDAsVvfiU4";

export default async function HomePage() {
  const featuredPackages = await getFeaturedTourPackages();
  const testimonials = await getTestimonials();
  const faqs = await getFaqs();

  return (
    <main className="home-redesign">
      <section className="travel-hero">
        <div className="container travel-hero-grid">
          <div className="travel-hero-copy">
            <p className="travel-kicker">Bhutan Travel Experiences</p>

            <h1>
              Discover Bhutan through culture, nature, and mindful journeys.
            </h1>

            <p className="travel-hero-text">
              Plan meaningful journeys across Bhutan with curated tour packages,
              partner hotels, restaurants, local experiences, and guided travel
              support.
            </p>

            <div className="travel-hero-actions">
              <Link href="/packages" className="travel-button primary">
                Explore Packages
              </Link>

              <Link href="/contact" className="travel-button secondary">
                Plan My Trip
              </Link>
            </div>

            <div className="travel-mini-stats">
              <div>
                <strong>Curated</strong>
                <span>Travel routes</span>
              </div>

              <div>
                <strong>Local</strong>
                <span>Bhutan support</span>
              </div>

              <div>
                <strong>Flexible</strong>
                <span>Custom planning</span>
              </div>
            </div>
          </div>

          <div className="travel-video-card">
            <div className="video-frame">
              {youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  title="Bhutan travel video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="video-placeholder">
                  <div className="play-circle">▶</div>
                  <p className="travel-kicker">Video Preview</p>
                  <h2>Bhutan Travel Film</h2>
                  <p>
                    Paste your YouTube embed link in app/page.tsx to play the
                    video here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="travel-section container">
        <div className="travel-section-heading">
          <p className="travel-kicker">Popular Journeys</p>
          <h2>Curated Bhutan travel packages for meaningful exploration.</h2>
        </div>

        <div className="travel-card-grid">
          {featuredPackages.map((item) => (
            <article key={item.id} className="travel-card">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="travel-card-image"
                />
              ) : (
                <div className="travel-card-image">Bhutan Image</div>
              )}

              <div className="travel-card-body">
                <p className="travel-card-meta">
                  {item.duration_days} Days / {item.duration_nights} Nights •{" "}
                  {item.difficulty}
                </p>

                <h3>{item.title}</h3>
                <p>{item.short_description}</p>

                <Link href={`/packages/${item.slug}`}>View itinerary</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="travel-story-band">
        <div className="container travel-story-grid">
          <div>
            <p className="travel-kicker">Why Travel With Us</p>
            <h2>Soft planning, strong local knowledge, and reliable support.</h2>
          </div>

          <div className="travel-feature-list">
            <div>
              <h3>Curated routes</h3>
              <p>Balanced itineraries across culture, comfort, and scenery.</p>
            </div>

            <div>
              <h3>Local support</h3>
              <p>Help with guides, hotels, transport, and travel planning.</p>
            </div>

            <div>
              <h3>Bhutan-focused</h3>
              <p>Experiences shaped around Bhutanese places and hospitality.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="travel-section container">
        <div className="travel-section-heading">
          <p className="travel-kicker">Traveler Stories</p>
          <h2>What guests say about their Bhutan journey.</h2>
        </div>

        {testimonials.length ? (
          <div className="travel-card-grid">
            {testimonials.slice(0, 3).map((item) => (
              <article key={item.id} className="travel-testimonial-card">
                <p className="travel-card-meta">
                  {item.rating ? `${item.rating}/5` : "Guest Story"}
                </p>

                <h3>{item.guest_name}</h3>

                {item.country && <p>{item.country}</p>}

                <p>{item.message}</p>
              </article>
            ))}
          </div>
        ) : (
          <p>No testimonials have been added yet.</p>
        )}
      </section>

      <section className="travel-section container">
        <div className="travel-section-heading">
          <p className="travel-kicker">FAQs</p>
          <h2>Common questions from travelers.</h2>
        </div>

        <div className="travel-faq-list">
          {faqs.map((item) => (
            <details key={item.id}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="travel-cta-wrap">
        <div className="container travel-cta">
          <p className="travel-kicker">Start Planning</p>
          <h2>Ready to design your Bhutan journey?</h2>
          <p>
            Tell us your travel dates, group size, and interests. We will help
            shape a route that feels thoughtful and manageable.
          </p>

          <Link href="/contact" className="travel-button primary light">
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}