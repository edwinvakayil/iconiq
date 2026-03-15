"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type FC, type ReactNode, useState } from "react";

export interface AnimatedTooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
  /** Background color of the tooltip (e.g. "#000000", "rgb(0,0,0)"). Defaults to black. */
  backgroundColor?: string;
  /** Text color (e.g. "#ffffff", "white"). Defaults to white. */
  textColor?: string;
  /** Border color (e.g. "rgba(255,255,255,0.2)"). Optional. */
  borderColor?: string;
}

const sideConfig = {
  top: {
    x: "-50%",
    y: 0,
    origin: { x: 0, y: 10 },
    arrow: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45",
  },
  bottom: {
    x: "-50%",
    y: 0,
    origin: { x: 0, y: -10 },
    arrow: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45",
  },
  left: {
    x: 0,
    y: "-50%",
    origin: { x: 10, y: 0 },
    arrow: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rotate-45",
  },
  right: {
    x: 0,
    y: "-50%",
    origin: { x: -10, y: 0 },
    arrow: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45",
  },
};

const positionClasses = {
  top: "bottom-full left-1/2 mb-3",
  bottom: "top-full left-1/2 mt-3",
  left: "right-full top-1/2 mr-3",
  right: "left-full top-1/2 ml-3",
};

const DEFAULT_BG = "#0a0a0a";
const DEFAULT_TEXT = "#fafafa";
const DEFAULT_BORDER = "rgba(255,255,255,0.12)";

const AnimatedTooltip: FC<AnimatedTooltipProps> = ({
  content,
  children,
  side = "top",
  delayMs = 200,
  backgroundColor = DEFAULT_BG,
  textColor = DEFAULT_TEXT,
  borderColor = DEFAULT_BORDER,
}) => {
  const [open, setOpen] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(
    null
  );

  const config = sideConfig[side];

  const handleEnter = () => {
    const t = setTimeout(() => setOpen(true), delayMs);
    setTimer(t);
  };

  const handleLeave = () => {
    if (timer) clearTimeout(timer);
    setOpen(false);
  };

  const contentStyle = {
    backgroundColor,
    color: textColor,
    borderColor,
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            className={`absolute z-50 ${positionClasses[side]} pointer-events-none`}
            exit={{ opacity: 0, scale: 0.6, ...config.origin }}
            initial={{ opacity: 0, scale: 0.6, ...config.origin }}
            style={{ translateX: config.x, translateY: config.y }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 22,
              mass: 0.8,
            }}
          >
            <div className="relative">
              {/* Arrow (behind content so it doesn't cut into the body) */}
              <div
                className={`absolute z-0 h-2.5 w-2.5 ${config.arrow}`}
                style={{
                  backgroundColor,
                  borderColor,
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
              />
              {/* Content (above arrow so background hides the overlapping part of the diamond) */}
              <div
                className="relative z-10 rounded-lg border px-4 py-2.5 font-medium text-sm shadow-lg"
                style={contentStyle}
              >
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 4 }}
                  transition={{ delay: 0.05, duration: 0.2 }}
                >
                  {content}
                </motion.div>
                {/* Shimmer line (gradient, slowly progressing) */}
                <motion.div
                  className="absolute right-2 bottom-0 left-2 h-px overflow-hidden rounded-full"
                  style={{ transformOrigin: "left" }}
                >
                  <motion.div
                    animate={{ scaleX: 1 }}
                    className="h-full w-full rounded-full opacity-60"
                    initial={{ scaleX: 0 }}
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, ${textColor} 35%, ${textColor} 65%, transparent 100%)`,
                      transformOrigin: "left",
                    }}
                    transition={{
                      delay: 0.3,
                      duration: 1.4,
                      ease: [0.22, 0.61, 0.36, 1],
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedTooltip;
