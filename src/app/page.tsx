import { ChatContainer } from "@/components/chat/ChatContainer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-semibold">DeepSeek Chat</h1>
      </header>
      <div className="flex-grow">
        <ChatContainer />
      </div>
    </main>
  );
}
