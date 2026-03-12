"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/hackathon.module.css";

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

export default function HackathonCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft) {
    return <p className={styles.countdownOver}>It&apos;s happening now!</p>;
  }

  return (
    <div>
      <p className={styles.countdownLabel}>Countdown to Hackathon</p>
      <div className={styles.countdownWidget}>
        <div className={styles.countdownUnit}>
          <span className={styles.countdownNum}>
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span className={styles.countdownTick}>Days</span>
        </div>
        <div className={styles.countdownSep}>:</div>
        <div className={styles.countdownUnit}>
          <span className={styles.countdownNum}>
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className={styles.countdownTick}>Hours</span>
        </div>
        <div className={styles.countdownSep}>:</div>
        <div className={styles.countdownUnit}>
          <span className={styles.countdownNum}>
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className={styles.countdownTick}>Mins</span>
        </div>
        <div className={styles.countdownSep}>:</div>
        <div className={styles.countdownUnit}>
          <span className={styles.countdownNum}>
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className={styles.countdownTick}>Secs</span>
        </div>
      </div>
    </div>
  );
}
