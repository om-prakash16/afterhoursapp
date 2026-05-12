"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Cpu, 
  MessageSquare,
  Activity
} from "lucide-react";

export default function VoiceAssistant({ onQuery }: { onQuery: (q: string) => Promise<string> }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        if (event.results[current].isFinal) {
          handleVoiceQuery(text);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      setTranscript("Listening...");
      setResponse("");
      recognitionRef.current?.start();
    }
  };

  const handleVoiceQuery = async (query: string) => {
    const res = await onQuery(query);
    setResponse(res);
    speak(res);
  };

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.1;
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      synth.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-32 right-8 z-[200] flex flex-col items-end gap-4">
      
      {/* Response Bubbles */}
      {(transcript || response) && (
        <div className="max-w-xs space-y-2 animate-in slide-in-from-bottom-4 duration-500">
           {transcript && (
             <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-400 backdrop-blur-xl">
                <span className="text-indigo-400 font-bold uppercase text-[8px] block mb-1">Your Query</span>
                {transcript}
             </div>
           )}
           {response && (
             <div className="bg-indigo-600 border border-indigo-500/20 rounded-2xl p-4 text-xs text-white shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                   <Volume2 size={12} />
                </div>
                <span className="text-white/60 font-bold uppercase text-[8px] block mb-1">Aura's Audit</span>
                {response}
             </div>
           )}
        </div>
      )}

      {/* Voice Trigger Toggle */}
      <button 
        onClick={toggleListening}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-2xl relative group ${
          isListening ? "bg-rose-600 scale-110 shadow-rose-600/40" : "bg-indigo-600 hover:scale-105 shadow-indigo-600/40"
        }`}
      >
        {isListening ? (
          <div className="relative">
             <MicOff size={24} className="text-white" />
             <div className="absolute inset-[-12px] border-4 border-white/20 rounded-full animate-ping" />
          </div>
        ) : (
          <Mic size={24} className="text-white" />
        )}
        
        {/* Animated Sound Wave */}
        {isSpeaking && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-1 h-8 items-end">
             <div className="w-1 bg-white rounded-full animate-sound-wave-1" />
             <div className="w-1 bg-white rounded-full animate-sound-wave-2" />
             <div className="w-1 bg-white rounded-full animate-sound-wave-3" />
             <div className="w-1 bg-white rounded-full animate-sound-wave-2" />
             <div className="w-1 bg-white rounded-full animate-sound-wave-1" />
          </div>
        )}
      </button>

    </div>
  );
}
