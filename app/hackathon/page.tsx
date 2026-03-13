import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollAnimations from "@/components/scroll-animations";
import HackathonCountdown from "@/components/hackathon-countdown";
import styles from "@/styles/hackathon.module.css";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Clock,
  Users,
  HeartPulse,
  Brain,
  TrendingUp,
  Scale,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "BuildAI Hackathon — Claude Builders' Club, UG",
  description:
    "CBC-UG's first semester hackathon. 24 hours to build AI-powered solutions inspired by Dario Amodei's vision in Machines of Loving Grace.",
};

const domains = [
  {
    icon: HeartPulse,
    title: "Health & Biology",
    span: "wide" as const,
    desc: "AI could compress a century of medical progress into a decade — eradicating most infectious diseases, reducing cancer rates by 95%, preventing genetic conditions, and potentially doubling healthy human lifespans. Sub-Saharan Africa stands to gain the most from broader access to specialist-level care.",
  },
  {
    icon: Brain,
    title: "Mental Wellness",
    span: "normal" as const,
    desc: "AI-accelerated neuroscience promises real treatments for depression, PTSD, and addiction — reaching anyone with a phone, no specialist required.",
  },
  {
    icon: TrendingUp,
    title: "Economic Empowerment",
    span: "normal" as const,
    desc: "AI adoption could drive 10–20% semester GDP growth in developing nations, bringing hundreds of millions out of poverty faster than any prior era.",
  },
  {
    icon: Scale,
    title: "Democracy & Governance",
    span: "wide" as const,
    desc: "Stronger institutions, fairer legal systems, and countering authoritarian misinformation — Amodei envisions democracies gaining an AI advantage, then distributing it globally to expand the coalition of free, open societies. AI as a safeguard for transparent governance.",
  },
  {
    icon: Sparkles,
    title: "Human Flourishing",
    span: "full" as const,
    desc: "The most speculative — and perhaps the most profound — of Amodei's domains. When AI handles more of our labor, humans are freed for what matters most: relationships, creativity, community, and meaning. A question about what kind of future we actually want to build.",
  },
];

const formatDetails = [
  { icon: Clock, value: "24 Hours", label: "Build Time" },
  { icon: Users, value: "2–4", label: "Team Size" },
  { icon: CalendarDays, value: "28 Mar", label: "Hack Day" },
  { icon: MapPin, value: "UG, Legon", label: "Venue" },
];

export default function HackathonPage() {
  return (
    <>
      <ScrollAnimations />
      <Navbar />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroPill}>
              CBC-UG · First Semester Hackathon
            </div>

            <h1 className={styles.heroTitle}>
              Build AI for
              <br />
              <em>Human Flourishing.</em>
            </h1>

            <p className={styles.heroSub}>
              Inspired by Dario Amodei&apos;s vision in{" "}
              <em>Machines of Loving Grace</em> — 24 hours to ship an
              AI-powered solution to a real problem facing our world.
            </p>

            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}>
                <CalendarDays size={14} strokeWidth={1.8} />
                28 March 2026
              </span>
              <span className={styles.heroMetaDot}>·</span>
              <span className={styles.heroMetaItem}>
                <MapPin size={14} strokeWidth={1.8} />
                University of Ghana, Legon
              </span>
              <span className={styles.heroMetaDot}>·</span>
              <span className={styles.heroMetaItem}>
                <Clock size={14} strokeWidth={1.8} />
                24 Hours
              </span>
            </div>

            <div className={styles.heroActions}>
              <a
                href="/register"
                className={styles.btnPrimary}
              >
                Register Now <ArrowRight size={16} strokeWidth={2} />
              </a>
              <a
                href="https://darioamodei.com/essay/machines-of-loving-grace"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnSecondary}
              >
                Read the Essay <ExternalLink size={14} strokeWidth={2} />
              </a>
            </div>

            <HackathonCountdown />
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* ── The Inspiration ── */}
      <section className={styles.inspirationSection}>
        <div className={styles.container}>
          <div className={styles.inspirationGrid}>
            <div>
              <p className={styles.sectionLabel} data-gsap="section-label">
                The Inspiration
              </p>
              <h2 className={styles.essayTitle} data-gsap="section-title">
                Machines of
                <br />
                Loving Grace
              </h2>
              <p className={styles.essayAuthor}>
                by Dario Amodei, CEO of Anthropic
              </p>

              <div className={styles.essayBody}>
                <p data-gsap="about-p">
                  In late 2024, Dario Amodei — the CEO of Anthropic, the
                  company behind Claude — published an essay unlike any he&apos;d
                  written before.{" "}
                  <em>Machines of Loving Grace</em> is a bold thought
                  experiment: what does the world look like if powerful AI
                  develops safely and is deployed for genuine human benefit? His
                  answer is sweeping, specific, and grounded in science.
                </p>
                <p data-gsap="about-p">
                  His central thesis: AI could compress 50 to 100 years of
                  scientific progress into just 5 to 10 years — not by
                  replacing researchers, but by dramatically multiplying their
                  capabilities. Imagine every scientist, doctor, and policymaker
                  working alongside thousands of brilliant AI collaborators
                  simultaneously. The result: diseases eliminated, mental health
                  crises resolved, and economic development accelerated at a
                  pace that could transform entire continents. Amodei
                  specifically names Sub-Saharan Africa as a region poised for
                  the most dramatic gains.
                </p>
                <p data-gsap="about-p">
                  For us at the University of Ghana, this essay isn&apos;t
                  abstract. The challenges Amodei describes — access to
                  quality healthcare, education, economic opportunity, and fair
                  governance — are ones our communities live with every day.
                  BuildAI is our response: in 24 hours, ship an AI-powered
                  solution to a real problem. The future he imagines won&apos;t
                  build itself — but it might be built by someone in this room.
                </p>
                <a
                  href="https://darioamodei.com/essay/machines-of-loving-grace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.essayReadMore}
                >
                  Read the full essay{" "}
                  <ArrowRight size={14} strokeWidth={2} />
                </a>
              </div>
            </div>

            <div data-gsap="card-group">
              <div className={styles.essayQuoteCard} data-gsap="card">
                <p className={styles.essayQuoteText}>
                  I genuinely believe we may be approaching a moment where many
                  instances of Claude work autonomously in a way that could
                  potentially compress decades of scientific progress into just a
                  few years. Claude agents could run experiments to defeat
                  diseases that have plagued us for millennia, independently
                  develop and test solutions to mental health crises, and
                  actively drive economic growth in a way that could lift
                  billions out of poverty.
                </p>
                <div className={styles.essayQuoteAttrib}>
                  <strong>Dario Amodei</strong>
                  CEO, Anthropic &mdash; Machines of Loving Grace
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* ── Five Domains ── */}
      <section className={styles.domainsSection}>
        <div className={styles.container}>
          <p className={styles.sectionLabel} data-gsap="section-label">
            What Could We Build?
          </p>
          <h2 className={styles.sectionTitle} data-gsap="section-title">
            Five domains to transform
          </h2>

          <div className={styles.domainsGrid} data-gsap="card-group">
            {domains.map((d) => (
              <div
                key={d.title}
                className={[
                  styles.domainCard,
                  d.span === "wide" ? styles.domainCardWide : "",
                  d.span === "full" ? styles.domainCardFull : "",
                ].join(" ")}
                data-gsap="card"
              >
                <div className={styles.domainCardInner}>
                  <div className={styles.domainIconWrap}>
                    <d.icon size={20} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className={styles.domainTitle}>{d.title}</h3>
                    <p className={styles.domainDesc}>{d.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* ── Format ── */}
      <section className={styles.formatSection}>
        <div className={styles.container}>
          <div className={styles.formatHeader}>
            <p className={styles.sectionLabel} data-gsap="section-label">
              The Format
            </p>
            <h2 className={styles.sectionTitle} data-gsap="section-title">
              How it works
            </h2>
          </div>

          <div className={styles.formatGrid} data-gsap="card-group">
            {formatDetails.map((f) => (
              <div key={f.label} className={styles.formatCard} data-gsap="card">
                <div className={styles.formatIconWrap}>
                  <f.icon size={18} strokeWidth={1.8} />
                </div>
                <div className={styles.formatValue}>{f.value}</div>
                <div className={styles.formatLabel}>{f.label}</div>
              </div>
            ))}
          </div>

          <div className={styles.themeAnnounce}>
            <div className={styles.themeAnnounceText}>
              <strong>Build AI for Human Flourishing.</strong>
              Inspired by Dario Amodei&apos;s essay — pick a domain, find a real
              problem, and ship something that matters.
            </div>
            <span className={styles.themeAnnouncePill}>Official Theme</span>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>
              Ready to build
              <br />
              the future?
            </h2>
            <p className={styles.ctaSub}>
              Open to all University of Ghana students — any year, any
              department, any skill level. Bring your curiosity. We&apos;ll
              provide Claude.
            </p>
            <a
              href="https://www.jotform.com/253555944387168"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              Register Now <ArrowRight size={16} strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
