"use client";

import Link from "next/link";
import { RevealWrapper } from "@/lib/use-reveal";
import { perks } from "@/data/site-data";
import styles from "@/styles/page.module.css";

export default function JoinSection() {
  return (
    <section className={styles.section} id="join">
      <div className={styles.joinSection}>
        <div className={styles.joinInnerCentered}>
          <RevealWrapper
            className={styles.joinLabel}
            style={{ justifyContent: "center" }}
          >
            Join Us
          </RevealWrapper>

          <RevealWrapper as="h2" delay={1} className={styles.joinTitle}>
            Ready to build
            <br />
            something great?
          </RevealWrapper>

          <RevealWrapper as="p" delay={2} className={styles.joinDesc}>
            Whether you&apos;re a first-year curious about AI or a final-year
            building production apps — there&apos;s a seat at the table for you.
            No experience required, just bring your curiosity.
          </RevealWrapper>

          <RevealWrapper delay={3} className={styles.joinPerksRow}>
            {perks.map((perk) => (
              <div key={perk} className={styles.perkItem}>
                <span className={styles.perkIcon}>&#x2713;</span>
                {perk}
              </div>
            ))}
          </RevealWrapper>

          <RevealWrapper delay={3} className={styles.joinCtaWrap}>
            <Link href="/join" className={styles.joinCtaBtn}>
              Join the Builders&apos; Club <span>&rarr;</span>
            </Link>
          </RevealWrapper>
        </div>
      </div>
    </section>
  );
}
