"use client";

import React from "react";
import { motion } from "motion/react";

function colorDarken(hex: string, percent: number): string {
  const h = hex.replace("#", "");
  const num = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  const r = Math.max(
    0,
    ((num >> 16) & 0xff) - Math.round(255 * (percent / 100)),
  );
  const g = Math.max(
    0,
    ((num >> 8) & 0xff) - Math.round(255 * (percent / 100)),
  );
  const b = Math.max(0, (num & 0xff) - Math.round(255 * (percent / 100)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

type DuolingoButtonProps = {
  children: React.ReactNode;
  color?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs min-w-20 md:px-4 md:py-2 md:text-sm md:min-w-24",
  md: "px-4 py-2 text-sm min-w-32 md:px-6 md:py-3 md:text-base md:min-w-40",
  lg: "px-5 py-2.5 text-base min-w-40 md:px-8 md:py-4 md:text-lg md:min-w-48",
};

export function DuolingoButton({
  children,
  color = "#58cc02",
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  loadingText,
  onClick,
  type = "button",
  className = "",
}: DuolingoButtonProps) {
  const isDisabled = disabled || loading;
  const isSecondary = variant === "secondary";

  return (
    <motion.button
      type={type}
      whileHover={{ scale: isDisabled ? 1 : 1.03 }}
      whileTap={{ scale: isDisabled ? 1 : 0.96 }}
      onClick={onClick}
      disabled={isDisabled}
      className={`rounded-2xl font-bold border-b-4 active:border-b-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm ${
        isSecondary ? "text-gray-700" : "text-white"
      } ${fullWidth ? "w-full" : ""} ${sizeStyles[size]} ${className}`}
      style={{
        backgroundColor: color,
        borderColor: colorDarken(color, 25),
      }}
    >
      {loading ? loadingText || "⏳ Đang xử lý..." : children}
    </motion.button>
  );
}
