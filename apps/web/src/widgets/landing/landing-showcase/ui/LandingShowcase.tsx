"use client";

import { Check, Minus, X } from "lucide-react";
import { useTransform, useMotionValue } from "motion/react";
import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { ContentStep } from "./ContentStep";
import { FeatureCard } from "./FeatureCard";

export function LandingShowcase() {
  const tComparison = useTranslations("Landing.Comparison");
  const rFeatureCards = useTranslations("Landing.feature_cards");

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollYProgress = useMotionValue(0);

  const [contentHeight, setContentHeight] = useState(0);
  const [vh, setVh] = useState(0);
  const [vw, setVw] = useState(0);

  // ---- измерение viewport ----
  useLayoutEffect(() => {
    const update = () => {
      setVh(window.innerHeight);
      setVw(window.innerWidth);
    };
    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ---- измерение контента ----
  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const measure = () => {
      setContentHeight(contentRef.current!.offsetHeight);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(contentRef.current);

    return () => ro.disconnect();
  }, []);

  const totalHeight = contentHeight + vh * 2;

  // ---- scroll tracking ----
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !vh) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();

      const scrollTop = -rect.top;
      const maxScroll = totalHeight - vh;

      const progress =
        maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

      scrollYProgress.set(progress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [totalHeight, vh, scrollYProgress]);

  // ---- helpers ----
  const maxScroll = Math.max(totalHeight - vh, 1);

  const progressAt = (px: number) => px / maxScroll;

  // ---- animation points ----

  // конец первого экрана
  const firstScreenEnd = vh;

  // начало последнего экрана
  const lastScreenStart = totalHeight - vh * 2;

  // конец последнего экрана
  const lastScreenEnd = totalHeight - vh;

  // ---- video reveal ----
  const videoScale = useTransform(
    scrollYProgress,
    [progressAt(0), progressAt(firstScreenEnd)],
    [0.5, 1],
  );

  const videoBorderRadius = useTransform(
    scrollYProgress,
    [progressAt(0), progressAt(firstScreenEnd)],
    ["100%", "0px"],
  );

  // ---- overlay ----
  const overlayOpacity = useTransform(
    scrollYProgress,
    [
      progressAt(0),
      progressAt(firstScreenEnd),

      progressAt(lastScreenStart),
      progressAt(lastScreenEnd),
    ],
    [0, 1, 1, 0],
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: totalHeight || "auto" }}
    >
      {/* sticky stage */}
      <div className="sticky top-0 h-dvh w-full flex flex-col items-center">
        <motion.div
          style={{
            scale: videoScale,
            borderRadius: videoBorderRadius,
          }}
          className="relative w-full h-full bg-black shadow-2xl origin-center overflow-hidden"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            src={
              vw > vh
                ? "/assets/collaborative-editing-16-9.mp4"
                : "/assets/collaborative-editing-9-16.mp4"
            }
            className="absolute w-full h-full object-cover"
          />

          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs"
          />
        </motion.div>
      </div>

      {/* scroll content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center pb-32"
      >
        <div className="h-screen" />

        {/* STEP 1 */}
        <ContentStep>
          <div className="grid place-items-center w-full h-full max-w-360 px-4 md:px-8 mx-auto">
            <div className="w-full grid grid-cols-12 gap-6">
              <FeatureCard
                title={rFeatureCards("collaborative_editing")}
                description={rFeatureCards("collaborative_editing_desc")}
                mediaSrc="/assets/collaborative-editing.mp4"
                className="col-span-12 md:col-span-12 order-2 min-[1080px]:order-0 min-[1080px]:col-span-7!"
                isVideo={true}
              />
              <FeatureCard
                title={rFeatureCards("more_than_board")}
                description={rFeatureCards("more_than_board_desc")}
                mediaSrc="/assets/other-features.mp4"
                isVideo={true}
                className="col-span-12 md:col-span-6 order-0 min-[1080px]:order-1 min-[1080px]:col-span-5!"
              />
              <FeatureCard
                title={rFeatureCards("role_based_access")}
                description={rFeatureCards("role_based_access_desc")}
                mediaSrc="/assets/role-based-access.mp4"
                isVideo={true}
                className="col-span-12 md:col-span-6 order-1 min-[1080px]:order-2 min-[1080px]:col-span-4! bg-[#0a0a0a]"
              />
              <FeatureCard
                title={rFeatureCards("return_to_focus")}
                description={rFeatureCards("return_to_focus_desc")}
                mediaSrc="/assets/return-to-focus.mp4"
                isVideo={true}
                videoSpeed={0.5}
                className="col-span-12 md:col-span-6 order-3 min-[1080px]:order-3 min-[1080px]:col-span-4!"
              />
              <FeatureCard
                title={rFeatureCards("smart_eraser")}
                description={rFeatureCards("smart_eraser_desc")}
                mediaSrc="/assets/smart-eraser.mp4"
                isVideo={true}
                className="col-span-12 md:col-span-6 order-4 min-[1080px]:order-4 min-[1080px]:col-span-4!"
              />
            </div>
          </div>
        </ContentStep>

        {/* STEP 2 */}
        <ContentStep className="mt-100">
          <div className="mx-auto grid items-center h-full max-w-5xl px-4 md:px-8">
            <Card className="bg-background/80 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-4xl md:text-2xl">
                  {tComparison("why_title")}
                </CardTitle>
                <CardDescription className="md:text-lg">
                  {tComparison("why_desc")}
                </CardDescription>
              </CardHeader>

              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-lg w-1/3">
                        {tComparison("headers.analog")}
                      </TableHead>
                      <TableHead className="text-lg w-1/3">
                        {tComparison("headers.drawback")}
                      </TableHead>
                      <TableHead className="text-lg w-1/3">
                        {tComparison("headers.advantage")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Excalidraw</TableCell>
                      <TableCell>
                        <X className="inline text-red-500" />{" "}
                        {tComparison("excalidraw.drawback")}
                      </TableCell>
                      <TableCell>
                        <Check className="inline text-green-500" />{" "}
                        {tComparison("excalidraw.advantage")}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Draw.io</TableCell>
                      <TableCell>
                        <X className="inline text-red-500" />{" "}
                        {tComparison("drawio.drawback")}
                      </TableCell>
                      <TableCell>
                        <Check className="inline text-green-500" />{" "}
                        {tComparison("drawio.advantage")}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Figma</TableCell>
                      <TableCell>
                        <X className="inline text-red-500" />{" "}
                        {tComparison("figma.drawback")}
                      </TableCell>
                      <TableCell>
                        <Check className="inline text-green-500" />{" "}
                        {tComparison("figma.advantage")}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </ContentStep>

        {/* STEP 3 */}
        <ContentStep className="mt-100">
          <div className="mx-auto grid items-center h-full max-w-5xl px-4 md:px-8">
            <Card className="bg-background/80 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-4xl md:text-2xl">
                  {tComparison("doubt_title")}
                </CardTitle>
                <CardDescription className="md:text-lg">
                  {tComparison("doubt_desc")}
                </CardDescription>
              </CardHeader>

              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-lg w-1/5">
                        {tComparison("col_feature")}
                      </TableHead>
                      <TableHead className="text-lg text-center w-1/5">
                        Power Paint
                      </TableHead>
                      <TableHead className="text-lg text-center w-1/5">
                        Excalidraw
                      </TableHead>
                      <TableHead className="text-lg text-center w-1/5">
                        Draw.io
                      </TableHead>
                      <TableHead className="text-lg text-center w-1/5">
                        Figma
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {/* rows unchanged */}
                    <TableRow>
                      <TableCell className="font-medium">
                        {tComparison("features.quick_sketches")}
                      </TableCell>
                      <TableCell className="text-center">
                        <Check className="inline text-green-500" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Check className="inline text-green-500" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Minus className="inline text-yellow-500" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Minus className="inline text-yellow-500" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </ContentStep>

        <div className="h-screen" />
      </div>
    </div>
  );
}
