"use client";

import { stats } from "@/data/site-data";
import styles from "@/styles/page.module.css";

export default function About() {
  return (
    <section className={styles.section} id="about">
      <div className={styles.container}>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutText}>
            <p className={styles.sectionLabel} data-gsap="section-label">
              About Us
            </p>
            <h2 className={styles.sectionTitle} data-gsap="section-title">
              Where curiosity
              <br />
              meets creation
            </h2>
            <p data-gsap="about-p">
              The Claude Builders&apos; Club is the University of Ghana&apos;s
              home for AI exploration. We bring together students from computer
              science, engineering, business, the humanities, and beyond to
              learn, build, and ship real projects powered by Claude and
              Anthropic&apos;s tools.
            </p>
            <p data-gsap="about-p">
              Whether you&apos;re writing your first prompt or deploying
              production AI applications, our community meets you where you are.
              We host weekly workshops, hackathons, and collaborative build
              sessions — all grounded in Anthropic&apos;s mission of building AI
              that is safe, beneficial, and understandable.
            </p>
          </div>

          <div
            className={styles.aboutStats}
            data-gsap="card-group"
          >
            {stats.map((stat) => {
              const numericPart = stat.number.replace(/\D/g, "");
              const suffix = stat.number.replace(/\d/g, "");
              return (
                <div key={stat.label} className={styles.statCard} data-gsap="card">
                  <div
                    className={styles.statNumber}
                    data-gsap="counter"
                    data-count={numericPart}
                    data-suffix={suffix}
                  >
                    {stat.number}
                  </div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
