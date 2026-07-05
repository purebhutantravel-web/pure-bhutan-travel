export default function AboutPage() {
  return (
    <main className="public-page">
      <section className="public-hero">
        <div className="container public-hero-grid">
          <div>
            <p className="travel-kicker">About Pure Bhutan</p>
            <h1>Travel planning rooted in Bhutanese hospitality.</h1>
            <p>
              Pure Bhutan Travel helps visitors discover Bhutan through
              meaningful routes, cultural experiences, comfortable stays, and
              reliable local support.
            </p>
          </div>

          <div className="public-hero-card">
            <span>Our Promise</span>
            <h2>Thoughtful journeys, not rushed itineraries.</h2>
            <p>
              We help travelers move through Bhutan with comfort, curiosity, and
              respect for place, culture, and pace.
            </p>
          </div>
        </div>
      </section>

      <section className="public-section container public-two-column">
        <div>
          <p className="travel-kicker">Our Approach</p>
          <h2>Simple planning with a deeply local focus.</h2>
        </div>

        <div className="public-text-stack">
          <p>
            We focus on thoughtful travel planning rather than rushed packages.
            Each journey is shaped around the traveler’s interests, available
            time, comfort level, and the kind of Bhutan experience they are
            looking for.
          </p>

          <p>
            Whether someone is visiting Bhutan for culture, nature, photography,
            food, festivals, trekking, or a peaceful holiday, the goal is to make
            planning simple and the journey memorable.
          </p>
        </div>
      </section>

      <section className="public-soft-band">
        <div className="container public-card-grid">
          <article className="public-feature-card">
            <h3>Culture-led</h3>
            <p>
              Routes can include monasteries, dzongs, local markets, food, and
              Bhutanese everyday life.
            </p>
          </article>

          <article className="public-feature-card">
            <h3>Comfort-aware</h3>
            <p>
              Travel plans can be shaped around your preferred pace, group size,
              and travel style.
            </p>
          </article>

          <article className="public-feature-card">
            <h3>Locally supported</h3>
            <p>
              We help coordinate hotels, guides, transport, restaurants, and
              practical travel needs.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}