"use client";

import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { motion } from "framer-motion";

export function Card({
  className,
  interactive,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className={clsx(
        "glass rounded-2xl",
        interactive ? "transition hover:border-white/15 hover:bg-white/[0.055]" : "",
        className
      )}
      {...props}
    />
  );
}

