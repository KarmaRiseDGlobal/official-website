import Image from "next/image";
import Link from "next/link";

const email = "hola@karmarisedglobal.com";

// Platform marks from Simple Icons.
const socialPlatforms = [
  { name: "WhatsApp", icon: "whatsapp" },
  { name: "Instagram", icon: "instagram" },
  { name: "TikTok", icon: "tiktok" },
  { name: "YouTube", icon: "youtube" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <Image
            className="footer-logo"
            src="/brand/main-logo-transparent.png"
            alt="KarmaRise D Global"
            width={701}
            height={815}
            sizes="(max-width: 44rem) 112px, (max-width: 80rem) 12vw, 154px"
          />
          <p>Your product, carried through.</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <div className="footer-link-group">
            <h2 className="footer-group-heading">Manufacturing</h2>
            <Link href="/manufacturing-programme">Manufacturing Programme</Link>
            <Link href="/working-across-distance">Working across distance</Link>
            <Link href="/about">About</Link>
            <Link href="/stories">Stories</Link>
            <Link href="/product-brief">Start a Product Brief</Link>
          </div>
          <div className="footer-link-group">
            <h2 className="footer-group-heading">Company and legal</h2>
            <Link href="/almarise">Almarise</Link>
            <Link href="/womens-training-initiative">
              Women&apos;s Training Initiative
            </Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy-policy">Privacy policy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </nav>

        <div className="footer-contact">
          <h2>Contact</h2>
          <address>
            <a
              className="underline"
              href="https://www.google.com/maps/place/Guru+Charan/@19.2324905,73.1534675,49m/data=!3m1!1e3!4m6!3m5!1s0x3be7943c1ba890cf:0x3c332f2cfae05f64!8m2!3d19.2325!4d73.1536!16s%2Fg%2F1pyqv_7by?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D"
            >
              2nd floor, Guru Charan Apartment
              <br />
              Ulhasnagar, Maharashtra, India, 421002
            </a>
            <a className="underline" href={`mailto:${email}`}>
              {email}
            </a>
            <a className="underline" href="tel:+918530009798">
              +91 8530009798
            </a>
            <a className="underline" href="tel:+34611722276">
              +34 611722276
            </a>
          </address>
          <ul
            className="footer-channels"
            aria-label="Contact and social channels"
            role="list"
          >
            <li>
              <a
                className="footer-channel"
                href={`mailto:${email}`}
                aria-label="Email"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </a>
            </li>
            {socialPlatforms.map(({ name, icon }) => (
              <li key={icon}>
                <span className="footer-channel" role="img" aria-label={name}>
                  <span
                    className="footer-channel-icon"
                    style={{ maskImage: `url(/brand/icons/${icon}.svg)` }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
