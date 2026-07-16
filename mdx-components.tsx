// mdx-components.tsx
import type { MDXComponents } from "mdx/types";
import LivePreview from "./components/LivePreview";
import Counter from "./components/demos/Counter";

export function useMDXComponents(): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-heading mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold text-heading mt-6 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-medium text-heading mt-5 mb-2">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-content leading-7 mb-4">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-content space-y-1 mb-4">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-content space-y-1 mb-4">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="text-content">{children}</li>,

    code: ({ children, ...props }) => (
      <code className="font-mono text-sm" {...props}>
        {children}
      </code>
    ),

    pre: ({ children, ...props }) => {
      const lang = props["data-language"] || "";
      return (
        <div className="max-h-88 overflow-y-auto rounded-lg border border-white/10 mb-4">
          {lang && (
            <span className="sticky top-0 z-10 block px-3 py-1.5 text-sm font-mono bg-[#1a1b26] border-b border-white/10 text-primary rounded-t-lg">
              .{lang}
            </span>
          )}
          <pre className="px-6 py-3 m-0 text-sm font-mono" {...props}>
            {children}
          </pre>
        </div>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 text-content italic mb-4">
        {children}
      </blockquote>
    ),
    a: ({ children, ...props }) => (
      <a className="text-primary hover:underline" {...props}>
        {children}
      </a>
    ),
    hr: () => <hr className="border-white/10 my-6" />,
    strong: ({ children }) => (
      <strong className="text-heading font-semibold">{children}</strong>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-content text-sm">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="text-left text-heading font-medium px-3 py-2 border-b border-white/10">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2 border-b border-white/5">{children}</td>
    ),
    Note: ({ children }) => (
      <div className="border-l-4 border-blue-500 bg-blue-500/10 p-4 my-4 rounded-r-lg">
        <p className="text-blue-400 font-semibold mb-1">📝 Note</p>
        <p className="text-content leading-7">{children}</p>
      </div>
    ),

    Tip: ({ children }) => (
      <div className="border-l-4 border-green-500 bg-green-500/10 p-4 my-4 rounded-r-lg">
        <p className="text-green-400 font-semibold mb-1">💡 Tip</p>
        <p className="text-content leading-7">{children}</p>
      </div>
    ),

    Warning: ({ children }) => (
      <div className="border-l-4 border-yellow-500 bg-yellow-500/10 p-4 my-4 rounded-r-lg">
        <p className="text-yellow-400 font-semibold mb-1">⚠️ Warning</p>
        <p className="text-content leading-7">{children}</p>
      </div>
    ),

    Highlight: ({
      children,
      color = "primary",
    }: {
      children: React.ReactNode;
      color?: "primary" | "green" | "red" | "blue" | "purple";
    }) => {
      const colors: Record<string, string> = {
        primary: "bg-primary/20 text-primary",
        green: "bg-green-500/20 text-green-400",
        red: "bg-red-500/20 text-red-400",
        blue: "bg-blue-500/20 text-blue-400",
        purple: "bg-purple-500/20 text-purple-400",
      };
      return (
        <span
          className={`px-1.5 py-0.5 rounded text-sm font-medium ${colors[color]}`}
        >
          {children}
        </span>
      );
    },
    LivePreview,
    Counter,
  };
}
