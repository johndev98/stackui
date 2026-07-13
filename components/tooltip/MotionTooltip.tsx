import { AnimatePresence, motion } from "motion/react";

// ✨ COMPONENT TOOLTIP MOTION TÁI SỬ DỤNG
interface TooltipProps {
  text: string;
  show: boolean;
}
export function MotionTooltip({ text, show }: TooltipProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-900/95 px-2.5 py-1 font-mono text-[11px] font-medium text-zinc-200 shadow-lg backdrop-blur"
          style={{ top: "-34px" }}
        >
          {text}
          {/* Mũi tên chỉ xuống nút */}
          <span
            className="absolute left-1/2 top-full -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid #3f3f46", // màu border zinc-700
            }}
          />
          <span
            className="absolute left-1/2 top-[calc(100%-1px)] -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: "4px solid #18181b", // màu bg zinc-900
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}