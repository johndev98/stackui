"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "motion/react";
import { DuolingoButton } from "@/components/ui/DuolingoButton";
import type { Highlighter, ThemedToken, BundledLanguage } from "shiki";

/* =========================================================
   🔌 KIỂU DỮ LIỆU
   ========================================================= */
export type BlankSegment =
  | { type: "text"; content: string }
  | { type: "blank"; id: string; hint?: string };
export type AnswerOption = { id: string; label: string };
export type DragDropProps = {
  question: BlankSegment[];
  options: AnswerOption[];
  accent?: string;
  mode?: "text" | "code";
  language?: BundledLanguage;
  onCheck?: (userAnswers: Record<string, string>) => Promise<{
    isCorrect: boolean;
    explanation?: string;
    slotStates?: Record<string, "idle" | "correct" | "wrong">;
  }>;
};

const TOKYO = {
  cardBg: "#1e1e1e",
  surface: "#252526",
  surfaceDark: "#181818",
  border: "#3c3c3c",
  borderMid: "#4a4a4a",
  text: "#d4d4d4",
  subtitle: "#808080",
  hover: "#569cd6",
  correct: "#6a9955",
  blue: "#569cd6",
  wrong: "#f44747",
  comment: "#608b4e",
  dotRed: "#f44747",
  dotYellow: "#dcdcaa",
  dotGreen: "#6a9955",
} as const;

function SortableChip({
  id,
  label,
  used,
  accent,
  mode = "text",
  onClick,
}: {
  id: string;
  label: string;
  used: boolean;
  accent: string;
  mode?: "text" | "code";
  onClick?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: used });
  const isCode = mode === "code";

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: used ? 0 : isDragging ? 0.9 : 1,
    pointerEvents: used ? "none" : "auto",
    position: used ? "absolute" : "relative",
    backgroundColor: isDragging
      ? `${accent}44`
      : isCode
        ? TOKYO.surface
        : "#fff",
    color: isCode ? TOKYO.text : "#1f2937",
    borderColor: accent,
    borderStyle: "solid",
    zIndex: isDragging ? 9999 : "auto",
    boxShadow: isDragging ? `0 10px 30px ${accent}55` : undefined,
    outlineColor: accent,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    listeners?.onClick?.(e);
    onClick?.();
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (used) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={used ? -1 : 0}
      aria-disabled={used}
      suppressHydrationWarning
      layout
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      whileHover={{ y: -2 }}
      whileDrag={{ scale: 1.08 }}
      className={`${isCode ? "font-mono text-sm" : "font-bold text-base"} 
        px-3 py-1.5 rounded-lg cursor-grab active:cursor-grabbing select-none
        border-b-[3px] shadow-sm outline-none
        focus-visible:ring-2 focus-visible:ring-offset-1
        ${isDragging ? "" : "hover:-translate-y-0.5 active:translate-y-0 active:border-b-0"}`}
    >
      {label}
    </motion.div>
  );
}
function DropSlot({
  blank,
  filledLabel,
  isActiveTarget,
  state,
  onClick,
  mode = "text",
}: {
  blank: BlankSegment & { type: "blank" };
  filledLabel?: string;
  isActiveTarget: boolean;
  state: "idle" | "correct" | "wrong";
  onClick: () => void;
  mode?: "text" | "code";
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: blank.id,
    disabled: !filledLabel,
  });
  const isCode = mode === "code";

  const textColors = {
    border: {
      idle: filledLabel ? "#58cc02" : isActiveTarget ? "#1cb0f6" : "#c7c7c7",
      correct: "#58cc02",
      wrong: "#ff4b4b",
    },
    bg: {
      idle: filledLabel ? "#d7ffb8" : isActiveTarget ? "#e5f7ff" : "#f7f7f7",
      correct: "#d7ffb8",
      wrong: "#ffdfe0",
    },
    text: { idle: "#374151", correct: "#2e7d32", wrong: "#ca282d" },
  };
  const codeColors = {
    border: {
      idle: filledLabel
        ? TOKYO.correct
        : isActiveTarget
          ? TOKYO.hover
          : TOKYO.comment,
      correct: TOKYO.correct,
      wrong: TOKYO.wrong,
    },
    bg: {
      idle: filledLabel
        ? `${TOKYO.correct}22`
        : isActiveTarget
          ? `${TOKYO.hover}33`
          : TOKYO.cardBg,
      correct: `${TOKYO.correct}33`,
      wrong: `${TOKYO.wrong}33`,
    },
    text: { idle: TOKYO.text, correct: TOKYO.correct, wrong: TOKYO.wrong },
  };
  const palette = isCode ? codeColors : textColors;

  const handleSlotClick = (e: React.MouseEvent) => {
    listeners?.onClick?.(e);
    onClick();
  };
  const handleSlotKeyDown = (e: React.KeyboardEvent) => {
    if (
      filledLabel &&
      (e.key === "Enter" ||
        e.key === " " ||
        e.key === "Backspace" ||
        e.key === "Delete")
    ) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.span
      ref={setNodeRef}
      // ✅ TRUYỀN ĐỦ attributes + listeners ĐỂ KÉO ĐƯỢC
      {...attributes}
      {...listeners}
      onClick={handleSlotClick}
      onKeyDown={handleSlotKeyDown}
      role="button"
      tabIndex={filledLabel ? 0 : -1}
      aria-disabled={!filledLabel}
      suppressHydrationWarning
      layout
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      whileDrag={{ scale: 1.08 }} // ✅ Phồng nhẹ khi kéo ô
      animate={{
        scale: isActiveTarget && !filledLabel ? 1.08 : 1,
        boxShadow:
          isActiveTarget && !filledLabel
            ? `0 0 0 3px ${isCode ? TOKYO.hover : "#1cb0f6"}44, 0 6px 20px ${isCode ? TOKYO.hover : "#1cb0f6"}33`
            : "0 0 0 transparent",
      }}
      className={`inline-flex items-center justify-center rounded-md border-b-2 font-semibold transition-all align-middle outline-none
        ${filledLabel ? "cursor-grab active:cursor-grabbing hover:brightness-110 focus-visible:ring-2" : ""} 
        ${isCode ? "font-mono text-sm" : "text-base"}`}
      // ✅ Áp dụng transform + style khi kéo để ô di chuyển theo con trỏ
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 9999 : "auto",
        minWidth: filledLabel ? "auto" : isCode ? "56px" : "76px",
        height: isCode ? "26px" : "32px",
        padding: isCode ? "0 8px" : "0 14px",
        borderWidth: isActiveTarget ? "2px" : "1px",
        borderColor: palette.border[state === "idle" ? "idle" : state],
        borderStyle: filledLabel ? "solid" : "dashed",
        backgroundColor: palette.bg[state === "idle" ? "idle" : state],
        color: palette.text[state === "idle" ? "idle" : state],
        verticalAlign: "middle",
      }}
      title={
        filledLabel
          ? "Kéo để hoán đổi / Click để trả đáp án về"
          : "Kéo đáp án vào đây / click đáp án bên dưới"
      }
    >
      {filledLabel || (
        <span
          className={isCode ? "text-xs" : "text-sm"}
          style={{ color: isCode ? TOKYO.subtitle : undefined, opacity: 0.75 }}
        >
          {blank.hint || ""}
        </span>
      )}
    </motion.span>
  );
}

export default function DragDrop({
  question,
  options,
  accent,
  mode = "text",
  language = "ts",
  onCheck,
}: DragDropProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [closestTargetId, setClosestTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    explanation?: string;
    slotStates: Record<string, "idle" | "correct" | "wrong">;
  } | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [shiki, setShiki] = useState<Highlighter | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  useEffect(() => {
    setIsMounted(true);
    import("shiki").then(async ({ createHighlighter }) => {
      const h = await createHighlighter({
        themes: ["dark-plus"],
        langs: [
          "ts",
          "tsx",
          "js",
          "jsx",
          "html",
          "css",
          "scss",
          "less",
          "vue",
          "svelte",
          "py",
          "rb",
          "php",
          "sh",
          "bash",
          "bat",
          "cmd",
          "ps1",
          "json",
          "yaml",
          "yml",
          "xml",
          "md",
          "c",
          "cpp",
          "rs",
          "go",
          "java",
          "kt",
          "kts",
          "cs",
          "dart",
          "swift",
          "scala",
          "lua",
          "sql",
          "graphql",
          "prisma",
          "dockerfile",
          "toml",
          "ini",
        ],
      });
      setShiki(h);
    });
  }, []);

  const isCode = mode === "code";
  const finalAccent = accent ?? (isCode ? TOKYO.blue : "#58cc02");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { setNodeRef: setQuestionDropRef } = useDroppable({
    id: "question-drop-zone",
  });

  const blankIds = useMemo(
    () =>
      question
        .filter(
          (s): s is Extract<BlankSegment, { type: "blank" }> =>
            s.type === "blank",
        )
        .map((s) => s.id),
    [question],
  );
  const blankHintOf = useMemo(() => {
    const m: Record<string, string> = {};
    question.forEach((s) => {
      if (s.type === "blank") m[s.id] = s.hint ?? "";
    });
    return m;
  }, [question]);
  const labelOf = useMemo(() => {
    const m: Record<string, string> = {};
    options.forEach((o) => (m[o.id] = o.label));
    return m;
  }, [options]);
  const usedIds = Object.values(answers);
  const allFilled = blankIds.length > 0 && blankIds.every((id) => answers[id]);

  /* ---------- CLICK ĐÁP ÁN → AUTO-FILL THEO THỨ TỰ ---------- */
  const handleChipClick = (chipId: string) => {
    setResult(null);
    setAnswers((prev) => {
      const next = { ...prev };
      const currentSlot = Object.keys(next).find((k) => next[k] === chipId);
      if (currentSlot) {
        delete next[currentSlot];
        return next;
      }
      const firstEmptySlot = blankIds.find((id) => !next[id]);
      if (!firstEmptySlot) return prev;
      Object.keys(next).forEach((k) => {
        if (next[k] === chipId) delete next[k];
      });
      next[firstEmptySlot] = chipId;
      return next;
    });
  };

  /* ---------- TÔ MÀU CODE (HỖ TRỢ MỌI NGÔN NGỮ) ---------- */
  const renderedCode = useMemo(() => {
    if (!isCode || !isMounted || !shiki) return null;
    const PLACEHOLDER = "\uFFFF";
    let codeStr = "";
    question.forEach((s) => {
      codeStr += s.type === "text" ? s.content : PLACEHOLDER;
    });

    const { tokens } = shiki.codeToTokens(codeStr, {
      lang: language,
      theme: "dark-plus",
    });

    let bc = 0;
    const out: React.ReactNode[] = [];
    let gk = 0;

    tokens.forEach((line, li) => {
      line.forEach((tok) => {
        if (tok.content.includes(PLACEHOLDER)) {
          const parts = tok.content.split(PLACEHOLDER);
          parts.forEach((textPart, idx) => {
            if (textPart) {
              out.push(
                <span
                  key={`t-${gk++}`}
                  style={{
                    color: tok.color || TOKYO.text,
                    fontStyle:
                      (tok as any).fontStyle === 1 ? "italic" : "normal",
                    fontWeight: (tok as any).fontWeight ?? 400,
                  }}
                >
                  {textPart}
                </span>,
              );
            }
            if (idx < parts.length - 1) {
              const bid = blankIds[bc++];
              if (bid) {
                out.push(
                  <DropSlot
                    key={`b-${bid}`}
                    blank={{ type: "blank", id: bid, hint: blankHintOf[bid] }}
                    mode="code"
                    filledLabel={
                      answers[bid] ? labelOf[answers[bid]] : undefined
                    }
                    isActiveTarget={closestTargetId === bid}
                    state={result?.slotStates[bid] ?? "idle"}
                    onClick={() => removeAnswer(bid)}
                  />,
                );
              }
            }
          });
          return;
        }
        out.push(
          <span
            key={`t-${gk++}`}
            style={{
              color: tok.color || TOKYO.text,
              fontStyle: (tok as any).fontStyle === 1 ? "italic" : "normal",
              fontWeight: (tok as any).fontWeight ?? 400,
            }}
          >
            {tok.content}
          </span>,
        );
      });
      if (li < tokens.length - 1) out.push(<span key={`n-${li}`}>{"\n"}</span>);
    });
    return out;
  }, [
    isCode,
    isMounted,
    shiki,
    question,
    language,
    blankIds,
    blankHintOf,
    answers,
    labelOf,
    closestTargetId,
    result,
  ]);

  /* ---------- CODE HOÀN CHỈNH KHI TRẢ LỜI ĐÚNG ---------- */
  const completedCode = useMemo(() => {
    if (!isCode || !isMounted || !shiki || !result?.isCorrect) return null;

    let codeStr = "";
    question.forEach((s) => {
      if (s.type === "text") {
        codeStr += s.content;
      } else {
        codeStr += answers[s.id] ? labelOf[answers[s.id]] : "";
      }
    });

    const { tokens } = shiki.codeToTokens(codeStr, {
      lang: language,
      theme: "dark-plus",
    });

    const out: React.ReactNode[] = [];
    let gk = 0;
    tokens.forEach((line, li) => {
      line.forEach((tok) => {
        out.push(
          <span
            key={`c-${gk++}`}
            style={{
              color: tok.color || TOKYO.text,
              fontStyle: (tok as any).fontStyle === 1 ? "italic" : "normal",
              fontWeight: (tok as any).fontWeight ?? 400,
            }}
          >
            {tok.content}
          </span>,
        );
      });
      if (li < tokens.length - 1)
        out.push(<span key={`cn-${li}`}>{"\n"}</span>);
    });
    return out;
  }, [isCode, isMounted, shiki, result, question, language, answers, labelOf]);

  /* ---------- 🎯 LOGIC KÉO THẢ + HOÁN ĐỔI Ô TRỐNG ---------- */
  const removeAnswer = (id: string) => {
    setAnswers((p) => {
      const n = { ...p };
      delete n[id];
      return n;
    });
    setResult(null);
    setShowToast(false);
  };

  const handleDragStart = (e: DragStartEvent) => {
    setClosestTargetId(null);
    setResult(null);
    setShowToast(false);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const over = e.over?.id as string | null;
    if (over && blankIds.includes(over)) {
      setClosestTargetId(over);
    } else if (over === "question-drop-zone") {
      const firstEmpty = blankIds.find((id) => !answers[id]);
      if (firstEmpty) setClosestTargetId(firstEmpty);
    } else if (!over) {
      setClosestTargetId(null);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const from = e.active.id as string;
    const overId_raw = e.over?.id as string | null;
    const to: string | null =
      (overId_raw && blankIds.includes(overId_raw) ? overId_raw : null) ??
      closestTargetId;

    setClosestTargetId(null);

    if (!to || !blankIds.includes(to)) return;
    const fromIsBlank = blankIds.includes(from);

    setAnswers((prev) => {
      const next = { ...prev };

      // 1. Kéo từ DANH SÁCH đáp án → ô trống
      if (!fromIsBlank) {
        Object.keys(next).forEach((k) => {
          if (next[k] === from) delete next[k];
        });
        next[to] = from;
        return next;
      }

      // 2. ✅ HOÁN ĐỔI / DI CHUYỂN GIỮA 2 Ô TRỐNG VỚI NHAU
      if (fromIsBlank && from !== to) {
        const valueFrom = prev[from]; // Đáp án ở ô nguồn
        const valueTo = prev[to]; // Đáp án ở ô đích
        if (!valueFrom) return prev; // Ô nguồn trống → bỏ qua

        next[to] = valueFrom;
        if (valueTo)
          next[from] = valueTo; // Cả 2 có đáp án → HOÁN ĐỔI
        else delete next[from]; // Ô đích trống → CHỈ DI CHUYỂN
      }

      return next;
    });
  };

  /* ---------- KIỂM TRA ĐÁP ÁN ---------- */
  const handleCheck = async () => {
    if (!allFilled) return;
    setLoading(true);
    setResult(null);
    try {
      if (onCheck) {
        const r = await onCheck(answers);
        const st: Record<string, "idle" | "correct" | "wrong"> = {};
        if (r.slotStates && Object.keys(r.slotStates).length > 0) {
          blankIds.forEach((id) => (st[id] = r.slotStates![id] ?? "idle"));
        } else {
          blankIds.forEach(
            (id) => (st[id] = r.isCorrect ? "correct" : "wrong"),
          );
        }
        setResult({ ...r, slotStates: st });
        setShowToast(true);
        if (!r.isCorrect) setShakeKey((k) => k + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAnswers({});
    setResult(null);
    setShowToast(false);
  };

  /* ---------- RENDER CÂU HỎI ---------- */
  const renderQuestion = () => {
    const mp = {
      animate:
        result && !result.isCorrect ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {},
      transition: { duration: 0.45, ease: "easeInOut" as const },
    };

    if (isCode) {
      return (
        <motion.div
          key={shakeKey}
          {...mp}
          className="font-mono p-3 text-[13px] md:text-[17px] leading-6 md:leading-7 select-none overflow-x-auto"
          style={{
            color: TOKYO.text,
            whiteSpace: "pre",
          }}
          suppressHydrationWarning
        >
          {result?.isCorrect && completedCode
            ? completedCode
            : isMounted && shiki && renderedCode
              ? renderedCode
              : question.map((seg, i) =>
                  seg.type === "text" ? (
                    <span key={i}>{seg.content}</span>
                  ) : (
                    <DropSlot
                      key={seg.id}
                      blank={seg}
                      mode="code"
                      filledLabel={
                        answers[seg.id] ? labelOf[answers[seg.id]] : undefined
                      }
                      isActiveTarget={closestTargetId === seg.id}
                      state={result?.slotStates[seg.id] ?? "idle"}
                      onClick={() => removeAnswer(seg.id)}
                    />
                  ),
                )}
        </motion.div>
      );
    }

    return (
      <motion.div
        key={shakeKey}
        {...mp}
        className="text-xl md:text-2xl leading-12 font-medium text-gray-800"
      >
        {question.map((seg, i) =>
          seg.type === "text" ? (
            <span key={i}>{seg.content}</span>
          ) : (
            <DropSlot
              key={seg.id}
              blank={seg}
              mode="text"
              filledLabel={
                answers[seg.id] ? labelOf[answers[seg.id]] : undefined
              }
              isActiveTarget={closestTargetId === seg.id}
              state={result?.slotStates[seg.id] ?? "idle"}
              onClick={() => removeAnswer(seg.id)}
            />
          ),
        )}
      </motion.div>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        className="w-full max-w-2xl mx-auto rounded-3xl shadow-lg border my-6 p-5 md:p-8"
        style={
          isCode
            ? { backgroundColor: TOKYO.cardBg, borderColor: TOKYO.border }
            : { backgroundColor: "#fff", borderColor: "#f3f4f6" }
        }
      >
        {isCode && (
          <div className="flex items-center justify-between mb-3 -mt-1">
            <div className="flex gap-1.5">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: TOKYO.dotRed }}
              />
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: TOKYO.dotYellow }}
              />
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: TOKYO.dotGreen }}
              />
            </div>
            <span
              className="text-xs font-mono px-2.5 py-1 rounded-md"
              style={{ backgroundColor: TOKYO.surface, color: TOKYO.subtitle }}
            >
              .{language || "ts"}
            </span>
            <span className="w-13" />
          </div>
        )}

        <SortableContext
          items={blankIds}
          strategy={horizontalListSortingStrategy}
        >
          <div
            ref={setQuestionDropRef}
            className="mb-6  md:p-5 rounded-2xl min-h-25 border overflow-x-auto transition-colors"
            style={
              isCode
                ? {
                    backgroundColor: closestTargetId
                      ? `${TOKYO.hover}11`
                      : TOKYO.surface,
                    borderColor: closestTargetId ? TOKYO.hover : TOKYO.border,
                  }
                : {
                    backgroundColor: closestTargetId ? "#e5f7ff" : "#f9fafb",
                    borderColor: closestTargetId ? "#1cb0f6" : "#f3f4f6",
                  }
            }
          >
            {renderQuestion()}
          </div>
        </SortableContext>

        {!(result?.isCorrect && isCode) && (
          <SortableContext
            items={options.map((o) => o.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div
              className="flex flex-wrap gap-2.5 p-3 rounded-2xl min-h-15 mb-5 border"
              style={
                isCode
                  ? {
                      backgroundColor: TOKYO.surfaceDark,
                      borderColor: TOKYO.border,
                    }
                  : { backgroundColor: "#eff6ff", borderColor: "transparent" }
              }
            >
              {options.map((o) => (
                <SortableChip
                  key={o.id}
                  id={o.id}
                  label={o.label}
                  used={usedIds.includes(o.id)}
                  accent={finalAccent}
                  mode={mode}
                  onClick={() => handleChipClick(o.id)}
                />
              ))}
            </div>
          </SortableContext>
        )}

        <div className="flex gap-3 justify-end mb-2">
          {!(result?.isCorrect && isCode) && (
            <DuolingoButton
              onClick={handleCheck}
              disabled={!allFilled || loading}
              loading={loading}
              loadingText="⏳ Đang kiểm tra..."
              color={finalAccent}
              fullWidth
            >
              KIỂM TRA
            </DuolingoButton>
          )}
          <DuolingoButton
            variant="primary"
            onClick={reset}
            color={isCode ? TOKYO.border : "#f3f4f6"}
            className={isCode ? "text-gray-200" : "text-gray-600"}
          >
            LÀM LẠI
          </DuolingoButton>
        </div>
      </div>

      <AnimatePresence>
        {showToast && result && (
          <motion.div
            initial={{ opacity: 0, x: 80, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 80, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl border-b-4 font-bold text-base flex items-center gap-3 text-white"
            style={{
              backgroundColor: result.isCorrect
                ? isCode
                  ? TOKYO.correct
                  : "#2e7d32"
                : isCode
                  ? TOKYO.wrong
                  : "#ca282d",
              borderColor: result.isCorrect
                ? isCode
                  ? colorDarken(TOKYO.correct, 25)
                  : "#1b5e20"
                : isCode
                  ? colorDarken(TOKYO.wrong, 25)
                  : "#b71c1c",
            }}
          >
            <span>{result.explanation}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </DndContext>
  );
}

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
