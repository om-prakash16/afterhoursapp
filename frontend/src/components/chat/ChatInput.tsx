"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <div className="relative group flex items-end gap-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-2 pr-3 shadow-lg focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all">
      <div className="flex items-center gap-1 pl-1 pb-1.5">
        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
          <ImageIcon size={20} />
        </button>
        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
          <Smile size={20} />
        </button>
      </div>
      
      <textarea
        ref={textareaRef}
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 py-2 resize-none max-h-[200px] min-h-[40px]"
        disabled={disabled}
      />
      
      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className={cn(
          "mb-1 p-2.5 rounded-xl transition-all duration-200",
          message.trim() && !disabled
            ? "bg-indigo-600 text-white shadow-indigo-200 shadow-lg hover:bg-indigo-700 active:scale-95"
            : "bg-slate-100 text-slate-400 cursor-not-allowed"
        )}
      >
        <Send size={18} />
      </button>
    </div>
  );
}
