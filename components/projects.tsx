"use client";

import { projects } from "@/data/site-data";
import type { TagVariant } from "@/data/types";
import styles from "@/styles/page.module.css";

const tagClass: Record<TagVariant, string> = {
  ai: styles.tagAi,
  web: styles.tagWeb,
  hack: styles.tagHack,
  data: styles.tagData,
  mobile: styles.tagMobile,
};

export default function Projects() {
  return (
    <section className={styles.section} id="projects">
      <div className={styles.container}>
        <p className={styles.sectionLabel} data-gsap="section-label">
          Projects Showcase
        </p>
        <h2 className={styles.sectionTitle} data-gsap="section-title">
          Things we&apos;ve built
        </h2>
        <p className={styles.sectionDesc} data-gsap="section-desc">
          From hackathon prototypes to deployed apps — here&apos;s a look at
          what our members are shipping with Claude.
        </p>

        <div className={styles.projectsGrid} data-gsap="card-group">
          {projects.map((project) => (
            <div
              key={project.title}
              className={styles.projectCard}
              data-gsap="card"
            >
              <span className={styles.projectNumber}>{project.number}</span>
              <div className={styles.projectTitle}>{project.title}</div>
              <div className={styles.projectDesc}>{project.desc}</div>
              <div className={styles.projectTags}>
                {project.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`${styles.projectTag} ${tagClass[tag.variant] ?? ""}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
