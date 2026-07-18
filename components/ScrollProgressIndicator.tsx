"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";

type ScrollProgressIndicatorProps = {
  /** Tham chiếu đến vùng nội dung có thanh cuộn */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Chiều cao thanh chỉ báo */
  height?: number;
  /** Màu nền thanh chỉ báo */
  color?: string;
  /** Giá trị độ cứng của chuyển động */
  stiffness?: number;
  /** Giá trị giảm chấn của chuyển động */
  damping?: number;
};

export default function ScrollProgressIndicator({
  containerRef,
  height = 4,
  color = "var(--hue-1, #3b82f6)",
  stiffness = 100,
  damping = 30,
}: ScrollProgressIndicatorProps) {
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness,
    damping,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "left",
        height,
        width: "100%",
        backgroundColor: color,
      }}
    />
  );
}
