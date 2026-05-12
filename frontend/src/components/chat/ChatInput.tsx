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
    <div className="relative group flex items-end gap-3 bg-white/5 border border-white/10 rounded-[1.5rem] p-3 pr-4 focus-within:border-indigo-500/50 transition-all">
      <div className="flex items-center gap-1 pb-1.5">
        <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
          <ImageIcon size={20} />
        </button>
      </div>
      
      <textarea
        ref={textareaRef}
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Analyze market conditions..."
        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-600 py-2.5 resize-none max-h-[200px] min-h-[44px] font-medium"
        disabled={disabled}
      />
      
      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className={cn(
          "mb-1 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
          message.trim() && !disabled
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 active:scale-95"
            : "bg-white/5 text-slate-600 cursor-not-allowed"
        )}
      >
        <Send size={18} />
      </button>
    </div>
  );
}
