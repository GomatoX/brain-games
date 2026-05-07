interface CodeBlockProps {
  code: string;
  className?: string;
}

export const CodeBlock = ({ code, className = "" }: CodeBlockProps) => {
  return (
    <pre
      className={`bg-foreground text-muted rounded-md p-4 text-sm overflow-x-auto ${className}`}
    >
      <code>{code}</code>
    </pre>
  );
};
