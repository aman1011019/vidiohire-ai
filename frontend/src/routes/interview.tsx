import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AIAvatar from "@/components/AIAvatar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Sparkles, Brain, Upload, Play, FastForward,
  Monitor, MonitorOff, Shield, AlertTriangle, Maximize, Eye, EyeOff,
} from "lucide-react";
import { INTERVIEW_PERSONAS, generateQuestions } from "@/lib/mock-data";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { wsClient } from "@/lib/websocket";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/interview")({
  head: () => ({ meta: [{ title: "AI Live Interview · VidioHire AI" }] }),
  component: Interview,
});

type Phase = "setup" | "rules" | "live" | "ended";

function useSpeak() {
  return (text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.98; u.pitch = 1.02;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => /female|samantha|google.*us/i.test(v.name)) ?? voices[0];
    if (pref) u.voice = pref;
    u.onend = () => onEnd?.();
    window.speechSynthesis.speak(u);
  };
}

function Interview() {
  const nav = useNavigate();
  const [phase, setPhase] = useState<Phase>("setup");
  const [persona, setPersona] = useState("technical");
  const [skillsInput, setSkillsInput] = useState("React, TypeScript, Node.js");
  const [role, setRole] = useState("Senior Frontend Engineer");
  const [questions, setQuestions] = useState<string[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [avatar, setAvatar] = useState<"idle" | "speaking" | "listening" | "thinking">("idle");
  const [transcript, setTranscript] = useState<{ role: "ai" | "you"; text: string }[]>([]);
  const [interim, setInterim] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [metrics, setMetrics] = useState({ comm: 70, conf: 70, tech: 70, eq: 70 });
  const [typedQ, setTypedQ] = useState("");
  const [elapsed, setElapsed] = useState(0);

  // Anti-cheat state
  const [screenSharing, setScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabFocused, setTabFocused] = useState(true);
  const [warnings, setWarnings] = useState<{ t: string; msg: string; at: number }[]>([]);
  const [violationCount, setViolationCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [hideTranscript, setHideTranscript] = useState(false);

  const recRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const camStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const speak = useSpeak();

  const addWarning = useCallback((t: string, msg: string) => {
    setWarnings(w => [{ t, msg, at: Date.now() }, ...w].slice(0, 10));
    setViolationCount(v => v + 1);
    toast.warning(msg);
    // Broadcast anti-cheat event to backend
    wsClient.send("anti_cheat", {
      interview_id: "demo-interview-123", // in reality, derived from URL or state
      event: t.toLowerCase().replace(/ /g, "_"),
      timestamp: new Date().toISOString()
    });
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "live" || paused) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [phase, paused]);

  // Type question
  useEffect(() => {
    if (phase !== "live") return;
    const q = questions[qIdx]; if (!q) return;
    setTypedQ(""); let i = 0;
    const id = setInterval(() => { i++; setTypedQ(q.slice(0, i)); if (i >= q.length) clearInterval(id); }, 22);
    return () => clearInterval(id);
  }, [qIdx, phase, questions]);

  // Anti-cheat: tab visibility
  useEffect(() => {
    if (phase !== "live") return;
    const onVis = () => {
      const focused = !document.hidden;
      setTabFocused(focused);
      if (!focused) addWarning("Tab switch", "Tab switching detected — please return to interview");
    };
    const onBlur = () => { setTabFocused(false); };
    const onFocus = () => setTabFocused(true);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, [phase, addWarning]);

  // Anti-cheat: fullscreen exit
  useEffect(() => {
    const onFs = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      if (phase === "live" && !fs) {
        addWarning("Fullscreen exit", "Fullscreen exited — interview integrity reduced");
        setShowExitWarning(true);
      }
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, [phase, addWarning]);

  // Anti-cheat: copy / paste
  useEffect(() => {
    if (phase !== "live") return;
    const onCopy = () => addWarning("Copy", "Copy action detected");
    const onPaste = () => addWarning("Paste", "Paste action detected");
    document.addEventListener("copy", onCopy);
    document.addEventListener("paste", onPaste);
    return () => { document.removeEventListener("copy", onCopy); document.removeEventListener("paste", onPaste); };
  }, [phase, addWarning]);

  const startCam = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      camStreamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch { toast.error("Camera permission denied"); setCamOn(false); }
  };
  const stopCam = () => { camStreamRef.current?.getTracks().forEach(t => t.stop()); camStreamRef.current = null; };

  const startScreenShare = async () => {
    try {
      if (!navigator.mediaDevices || !(navigator.mediaDevices as any).getDisplayMedia) {
        toast.error("Screen sharing API unavailable. Use a desktop Chromium browser over HTTPS.");
        return false;
      }
      const s: MediaStream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: { displaySurface: "monitor" },
        audio: false,
      });
      screenStreamRef.current = s;
      if (screenRef.current) screenRef.current.srcObject = s;
      setScreenSharing(true);
      s.getVideoTracks()[0].addEventListener("ended", () => {
        setScreenSharing(false);
        screenStreamRef.current = null;
        if (phase === "live") {
          addWarning("Screen share stopped", "Screen sharing was disabled — interview paused");
          setPaused(true);
        }
      });
      return true;
    } catch (err: any) {
      const name = err?.name || "";
      if (name === "NotAllowedError") toast.error("Screen share permission denied");
      else if (name === "NotFoundError") toast.error("No screen source available to share");
      else if (name === "NotSupportedError") toast.error("Screen sharing not supported here (needs HTTPS + desktop browser)");
      else toast.error(`Screen share failed: ${err?.message || name || "unknown error"}`);
      return false;
    }
  };
  const stopScreenShare = () => {
    screenStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current = null;
    setScreenSharing(false);
  };

  const enterFullscreen = async () => {
    try { await containerRef.current?.requestFullscreen?.(); } catch {}
  };

  const startRecognition = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = "en-US";
    r.onresult = (e: any) => {
      let interimT = "", finalT = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalT += t; else interimT += t;
      }
      setInterim(interimT);
      if (finalT) {
        setTranscript((s) => [...s, { role: "you", text: finalT }]);
        setInterim("");
        // Broadcast transcript to backend
        wsClient.send("transcript_chunk", {
          interview_id: "demo-interview-123",
          text: finalT
        });
        setMetrics((m) => ({
          comm: Math.min(99, m.comm + Math.random() * 4),
          conf: Math.min(99, m.conf + Math.random() * 5),
          tech: Math.min(99, m.tech + Math.random() * 3),
          eq: Math.min(99, m.eq + Math.random() * 3),
        }));
      }
    };
    r.onerror = () => {};
    try { r.start(); } catch {}
    recRef.current = r;
  };
  const stopRecognition = () => { try { recRef.current?.stop(); } catch {} recRef.current = null; };

  const askQuestion = (i: number) => {
    const q = questions[i]; if (!q) return;
    setAvatar("speaking");
    setTranscript((s) => [...s, { role: "ai", text: q }]);
    speak(q, () => { setAvatar("listening"); if (micOn) startRecognition(); });
  };

  const start = async () => {
    const skills = skillsInput.split(",").map(s => s.trim()).filter(Boolean);
    const qs = generateQuestions(skills, persona);
    setQuestions(qs); setQIdx(0); setTranscript([]); setElapsed(0); setWarnings([]); setViolationCount(0);
    setPhase("rules");
  };

  const beginLive = async () => {
    // Screen sharing is NOT requested visually — anti-cheat monitoring runs
    // silently via visibilitychange / focus / blur / fullscreenchange listeners.
    await startCam();
    wsClient.connect(); // Connect to WS when interview starts
    setPhase("live");
    setTimeout(() => enterFullscreen(), 200);
    setTimeout(() => askQuestion(0), 800);
  };

  const next = () => {
    stopRecognition();
    setAvatar("thinking");
    setTimeout(() => {
      if (qIdx + 1 >= questions.length) end();
      else { setQIdx((i) => i + 1); setTimeout(() => askQuestion(qIdx + 1), 300); }
    }, 700);
  };

  const followUp = () => {
    const fu = "Interesting — can you tell me more about the tradeoffs you considered there?";
    setTranscript((s) => [...s, { role: "ai", text: fu }]);
    setAvatar("speaking"); stopRecognition();
    speak(fu, () => { setAvatar("listening"); if (micOn) startRecognition(); });
  };

  const end = () => {
    stopRecognition(); stopCam(); stopScreenShare();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    window.speechSynthesis?.cancel();
    setPhase("ended");
  };

  useEffect(() => () => { stopRecognition(); stopCam(); stopScreenShare(); window.speechSynthesis?.cancel(); }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ───────────────── SETUP ─────────────────
  if (phase === "setup") {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <Badge className="bg-accent/40 mb-2"><Sparkles className="size-3 mr-1" /> AI Interview</Badge>
            <h1 className="text-3xl font-bold">Set up your live AI interview</h1>
            <p className="text-muted-foreground">Pick a persona — the AI tailors questions to your resume and role.</p>
          </div>

          <Card className="glass-strong p-6 space-y-5">
            <div>
              <div className="text-sm font-medium mb-2">Interviewer persona</div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {INTERVIEW_PERSONAS.map((p) => (
                  <button key={p.id} onClick={() => setPersona(p.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${persona === p.id ? "border-primary glow bg-accent/30" : "border-border hover:bg-accent/20"}`}>
                    <div className="text-2xl">{p.emoji}</div>
                    <div className="font-semibold mt-1">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-2">Target role</div>
                <Input value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Skills (comma separated)</div>
                <Input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-border p-5 text-center">
              <Upload className="size-6 mx-auto text-muted-foreground" />
              <div className="text-sm mt-2">Drop your resume — we'll extract skills automatically</div>
              <Button variant="outline" className="mt-3" onClick={() => toast.success("Resume parsed — skills extracted")}>Choose file</Button>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => nav({ to: "/dashboard" })}>Cancel</Button>
              <Button className="gradient-primary text-primary-foreground glow" onClick={start}>
                <Play className="size-4 mr-2" /> Continue
              </Button>
            </div>
          </Card>
        </div>
      </AppShell>
    );
  }

  // ───────────────── RULES ─────────────────
  if (phase === "rules") {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="text-center">
            <div className="size-16 rounded-2xl gradient-primary grid place-items-center glow mx-auto mb-3">
              <Shield className="size-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Interview integrity check</h1>
            <p className="text-muted-foreground">To ensure fairness we monitor screen, focus, and activity.</p>
          </div>

          <Card className="glass-strong p-6 space-y-4">
            {[
              { i: Maximize, t: "Fullscreen mode", d: "We auto-enter fullscreen. Exiting will trigger warnings." },
              { i: Video, t: "Camera & microphone", d: "Camera stays on for face presence; mic captures responses." },
              { i: Shield, t: "Silent integrity monitoring", d: "Tab switches, window blur, copy/paste and fullscreen exits are tracked in the background." },
              { i: AlertTriangle, t: "Repeated violations end the interview", d: "Persistent suspicious activity is flagged in your scorecard." },
            ].map((r, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                <r.i className="size-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold">{r.t}</div>
                  <div className="text-sm text-muted-foreground">{r.d}</div>
                </div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground border-t border-border pt-3">
              By starting you consent to recording and AI evaluation for this session. No data leaves your browser in this demo.
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPhase("setup")}>Back</Button>
              <Button className="gradient-primary text-primary-foreground glow" onClick={beginLive}>
                <Shield className="size-4 mr-2" /> I agree — begin interview
              </Button>
            </div>
          </Card>
        </div>
      </AppShell>
    );
  }

  // ───────────────── ENDED ─────────────────
  if (phase === "ended") {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="size-20 rounded-full gradient-primary glow-strong grid place-items-center mx-auto"><Sparkles className="size-8 text-primary-foreground" /></div>
          <h1 className="text-3xl font-bold">Interview complete 🎉</h1>
          <p className="text-muted-foreground">Generating your detailed AI scorecard…</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[{ l: "Comm", v: Math.round(metrics.comm) }, { l: "Confidence", v: Math.round(metrics.conf) }, { l: "Technical", v: Math.round(metrics.tech) }, { l: "EQ", v: Math.round(metrics.eq) }].map(m => (
              <Card key={m.l} className="glass p-4"><div className="text-xs text-muted-foreground">{m.l}</div><div className="text-2xl font-bold gradient-text">{m.v}</div></Card>
            ))}
          </div>
          <Card className="glass p-4 text-left">
            <div className="text-sm font-semibold mb-2 flex items-center gap-2"><Shield className="size-4 text-primary" />Integrity report</div>
            <div className="text-xs text-muted-foreground">Violations detected: <span className={violationCount > 0 ? "text-warning font-semibold" : "text-success font-semibold"}>{violationCount}</span></div>
          </Card>
          <div className="flex justify-center gap-2 pt-4">
            <Button className="gradient-primary text-primary-foreground glow" onClick={() => nav({ to: "/feedback" })}>View full report</Button>
            <Button variant="outline" onClick={() => { setPhase("setup"); setQIdx(0); }}>Try another</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  // ───────────────── LIVE (Fullscreen mode) ─────────────────
  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-background text-foreground overflow-y-auto">
      {/* Cinematic backdrop */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-hero)" }} />

      {/* Top bar */}
      <header className="relative sticky top-0 z-30 glass-strong border-b border-border h-14 px-3 sm:px-5 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg gradient-primary grid place-items-center glow"><Brain className="size-4 text-primary-foreground" /></div>
          <div className="leading-none">
            <div className="text-sm font-semibold">AI Interview · {INTERVIEW_PERSONAS.find(p => p.id === persona)?.name}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{role}</div>
          </div>
        </div>
        <Badge className="bg-destructive/20 text-destructive border-destructive/30 animate-pulse">● REC {fmt(elapsed)}</Badge>
        <div className="hidden sm:flex items-center gap-2 ml-2">
          <span className="text-xs text-muted-foreground">Q {qIdx + 1}/{questions.length}</span>
        </div>

        {/* Status indicators */}
        <div className="ml-auto flex items-center gap-2 text-xs">
          {[
            { ok: camOn, on: "Cam", off: "No cam" },
            { ok: micOn, on: "Mic", off: "Mic off" },
            { ok: isFullscreen, on: "Fullscreen", off: "Windowed" },
            { ok: tabFocused, on: "Focused", off: "Unfocused" },
          ].map((s, i) => (
            <div key={i} className={`hidden md:flex items-center gap-1 px-2 py-1 rounded-md border ${s.ok ? "border-success/40 text-success bg-success/10" : "border-destructive/40 text-destructive bg-destructive/10"}`}>
              <span className={`size-1.5 rounded-full ${s.ok ? "bg-success" : "bg-destructive"} animate-pulse`} />
              {s.ok ? s.on : s.off}
            </div>
          ))}
          <Badge variant="outline" className={violationCount > 0 ? "border-warning/40 text-warning" : ""}>
            <Shield className="size-3 mr-1" />{violationCount}
          </Badge>
        </div>

        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" onClick={followUp}><Brain className="size-4 sm:mr-1.5" /><span className="hidden sm:inline">Follow-up</span></Button>
          <Button size="sm" variant="outline" onClick={next}><FastForward className="size-4 sm:mr-1.5" /><span className="hidden sm:inline">Next</span></Button>
          <Button size="sm" variant="destructive" onClick={end}><PhoneOff className="size-4 sm:mr-1.5" /><span className="hidden sm:inline">End</span></Button>
        </div>
      </header>

      {/* Paused overlay */}
      <div className="relative p-3 sm:p-5 grid lg:grid-cols-3 gap-4 max-w-[1600px] mx-auto">
        {/* AI + Cam — full width now that visible screen-share panel is removed */}
        <Card className="glass-strong p-4 lg:col-span-3 grid sm:grid-cols-2 gap-3">
          <div className="relative aspect-video rounded-xl bg-background/40 grid place-items-center overflow-hidden">
            <div className="absolute top-2 left-2 text-[10px] text-muted-foreground uppercase tracking-wider">AI Interviewer</div>
            <AIAvatar state={avatar} size={200} />
            <div className="absolute bottom-2 right-2 text-xs">
              {avatar === "speaking" && <span className="text-neon">● Speaking</span>}
              {avatar === "listening" && <span className="text-success">● Listening</span>}
              {avatar === "thinking" && <span className="text-warning">● Thinking</span>}
            </div>
          </div>
          <div className="relative aspect-video rounded-xl bg-black overflow-hidden">
            {camOn ? <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" /> : (
              <div className="grid place-items-center h-full bg-muted/30"><VideoOff className="size-8 text-muted-foreground" /></div>
            )}
            <div className="absolute top-2 left-2 text-[10px] text-white/80 uppercase tracking-wider">You</div>
            <div className="absolute bottom-2 inset-x-2 flex justify-center gap-1.5">
              <Button size="icon" variant={micOn ? "default" : "destructive"} onClick={() => { setMicOn(!micOn); if (micOn) stopRecognition(); else startRecognition(); }}>
                {micOn ? <Mic className="size-4" /> : <MicOff className="size-4" />}
              </Button>
              <Button size="icon" variant={camOn ? "default" : "destructive"} onClick={() => { if (camOn) { stopCam(); setCamOn(false); } else { setCamOn(true); startCam(); } }}>
                {camOn ? <Video className="size-4" /> : <VideoOff className="size-4" />}
              </Button>
            </div>
          </div>
        </Card>

        {/* Question banner */}
        <Card className="glass-strong p-5 lg:col-span-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Current question</div>
          <div className="text-lg sm:text-xl font-semibold leading-snug">{typedQ}<span className="animate-pulse">|</span></div>
        </Card>


        {/* Transcript */}
        <Card className="glass p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-semibold">Live transcript</div>
            <Button size="sm" variant="ghost" onClick={() => setHideTranscript(!hideTranscript)}>
              {hideTranscript ? <><Eye className="size-3 mr-1" />Show</> : <><EyeOff className="size-3 mr-1" />Hide</>}
            </Button>
          </div>
          {!hideTranscript && (
            <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-thin pr-2">
              {transcript.map((t, i) => (
                <div key={i} className={`flex gap-2 text-sm ${t.role === "ai" ? "text-foreground/90" : "text-foreground"}`}>
                  <Badge variant={t.role === "ai" ? "default" : "outline"} className={t.role === "ai" ? "gradient-primary text-primary-foreground" : ""}>{t.role === "ai" ? "AI" : "You"}</Badge>
                  <span className="flex-1">{t.text}</span>
                </div>
              ))}
              {interim && <div className="flex gap-2 text-sm opacity-70"><Badge variant="outline">You</Badge><span className="italic">{interim}</span></div>}
              {transcript.length === 0 && <div className="text-xs text-muted-foreground text-center py-6">Transcript will appear as you speak…</div>}
            </div>
          )}
        </Card>

        {/* Metrics + warnings */}
        <Card className="glass p-5">
          <div className="text-sm font-semibold mb-3">Real-time metrics</div>
          {[
            { l: "Communication", v: metrics.comm, c: "oklch(0.72 0.20 265)" },
            { l: "Confidence", v: metrics.conf, c: "oklch(0.68 0.24 295)" },
            { l: "Technical", v: metrics.tech, c: "oklch(0.82 0.16 200)" },
            { l: "EQ", v: metrics.eq, c: "oklch(0.72 0.18 155)" },
          ].map(m => (
            <div key={m.l} className="mb-2.5">
              <div className="flex justify-between text-xs mb-1"><span>{m.l}</span><span>{Math.round(m.v)}</span></div>
              <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full transition-all duration-300" style={{ width: `${m.v}%`, background: m.c }} /></div>
            </div>
          ))}
          <div className="mt-4 border-t border-border pt-3">
            <div className="text-sm font-semibold mb-2 flex items-center gap-1"><Shield className="size-3" />Anti-cheat log</div>
            <div className="space-y-1 max-h-28 overflow-y-auto scrollbar-thin">
              {warnings.length === 0 && <div className="text-xs text-success">● All clear</div>}
              {warnings.map((w, i) => (
                <div key={i} className="text-[11px] flex gap-1.5 text-warning">
                  <AlertTriangle className="size-3 shrink-0 mt-0.5" /><span>{w.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="size-5 text-warning" />Fullscreen exited</DialogTitle>
            <DialogDescription>
              For interview integrity, please re-enter fullscreen mode. Repeated exits will be flagged in your scorecard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitWarning(false)}>Continue anyway</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={() => { enterFullscreen(); setShowExitWarning(false); }}>
              <Maximize className="size-4 mr-2" />Re-enter fullscreen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
