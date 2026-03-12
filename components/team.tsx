"use client";

import Image from "next/image";
import { team } from "@/data/site-data";
import type { TeamMember } from "@/data/types";
import { LinkedInIcon, GitHubIcon } from "./icons";
import styles from "@/styles/page.module.css";

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className={styles.teamCard} data-gsap="card">
      <div className={styles.teamCardImg}>
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 900px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className={styles.imgPlaceholder}>{member.initials}</div>
        )}
      </div>
      <div className={styles.teamCardBody}>
        <div className={styles.teamName}>{member.name}</div>
        <div className={styles.teamRole}>{member.role}</div>
        <div className={styles.teamBio}>{member.bio}</div>
        <div className={styles.teamSocials}>
          {member.linkedin && (
            <a
              href={member.linkedin}
              className={styles.teamSocialLink}
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon />
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              className={styles.teamSocialLink}
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <section className={styles.section} id="team">
      <div className={styles.container}>
        <p className={styles.sectionLabel} data-gsap="section-label">
          Leadership Team
        </p>
        <h2 className={styles.sectionTitle} data-gsap="section-title">
          The people behind the club
        </h2>
        <p className={styles.sectionDesc} data-gsap="section-desc">
          A cross-disciplinary team of students passionate about AI, building
          useful things, and growing a community that lasts.
        </p>

        <div className={styles.teamGrid} data-gsap="card-group">
          {team.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
