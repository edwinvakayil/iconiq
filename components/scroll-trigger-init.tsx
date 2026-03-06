"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_SELECTOR = "[data-gsap-scroll]";

const defaultScrollVars = {
  y: 28,
  opacity: 0,
  duration: 0.55,
  ease: "power2.out",
  scrollTrigger: {
    start: "top 88%",
    end: "bottom 12%",
    toggleActions: "play none none none",
  },
};

export function ScrollTriggerInit() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(SCROLL_SELECTOR);
    if (els.length === 0) return;

    const triggers: ScrollTrigger[] = [];

    els.forEach((el) => {
      const delay = parseFloat(el.dataset.gsapDelay ?? "0");
      const y = parseFloat(el.dataset.gsapY ?? String(defaultScrollVars.y));
      const duration = parseFloat(
        el.dataset.gsapDuration ?? String(defaultScrollVars.duration)
      );

      const t = gsap.from(el, {
        y,
        opacity: 0,
        duration,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 15%",
          toggleActions: "play none none none",
        },
      });

      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    });

    return () => {
      triggers.forEach((st) => st.kill());
      gsap.killTweensOf(SCROLL_SELECTOR);
    };
  }, []);

  return null;
}
