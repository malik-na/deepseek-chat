import { IMessage } from "@/lib/models/Chat";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MessageProps {
  message: IMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4 px-4 animate-fade-in`}
    >
      <div
        className={`max-w-[85%] ${
          isUser
            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-sm"
        } px-6 py-4 shadow-sm`}
      >
        <div
          className={`prose ${
            isUser ? "prose-invert" : "prose-gray dark:prose-invert"
          } max-w-none prose-pre:p-0 prose-pre:my-0 prose-p:leading-relaxed prose-headings:mb-2 prose-headings:mt-4`}
        >
          <ReactMarkdown
            components={{
              code({ inline, className, children }) {
                const match = /language-(\w+)/.exec(className || "");
                return inline ? (
                  <code className="bg-gray-800 text-gray-200 rounded px-1 py-0.5">
                    {children}
                  </code>
                ) : (
                  <div className="my-4 rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match?.[1] || "text"}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                );
              },
              p({ children }) {
                return <p className="mb-4 last:mb-0">{children}</p>;
              },
              ul({ children }) {
                return (
                  <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>
                );
              },
              ol({ children }) {
                return (
                  <ol className="list-decimal ml-6 mb-4 space-y-2">
                    {children}
                  </ol>
                );
              },
              li({ children }) {
                return <li className="mb-1">{children}</li>;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
