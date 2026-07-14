"use client";

import { useState, useRef, useEffect, type ComponentProps } from "react";
import { motion, AnimatePresence, type MotionProps } from "motion/react";
import { AlignLeft, Copy, Check, ChevronUp } from "lucide-react";
import { MotionTooltip } from "../tooltip/MotionTooltip";

type PreProps = ComponentProps<"pre"> & MotionProps;

interface Props extends PreProps {
  rawCode: string;
  lang: string;
}

// ⚙️ CONFIG
const MAX_HEIGHT_COLLAPSED = 380;
const MAX_HEIGHT_EXPANDED = 600;
const HEIGHT_PADDING = 10;
const ANIM_DURATION = 0.35;

const SPRING_CONFIG = {
  type: "spring",
  visualDuration: 0.2,
  bounce: 0.2,
} as const;

export default function CodeBlockPre({
  rawCode,
  lang,
  className = "",
  style,
  children,
  ...props
}: Props) {
  const [showLines, setShowLines] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);
  const [actualContentHeight, setActualContentHeight] = useState(0);
  const [isMeasured, setIsMeasured] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  // Tooltip states
  const [showTooltipLines, setShowTooltipLines] = useState(false);
  const [showTooltipCopy, setShowTooltipCopy] = useState(false);
  const [showTooltipExpand, setShowTooltipExpand] = useState(false);

  const preRef = useRef<HTMLPreElement>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const el = preRef.current;
    if (!el) return;

    const checkHeight = () => {
      // Measure real content height
      const clone = el.cloneNode(true) as HTMLElement;
      Object.assign(clone.style, {
        position: "absolute",
        visibility: "hidden",
        height: "auto",
        maxHeight: "none",
        overflow: "visible",
        width: `${el.clientWidth}px`,
      });

      el.parentElement?.appendChild(clone);
      const realHeight = clone.scrollHeight;
      el.parentElement?.removeChild(clone);

      setActualContentHeight(realHeight);
      setNeedsExpand(realHeight > MAX_HEIGHT_COLLAPSED + HEIGHT_PADDING);
      setIsMeasured(true);
    };

    const timer = requestAnimationFrame(checkHeight);
    const resizeObserver = new ResizeObserver(checkHeight);
    resizeObserver.observe(el);

    return () => {
      cancelAnimationFrame(timer);
      resizeObserver.disconnect();
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    };
  }, [children]);

  // Update scroll permission based on current state
  useEffect(() => {
    if (!isMeasured) return;

    if (isExpanded) {
      // Only allow scroll if content exceeds MAX_HEIGHT_EXPANDED
      setCanScroll(actualContentHeight > MAX_HEIGHT_EXPANDED);
    } else {
      // No scroll when collapsed
      setCanScroll(false);
    }
  }, [isExpanded, actualContentHeight, isMeasured]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleToggleExpand = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);

    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);

    if (!newState && preRef.current) {
      preRef.current.scrollTop = 0;
    }
  };

  // Determine current max height for animation
  const currentMaxHeight = isExpanded
    ? Math.min(actualContentHeight, MAX_HEIGHT_EXPANDED)
    : MAX_HEIGHT_COLLAPSED;

  return (
    <div className="relative group my-4 w-full">
      {/* Toolbar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 pt-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="flex items-center gap-1.5 rounded-md border border-zinc-700/60 bg-zinc-900/70 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {lang}
        </span>

        <div className="flex items-center gap-2">
          {/* Toggle line numbers */}
          <button
            type="button"
            onMouseEnter={() => setShowTooltipLines(true)}
            onMouseLeave={() => setShowTooltipLines(false)}
            onClick={() => setShowLines((prev) => !prev)}
            className="relative flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900/80 text-zinc-300 transition hover:border-primary hover:text-primary"
          >
            <motion.div
              animate={{
                rotate: showLines ? 0 : 90,
                scale: showLines ? 1 : 0.9,
              }}
              transition={SPRING_CONFIG}
            >
              <AlignLeft size={16} />
            </motion.div>
            <MotionTooltip
              show={showTooltipLines}
              text={showLines ? "Ấn số dòng" : "Hiện số dòng"}
            />
          </button>

          {/* Copy button */}
          <button
            type="button"
            onMouseEnter={() => setShowTooltipCopy(true)}
            onMouseLeave={() => setShowTooltipCopy(false)}
            onClick={handleCopy}
            className="relative flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900/80 text-zinc-300 transition hover:border-secondary hover:text-secondary"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -30, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: 30, opacity: 0 }}
                  transition={SPRING_CONFIG}
                >
                  <Check
                    size={16}
                    className="text-secondary"
                    strokeWidth={2.5}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={SPRING_CONFIG}
                >
                  <Copy size={16} />
                </motion.div>
              )}
            </AnimatePresence>
            <MotionTooltip
              show={showTooltipCopy}
              text={copied ? "Copied!" : "Sao chép"}
            />
          </button>
        </div>
      </div>

      {/* Code block */}
      <motion.pre
        ref={preRef}
        {...props}
        style={{
          ...style,
          overflowY: canScroll ? "auto" : "hidden",
        }}
        className={`${className} w-full`}
        data-custom-codeblock
        data-lines={showLines ? "show" : "hide"}
        initial={{
          maxHeight: MAX_HEIGHT_COLLAPSED,
          "--line-offset": "3.25rem",
          "--line-number-opacity": 1,
          "--line-number-scale": 1,
          "--line-number-translate": "0px",
        }}
        animate={
          isMeasured
            ? {
                maxHeight: currentMaxHeight,
                "--line-offset": showLines ? "3.25rem" : "0.25rem",
                "--line-number-opacity": showLines ? 1 : 0,
                "--line-number-scale": showLines ? 1 : 0.4,
                "--line-number-translate": showLines ? "0px" : "-12px",
              }
            : undefined
        }
        transition={
          {
            maxHeight: {
              type: "tween",
              duration: ANIM_DURATION,
              ease: [0.22, 1, 0.36, 1],
            },
            "--line-offset": { duration: 0.25, ease: "easeInOut" },
            "--line-number-opacity": { duration: 0.2, ease: "easeInOut" },
            "--line-number-scale": { duration: 0.2, ease: "easeInOut" },
            "--line-number-translate": { duration: 0.2, ease: "easeInOut" },
            default: SPRING_CONFIG,
          } as never
        }
      >
        {children}
      </motion.pre>

      {/* Fade gradient when collapsed */}
      {!isExpanded && needsExpand && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-[#141a18] to-transparent" />
      )}

      {/* Expand / Collapse button */}
      <AnimatePresence>
        {isMeasured && needsExpand && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={SPRING_CONFIG}
            onMouseEnter={() => setShowTooltipExpand(true)}
            onMouseLeave={() => setShowTooltipExpand(false)}
            onClick={handleToggleExpand}
            className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/90 px-4 py-1.5 font-mono text-xs text-zinc-300 backdrop-blur transition hover:border-accent hover:text-accent"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 0 : 180 }}
              transition={SPRING_CONFIG}
            >
              <ChevronUp size={14} />
            </motion.div>
            <span>{isExpanded ? "Thu nhỏ" : "Xem thêm"}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <style>{`
        pre[data-custom-codeblock] {
          --line-offset: 3.25rem;
          --line-number-opacity: 1;
          --line-number-scale: 1;
          --line-number-translate: 0px;

          background: #141a18 !important;
          
          /*Font Size của code */
          font-size: 0.9rem;

          line-height: 1.7;
          margin: 0 !important;

          /*PADDING toàn bộ nội dung bên trong*/
          padding: 3rem 1rem 2rem 1rem !important;

          position: relative;
          width: 100%;
        }

        pre[data-custom-codeblock] code {
          display: grid;
          counter-reset: line;
          width: 100%;
        }
        pre[data-custom-codeblock] code .line {
          counter-increment: line;
          display: block;
          width: 100%;
          padding-left: var(--line-offset);
          text-indent: calc(var(--line-offset) * -1);
          white-space: pre;
        }
        pre[data-custom-codeblock] code .line::before {
          content: counter(line);
          display: inline-block;
          width: 2rem;
          margin-right: 1.25rem;
          text-align: right;
          color: #565f89;
          user-select: none;
          opacity: var(--line-number-opacity);
          transform: scale(var(--line-number-scale)) translateX(var(--line-number-translate));
          transform-origin: right center;
        }

        pre[data-custom-codeblock]::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        pre[data-custom-codeblock]::-webkit-scrollbar-track {
          background: transparent;
        }
        pre[data-custom-codeblock]::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        pre[data-custom-codeblock]::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
}
