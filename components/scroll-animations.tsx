"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Heuristic low-end device check */
function isLowEnd(): boolean {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 8;
  const mem = (navigator as any).deviceMemory ?? 8;
  return cores <= 4 || mem <= 2;
}

/** Animation parameters — simplified on low-end hardware */
function cfg(low: boolean) {
  return {
    heroLineY:   low ? 28 : 64,
    heroLineDur: low ? 0.55 : 1.1,
    heroDur:     low ? 0.45 : 0.75,
    scrollDur:   low ? 0.45 : 0.85,
    cardDur:     low ? 0.4  : 0.78,
    cardY:       low ? 20   : 48,
    cardScale:   low ? 1    : 0.96,  // skip scale on low-end (saves repaints)
    stagger:     low ? 0.05 : 0.09,
    counterDur:  low ? 1.2  : 2.4,
    ease:        low ? "power2.out" : "power3.out",
    joinScale:   low ? 1    : 0.975,
  };
}

export default function ScrollAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const low = isLowEnd();
    const c   = cfg(low);

    /**
     * gsap.matchMedia handles prefers-reduced-motion natively.
     * The "reduce" branch instantly reveals every element so no content
     * is ever stuck invisible on assistive-tech / battery-saver devices.
     */
    const mm = gsap.matchMedia();

    // ── Reduced motion: reveal everything immediately ──────────────────
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-gsap]", { opacity: 1, y: 0, x: 0, scale: 1 });
      gsap.set("[data-gsap]", { clearProps: "willChange" });
      return () => {};
    });

    // ── Full animations ────────────────────────────────────────────────
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {

        // Prime GPU for hero elements before the timeline plays
        gsap.set(
          '[data-gsap="hero-eyebrow"],[data-gsap="hero-line"],' +
          '[data-gsap="hero-sub"],[data-gsap="hero-actions"],[data-gsap="hero-badge"]',
          { willChange: "transform, opacity" }
        );

        // ── 1. Hero entrance timeline ────────────────────────────────
        const heroTl = gsap.timeline({
          delay: 0.1,
          onComplete() {
            // Free GPU memory once hero finishes
            gsap.set(
              '[data-gsap="hero-eyebrow"],[data-gsap="hero-line"],' +
              '[data-gsap="hero-sub"],[data-gsap="hero-actions"],[data-gsap="hero-badge"]',
              { clearProps: "willChange" }
            );
          },
        });

        heroTl
          .fromTo(
            '[data-gsap="hero-eyebrow"]',
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: c.heroDur, ease: c.ease }
          )
          .fromTo(
            '[data-gsap="hero-line"]',
            { y: c.heroLineY, opacity: 0 },
            { y: 0, opacity: 1, duration: c.heroLineDur, stagger: 0.13, ease: "power4.out" },
            "-=0.45"
          )
          .fromTo(
            '[data-gsap="hero-sub"]',
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: c.scrollDur, ease: c.ease },
            "-=0.4"
          )
          .fromTo(
            '[data-gsap="hero-actions"]',
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6, ease: c.ease },
            "-=0.4"
          )
          .fromTo(
            '[data-gsap="hero-badge"]',
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5, ease: c.ease },
            "-=0.3"
          );

        // ── 2. Section labels (slide from left) ──────────────────────
        document.querySelectorAll('[data-gsap="section-label"]').forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, x: low ? 0 : -18 },
            {
              opacity: 1, x: 0, duration: 0.6, ease: c.ease,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
          );
        });

        // ── 3. Section titles ─────────────────────────────────────────
        document.querySelectorAll('[data-gsap="section-title"]').forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, y: 28 },
            {
              opacity: 1, y: 0, duration: c.scrollDur, ease: c.ease,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
          );
        });

        // ── 4. Section descriptions ───────────────────────────────────
        document.querySelectorAll('[data-gsap="section-desc"]').forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, y: 18 },
            {
              opacity: 1, y: 0, duration: 0.7, ease: c.ease,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
          );
        });

        // ── 5. Card stagger groups ────────────────────────────────────
        document.querySelectorAll('[data-gsap="card-group"]').forEach((group) => {
          const cards = group.querySelectorAll('[data-gsap="card"]');
          gsap.fromTo(cards,
            { opacity: 0, y: c.cardY, scale: c.cardScale },
            {
              opacity: 1, y: 0, scale: 1,
              duration: c.cardDur, stagger: c.stagger, ease: c.ease,
              scrollTrigger: { trigger: group, start: "top 84%", once: true },
            }
          );
        });

        // ── 6. Stat counters ──────────────────────────────────────────
        document.querySelectorAll('[data-gsap="counter"]').forEach((el) => {
          const target = parseInt(el.getAttribute("data-count") ?? "0", 10);
          const suffix = el.getAttribute("data-suffix") ?? "";

          // Extremely low memory: skip animation, show final number
          if ((navigator as any).deviceMemory <= 1) {
            el.textContent = target + suffix;
            return;
          }

          const obj = { val: 0 };
          ScrollTrigger.create({
            trigger: el, start: "top 85%", once: true,
            onEnter() {
              gsap.to(obj, {
                val: target, duration: c.counterDur, ease: "power2.out",
                onUpdate() { el.textContent = Math.round(obj.val) + suffix; },
              });
            },
          });
        });

        // ── 7. About paragraphs ───────────────────────────────────────
        document.querySelectorAll('[data-gsap="about-p"]').forEach((el, i) => {
          gsap.fromTo(el,
            { opacity: 0, y: 18 },
            {
              opacity: 1, y: 0, duration: 0.7, delay: i * 0.1, ease: c.ease,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
          );
        });

        // ── 8. Join section ───────────────────────────────────────────
        const joinEl = document.querySelector('[data-gsap="join-section"]');
        if (joinEl) {
          const joinTl = gsap.timeline({
            scrollTrigger: { trigger: joinEl, start: "top 80%", once: true },
          });
          joinTl
            .fromTo(joinEl,
              { opacity: 0, y: 36, scale: c.joinScale },
              { opacity: 1, y: 0, scale: 1, duration: 0.95, ease: c.ease }
            )
            .fromTo(
              joinEl.querySelectorAll('[data-gsap="join-item"]'),
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: c.ease },
              "-=0.55"
            );
        }

        // ── 9. Footer ─────────────────────────────────────────────────
        const footerEl = document.querySelector('[data-gsap="footer"]');
        if (footerEl) {
          gsap.fromTo(footerEl,
            { opacity: 0, y: 18 },
            {
              opacity: 1, y: 0, duration: 0.75, ease: c.ease,
              scrollTrigger: { trigger: footerEl, start: "top 92%", once: true },
            }
          );
        }
      });

      ScrollTrigger.refresh();
      return () => { ctx.revert(); };
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
