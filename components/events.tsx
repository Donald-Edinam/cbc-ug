"use client";

import { RevealWrapper } from "@/lib/use-reveal";
import { events } from "@/data/site-data";
import styles from "@/styles/page.module.css";

export default function Events() {
  return (
    <section className={styles.section} id="events">
      <div className={styles.container}>
        <RevealWrapper className={styles.sectionLabel}>
          Events &amp; Meetings
        </RevealWrapper>
        <RevealWrapper as="h2" delay={1} className={styles.sectionTitle}>
          What&apos;s happening
        </RevealWrapper>
        <RevealWrapper as="p" delay={2} className={styles.sectionDesc}>
          From intro workshops to advanced build sprints, there&apos;s always
          something going on. Join us and level up your AI skills.
        </RevealWrapper>

        <div className={styles.eventsGrid}>
          {events.map((event, i) => (
            <RevealWrapper
              key={event.title}
              delay={Math.min(i % 3, 3) as 0 | 1 | 2 | 3}
              className={styles.eventCard}
            >
              <div className={styles.eventDate}>
                <span className={styles.dot} /> {event.date}
              </div>
              <div className={styles.eventTitle}>{event.title}</div>
              <div className={styles.eventDesc}>{event.desc}</div>
              <span className={styles.eventTag}>{event.tag}</span>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
