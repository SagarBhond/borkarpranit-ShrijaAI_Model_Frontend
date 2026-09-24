// src/components/chat/MessageCard.tsx
import React, { useState } from "react";
import { Sparkles, Cpu, Copy, ThumbsUp, ThumbsDown, RefreshCw, User } from "lucide-react";
import { Message } from "../../types";
import { ThinkingDots, CodeBlock } from "../shared";
export { ChatInput } from './ChatInput';

export const MessageCard = ({ msg }: { msg: Message }) => {
  const isAI = msg.role === "assistant";
  const [copied, setCopied] = useState(false);

  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const lines = part.slice(3, -3).split("\n");
        const lang = lines[0].trim() || "code";
        const code = lines.slice(1).join("\n");
        return <CodeBlock key={i} code={code} lang={lang} />;
      }
      const formatted = part
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-secondary text-foreground text-sm font-mono">$1</code>')
        .replace(/\n/g, "<br />");
      return <p key={i} className="leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (msg.thinking) {
    return (
      <div className="flex justify-start px-6 py-4">
        <div className="flex gap-3 max-w-3xl">
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-foreground text-background">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Shrija AI</div>
            <div className="rounded-2xl px-4 py-3 border border-border bg-card">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Cpu size={12} />
                <span>Thinking</span>
                <ThinkingDots />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`px-6 py-4 ${isAI ? "bg-transparent" : "bg-secondary/10"}`}>
      <div className={`flex gap-4 max-w-3xl mx-auto ${isAI ? "justify-start" : "justify-end"}`}>
        {/* Avatar - Left for AI */}
        {isAI && (
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-foreground text-background">
            <Sparkles size={16} />
          </div>
        )}

        {/* Message Content */}
        <div className={`flex-1 ${isAI ? "" : "flex flex-col items-end"}`}>
          {/* Sender name */}
          <div className={`text-xs font-medium text-muted-foreground mb-1 ${isAI ? "text-left" : "text-right"}`}>
            {isAI ? "Shrija AI" : "You"}
          </div>
          
          {/* Message bubble */}
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              isAI 
                ? "border border-border bg-card text-foreground" 
                : "bg-foreground text-background"
            }`}
            style={{ maxWidth: "80%" }}
          >
            <div className="space-y-2 leading-relaxed">
              {renderContent(msg.content)}
            </div>
          </div>

          {/* Action buttons - only for AI messages */}
          {isAI && (
            <div className="flex items-center gap-1 mt-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all text-xs"
                title="Copy"
              >
                <Copy size={14} />
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                className="flex items-center gap-1 px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all text-xs"
                title="Good response"
              >
                <ThumbsUp size={14} />
              </button>
              <button
                className="flex items-center gap-1 px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all text-xs"
                title="Bad response"
              >
                <ThumbsDown size={14} />
              </button>
              <button
                className="flex items-center gap-1 px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all text-xs"
                title="Regenerate"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Avatar - Right for User */}
        {!isAI && (
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary">
            <User size={16} />
          </div>
        )}
      </div>
    </div>
  );
};