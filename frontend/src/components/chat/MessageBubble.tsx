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
          "max-w-[85%] rounded-[1.5rem] px-6 py-4 text-sm md:text-base transition-all",
          isAssistant
            ? "bg-white/5 text-slate-300 border border-white/5 rounded-tl-none"
            : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 rounded-tr-none font-medium"
        )}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <span
            className={cn(
              "text-[9px] mt-2 block font-black uppercase tracking-widest text-right",
              isAssistant ? "text-slate-500" : "text-indigo-200"
            )}
          >
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
