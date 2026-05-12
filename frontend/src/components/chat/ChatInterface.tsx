"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { chatWithAI } from "@/lib/api";
import { Cpu, Info, Send, Bot, Sparkles } from "lucide-react";
import VoiceAssistant from "./VoiceAssistant";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Commander, I've analyzed the latest market DNA. Sentiment is slightly greed-heavy. How can I help you navigate the next move?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await chatWithAI(content);
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      return response.response;
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Operational interference detected. Please try reconnecting to the Aura core.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return "Operational interference detected.";
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-200px)] max-w-5xl mx-auto glass-morphism rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden mt-10">
        {/* ... (Existing Chat UI) ... */}
        {/* Chat Header */}
        <div className="flex items-center justify-between px-8 py-6 bg-white/5 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Cpu size={24} />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg tracking-tight">Aura Terminal</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Cognitive Link Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 scroll-smooth custom-scrollbar bg-transparent"
        >
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none px-6 py-4">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-10 bg-white/5 border-t border-white/5">
          <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
      </div>
      
      <VoiceAssistant onQuery={handleSendMessage} />
    </>
  );
}
