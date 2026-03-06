interface CodeBlockProps {
  code: string;
  className?: string;
}

export const CodeBlock = ({ code, className = "" }: CodeBlockProps) => {
  return (
    <pre
      className={`bg-[#1e293b] text-slate-300 rounded-[4px] p-4 text-sm overflow-x-auto ${className}`}
    >
      <code>{code}</code>
    </pre>
  );
};
