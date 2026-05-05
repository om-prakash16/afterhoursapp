import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export default function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isAssistant = role === "assistant";

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm md:text-base transition-all",
          isAssistant
            ? "bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none"
            : "bg-indigo-600 text-white shadow-indigo-100 shadow-lg rounded-tr-none"
        )}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <span
            className={cn(
              "text-[10px] mt-1 block opacity-50 text-right",
              isAssistant ? "text-slate-400" : "text-indigo-200"
            )}
          >
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
