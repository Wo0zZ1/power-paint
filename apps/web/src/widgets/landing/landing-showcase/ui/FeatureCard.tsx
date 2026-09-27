"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";

import { cn } from "@/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  mediaSrc: string;
  isVideo?: boolean;
  videoSpeed?: number;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  mediaSrc,
  isVideo = false,
  videoSpeed = 1,
  className,
}: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();

    if (!rect || !cardRef.current) return;

    const rectWidth = rect.width;
    const rectHeight = rect.height;

    const x = e.clientX - rect.left - rectWidth * 0.025;
    const y = e.clientY - rect.top - rectHeight * 0.025;

    cardRef.current.style.setProperty("--x", `${x}px`);
    cardRef.current.style.setProperty("--y", `${y}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative h-120 bg-[#030507] border border-[#ffffff1a] rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105",
        className,
      )}
    >
      <div className="h-full flex flex-col gap-y-2">
        <div className="flex flex-col gap-1 p-4.5">
          <h2 className="text-white font-bold text-[20px] tracking-[5%] truncate">
            {title}
          </h2>
          <p className="text-[#a1a1a1] text-[14px] tracking-[-5%] leading-[125%] line-clamp-4 mt-1">
            {description}
          </p>
        </div>

        <div
          className={cn("relative max-w-125 w-full mx-auto h-full min-h-0", {
            "mask-[radial-gradient(circle,black_30%,#0008_80%,#0000_100%)] [-webkit-mask-image:radial-gradient(circle,black_30%,#0008_80%,#0000_100%)]":
              !isVideo,
          })}
        >
          {isVideo ? (
            <video
              ref={(r) => {
                if (r) r.playbackRate = videoSpeed;
              }}
              src={mediaSrc}
              autoPlay
              loop
              muted
              className="w-full h-full object-contain"
            />
          ) : (
            <Image
              src={mediaSrc}
              alt={title}
              className="w-full h-full object-cover"
              fill
            />
          )}
        </div>
      </div>

      {/* glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{
          background:
            "radial-gradient(150px circle at var(--x) var(--y), color-mix(in oklab, white 1%, transparent), transparent 100%)",
        }}
      />
    </div>
  );
}
