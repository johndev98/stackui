import { readFile } from "fs/promises";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkFrontmatter from "remark-frontmatter";
import rehypePrettyCode from "rehype-pretty-code";
import { useMDXComponents } from "@/mdx-components";
import { FillBlankQuiz } from "@/content/courses/_shared/ClientQuiz";
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
    const parsed = matter(file);
    content = parsed.content;
  } catch {
    return (
      <div className="py-6 text-content text-center">
        <p className="italic">Nội dung chi tiết đang được cập nhật.</p>
      </div>
    );
  }

  const tatCaComponents = {
    ...useMDXComponents(),
    FillBlankQuiz,
  };

  const stepMatches = Array.from(
    content.matchAll(/<Step(?:\s[^>]*)?>([\s\S]*?)<\/Step>/gi),
  );
  const hasStepBlocks = stepMatches.length > 0;
  const stepContents = hasStepBlocks
    ? stepMatches.map((match) => match[1].trim())
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
              components={tatCaComponents}
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
          components={tatCaComponents}
        />
      )}
    </div>
  );
}
