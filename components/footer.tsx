import { navLinks } from "@/data/site-data";
import styles from "@/styles/page.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerInner}>
          <div>
            <div className={styles.footerBrand}>
              <span className={styles.brandIcon}>CB</span>
              <span>Claude Builders&apos; Club</span>
            </div>
            <p className={styles.footerTagline}>
              A student community at the University of Ghana building with AI,
              powered by Claude and Anthropic.
            </p>
          </div>
          <div className={styles.footerLinks}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <a href="#join">Join</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span className={styles.footerCopy}>
            &copy; {new Date().getFullYear()} Claude Builders&apos; Club,
            University of Ghana. All rights reserved.
          </span>
          <span className={styles.footerBuilt}>Built with ♥ using Claude &amp; Anthropic</span>
        </div>
      </div>
    </footer>
  );
}
