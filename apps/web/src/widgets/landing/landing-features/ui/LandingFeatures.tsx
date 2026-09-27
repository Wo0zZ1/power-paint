import {
  CloudUpload,
  CodeXml,
  Infinity,
  ShieldUser,
  SplinePointer,
  UsersRound,
} from "lucide-react";
import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

interface FeatureTipProps {
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
  className?: string;
}

function FeatureTip({
  title,
  description,
  icon,
  delay = 0,
  className,
}: FeatureTipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-help" asChild>
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            whileHover={{ opacity: 0.7 }}
            transition={{ delay }}
          >
            <div className="flex flex-col items-center gap-2.5 hover:opacity-70 transition-opacity">
              <span>{icon}</span>
              <p className={cn("text-xs text-center", className)}>{title}</p>
            </div>
          </motion.div>
        </TooltipTrigger>

        <TooltipContent className="text-center max-w-50">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function LandingFeatures() {
  const t = useTranslations("Landing.Features");

  const FEATURES = [
    {
      title: t("infinite_canvas_title"),
      description: t("infinite_canvas_description"),
      icon: <Infinity />,
    },
    {
      title: t("multiplayer_title"),
      description: t("multiplayer_description"),
      icon: <UsersRound />,
    },
    {
      title: t("custom_tools_title"),
      description: t("custom_tools_description"),
      icon: <SplinePointer />,
    },
    {
      title: t("role_system_title"),
      description: t("role_system_description"),
      icon: <ShieldUser />,
    },
    {
      title: t("open_source_title"),
      description: t("open_source_description"),
      icon: <CodeXml />,
    },
    {
      title: t("cloud_storage_title"),
      description: t("cloud_storage_description"),
      icon: <CloudUpload />,
    },
  ];

  return (
    <ul className="mt-8 md:mt-32 w-full gap-y-6 gap-x-1 grid grid-cols-1 min-[320px]:grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 text-muted-foreground">
      {FEATURES.map((feature, index) => (
        <li key={feature.title}>
          <FeatureTip
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            delay={0.5 + index * 0.1}
          />
        </li>
      ))}
    </ul>
  );
}
