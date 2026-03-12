"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import styles from "@/styles/page.module.css";

const HACKATHON_DATE = new Date("2026-03-28T08:00:00");

function getTimeLeft() {
  const diff = HACKATHON_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function HackathonBanner() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className={styles.hackathonBanner} id="hackathon" data-gsap="hackathon-banner">
      <div className={styles.container}>
        <div className={styles.hackathonInner}>

          <div className={styles.hackathonMeta}>
            <span className={styles.hackathonPill}>First Hackathon</span>
            <h2 className={styles.hackathonTitle}>BuildAI Hackathon</h2>

            <div className={styles.hackathonInfoRow}>
              <p className={styles.hackathonDate}>
                <CalendarDays size={15} strokeWidth={1.8} />
                28 March 2026
              </p>
              <span className={styles.hackathonInfoDot}>·</span>
              <p className={styles.hackathonDate}>
                <MapPin size={15} strokeWidth={1.8} />
                University of Ghana, Legon
              </p>
            </div>

            <p className={styles.hackathonThemeLine}>
              Theme: <span className={styles.hackathonThemeValue}>Build AI for Human Flourishing</span>
            </p>
            <p className={styles.hackathonDesc}>
              CBC-UG&apos;s first-ever hackathon — 24 hours to ideate, build, and ship
              an AI-powered solution to a real-world problem. Open to all UG students,
              all skill levels welcome.
            </p>
            <div className={styles.hackathonCtaRow}>
              <a
                href="https://www.jotform.com/253555944387168"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.hackathonCta}
              >
                Register Now <ArrowRight size={16} strokeWidth={2} />
              </a>
              <a href="/hackathon" className={styles.hackathonLink}>
                See full details <ArrowRight size={13} strokeWidth={2} />
              </a>
            </div>
          </div>

          <div className={styles.hackathonCountdown}>
            <p className={styles.countdownLabel}>Countdown to Hackathon</p>
            <div className={styles.countdownGrid}>
              {timeLeft ? (
                <>
                  <div className={styles.countdownUnit}>
                    <span className={styles.countdownNum}>{String(timeLeft.days).padStart(2, "0")}</span>
                    <span className={styles.countdownTick}>Days</span>
                  </div>
                  <div className={styles.countdownSep}>:</div>
                  <div className={styles.countdownUnit}>
                    <span className={styles.countdownNum}>{String(timeLeft.hours).padStart(2, "0")}</span>
                    <span className={styles.countdownTick}>Hours</span>
                  </div>
                  <div className={styles.countdownSep}>:</div>
                  <div className={styles.countdownUnit}>
                    <span className={styles.countdownNum}>{String(timeLeft.minutes).padStart(2, "0")}</span>
                    <span className={styles.countdownTick}>Mins</span>
                  </div>
                  <div className={styles.countdownSep}>:</div>
                  <div className={styles.countdownUnit}>
                    <span className={styles.countdownNum}>{String(timeLeft.seconds).padStart(2, "0")}</span>
                    <span className={styles.countdownTick}>Secs</span>
                  </div>
                </>
              ) : (
                <p className={styles.countdownOver}>It&apos;s happening now!</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
