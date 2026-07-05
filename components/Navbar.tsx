import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Packages", href: "/packages" },
  { label: "Gallery", href: "/gallery" },
  { label: "Hotels", href: "/hotels" },
  { label: "Restaurants", href: "/restaurants" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="travel-header">
      <nav className="container travel-navbar">
        <Link href="/" className="travel-brand">
          <span className="travel-brand-mark">PB</span>
          <span>
            <strong>Pure Bhutan</strong>
            <small>Travel & Tours</small>
          </span>
        </Link>

        <div className="travel-nav-links">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <Link href="/contact" className="travel-nav-cta">
          Plan My Trip
        </Link>
      </nav>
    </header>
  );
}