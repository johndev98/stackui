import { readFile } from "fs/promises";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkFrontmatter from "remark-frontmatter";
import rehypePrettyCode from "rehype-pretty-code";
import { useMDXComponents } from "@/mdx-components";
import { FillBlankQuiz } from "@/components/learn/ClientQuiz";
import { DragDropQuiz } from "@/components/learn/DragDropQuiz";
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

  let stepMatches: RegExpMatchArray[] = [];
  try {
    stepMatches = Array.from(
      content.matchAll(/<Step(?:\s[^>]*)?>([\s\S]*?)<\/Step>/gi),
    );
  } catch (error) {
    console.error("Error parsing step blocks:", error);
    // Fallback: treat entire content as single step
    return (
      <div className="space-y-4">
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
          components={{
            ...useMDXComponents(),
            FillBlankQuiz,
            DragDropQuiz,
          }}
        />
      </div>
    );
  }

  const hasStepBlocks = stepMatches.length > 0;
  const stepContents = hasStepBlocks
    ? stepMatches
        .map((match) => match[1]?.trim())
        .filter((content): content is string => Boolean(content))
    : [content];

  return (
    <div className="space-y-4">
      {hasStepBlocks ? (
        <LessonSteps
          currentLessonTitle={currentLessonTitle}
          nextLessonTitle={nextLessonTitle}
          nextLessonHref={nextLessonHref}
          learnListHref={learnListHref}
          hasStepBlocks={hasStepBlocks}
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
