"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@ai-sdk/react";
import { Bot, Command, Send, Sparkles } from "lucide-react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-50 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Antigravity AI Agent</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Command className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8 border border-zinc-800">
            <AvatarFallback className="bg-zinc-800 text-xs">ME</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden flex flex-col items-center">
        <ScrollArea className="flex-1 w-full max-w-4xl px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center mt-32 space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-500 shadow-[0_0_40px_rgba(124,58,237,0.3)]">
                <Bot className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold tracking-tight">How can I help you today?</h2>
                <p className="text-zinc-400 max-w-md mx-auto">
                  I am your AI assistant, equipped with tools to search the web, execute code, and access your database.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-8 w-full max-w-lg">
                {[
                  "Write a Python script",
                  "Review my latest PR",
                  "Query the database",
                  "Search the web for news",
                ].map((suggestion, i) => (
                  <Card
                    key={i}
                    className="p-4 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer text-sm text-zinc-300 flex items-center justify-center"
                    onClick={() => handleInputChange({ target: { value: suggestion } } as any)}
                  >
                    {suggestion}
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                >
                  <Avatar className="h-8 w-8 shrink-0 mt-1">
                    {message.role === "user" ? (
                      <AvatarFallback className="bg-zinc-800 text-xs">ME</AvatarFallback>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-violet-600">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </Avatar>
                  <div
                    className={`flex flex-col max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"
                      }`}
                  >
                    <div
                      className={`px-5 py-3 rounded-2xl text-[15px] leading-relaxed ${message.role === "user"
                        ? "bg-violet-600 text-white rounded-tr-sm"
                        : "bg-zinc-900 text-zinc-100 rounded-tl-sm border border-zinc-800"
                        }`}
                    >
                      {message.parts.map((part) => part.type)}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 flex-row">
                  <Avatar className="h-8 w-8 shrink-0 mt-1">
                    <div className="flex h-full w-full items-center justify-center bg-violet-600">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  </Avatar>
                  <div className="px-5 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 rounded-tl-sm flex items-center gap-1">
                    <span className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="w-full max-w-4xl p-4 bg-zinc-950">
          <div className="relative flex items-center">
            <form onSubmit={handleSubmit} className="w-full relative flex items-center">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask your AI agent anything..."
                className="w-full pl-6 pr-14 py-6 rounded-full bg-zinc-900 border-zinc-800 focus-visible:ring-1 focus-visible:ring-violet-500 text-base shadow-lg"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 h-9 w-9 rounded-full bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 transition-all"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
          <p className="text-center text-xs text-zinc-500 mt-3">
            AI Agent can make mistakes. Consider verifying critical information.
          </p>
        </div>
      </main>
    </div>
  );
}
