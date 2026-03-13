"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { SunIcon, MoonIcon } from "./icons";
import { navLinks } from "@/data/site-data";
import styles from "@/styles/page.module.css";

export default function Navbar() {
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.pageYOffset > 20);

      const sections = document.querySelectorAll("section[id]");
      const scrollY = window.pageYOffset + 100;
      sections.forEach((section) => {
        const el = section as HTMLElement;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          setActiveSection(el.id);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMobile = () => setMenuOpen(false);

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${pathname === "/hackathon" && !scrolled ? styles.navbarImmersive : ""}`}>
        <div className={styles.navbarInner}>
          <a href="#hero" className={styles.navbarBrand}>
            <span className={styles.brandIcon}>CBC</span>
            <span className={styles.brandText}>
              <span className={styles.brandName}>Claude Builders&apos; Club</span>
              <span className={styles.brandSub}>University of Ghana Chapter</span>
            </span>
          </a>

          <ul className={styles.navbarLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={
                    activeSection === link.href.slice(1) ? styles.active : ""
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.navCtaWrap}>
            <a href="/register" className={styles.navCta}>
              Join the Club
            </a>
          </div>

          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {mounted && (theme === "dark" ? <MoonIcon /> : <SunIcon />)}
          </button>

          <button
            className={`${styles.menuToggle} ${menuOpen ? styles.menuOpen : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={styles.mobileLink}
            onClick={closeMobile}
          >
            {link.label}
          </a>
        ))}
        <a
          href="/register"
          className={`${styles.mobileLink} ${styles.mobileCta}`}
          onClick={closeMobile}
        >
          Join the Club
        </a>
      </div>
    </>
  );
}
