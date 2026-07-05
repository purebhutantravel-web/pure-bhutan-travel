import { getGalleryImages } from "@/lib/data";

export const revalidate = 0;

export default async function GalleryPage() {
  const galleryItems = await getGalleryImages();

  return (
    <main className="public-page">
      <section className="public-hero">
        <div className="container public-hero-grid">
          <div>
            <p className="travel-kicker">Gallery</p>
            <h1>Bhutan in moments, places, and experiences.</h1>
            <p>
              A visual space for culture, landscapes, local life, food, and
              travel inspiration.
            </p>
          </div>

          <div className="public-hero-card">
            <span>Visual Journal</span>
            <h2>Scenes that shape the journey.</h2>
            <p>
              Explore glimpses of Bhutan’s valleys, monasteries, local life,
              landscapes, and travel experiences.
            </p>
          </div>
        </div>
      </section>

      <section className="public-section container">
        {galleryItems.length === 0 ? (
          <p>No gallery items found. Please check Supabase data.</p>
        ) : (
          <div className="public-gallery-grid">
            {galleryItems.map((item) => (
              <article key={item.id} className="public-gallery-card">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.alt_text || item.title}
                  />
                ) : (
                  <div className="public-gallery-placeholder">
                    Gallery Image
                  </div>
                )}

                <div>
                  <p className="travel-card-meta">{item.category || "Bhutan"}</p>
                  <h2>{item.title}</h2>
                  {item.location && <p>{item.location}</p>}
                  {item.description && <p>{item.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}