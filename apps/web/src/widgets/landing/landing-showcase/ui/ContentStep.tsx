"use client";

import { useScroll, useTransform, motion } from "motion/react";
import { useRef, type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

interface ContentStepProps {
  children?: ReactNode;
  className?: string;
}

export function ContentStep({ children, className }: ContentStepProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0 0.3"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const filter = useTransform(
    scrollYProgress,
    [0, 1],
    ["blur(12px)", "blur(0px)"],
  );

  return (
    <motion.div
      ref={ref}
      style={{ opacity, filter }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
}
