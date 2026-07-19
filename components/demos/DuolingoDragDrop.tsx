"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
import type { Highlighter, ThemedToken, BundledLanguage } from "shiki";

/* =========================================================
   🔌 KIỂU DỮ LIỆU
   ========================================================= */
export type BlankSegment =
  | { type: "text"; content: string }
  | { type: "blank"; id: string; hint?: string };
export type AnswerOption = { id: string; label: string };
export type DuolingoDragDropProps = {
  question: BlankSegment[];
  options: AnswerOption[];
  correctAnswers?: Record<string, string>;
  accent?: string;
  mode?: "text" | "code";
  language?: BundledLanguage;
  onCheck?: (userAnswers: Record<string, string>) => Promise<{
    isCorrect: boolean;
    explanation?: string;
  }>;
};

/* =========================================================
   🎨 TOKYO NIGHT (CHUẨN BẢNG BẠN GỬI)
   ========================================================= */
const TOKYO = {
  cardBg: "#1a1b26",
  surface: "#1e202e",
  surfaceDark: "#16161e",
  border: "#292e42",
  borderMid: "#363b54",
  text: "#a9b1d6",
  subtitle: "#9aa5ce",
  hover: "#7aa2f7",
  correct: "#9ece6a",
  blue: "#7aa2f7",
  wrong: "#f7768e",
  comment: "#565f89",
  dotRed: "#f7768e",
  dotYellow: "#e0af68",
  dotGreen: "#9ece6a",
} as const;

/* =========================================================
   🧱 SORTABLE CHIP (ĐÃ SỬA LỖI 2 STYLE + HOÀN THIỆN)
   ========================================================= */
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

  // ✅ GỘP TẤT CẢ STYLE VÀO 1 OBJECT DUY NHẤT → KHÔNG BỊ TRÙNG TÊN
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
    outlineColor: accent, // ✅ thêm outlineColor vào đây luôn
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
      style={style} // ✅ CHỈ CÒN 1 STYLE DUY NHẤT → KHÔNG LỖI TS(17001)
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

/* =========================================================
   ⬜ DROP SLOT (Ô CẦN THẢ / CLICK TRẢ ĐÁP ÁN VỀ)
   ========================================================= */
function DropSlot({
  blank,
  filledLabel,
  isOver,
  isActiveTarget,
  state,
  onClick,
  mode = "text",
}: {
  blank: BlankSegment & { type: "blank" };
  filledLabel?: string;
  isOver: boolean;
  isActiveTarget: boolean;
  state: "idle" | "correct" | "wrong";
  onClick: () => void;
  mode?: "text" | "code";
}) {
  const { setNodeRef } = useSortable({ id: blank.id });
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

  return (
    <motion.span
      ref={setNodeRef}
      onClick={onClick}
      role="button"
      tabIndex={filledLabel ? 0 : -1}
      onKeyDown={(e) => {
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
      }}
      suppressHydrationWarning
      layout
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      animate={{
        scale: isActiveTarget && !filledLabel ? 1.08 : 1,
        boxShadow:
          isActiveTarget && !filledLabel
            ? `0 0 0 3px ${isCode ? TOKYO.hover : "#1cb0f6"}44, 0 6px 20px ${isCode ? TOKYO.hover : "#1cb0f6"}33`
            : "0 0 0 transparent",
      }}
      className={`inline-flex items-center justify-center mx-0.5 rounded-md border-b-[2px] font-semibold transition-all align-middle outline-none
        ${filledLabel ? "cursor-pointer hover:brightness-110 focus-visible:ring-2" : ""} 
        ${isCode ? "font-mono text-sm" : "text-base"}`}
      style={{
        minWidth: filledLabel ? "auto" : isCode ? "68px" : "76px",
        height: isCode ? "30px" : "42px",
        padding: isCode ? "0 10px" : "0 14px",
        borderWidth: isActiveTarget ? "3px" : "2px",
        borderColor: palette.border[state === "idle" ? "idle" : state],
        borderStyle: filledLabel ? "solid" : "dashed",
        backgroundColor: palette.bg[state === "idle" ? "idle" : state],
        color: palette.text[state === "idle" ? "idle" : state],
        verticalAlign: "middle",
      }}
      title={
        filledLabel
          ? "Click / Enter để trả đáp án về"
          : "Kéo đáp án vào đây / click đáp án bên dưới"
      }
    >
      {filledLabel || (
        <span
          className={isCode ? "text-xs" : "text-sm"}
          style={{ color: isCode ? TOKYO.subtitle : undefined, opacity: 0.75 }}
        >
          {blank.hint || "…"}
        </span>
      )}
    </motion.span>
  );
}

/* =========================================================
   🏆 COMPONENT CHÍNH
   ========================================================= */
export default function DuolingoDragDrop({
  question,
  options,
  correctAnswers,
  accent,
  mode = "text",
  language = "ts",
  onCheck,
}: DuolingoDragDropProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
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

  useEffect(() => {
    setIsMounted(true);
    import("shiki").then(async ({ createHighlighter }) => {
      const h = await createHighlighter({
        themes: ["tokyo-night"],
        // ✅ DÙNG TÊN NGẮN GỌN CHUẨN SHIKI, TẤT CẢ NGÔN NGỮ PHỔ BIẾN
        langs: [
          // Web / Frontend
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
          // Script / Đa dụng
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
          // Hệ thống / Thông dụng
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
          // CSDL / Khác
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

  // 👉 THỨ TỰ Ô TRỐNG: trái → phải, trên → dưới (theo thứ tự trong question)
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

  /* =========================================================
     ✅ MỚI: LOGIC CLICK ĐÁP ÁN → AUTO-FILL THEO THỨ TỰ
     Quy tắc chuẩn Duolingo:
     1. Click đáp án CHƯA DÙNG → điền vào Ô TRỐNG ĐẦU TIÊN (trái→phải)
     2. Click đáp án ĐÃ DÙNG → trả về khung chọn
     3. Nếu ô đích đã có đáp án cũ → đáp án cũ tự quay về
     ========================================================= */
  const handleChipClick = (chipId: string) => {
    setResult(null);
    setAnswers((prev) => {
      const next = { ...prev };

      // 1. Nếu đáp án đã nằm trong 1 ô → click = trả về khung
      const currentSlot = Object.keys(next).find((k) => next[k] === chipId);
      if (currentSlot) {
        delete next[currentSlot];
        return next;
      }

      // 2. Tìm ô trống ĐẦU TIÊN theo thứ tự blankIds
      const firstEmptySlot = blankIds.find((id) => !next[id]);
      if (!firstEmptySlot) return prev; // hết ô trống → bỏ qua

      // 3. Đảm bảo đáp án này không bị lặp ở đâu
      Object.keys(next).forEach((k) => {
        if (next[k] === chipId) delete next[k];
      });

      // 4. Điền vào ô trống đầu tiên (đáp án cũ nếu có sẽ được ghi đè = tự trả về)
      next[firstEmptySlot] = chipId;
      return next;
    });
  };

  // ✨ TÔ MÀU CODE (ĐÃ SỬA: HỖ TRỢ MỌI NGÔN NGỮ NHƯ PYTHON, C++, RUST...)
  const renderedCode = useMemo(() => {
    if (!isCode || !isMounted || !shiki) return null;

    // ✅ Dùng ký tự đặc biệt KHÔNG HỢP LỆ → Shiki LUÔN tách thành token riêng
    const PLACEHOLDER = "\uFFFF";
    let codeStr = "";
    question.forEach((s) => {
      codeStr += s.type === "text" ? s.content : PLACEHOLDER;
    });

    const { tokens } = shiki.codeToTokens(codeStr, {
      lang: language,
      theme: "tokyo-night",
    });

    let bc = 0;
    const out: React.ReactNode[] = [];
    let gk = 0;

    tokens.forEach((line, li) => {
      line.forEach((tok) => {
        // ✅ Kiểm tra nếu token chứa ký tự đặc biệt → tách thành các ô trống
        if (tok.content.includes(PLACEHOLDER)) {
          // Tách từng vị trí ô trống
          const parts = tok.content.split(PLACEHOLDER);
          parts.forEach((textPart, idx) => {
            // Phần chữ bình thường trước ô trống
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
            // Ô trống (trừ phần cuối cùng sau khi tách)
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
                    isOver={overId === bid}
                    isActiveTarget={closestTargetId === bid}
                    state={result?.slotStates[bid] ?? "idle"}
                    onClick={() => {
                      setAnswers((p) => {
                        const n = { ...p };
                        delete n[bid];
                        return n;
                      });
                      setResult(null);
                    }}
                  />,
                );
              }
            }
          });
          return;
        }

        // Phần chữ bình thường
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

      if (li < tokens.length - 1) {
        out.push(<span key={`n-${li}`}>{"\n"}</span>);
      }
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
    overId,
    closestTargetId,
    result,
  ]);

  /* ---------- 🎯 LOGIC KÉO THẢ AUTO-SNAP ---------- */
  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
    setClosestTargetId(null);
    setResult(null);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const over = e.over?.id as string | null;
    setOverId(over);
    if (over && blankIds.includes(over)) {
      setClosestTargetId(over);
    } else if (!over) {
      setClosestTargetId(null);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const from = e.active.id as string;
    let to: string | null = (e.over?.id as string) ?? closestTargetId;

    setActiveId(null);
    setOverId(null);
    setClosestTargetId(null);

    if (!to) return;
    if (!blankIds.includes(to)) return;

    const fromIsBlank = blankIds.includes(from);

    setAnswers((prev) => {
      const next = { ...prev };

      if (!fromIsBlank) {
        Object.keys(next).forEach((k) => {
          if (next[k] === from) delete next[k];
        });
        next[to] = from;
      } else if (fromIsBlank && from !== to) {
        const movingAnswer = prev[from];
        const existingAnswer = prev[to];
        if (!movingAnswer) return prev;
        delete next[from];
        next[to] = movingAnswer;
        if (existingAnswer) next[from] = existingAnswer;
      }

      return next;
    });
  };

  /* ---------- KIỂM TRA ---------- */
  const handleCheck = async () => {
    if (!allFilled) return;
    setLoading(true);
    setResult(null);
    try {
      if (onCheck) {
        const r = await onCheck(answers);
        const st: Record<string, "idle" | "correct" | "wrong"> = {};
        blankIds.forEach((id) => (st[id] = r.isCorrect ? "correct" : "idle"));
        setResult({
          isCorrect: r.isCorrect,
          explanation: r.explanation,
          slotStates: st,
        });
        if (!r.isCorrect) setShakeKey((k) => k + 1);
        return;
      }
      if (!correctAnswers) return;
      const st: Record<string, "idle" | "correct" | "wrong"> = {};
      let ok = true;
      blankIds.forEach((id) => {
        const v = answers[id] === correctAnswers[id];
        st[id] = v ? "correct" : "wrong";
        if (!v) ok = false;
      });
      setResult({
        isCorrect: ok,
        explanation: ok
          ? "Tuyệt vời! Bạn đã làm đúng hoàn toàn 🎉"
          : "Có vài chỗ chưa đúng, bạn thử kéo đổi lại nhé 💪",
        slotStates: st,
      });
      if (!ok) setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAnswers({});
    setResult(null);
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
          className="font-mono text-[15px] leading-7 select-none"
          style={{
            color: TOKYO.text,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          suppressHydrationWarning
        >
          {isMounted && shiki && renderedCode
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
                    isOver={overId === seg.id}
                    isActiveTarget={closestTargetId === seg.id}
                    state={result?.slotStates[seg.id] ?? "idle"}
                    onClick={() => {
                      setAnswers((p) => {
                        const n = { ...p };
                        delete n[seg.id];
                        return n;
                      });
                      setResult(null);
                    }}
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
        className="text-xl md:text-2xl leading-[3rem] font-medium text-gray-800"
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
              isOver={overId === seg.id}
              isActiveTarget={closestTargetId === seg.id}
              state={result?.slotStates[seg.id] ?? "idle"}
              onClick={() => {
                setAnswers((p) => {
                  const n = { ...p };
                  delete n[seg.id];
                  return n;
                });
                setResult(null);
              }}
            />
          ),
        )}
      </motion.div>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
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
            <span className="w-[52px]" />
          </div>
        )}

        <SortableContext
          items={blankIds}
          strategy={horizontalListSortingStrategy}
        >
          <div
            className="mb-6 p-4 md:p-5 rounded-2xl min-h-[100px] border overflow-x-auto"
            style={
              isCode
                ? { backgroundColor: TOKYO.surface, borderColor: TOKYO.border }
                : { backgroundColor: "#f9fafb", borderColor: "#f3f4f6" }
            }
          >
            {renderQuestion()}
          </div>
        </SortableContext>

        <SortableContext
          items={options.map((o) => o.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div
            className="flex flex-wrap gap-2.5 p-3 rounded-2xl min-h-[60px] mb-5 border"
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
                onClick={() => handleChipClick(o.id)} // ✅ TRUYỀN CALLBACK CLICK
              />
            ))}
          </div>
        </SortableContext>

        <div className="flex gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: allFilled && !loading ? 1.03 : 1 }}
            whileTap={{ scale: allFilled && !loading ? 0.96 : 1 }}
            onClick={handleCheck}
            disabled={!allFilled || loading}
            className="flex-1 min-w-[160px] py-3 rounded-2xl font-bold text-white text-lg border-b-[4px] active:border-b-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            style={{
              backgroundColor: finalAccent,
              borderColor: colorDarken(finalAccent, 25),
            }}
          >
            {loading ? "⏳ Đang kiểm tra..." : "KIỂM TRA"}
          </motion.button>
          <button
            onClick={reset}
            className="px-5 py-3 rounded-2xl font-bold border-b-[4px] active:border-b-0 transition-all"
            style={
              isCode
                ? {
                    color: TOKYO.text,
                    backgroundColor: TOKYO.border,
                    borderColor: TOKYO.cardBg,
                  }
                : {
                    color: "#4b5563",
                    backgroundColor: "#f3f4f6",
                    borderColor: "#e5e7eb",
                  }
            }
            onMouseEnter={(e) => {
              if (isCode)
                e.currentTarget.style.backgroundColor = TOKYO.borderMid;
            }}
            onMouseLeave={(e) => {
              if (isCode) e.currentTarget.style.backgroundColor = TOKYO.border;
            }}
          >
            LÀM LẠI
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="mt-5 p-4 rounded-2xl border-b-[4px] font-semibold"
              style={
                isCode
                  ? result.isCorrect
                    ? {
                        backgroundColor: `${TOKYO.correct}22`,
                        color: TOKYO.correct,
                        borderColor: TOKYO.correct,
                      }
                    : {
                        backgroundColor: `${TOKYO.wrong}22`,
                        color: TOKYO.wrong,
                        borderColor: TOKYO.wrong,
                      }
                  : undefined
              }
            >
              <p
                className={`text-lg ${!isCode ? (result.isCorrect ? "text-[#2e7d32]" : "text-[#ca282d]") : ""}`}
                style={
                  !isCode
                    ? {
                        backgroundColor: result.isCorrect
                          ? "#d7ffb8"
                          : "#ffdfe0",
                        borderBottomColor: result.isCorrect
                          ? "#58a700"
                          : "#f95459",
                      }
                    : undefined
                }
              >
                {result.isCorrect
                  ? "🎉 Chính xác tuyệt đối!"
                  : "😅 Chưa đúng hết, kéo đổi thử lại nhé"}
              </p>
              {result.explanation && (
                <p
                  className="text-sm mt-1 opacity-90 font-normal"
                  style={isCode ? { color: TOKYO.subtitle } : undefined}
                >
                  {result.explanation}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
