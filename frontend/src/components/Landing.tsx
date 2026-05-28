import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight, Bot, Video, Sparkles, BarChart3, ShieldCheck, Wand2, Play,
  Users, Briefcase, Check, Star, Github, Twitter, Linkedin, Mic, Brain, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import AIAvatar from "@/components/AIAvatar";

function useCounter(target: number, dur = 1500) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setV(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return v;
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const n = useCounter(value);
  return (
    <div className="text-center">
      <div className="text-4xl sm:text-5xl font-bold gradient-text">{n.toLocaleString()}{suffix}</div>
      <div className="text-sm text-muted-foreground mt-2">{label}</div>
    </div>
  );
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "glass-strong border-b border-border" : ""}`}>
        <div className="container mx-auto max-w-7xl flex items-center h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg gradient-primary grid place-items-center glow"><Bot className="size-4 text-primary-foreground" /></div>
            <span className="font-bold text-lg gradient-text">VidioHire AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-10">
            {[
              { l: "Features", h: "#features" },
              { l: "AI", h: "#ai" },
              { l: "How it works", h: "#how" },
              { l: "Pricing", h: "#pricing" },
              { l: "FAQ", h: "#faq" },
            ].map((i) => (
              <a key={i.h} href={i.h} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors relative group">
                {i.l}
                <span className="absolute bottom-1 left-3 right-3 h-px bg-gradient-to-r from-neon to-violet scale-x-0 group-hover:scale-x-100 transition-transform" />
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
            <Link to="/signup"><Button className="gradient-primary text-primary-foreground glow">Get started <ArrowRight className="size-4 ml-1" /></Button></Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-accent/40 border-border text-foreground gap-1.5 backdrop-blur">
                <Sparkles className="size-3 text-neon" /> Now in private beta · YC-backed
              </Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                Hire <span className="gradient-text">beyond</span><br />paper resumes.
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                VidioHire AI lets candidates pitch on video and runs live, intelligent AI interviews — so recruiters
                see communication, confidence, and craft, not just a PDF.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/signup"><Button size="lg" className="gradient-primary text-primary-foreground glow-strong">Get started free <ArrowRight className="size-4 ml-1" /></Button></Link>
                <a href="#demo"><Button size="lg" variant="outline" className="glass"><Play className="size-4 mr-2" /> Watch demo</Button></a>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {["AS", "PL", "MN", "SV"].map((i, k) => (
                    <div key={k} className="size-9 rounded-full grid place-items-center text-xs font-semibold gradient-primary text-primary-foreground border-2 border-background">{i}</div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex gap-0.5">{[0,1,2,3,4].map(i => <Star key={i} className="size-3.5 fill-warning text-warning" />)}</div>
                  <div className="text-muted-foreground">Loved by 12k+ teams</div>
                </div>
              </div>
            </div>

            {/* Floating preview */}
            <div className="relative h-[520px]">
              <div className="absolute inset-0 grid place-items-center">
                <AIAvatar state="speaking" size={260} />
              </div>
              <Card className="glass-strong absolute top-0 right-0 w-64 p-4 animate-float" style={{ animationDelay: "0s" }}>
                <div className="text-xs text-muted-foreground">Confidence</div>
                <div className="text-2xl font-bold gradient-text">92%</div>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full gradient-primary" style={{ width: "92%" }} />
                </div>
              </Card>
              <Card className="glass-strong absolute bottom-8 left-0 w-72 p-4 animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-8 rounded-full gradient-primary grid place-items-center"><Mic className="size-4 text-primary-foreground" /></div>
                  <div className="text-sm font-medium">Live transcript</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  "I led the migration to a streaming architecture that cut p99 latency by 38%…"
                </div>
              </Card>
              <Card className="glass-strong absolute bottom-0 right-4 w-56 p-3 animate-float" style={{ animationDelay: "2s" }}>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">AI match</div>
                  <Badge className="bg-success/20 text-success border-success/30">+94%</Badge>
                </div>
                <div className="mt-2 text-sm font-semibold">Senior FE · Linear</div>
              </Card>
            </div>
          </div>

          {/* logos */}
          <div className="mt-20 pt-10 border-t border-border">
            <div className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-6">Trusted by talent teams at</div>
            <div className="flex flex-wrap items-center justify-center gap-10 opacity-70">
              {["Linear", "Stripe", "Figma", "Vercel", "Notion", "Anthropic"].map((c) => (
                <div key={c} className="text-lg font-semibold tracking-tight">{c}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-8">
          <Stat value={48000} suffix="+" label="Candidates onboarded" />
          <Stat value={92} suffix="%" label="Recruiter time saved" />
          <Stat value={3200} suffix="+" label="Hires made" />
          <Stat value={140} label="Countries reached" />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge className="mb-3 bg-accent/40">Features</Badge>
            <h2 className="text-4xl font-bold tracking-tight">A complete <span className="gradient-text">video-first</span> hiring stack</h2>
            <p className="text-muted-foreground mt-3">Everything candidates and recruiters need — replacing 5 disjointed tools with one delightful product.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { i: Video, t: "Video Resumes", d: "60-second pitches with AI thumbnails, captions, and analytics." },
              { i: Bot, t: "Live AI Interviews", d: "Resume-aware questions, voice, real-time scoring & follow-ups." },
              { i: BarChart3, t: "Communication Scores", d: "Clarity, confidence, EQ, pacing, and filler-word detection." },
              { i: Wand2, t: "AI Match Engine", d: "Rank candidates by skills, video signals, and job context." },
              { i: ShieldCheck, t: "Bias-Aware", d: "Structured scoring rubrics with explainable evaluations." },
              { i: Sparkles, t: "Hiring Pipeline", d: "Drag-and-drop kanban with collaborative notes." },
            ].map((f) => (
              <Card key={f.t} className="glass p-6 group hover:glow transition-all hover:-translate-y-1">
                <div className="size-11 rounded-xl gradient-primary grid place-items-center glow mb-4 group-hover:scale-110 transition-transform">
                  <f.i className="size-5 text-primary-foreground" />
                </div>
                <div className="font-semibold text-lg">{f.t}</div>
                <div className="text-sm text-muted-foreground mt-1.5">{f.d}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI section */}
      <section id="ai" className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-accent/40"><Brain className="size-3 mr-1" /> AI Engine</Badge>
            <h2 className="text-4xl font-bold tracking-tight">Interviews that <span className="gradient-text">actually understand</span> the candidate</h2>
            <p className="text-muted-foreground">VidioHire reads the resume, watches the video, and adapts each follow-up. No more generic questionnaires.</p>
            <ul className="space-y-3">
              {[
                "Resume-aware question generation",
                "Voice interview with live transcription",
                "Real-time evaluation & dynamic difficulty",
                "Structured PDF scorecards out of the box",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="size-4 text-success" /> {t}</li>
              ))}
            </ul>
            <Link to="/interview"><Button className="gradient-primary text-primary-foreground glow">Try a mock interview <ArrowRight className="size-4 ml-1" /></Button></Link>
          </div>
          <Card className="glass-strong p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium">Live evaluation</div>
              <Badge className="bg-success/20 text-success">Recording</Badge>
            </div>
            {[
              { l: "Communication", v: 88 },
              { l: "Technical depth", v: 76 },
              { l: "Confidence", v: 92 },
              { l: "Emotional intelligence", v: 84 },
            ].map((s) => (
              <div key={s.l} className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>{s.l}</span><span>{s.v}</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full gradient-primary animate-gradient" style={{ width: `${s.v}%` }} /></div>
              </div>
            ))}
            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm border border-border">
              <div className="text-xs text-muted-foreground mb-1">AI follow-up</div>
              You mentioned scaling to 10M users — what was the actual bottleneck, and how did you measure it?
            </div>
          </Card>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <Badge className="bg-accent/40 mb-3">Workflow</Badge>
            <h2 className="text-4xl font-bold tracking-tight">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { i: Video, t: "1. Record your pitch", d: "Drop in a short video — AI generates a thumbnail, captions, and signals." },
              { i: Bot, t: "2. Take an AI interview", d: "Live, resume-aware interview that adapts to your answers in real-time." },
              { i: Users, t: "3. Get matched", d: "Recruiters discover you via the AI feed. Apply or get invited directly." },
            ].map((s, i) => (
              <Card key={i} className="glass p-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 size-32 rounded-full gradient-primary opacity-10 blur-3xl" />
                <s.i className="size-7 text-neon mb-3" />
                <div className="font-semibold text-lg">{s.t}</div>
                <p className="text-sm text-muted-foreground mt-1.5">{s.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <Badge className="bg-accent/40 mb-3">Pricing</Badge>
            <h2 className="text-4xl font-bold tracking-tight">Simple, transparent</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: "Starter", p: "Free", d: "For candidates getting discovered.", f: ["Video resume", "5 AI mock interviews / mo", "Public profile"], cta: "Sign up" },
              { n: "Pro", p: "$29", d: "For active job seekers & freelancers.", f: ["Unlimited AI interviews", "Detailed AI feedback reports", "Priority recruiter feed"], cta: "Start free trial", hi: true },
              { n: "Recruiter", p: "$149", d: "For talent teams.", f: ["Candidate discovery", "Pipeline & analytics", "ATS export & API"], cta: "Book a demo" },
            ].map((p) => (
              <Card key={p.n} className={`glass p-6 relative ${p.hi ? "ring-2 ring-primary glow" : ""}`}>
                {p.hi && <Badge className="absolute -top-3 left-6 gradient-primary text-primary-foreground">Most popular</Badge>}
                <div className="text-sm text-muted-foreground">{p.n}</div>
                <div className="mt-2 flex items-baseline gap-1"><span className="text-4xl font-bold">{p.p}</span><span className="text-sm text-muted-foreground">{p.p !== "Free" && "/mo"}</span></div>
                <p className="text-sm text-muted-foreground mt-2">{p.d}</p>
                <ul className="my-5 space-y-2 text-sm">
                  {p.f.map((x) => (<li key={x} className="flex gap-2"><Check className="size-4 text-success shrink-0" /> {x}</li>))}
                </ul>
                <Link to="/signup"><Button className={`w-full ${p.hi ? "gradient-primary text-primary-foreground glow" : ""}`} variant={p.hi ? "default" : "outline"}>{p.cta}</Button></Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <Badge className="bg-accent/40 mb-3">Loved by teams</Badge>
            <h2 className="text-4xl font-bold tracking-tight">Don't take our word for it</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: "Alex Su", r: "Head of Talent, Stripe", t: "We cut screening time by 60%. The AI scorecards are gold." },
              { n: "Priya Rao", r: "Recruiter, Linear", t: "Finally a product that respects both sides of the hiring market." },
              { n: "Marco Bell", r: "Engineer, Notion", t: "Got 4 interview invites in a week — recruiters actually watched me." },
            ].map((q) => (
              <Card key={q.n} className="glass p-6">
                <div className="flex gap-0.5 mb-3">{[0,1,2,3,4].map(i => <Star key={i} className="size-4 fill-warning text-warning" />)}</div>
                <p className="text-sm text-foreground/90">"{q.t}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="size-9 rounded-full gradient-primary grid place-items-center text-xs text-primary-foreground font-semibold">
                    {q.n.split(" ").map(s => s[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{q.n}</div>
                    <div className="text-xs text-muted-foreground">{q.r}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <Badge className="bg-accent/40 mb-3">FAQ</Badge>
            <h2 className="text-4xl font-bold tracking-tight">Common questions</h2>
          </div>
          <Accordion type="single" collapsible className="glass rounded-2xl px-6">
            {[
              { q: "Do candidates need to be technical?", a: "No — VidioHire works for any role. Question banks adapt automatically." },
              { q: "Does the AI replace human recruiters?", a: "No, it removes drudge work so recruiters spend time on the 20% that matters." },
              { q: "Where is video stored?", a: "In your region, encrypted at rest. You can delete anytime." },
              { q: "Do you integrate with our ATS?", a: "Yes — Greenhouse, Lever, Ashby, and a CSV / API export are supported." },
            ].map((f, i) => (
              <AccordionItem key={i} value={`f-${i}`} className="border-border">
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section id="demo" className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <Card className="glass-strong p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 size-72 rounded-full gradient-primary opacity-20 blur-3xl" />
            <Zap className="size-10 text-neon mx-auto mb-4" />
            <h3 className="text-3xl md:text-4xl font-bold">Ready to redefine hiring?</h3>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Join the teams replacing resumes with real human signal. 60 seconds to set up.</p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link to="/signup"><Button size="lg" className="gradient-primary text-primary-foreground glow-strong">Get started free <ArrowRight className="size-4 ml-1" /></Button></Link>
              <Link to="/recruiter"><Button size="lg" variant="outline" className="glass"><Briefcase className="size-4 mr-2" /> Join as recruiter</Button></Link>
            </div>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border py-10 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-md gradient-primary grid place-items-center"><Bot className="size-4 text-primary-foreground" /></div>
              <span className="font-bold gradient-text">VidioHire AI</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs">The future of hiring — beyond paper resumes.</p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <Link to="/help" className="hover:text-foreground">Help</Link>
            <Link to="/login" className="hover:text-foreground">Sign in</Link>
          </div>
          <div className="flex gap-3 text-muted-foreground">
            <a href="#" aria-label="Twitter" className="hover:text-foreground"><Twitter className="size-4" /></a>
            <a href="#" aria-label="GitHub" className="hover:text-foreground"><Github className="size-4" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-foreground"><Linkedin className="size-4" /></a>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl text-xs text-muted-foreground mt-6">© 2026 VidioHire AI. All rights reserved.</div>
      </footer>
    </div>
  );
}
