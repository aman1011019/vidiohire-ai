import { useState } from "react";
import { Bot, Send, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUGGESTIONS = [
  "How do I improve my AI score?",
  "Find top-matched jobs for me",
  "Tips for video resume",
  "Schedule a mock interview",
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hey 👋 I'm Vidi, your hiring copilot. Ask me anything." },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text:
            text.toLowerCase().includes("score")
              ? "Boost it by re-recording your intro with clearer pacing and stronger eye contact. Try a 60-second pitch with 3 concrete wins."
              : "Got it — I'll surface tailored recommendations in your dashboard within a moment.",
        },
      ]);
    }, 700);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full gradient-primary glow-strong grid place-items-center hover:scale-105 transition-all animate-pulse-glow"
        aria-label="AI Assistant"
      >
        {open ? <X className="size-5 text-primary-foreground" /> : <Bot className="size-6 text-primary-foreground" />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[92vw] h-[520px] glass-strong rounded-2xl border border-border shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-4">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Sparkles className="size-4 text-neon" />
            <div className="font-semibold">Vidi · Hiring Copilot</div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  m.role === "user" ? "gradient-primary text-primary-foreground" : "bg-muted/60 text-foreground"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="px-3 pb-2 flex flex-wrap gap-1">
            {SUGGESTIONS.slice(0, 3).map((s) => (
              <button key={s} onClick={() => send(s)} className="text-xs px-2 py-1 rounded-full border border-border hover:bg-accent/40">
                {s}
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask Vidi…"
            />
            <Button size="icon" onClick={() => send(input)} className="gradient-primary"><Send className="size-4" /></Button>
          </div>
        </div>
      )}
    </>
  );
}
