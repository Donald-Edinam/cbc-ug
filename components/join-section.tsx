"use client";

import { perks } from "@/data/site-data";
import styles from "@/styles/page.module.css";

export default function JoinSection() {
  return (
    <section className={styles.section} id="join">
      <div className={styles.joinSection} data-gsap="join-section">
        <div className={styles.joinInnerCentered}>
          <p className={styles.joinLabel} data-gsap="join-item">
            Join Us
          </p>

          <h2 className={styles.joinTitle} data-gsap="join-item">
            Ready to build
            <br />
            something great?
          </h2>

          <p className={styles.joinDesc} data-gsap="join-item">
            Whether you&apos;re a first-year curious about AI or a final-year
            building production apps — there&apos;s a seat at the table for you.
            No experience required, just bring your curiosity.
          </p>

          <div className={styles.joinPerksRow} data-gsap="join-item">
            {perks.map((perk) => (
              <div key={perk} className={styles.perkItem}>
                <span className={styles.perkIcon}>&#x2713;</span>
                {perk}
              </div>
            ))}
          </div>

          <div className={styles.joinCtaWrap} data-gsap="join-item">
            <a
              href="https://www.jotform.com/253555944387168"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.joinCtaBtn}
            >
              Join the Builders&apos; Club <span>&rarr;</span>
            </a>
            <p className={styles.joinNote}>
              Free to join &middot; Open to all UG students
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
