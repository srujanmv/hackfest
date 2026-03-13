"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  const base =
    "focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed select-none";
  const sizes =
    size === "sm"
      ? "px-3 py-2 text-sm"
      : size === "lg"
        ? "px-5 py-3 text-sm"
        : "px-4 py-2.5 text-sm";
  const styles =
    variant === "primary"
      ? "bg-primary shadow-glow hover:brightness-110"
      : variant === "secondary"
        ? "bg-secondary/20 shadow-glowStrong hover:bg-secondary/25"
        : "border border-white/15 bg-white/5 hover:bg-white/10";

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={clsx(base, sizes, styles, className)}
      {...props}
    />
  );
}

