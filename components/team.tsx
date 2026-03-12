"use client";

import Image from "next/image";
import { RevealWrapper } from "@/lib/use-reveal";
import { team } from "@/data/site-data";
import type { TeamMember } from "@/data/types";
import { LinkedInIcon, GitHubIcon } from "./icons";
import styles from "@/styles/page.module.css";

interface TeamCardProps {
  member: TeamMember;
  delay: 0 | 1 | 2 | 3 | 4;
}

function TeamCard({ member, delay }: TeamCardProps) {
  return (
    <RevealWrapper delay={delay} className={styles.teamCard}>
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
    </RevealWrapper>
  );
}

export default function Team() {
  return (
    <section className={styles.section} id="team">
      <div className={styles.container}>
        <RevealWrapper className={styles.sectionLabel}>
          Leadership Team
        </RevealWrapper>
        <RevealWrapper as="h2" delay={1} className={styles.sectionTitle}>
          The people behind the club
        </RevealWrapper>
        <RevealWrapper as="p" delay={2} className={styles.sectionDesc}>
          A cross-disciplinary team of students passionate about AI, building
          useful things, and growing a community that lasts.
        </RevealWrapper>

        <div className={styles.teamGrid}>
          {team.map((member, i) => (
            <TeamCard
              key={member.name}
              member={member}
              delay={Math.min((i % 4) + 1, 4) as 1 | 2 | 3 | 4}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
