"use client";

import { ChevronDown } from "lucide-react";
import * as motion from "motion/react-client";

import { Button } from "@/shared/ui/button";

export function ScrollDownButton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
      >
        <ChevronDown className="size-8" />
      </Button>
    </motion.div>
  );
}
