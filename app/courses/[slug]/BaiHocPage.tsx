import { readFile } from "fs/promises";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkFrontmatter from "remark-frontmatter";
import rehypePrettyCode from "rehype-pretty-code";
import { useMDXComponents } from "@/mdx-components";
import { FillBlankQuiz } from "@/content/courses/ClientQuiz";

type Props = { slug: string };

export async function BaiHocPage({ slug }: Props) {
  let content: string;
  try {
    const file = await readFile(
      `${process.cwd()}/content/courses/${slug}.mdx`,
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
        components={tatCaComponents}
      />
    </div>
  );
}
