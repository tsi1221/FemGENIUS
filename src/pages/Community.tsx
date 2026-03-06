import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { motion } from "motion/react";
import { Send, User as UserIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

let socket: Socket;

export default function Community() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [userName] = useState(`Genius_${Math.floor(Math.random() * 1000)}`);

  useEffect(() => {
    socket = io();

    socket.on("chat:history", (history) => {
      setMessages(history);
    });

    socket.on("chat:message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    socket.emit("chat:message", {
      text: input,
      user: userName,
    });
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-brand-dark">Sisterhood Circle</h1>
        <p className="text-slate-500">Connect, share, and grow together.</p>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[80%]",
                msg.user === userName ? "ml-auto items-end" : "items-start"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{msg.user}</span>
              </div>
              <div className={cn(
                "px-4 py-2 rounded-2xl text-sm",
                msg.user === userName 
                  ? "bg-brand-purple text-white rounded-tr-none" 
                  : "bg-slate-100 text-slate-700 rounded-tl-none"
              )}>
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-300 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={sendMessage} className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
          />
          <button
            type="submit"
            className="w-10 h-10 bg-brand-purple text-white rounded-xl flex items-center justify-center hover:bg-brand-purple/90 transition-all active:scale-95"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
