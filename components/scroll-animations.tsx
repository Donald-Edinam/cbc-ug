"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ── 1. Hero entrance (immediate, staggered timeline) ────────────────
      const heroTl = gsap.timeline({ delay: 0.1 });

      heroTl
        .fromTo(
          '[data-gsap="hero-eyebrow"]',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" }
        )
        .fromTo(
          '[data-gsap="hero-line"]',
          { y: 64, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.13,
            ease: "power4.out",
          },
          "-=0.45"
        )
        .fromTo(
          '[data-gsap="hero-sub"]',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          '[data-gsap="hero-actions"] > *',
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .fromTo(
          '[data-gsap="hero-badge"] > *',
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.3"
        );

      // ── 2. Section labels (slide in from left) ──────────────────────────
      document.querySelectorAll('[data-gsap="section-label"]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      // ── 3. Section titles (slide up) ────────────────────────────────────
      document.querySelectorAll('[data-gsap="section-title"]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      // ── 4. Section descriptions ─────────────────────────────────────────
      document.querySelectorAll('[data-gsap="section-desc"]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      // ── 5. Card groups (staggered reveal with scale) ────────────────────
      document.querySelectorAll('[data-gsap="card-group"]').forEach((group) => {
        const cards = group.querySelectorAll('[data-gsap="card"]');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 48, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.78,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 83%", once: true },
          }
        );
      });

      // ── 6. Stat counters (count up on scroll) ───────────────────────────
      document.querySelectorAll('[data-gsap="counter"]').forEach((el) => {
        const target = parseInt(el.getAttribute("data-count") ?? "0", 10);
        const suffix = el.getAttribute("data-suffix") ?? "";
        const obj = { val: 0 };

        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              val: target,
              duration: 2.4,
              ease: "power2.out",
              onUpdate() {
                el.textContent = Math.round(obj.val) + suffix;
              },
            });
          },
        });
      });

      // ── 7. About text paragraphs ────────────────────────────────────────
      document.querySelectorAll('[data-gsap="about-p"]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.78,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      // ── 8. Join dark section (scale + fade + inner stagger) ─────────────
      const joinEl = document.querySelector('[data-gsap="join-section"]');
      if (joinEl) {
        const joinTl = gsap.timeline({
          scrollTrigger: { trigger: joinEl, start: "top 80%", once: true },
        });

        joinTl
          .fromTo(
            joinEl,
            { opacity: 0, y: 40, scale: 0.975 },
            { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out" }
          )
          .fromTo(
            joinEl.querySelectorAll('[data-gsap="join-item"]'),
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: "power3.out",
            },
            "-=0.6"
          );
      }

      // ── 9. Footer fade in ────────────────────────────────────────────────
      const footerEl = document.querySelector('[data-gsap="footer"]');
      if (footerEl) {
        gsap.fromTo(
          footerEl,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: footerEl, start: "top 92%", once: true },
          }
        );
      }
    });

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
