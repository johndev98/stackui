import { readFile } from "fs/promises";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkFrontmatter from "remark-frontmatter";
import rehypePrettyCode from "rehype-pretty-code";
import { useMDXComponents } from "@/mdx-components";
import { FillBlankQuiz } from "@/components/learn/ClientQuiz";
import { DragDropQuiz } from "@/components/learn/DragDropQuiz";
import { SplitLayout, SplitLeft, SplitRight } from "@/components/learn/SplitLayout";
import LessonSteps from "@/components/learn/LessonSteps";

type LessonContentProps = {
  courseSlug: string;
  lessonSlug?: string;
  currentLessonTitle?: string;
  nextLessonTitle?: string;
  nextLessonHref?: string;
  learnListHref?: string;
};

export async function LessonContent({
  courseSlug,
  lessonSlug,
  currentLessonTitle,
  nextLessonTitle,
  nextLessonHref,
  learnListHref,
}: LessonContentProps) {
  let content: string;
  try {
    const fileName = lessonSlug ?? "_index";
    const file = await readFile(
      `${process.cwd()}/content/courses/${courseSlug}/${fileName}.mdx`,
      "utf8",
    );
    //tách ra 2 phần: frontmatter và content
    const parsed = matter(file);
    content = parsed.content;
  } catch {
    return (
      <div className="py-6 text-content text-center">
        <p className="italic">Nội dung chi tiết đang được cập nhật.</p>
      </div>
    );
  }

  const AllComponents = {
    ...useMDXComponents(),
    FillBlankQuiz,
    DragDropQuiz,
    SplitLayout,
    SplitLeft,
    SplitRight,
  };

  // Validate content size before regex to prevent catastrophic backtracking
  const MAX_CONTENT_SIZE = 10 * 1024 * 1024; // 10MB limit
  if (content.length > MAX_CONTENT_SIZE) {
    return (
      <div className="py-6 text-content text-center">
        <p className="italic">
          Nội dung quá lớn, không thể hiển thị. Vui lòng liên hệ quản trị viên.
        </p>
      </div>
    );
  }

  function extractSteps(src: string): string[] {
    const steps: string[] = [];
    const tagOpen = /<Step(?:\s[^>]*)?>/gi;
    let m: RegExpExecArray | null;
    while ((m = tagOpen.exec(src)) !== null) {
      let depth = 1;
      const start = m.index + m[0].length;
      let pos = start;
      while (depth > 0 && pos < src.length) {
        const nextOpen = src.indexOf("<Step", pos);
        const nextClose = src.indexOf("</Step>", pos);
        if (nextClose === -1) break;
        if (nextOpen !== -1 && nextOpen < nextClose) {
          depth++;
          pos = nextOpen + 5;
        } else {
          depth--;
          if (depth === 0) steps.push(src.slice(start, nextClose));
          pos = nextClose + 7;
        }
      }
    }
    return steps;
  }

  let stepContents: string[] = [];
  try {
    stepContents = extractSteps(content);
  } catch (error) {
    console.error("Error parsing step blocks:", error);
  }

  const hasStepBlocks = stepContents.length > 0;
  if (!hasStepBlocks) stepContents = [content];

  const stepHasSplitLayout = stepContents.map((s) =>
    /<SplitLayout[\s/>]/i.test(s),
  );

  return (
    <div className="space-y-4">
      {hasStepBlocks ? (
        <LessonSteps
          currentLessonTitle={currentLessonTitle}
          nextLessonTitle={nextLessonTitle}
          nextLessonHref={nextLessonHref}
          learnListHref={learnListHref}
          hasStepBlocks={hasStepBlocks}
          stepHasSplitLayout={stepHasSplitLayout}
        >
          {stepContents.map((stepSource, index) => (
            <MDXRemote
              key={index}
              source={stepSource}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkFrontmatter],
                  rehypePlugins: [
                    [
                      rehypePrettyCode,
                      { theme: "tokyo-night", keepBackground: true },
                    ],
                  ],
                },
              }}
              components={AllComponents}
            />
          ))}
        </LessonSteps>
      ) : (
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkFrontmatter],
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  { theme: "tokyo-night", keepBackground: true },
                ],
              ],
            },
          }}
          components={AllComponents}
        />
      )}
    </div>
  );
}
