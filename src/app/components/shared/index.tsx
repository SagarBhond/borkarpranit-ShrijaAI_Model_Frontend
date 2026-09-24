import { Check, Copy } from "lucide-react";
import { useState } from "react";

export const StatusDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = { online: "bg-green-500", busy: "bg-yellow-500", offline: "bg-muted-foreground" };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] ?? "bg-muted-foreground"}`} />;
};

export const Badge = ({ label }: { label: string }) => (
  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-foreground bg-foreground text-background">
    {label}
  </span>
);

export const PriorityBadge = ({ priority }: { priority: string }) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    high: { bg: "bg-foreground", text: "text-background", label: "High" },
    medium: { bg: "bg-secondary", text: "text-foreground", label: "Medium" },
    low: { bg: "bg-background", text: "text-muted-foreground", label: "Low" },
  };
  const s = map[priority];
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-border ${s.bg} ${s.text}`}>{s.label}</span>;
};

export const StatusChip = ({ status }: { status: string }) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    completed: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", label: "Completed" },
    "in-progress": { bg: "bg-foreground/10", text: "text-foreground", label: "In Progress" },
    pending: { bg: "bg-muted/50", text: "text-muted-foreground", label: "Pending" },
  };
  const s = map[status];
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.bg} ${s.text}`}>{s.label}</span>;
};

export const FileIcon = ({ type }: { type: string }) => {
  return (
    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold uppercase bg-secondary text-foreground border border-border">
      {type}
    </div>
  );
};

export const ThinkingDots = () => (
  <div className="flex items-center gap-1 py-1">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 rounded-full bg-foreground"
        style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
      />
    ))}
    <style>{`
      @keyframes bounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-6px); opacity: 1; }
      }
    `}</style>
  </div>
);

export const CodeBlock = ({ code, lang = "typescript" }: { code: string; lang?: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-xl overflow-hidden border border-border my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
        <span className="text-xs text-muted-foreground font-mono">{lang}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono text-foreground overflow-x-auto bg-card">
        <code>{code}</code>
      </pre>
    </div>
  );
};
