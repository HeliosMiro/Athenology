import { useState } from "react";
import Markdown from "react-markdown";
import { Copy, Check, Sparkles, User, FileText, RefreshCw, AlertCircle } from "lucide-react";
import { Message } from "../types";

interface ChatMessageProps {
  message: Message;
  isLastAssistantMessage?: boolean;
  onRetry?: () => void;
  isGenerating?: boolean;
}

export function ChatMessage({ message, isLastAssistantMessage, onRetry, isGenerating }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";
  const hasError = message.content.includes("encountered a connection issue") || message.content.includes("[Notice:");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`py-4 px-4 sm:px-6 rounded-xl transition-colors ${
        isAssistant
          ? hasError
            ? "bg-amber-50/70 border border-amber-200 shadow-2xs"
            : "bg-[#fdfcf9] border border-stone-200/80 shadow-2xs"
          : "bg-stone-100/70 border border-stone-200/50"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
              isAssistant
                ? hasError
                  ? "bg-amber-800 text-amber-100"
                  : "bg-stone-900 text-stone-100 font-serif"
                : "bg-stone-300 text-stone-800"
            }`}
          >
            {isAssistant ? (hasError ? <AlertCircle className="w-3.5 h-3.5" /> : "M") : <User className="w-3.5 h-3.5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-serif font-bold text-stone-900">
                {isAssistant ? "Memory Link" : "You (Student / Inquirer)"}
              </span>
              {isAssistant && (
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200/60">
                  Educational AI
                </span>
              )}
              {message.groundedInResearch && (
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-stone-200 text-stone-800 flex items-center gap-1">
                  <FileText className="w-2.5 h-2.5 text-stone-600" />
                  Grounded in Provided Course Materials
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {isAssistant && isLastAssistantMessage && onRetry && !isGenerating && (
            <button
              type="button"
              onClick={onRetry}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors text-xs flex items-center gap-1"
              title="Regenerate / Retry response"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="text-[10px]">Retry</span>
            </button>
          )}

          {isAssistant && message.content.length > 0 && (
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors text-xs flex items-center gap-1"
              title="Copy explanation"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Message Content with Markdown */}
      <div className="prose prose-stone max-w-none text-sm leading-relaxed text-stone-800 space-y-2">
        {message.content ? (
          <div className="markdown-body">
            <Markdown
              components={{
                h1: ({ children }) => (
                  <h1 className="font-serif font-bold text-stone-900 text-base mt-4 mb-2 pb-1 border-b border-stone-200">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="font-serif font-semibold text-stone-900 text-sm mt-3 mb-1.5">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="font-serif font-medium text-stone-900 text-xs uppercase tracking-wider mt-2.5 mb-1 text-amber-900">
                    {children}
                  </h3>
                ),
                p: ({ children }) => <p className="mb-2 text-stone-800 leading-relaxed">{children}</p>,
                ul: ({ children }) => (
                  <ul className="list-disc list-outside ml-4 mb-2 space-y-1 text-stone-800">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-outside ml-4 mb-2 space-y-1 text-stone-800">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="text-stone-800">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-amber-600 pl-3 italic text-stone-700 my-2 bg-stone-100/50 py-1 rounded-r">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-stone-950">{children}</strong>
                ),
                code: ({ children }) => (
                  <code className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded text-xs font-mono">
                    {children}
                  </code>
                ),
              }}
            >
              {message.content}
            </Markdown>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-stone-500 italic text-xs py-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-600" />
            <span>Consulting social and cognitive psychological research...</span>
          </div>
        )}
      </div>
    </div>
  );
}
