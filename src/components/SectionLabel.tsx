export default function SectionLabel({
  n,
  children,
  center = false,
}: {
  n: string;
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div
      data-reveal
      className={`mb-10 flex items-center gap-4 ${center ? "justify-center" : ""}`}
    >
      <span className="font-mono text-xs text-violet">{n}</span>
      <span className="h-px w-10 bg-line" />
      <span className="eyebrow">{children}</span>
    </div>
  );
}
