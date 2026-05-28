import { Bot } from "lucide-react";

type Props = { state: "idle" | "speaking" | "listening" | "thinking"; size?: number };

export default function AIAvatar({ state, size = 220 }: Props) {
  const glow =
    state === "speaking" ? "animate-pulse-glow" :
    state === "listening" ? "ring-neon" :
    state === "thinking" ? "animate-pulse" : "";

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full gradient-primary animate-gradient blur-3xl opacity-40" />
      <div className={`absolute inset-4 rounded-full border border-primary/40 ${state === "listening" ? "animate-ping" : ""}`} />
      <div className={`absolute inset-8 rounded-full border border-violet/40 animate-orbit`} style={{ animationDuration: "10s" }} />
      <div className={`relative size-1/2 rounded-full glass-strong grid place-items-center ${glow}`}>
        <div className="absolute inset-2 rounded-full gradient-primary opacity-80 animate-gradient" />
        <Bot className="relative size-1/2 text-primary-foreground" strokeWidth={1.6} />
      </div>
      {state === "speaking" && (
        <div className="absolute bottom-2 flex items-end gap-1 h-8">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-neon animate-voice-wave"
              style={{ height: "100%", animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
