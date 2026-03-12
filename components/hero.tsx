"use client";

import styles from "@/styles/page.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <p
            className={styles.heroEyebrow}
            data-gsap="hero-eyebrow"
          >
            University of Ghana
          </p>

          <h1>
            <span className={styles.lineWrap}>
              <span data-gsap="hero-line">Building with AI,</span>
            </span>
            <span className={styles.lineWrap}>
              <span data-gsap="hero-line">
                <span className={styles.highlight}>together.</span>
              </span>
            </span>
          </h1>

          <p className={styles.heroSub} data-gsap="hero-sub">
            We&apos;re a community of builders, thinkers, and creators at the
            University of Ghana — exploring the frontier of AI through hands-on
            projects, workshops, and collaboration with Claude and Anthropic.
          </p>

          <div className={styles.heroActions} data-gsap="hero-actions">
            <a href="#join" className={styles.btnPrimary}>
              Join the Club <span>&rarr;</span>
            </a>
            <a href="#projects" className={styles.btnSecondary}>
              See Our Work
            </a>
          </div>

          <div className={styles.heroBadge} data-gsap="hero-badge">
            <div className={styles.heroBadgeStat}>
              <strong>120+</strong>
              <span>Active members</span>
            </div>
            <div className={styles.heroBadgeStat}>
              <strong>24</strong>
              <span>Projects shipped</span>
            </div>
            <div className={styles.heroBadgeStat}>
              <strong>8</strong>
              <span>Departments</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.heroScrollHint}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
