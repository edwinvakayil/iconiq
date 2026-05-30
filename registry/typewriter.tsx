"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { useResolvedReducedMotion } from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

export interface TextTypewriterProps {
  children: string;
  className?: string;
  duration?: number;
}

const WRONG_CHARS = "!@#$%^&*()QWERTY";

function randomWrongChar() {
  return WRONG_CHARS[Math.floor(Math.random() * WRONG_CHARS.length)];
}

export default function TextTypewriter({
  children,
  className,
  duration = 3,
}: TextTypewriterProps) {
  const reducedMotion = useResolvedReducedMotion();
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setText(children);
      setShowCursor(false);
      return;
    }

    const timeouts = new Set<ReturnType<typeof setTimeout>>();
    const speed = duration / 3;

    const schedule = (callback: () => void, ms: number) => {
      const id = setTimeout(callback, ms * speed);
      timeouts.add(id);
    };

    const runAnimation = () => {
      let currentText = "";
      let targetIndex = 0;
      const finalText = children;

      const typeChar = () => {
        if (targetIndex >= finalText.length) {
          setText(finalText);
          setShowCursor(false);
          schedule(() => {
            setShowCursor(true);
            runAnimation();
          }, 1000);
          return;
        }

        const targetChar = finalText[targetIndex];
        const shouldGlitch = Math.random() > 0.6 && targetChar !== " ";

        if (shouldGlitch) {
          currentText += randomWrongChar();
          setText(currentText);

          schedule(
            () => {
              currentText = currentText.slice(0, -1);
              setText(currentText);

              schedule(() => {
                if (Math.random() > 0.5) {
                  currentText += randomWrongChar();
                  setText(currentText);

                  schedule(() => {
                    currentText = currentText.slice(0, -1);
                    setText(currentText);

                    schedule(() => {
                      currentText += targetChar;
                      setText(currentText);
                      targetIndex++;
                      schedule(typeChar, 50 + Math.random() * 100);
                    }, 80);
                  }, 120);
                } else {
                  currentText += targetChar;
                  setText(currentText);
                  targetIndex++;
                  schedule(typeChar, 50 + Math.random() * 100);
                }
              }, 80);
            },
            100 + Math.random() * 150
          );
        } else {
          currentText += targetChar;
          setText(currentText);
          targetIndex++;
          schedule(typeChar, 40 + Math.random() * 80);
        }
      };

      setText("");
      setShowCursor(true);
      schedule(typeChar, 500);
    };

    runAnimation();

    return () => {
      for (const id of timeouts) {
        clearTimeout(id);
      }
      timeouts.clear();
    };
  }, [children, duration, reducedMotion]);

  return (
    <div className={cn(className)}>
      <span aria-live="polite">
        {text}
        {showCursor ? (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            aria-hidden
            transition={{
              duration: 0.8,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            |
          </motion.span>
        ) : null}
      </span>
    </div>
  );
}
