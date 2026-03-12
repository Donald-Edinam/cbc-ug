"use client";

import { RevealWrapper } from "@/lib/use-reveal";
import styles from "@/styles/page.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <RevealWrapper className={styles.heroEyebrow}>
            University of Ghana
          </RevealWrapper>

          <RevealWrapper as="h1" delay={1}>
            Building with AI,
            <br />
            <span className={styles.highlight}>together.</span>
          </RevealWrapper>

          <RevealWrapper as="p" delay={2} className={styles.heroSub}>
            We&apos;re a community of builders, thinkers, and creators at the
            University of Ghana — exploring the frontier of AI through hands-on
            projects, workshops, and collaboration with Claude and Anthropic.
          </RevealWrapper>

          <RevealWrapper delay={3} className={styles.heroActions}>
            <a href="#join" className={styles.btnPrimary}>
              Join the Club <span>&rarr;</span>
            </a>
            <a href="#projects" className={styles.btnSecondary}>
              See Our Work
            </a>
          </RevealWrapper>
        </div>
      </div>

      <div className={styles.heroScrollHint}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
