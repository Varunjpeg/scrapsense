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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all duration-300 flex items-center justify-center border border-white/10 group cursor-pointer"
        >
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-900 absolute -top-1.5 -right-1.5 animate-pulse" />
            <MessageSquare className="w-6 h-6" />
          </div>
        </button>
      )}

      {/* Expanded Support Chat Drawer */}
      {isOpen && (
        <div className="glassmorphism w-[340px] sm:w-[380px] h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/25 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header Panel */}
          <div className="p-4 bg-gradient-to-r from-emerald-950/80 to-slate-950 border-b border-emerald-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Leaf className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">EcoBot AI</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-semibold text-emerald-400/90 tracking-wide uppercase">Online Support</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/40">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${
                  msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-500 text-slate-950 rounded-tr-none shadow-md shadow-emerald-500/10 font-semibold"
                      : "bg-slate-900 border border-white/5 text-gray-200 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] font-mono text-gray-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form Footer */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-slate-950/90 border-t border-white/5 flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about scrap rates, rewards, gold extraction..."
              className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/30"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-md shadow-emerald-500/15"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
