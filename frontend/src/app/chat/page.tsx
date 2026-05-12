import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#020617] pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
      <ChatInterface />
    </main>
  );
}
