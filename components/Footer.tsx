import Link from "next/link";

export default function Footer() {
  return (
    <footer className="travel-footer">
      <div className="container travel-footer-grid">
        <div>
          <div className="travel-footer-brand">
            <span className="travel-brand-mark">PB</span>
            <div>
              <h2>Pure Bhutan Travel</h2>
              <p>Travel & Tours</p>
            </div>
          </div>

          <p>
            Thoughtfully designed journeys across Bhutan, including cultural
            tours, hotels, restaurants, local experiences, and guided travel
            support.
          </p>
        </div>

        <div>
          <h3>Explore</h3>
          <Link href="/packages">Tour Packages</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/hotels">Partner Hotels</Link>
          <Link href="/restaurants">Restaurants</Link>
        </div>

        <div>
          <h3>Contact</h3>
          <p>Bhutan</p>
          <p>Email: hello@purebhutantravel.com</p>
          <p>WhatsApp: +975 17 000 000</p>
        </div>
      </div>

      <div className="travel-footer-bottom">
        <p>© 2026 Pure Bhutan Travel. All rights reserved.</p>
      </div>
    </footer>
  );
}