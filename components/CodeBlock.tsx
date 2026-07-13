import { codeToHast, type BundledLanguage } from "shiki";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type JSX } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import CodeBlockPre from "./CodeBlockPre";

interface Props {
  children: string;
  lang: BundledLanguage;
}

export async function CodeBlock({ children, lang }: Props) {
  const cleanCode = children.trim();

  const hast = await codeToHast(cleanCode, {
    lang,
    theme: "tokyo-night",
    transformers: [
      {
        line(node) {
          node.properties.class = ["line"];
          return node;
        },
      },
    ],
  });

  return toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
    components: {
      pre: (preProps) => (
        <CodeBlockPre
          {...preProps}
          rawCode={cleanCode}
          lang={lang}
          className={`${preProps.className ?? ""} font-mono font-medium rounded-xl border border-zinc-800 overflow-x-auto p-5 w-full`}
        />
      ),
      code: ({ className = "", ...props }) => (
        <code {...props} className={className.replace(/language-\w+/, "")} />
      ),
    },
  }) as JSX.Element;
}
