"use client";

import { events } from "@/data/site-data";
import styles from "@/styles/page.module.css";

export default function Events() {
  return (
    <section className={styles.section} id="events">
      <div className={styles.container}>
        <p className={styles.sectionLabel} data-gsap="section-label">
          Events &amp; Meetings
        </p>
        <h2 className={styles.sectionTitle} data-gsap="section-title">
          What&apos;s happening
        </h2>
        <p className={styles.sectionDesc} data-gsap="section-desc">
          From intro workshops to advanced build sprints, there&apos;s always
          something going on. Join us and level up your AI skills.
        </p>

        <div className={styles.eventsGrid} data-gsap="card-group">
          {events.map((event) => (
            <div key={event.title} className={styles.eventCard} data-gsap="card">
              <div className={styles.eventDate}>
                <span className={styles.dot} /> {event.date}
              </div>
              <div className={styles.eventTitle}>{event.title}</div>
              <div className={styles.eventDesc}>{event.desc}</div>
              <span className={styles.eventTag}>{event.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
