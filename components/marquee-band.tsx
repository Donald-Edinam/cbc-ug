import styles from "@/styles/page.module.css";

const items = [
  "Prompt Engineering",
  "AI Hackathons",
  "Claude API",
  "Weekly Build Sessions",
  "Real Projects",
  "Community",
  "Anthropic Partnership",
  "Demo Days",
  "Mentorship",
  "Open to All UG Students",
];

export default function MarqueeBand() {
  const doubled = [...items, ...items];

  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.marqueeTrack}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.marqueeItem}>
            {item}
            <span className={styles.marqueeAccent}>&nbsp;·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
