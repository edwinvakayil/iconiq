import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface InfoCardProps {
  imageSrc: string;
  title: string;
  description: string;
  index?: number;
}

export function InfoCard({
  imageSrc,
  title,
  description,
  index = 0,
}: InfoCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-card"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={ref}
      style={{
        boxShadow: "0 1px 3px 0 oklch(0 0 0 / 0.04)",
        perspective: 800,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -8,
        boxShadow:
          "0 20px 40px -12px oklch(0 0 0 / 0.12), 0 4px 12px -2px oklch(0 0 0 / 0.06)",
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      }}
      whileTap={{
        scale: 0.97,
        transition: { duration: 0.1, ease: "easeOut" },
      }}
    >
      <div
        className="relative m-1 h-56 w-full overflow-hidden rounded-2xl"
        style={{ width: "calc(100% - 0.5rem)" }}
      >
        <motion.div
          className="relative h-full w-full"
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.08 }}
        >
          <Image
            alt={title}
            className="rounded-2xl object-cover"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            src={imageSrc}
          />
        </motion.div>
      </div>

      <div className="flex flex-col px-5 pt-4 pb-5" style={{ height: "160px" }}>
        <h3 className="mb-2 shrink-0 font-bold text-foreground text-lg">
          {title}
        </h3>
        <p className="flex-1 overflow-y-auto pr-1 text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
