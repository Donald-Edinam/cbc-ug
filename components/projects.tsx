"use client";

import { RevealWrapper } from "@/lib/use-reveal";
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
        <RevealWrapper className={styles.sectionLabel}>
          Projects Showcase
        </RevealWrapper>
        <RevealWrapper as="h2" delay={1} className={styles.sectionTitle}>
          Things we&apos;ve built
        </RevealWrapper>
        <RevealWrapper as="p" delay={2} className={styles.sectionDesc}>
          From hackathon prototypes to deployed apps — here&apos;s a look at
          what our members are shipping with Claude.
        </RevealWrapper>

        <div className={styles.projectsGrid}>
          {projects.map((project, i) => (
            <RevealWrapper
              key={project.title}
              delay={Math.min(i + 1, 3) as 1 | 2 | 3}
              className={styles.projectCard}
            >
              <span className={styles.projectNumber}>{project.number}</span>
              <div className={styles.projectTitle}>{project.title}</div>
              <div className={styles.projectDesc}>{project.desc}</div>
              <div className={styles.projectTags}>
                {project.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`${styles.projectTag} ${tagClass[tag.variant] || ""}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
