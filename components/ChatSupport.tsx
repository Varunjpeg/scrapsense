"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Leaf } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { chatMessages, addChatMessage } = useApp();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    addChatMessage(inputValue, "user");
    setInputValue("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 text-left">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center border border-emerald-400/20 cursor-pointer"
        >
          <div className="relative">
            <span className="w-2 h-2 rounded-full bg-white absolute -top-1 -right-1 animate-pulse" />
            <MessageSquare className="w-5.5 h-5.5" />
          </div>
        </button>
      )}

      {/* Expanded Support Chat Drawer */}
      {isOpen && (
        <div className="glassmorphism w-[330px] sm:w-[360px] h-[460px] rounded-2xl overflow-hidden shadow-2xl border border-card-border flex flex-col justify-between bg-card animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header Panel */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 to-emerald-500 border-b border-card-border flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-white/10 text-white border border-white/20 shadow-inner">
                <Leaf className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-black leading-tight uppercase font-mono tracking-wider">EcoBot AI</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[9px] font-bold opacity-90 tracking-wider uppercase font-mono">Assisting Live</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-background shadow-inner">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${
                  msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm font-medium ${
                    msg.sender === "user"
                      ? "bg-emerald-500 text-white rounded-tr-none"
                      : "bg-card border border-card-border text-foreground rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[8px] font-mono text-muted-text mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form Footer */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-card border-t border-card-border flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about compliance, yields, doorstep pickup..."
              className="flex-1 bg-background border border-card-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder-slate-400 focus:outline-none focus:border-emerald-500/40"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
