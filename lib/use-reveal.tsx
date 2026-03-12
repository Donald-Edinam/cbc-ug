"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
  type CSSProperties,
  type ComponentPropsWithoutRef,
} from "react";

export function useReveal(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

interface RevealWrapperProps {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
}

export function RevealWrapper({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  style,
}: RevealWrapperProps) {
  const { ref, isVisible } = useReveal();
  const delayClass = delay > 0 ? ` reveal-delay-${delay}` : "";

  return (
    <Tag
      ref={ref}
      className={`reveal${delayClass}${isVisible ? " visible" : ""} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}
