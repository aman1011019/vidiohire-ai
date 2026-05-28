import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRef, useState } from "react";
import { Upload, FileText, Sparkles, CheckCircle2, AlertTriangle, Brain, Target, TrendingUp, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/resume")({
  head: () => ({ meta: [{ title: "AI Resume Analysis · VidioHire AI" }] }),
  component: ResumePage,
});

type Analysis = {
  fileName: string;
  size: string;
  scores: { overall: number; technical: number; communication: number; ats: number; profile: number };
  skills: { name: string; level: number }[];
  missing: string[];
  experience: { role: string; company: string; period: string }[];
  education: { school: string; degree: string; year: string }[];
  certifications: string[];
  projects: string[];
  insights: { type: "good" | "warn" | "tip"; text: string }[];
  suggestedJobs: { title: string; company: string; match: number }[];
};

const SKILL_POOL = ["React","TypeScript","Node.js","Python","PostgreSQL","AWS","Docker","Kubernetes","GraphQL","Next.js","Tailwind","Redis","MongoDB","FastAPI","Go","Rust","PyTorch","LangChain"];

function analyze(file: File): Analysis {
  // Heuristic mock analysis based on filename + random distribution
  const seed = file.name.length + file.size;
  const r = (n: number) => Math.floor(((seed * (n + 1)) % 30) + 70);
  const pickN = (arr: string[], n: number) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
  const detected = pickN(SKILL_POOL, 8);
  const missing = SKILL_POOL.filter(s => !detected.includes(s)).slice(0, 5);
  return {
    fileName: file.name,
    size: (file.size / 1024).toFixed(1) + " KB",
    scores: { overall: r(1), technical: r(2), communication: r(3), ats: r(4), profile: r(5) },
    skills: detected.map((s, i) => ({ name: s, level: 60 + ((seed + i * 11) % 40) })),
    missing,
    experience: [
      { role: "Senior Frontend Engineer", company: "Acme Corp", period: "2023 — Present" },
      { role: "Frontend Engineer", company: "Stellar Labs", period: "2021 — 2023" },
      { role: "Junior Developer", company: "Pixel Studio", period: "2019 — 2021" },
    ],
    education: [{ school: "Stanford University", degree: "B.S. Computer Science", year: "2019" }],
    certifications: ["AWS Solutions Architect", "Google Cloud Professional"],
    projects: ["Real-time collaboration editor (WebRTC)", "AI-powered analytics dashboard", "Distributed task queue in Go"],
    insights: [
      { type: "good", text: "Strong action verbs and quantified impact across 80% of bullets." },
      { type: "warn", text: "Resume exceeds 2 pages — recruiters spend 6s on average. Trim older roles." },
      { type: "tip", text: "Add 2–3 more measurable outcomes (%, $, x) to strengthen ATS scoring." },
      { type: "good", text: "Skills section maps well to senior frontend roles in your target market." },
    ],
    suggestedJobs: [
      { title: "Senior Frontend Engineer", company: "Linear", match: 94 },
      { title: "Staff Engineer, UI Platform", company: "Stripe", match: 89 },
      { title: "Full Stack Engineer", company: "Vercel", match: 86 },
    ],
  };
}

function Ring({ value, label, color = "var(--primary)" }: { value: number; label: string; color?: string }) {
  const r = 36, c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <div className="relative size-24">
        <svg className="-rotate-90 size-24">
          <circle cx="48" cy="48" r={r} stroke="var(--muted)" strokeWidth="8" fill="none" />
          <circle cx="48" cy="48" r={r} stroke={color} strokeWidth="8" fill="none"
            strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }} />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-xl font-bold gradient-text">{value}</div>
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function ResumePage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const handleFile = (f: File) => {
    const ok = /\.(pdf|docx?|txt)$/i.test(f.name);
    if (!ok) return toast.error("Upload a PDF, DOCX, or TXT file");
    if (f.size > 10 * 1024 * 1024) return toast.error("Max 10MB");
    setUploading(true); setProgress(0); setAnalysis(null);
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 18 + 6;
      setProgress(Math.min(100, p));
      if (p >= 100) {
        clearInterval(id);
        setUploading(false);
        setAnalyzing(true);
        setTimeout(() => {
          setAnalysis(analyze(f));
          setAnalyzing(false);
          toast.success("AI analysis complete");
        }, 1600);
      }
    }, 180);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge className="bg-accent/40 mb-2"><Brain className="size-3 mr-1" /> AI Resume Engine</Badge>
            <h1 className="text-3xl font-bold">Resume Analysis</h1>
            <p className="text-muted-foreground">Upload your PDF or DOCX — get instant ATS scoring, skill extraction, and recruiter-grade insights.</p>
          </div>
          {analysis && (
            <Button variant="outline" onClick={() => { setAnalysis(null); }}>
              <Trash2 className="size-4 mr-2" /> Clear analysis
            </Button>
          )}
        </div>

        {!analysis && (
          <Card className="glass-strong p-8">
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              className={`rounded-2xl border-2 border-dashed p-12 text-center transition-all ${drag ? "border-primary bg-accent/30 glow" : "border-border"}`}
            >
              <div className="size-16 mx-auto rounded-2xl gradient-primary grid place-items-center glow mb-4">
                <Upload className="size-7 text-primary-foreground" />
              </div>
              <div className="font-semibold text-lg">Drop your resume here</div>
              <div className="text-sm text-muted-foreground">PDF · DOCX · TXT · up to 10MB</div>
              <Button onClick={() => fileRef.current?.click()} className="mt-5 gradient-primary text-primary-foreground glow">
                <FileText className="size-4 mr-2" /> Choose file
              </Button>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" hidden
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              {uploading && (
                <div className="mt-6 max-w-md mx-auto">
                  <Progress value={progress} />
                  <div className="text-xs text-muted-foreground mt-1">Uploading {Math.round(progress)}%</div>
                </div>
              )}
              {analyzing && (
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-neon">
                  <Sparkles className="size-4 animate-pulse" />
                  AI extracting skills, experience, and ATS keywords…
                </div>
              )}
            </div>
            <div className="grid sm:grid-cols-3 gap-3 mt-6">
              {[
                { i: Target, t: "ATS optimised", d: "We score the way Workday & Greenhouse parse." },
                { i: Brain, t: "AI extraction", d: "Skills, projects, certs, soft signals." },
                { i: TrendingUp, t: "Career growth", d: "Suggested roles with match %." },
              ].map((c, i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border">
                  <c.i className="size-5 text-primary mb-2" />
                  <div className="font-semibold">{c.t}</div>
                  <div className="text-xs text-muted-foreground">{c.d}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {analysis && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="glass-strong p-6">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="size-12 rounded-xl gradient-primary grid place-items-center glow">
                  <FileText className="size-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{analysis.fileName}</div>
                  <div className="text-xs text-muted-foreground">{analysis.size} · parsed by VidioHire AI</div>
                </div>
                <Badge className="bg-success/20 text-success border-success/30 text-base px-3">{analysis.scores.overall}% overall</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <Ring value={analysis.scores.overall} label="Overall" />
                <Ring value={analysis.scores.technical} label="Technical" color="var(--cyan)" />
                <Ring value={analysis.scores.communication} label="Communication" color="var(--violet)" />
                <Ring value={analysis.scores.ats} label="ATS" color="var(--success)" />
                <Ring value={analysis.scores.profile} label="Profile" color="var(--warning)" />
              </div>
            </Card>

            <div className="grid lg:grid-cols-3 gap-5">
              <Card className="glass p-5 lg:col-span-2">
                <div className="font-semibold mb-3 flex items-center gap-2"><Sparkles className="size-4 text-neon" />Skill graph</div>
                <div className="space-y-2.5">
                  {analysis.skills.map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-xs"><span>{s.name}</span><span className="text-muted-foreground">{s.level}</span></div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden mt-1">
                        <div className="h-full gradient-primary transition-all duration-700" style={{ width: `${s.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="glass p-5">
                <div className="font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="size-4 text-warning" />Missing keywords</div>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing.map((m) => (
                    <Badge key={m} variant="outline" className="border-warning/40 text-warning">{m}</Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mt-3">Adding these increases ATS score by an estimated <span className="text-foreground font-semibold">+12 pts</span>.</div>
              </Card>
            </div>

            <Card className="glass p-5">
              <div className="font-semibold mb-3 flex items-center gap-2"><Brain className="size-4 text-violet" />AI insights</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {analysis.insights.map((ins, i) => {
                  const Icon = ins.type === "good" ? CheckCircle2 : ins.type === "warn" ? AlertTriangle : Sparkles;
                  const color = ins.type === "good" ? "text-success" : ins.type === "warn" ? "text-warning" : "text-neon";
                  return (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                      <Icon className={`size-4 mt-0.5 shrink-0 ${color}`} />
                      <div className="text-sm">{ins.text}</div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-5">
              <Card className="glass p-5">
                <div className="font-semibold mb-3">Experience extracted</div>
                <div className="space-y-2">
                  {analysis.experience.map((e, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="font-medium">{e.role}</div>
                      <div className="text-xs text-muted-foreground">{e.company} · {e.period}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="glass p-5">
                <div className="font-semibold mb-3">Projects & certifications</div>
                <div className="space-y-1.5 text-sm mb-3">
                  {analysis.projects.map((p) => (
                    <div key={p} className="flex gap-2"><CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />{p}</div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.certifications.map((c) => <Badge key={c} className="bg-primary/20 text-primary border-primary/30">{c}</Badge>)}
                </div>
              </Card>
            </div>

            <Card className="glass-strong p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold flex items-center gap-2"><Target className="size-4 text-primary" />Recommended roles</div>
                <Link to="/jobs"><Button size="sm" variant="outline">Browse all jobs</Button></Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {analysis.suggestedJobs.map((j, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/40 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">{j.title}</div>
                        <div className="text-xs text-muted-foreground">{j.company}</div>
                      </div>
                      <Badge className="bg-success/20 text-success border-success/30">{j.match}%</Badge>
                    </div>
                    <Link to="/jobs"><Button size="sm" className="w-full gradient-primary text-primary-foreground mt-2">View role</Button></Link>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex flex-wrap gap-2 justify-end">
              <Link to="/interview"><Button variant="outline"><Sparkles className="size-4 mr-2" />Practice with AI interviewer</Button></Link>
              <Link to="/video-resume"><Button className="gradient-primary text-primary-foreground glow">Record video resume</Button></Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
