"use client";

import { RevealWrapper } from "@/lib/use-reveal";
import { stats } from "@/data/site-data";
import styles from "@/styles/page.module.css";

export default function About() {
  return (
    <section className={styles.section} id="about">
      <div className={styles.container}>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutText}>
            <RevealWrapper className={styles.sectionLabel}>
              About Us
            </RevealWrapper>
            <RevealWrapper as="h2" delay={1} className={styles.sectionTitle}>
              Where curiosity
              <br />
              meets creation
            </RevealWrapper>
            <RevealWrapper as="p" delay={2}>
              The Claude Builders&apos; Club is the University of Ghana&apos;s
              home for AI exploration. We bring together students from computer
              science, engineering, business, the humanities, and beyond to
              learn, build, and ship real projects powered by Claude and
              Anthropic&apos;s tools.
            </RevealWrapper>
            <RevealWrapper as="p" delay={3}>
              Whether you&apos;re writing your first prompt or deploying
              production AI applications, our community meets you where you are.
              We host weekly workshops, hackathons, and collaborative build
              sessions — all grounded in Anthropic&apos;s mission of building AI
              that is safe, beneficial, and understandable.
            </RevealWrapper>
          </div>

          <RevealWrapper delay={2} className={styles.aboutStats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </RevealWrapper>
        </div>
      </div>
    </section>
  );
}
