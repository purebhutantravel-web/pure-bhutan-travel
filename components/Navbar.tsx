"use client";

import Link from "next/link";
import { useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="travel-header">
      <nav className="container travel-navbar">
        <Link href="/" className="travel-brand" onClick={() => setMenuOpen(false)}>
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

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-panel">
            <div className="mobile-menu-top">
              <Link
                href="/"
                className="travel-brand"
                onClick={() => setMenuOpen(false)}
              >
                <span className="travel-brand-mark">PB</span>
                <span>
                  <strong>Pure Bhutan</strong>
                  <small>Travel & Tours</small>
                </span>
              </Link>

              <button
                type="button"
                className="mobile-menu-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            <div className="mobile-menu-links">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              href="/contact"
              className="mobile-menu-cta"
              onClick={() => setMenuOpen(false)}
            >
              Plan My Trip
            </Link>

            <p className="mobile-menu-note">
              Thoughtful Bhutan journeys through culture, nature, and mindful
              travel.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}