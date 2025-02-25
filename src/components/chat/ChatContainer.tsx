"use client";

import { IMessage } from "@/lib/models/Chat";
import React, { useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { Message } from "./Message";

interface ChatContainerProps {
  chatId?: string;
  initialMessages?: IMessage[];
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  chatId,
  initialMessages = [],
}) => {
  const [messages, setMessages] = useState<IMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    setError(null);
    const userMessage: IMessage = {
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          message: content,
          messages: messages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || "Failed to send message"
        );
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantMessage += chunk;

          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];

            if (lastMessage?.role === "assistant") {
              lastMessage.content = assistantMessage;
              return [...newMessages];
            } else {
              return [
                ...newMessages,
                {
                  role: "assistant",
                  content: assistantMessage,
                  timestamp: new Date(),
                },
              ];
            }
          });
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="flex-grow overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Start a conversation by sending a message...
          </div>
        )}
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-100 rounded-lg animate-fade-in">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="flex justify-start px-4 animate-pulse">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm">
              <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};
