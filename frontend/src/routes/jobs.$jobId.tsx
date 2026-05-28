import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JOBS } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import {
  ArrowLeft, Bookmark, Check, MapPin, Briefcase, Bot, Building2, Share2, Heart,
  Users as UsersIcon, DollarSign, Calendar, Globe, Sparkles, ChevronLeft, ChevronRight,
  GraduationCap, Coffee, Award, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/jobs/$jobId")({
  head: ({ params }) => ({ meta: [{ title: `${JOBS.find(j => j.id === params.jobId)?.title ?? "Job"} · VidioHire AI` }] }),
  component: JobDetail,
});

const COMPANY_PHOTOS = [
  "linear-gradient(135deg, oklch(0.65 0.22 265), oklch(0.55 0.24 295))",
  "linear-gradient(135deg, oklch(0.70 0.20 200), oklch(0.62 0.22 240))",
  "linear-gradient(135deg, oklch(0.68 0.18 155), oklch(0.60 0.20 200))",
  "linear-gradient(135deg, oklch(0.75 0.18 75), oklch(0.65 0.22 35))",
];

function JobDetail() {
  const { jobId } = Route.useParams();
  const job = JOBS.find((j) => j.id === jobId);
  const { apply, savedJobs, toggleSavedJob, applications } = useApp();
  const nav = useNavigate();
  const [photoIdx, setPhotoIdx] = useState(0);
  const [following, setFollowing] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  if (!job) return <AppShell><div>Job not found</div></AppShell>;
  const applied = applications.some((a) => a.jobId === job.id);
  const similar = JOBS.filter(j => j.id !== job.id && j.skills.some(s => job.skills.includes(s))).slice(0, 3);

  const company = {
    about: `${job.company} is reimagining the way modern teams build products. We've raised $${(job.matchScore * 4).toFixed(0)}M in Series C funding and serve over 50,000 customers worldwide.`,
    culture: "Async-first · Bias for shipping · High autonomy · No-meeting Wednesdays · Quarterly offsites in different cities.",
    employees: `${200 + (job.matchScore * 3)}–${500 + (job.matchScore * 5)}`,
    funding: `$${(job.matchScore * 4).toFixed(0)}M Series C`,
    stack: job.skills.slice(0, 5),
    benefits: ["Unlimited PTO", "Health + Vision + Dental", "$2k home office stipend", "Equity package", "Mental health support", "Learning budget"],
    deadline: "Closes in 14 days",
  };

  const apply_ = () => { apply(job.id); toast.success("Application submitted"); };
  const share = () => {
    if (navigator.share) navigator.share({ title: job.title, url: window.location.href }).catch(() => {});
    else { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6 pb-24">
        <button onClick={() => nav({ to: "/jobs" })} className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-foreground">
          <ArrowLeft className="size-3" /> Back to jobs
        </button>

        {/* Hero */}
        <Card className="glass-strong p-6 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ background: COMPANY_PHOTOS[0] }} />
          <div className="relative flex items-start gap-4 flex-wrap">
            <div className="size-20 rounded-2xl gradient-primary grid place-items-center text-primary-foreground font-bold text-3xl glow shrink-0">{job.logo}</div>
            <div className="flex-1 min-w-[200px]">
              <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
              <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="flex items-center gap-1"><Building2 className="size-4" />{job.company}</span>
                <span className="flex items-center gap-1"><MapPin className="size-4" />{job.location}</span>
                <span className="flex items-center gap-1"><Briefcase className="size-4" />{job.type}</span>
                <span className="flex items-center gap-1"><Clock className="size-4" />{job.posted}</span>
                {job.remote && <Badge variant="outline">Remote</Badge>}
              </div>
            </div>
            <Badge className="bg-success/20 text-success border-success/30 text-base px-3 py-1.5">
              <Sparkles className="size-3 mr-1" />{job.matchScore}% match
            </Badge>
          </div>

          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            {[
              { l: "Salary", v: job.salary, i: DollarSign },
              { l: "Experience", v: job.experience, i: Award },
              { l: "Team size", v: company.employees, i: UsersIcon },
              { l: "Deadline", v: company.deadline, i: Calendar },
            ].map(s => (
              <div key={s.l} className="p-3 rounded-lg bg-card/60 border border-border backdrop-blur">
                <s.i className="size-4 text-primary mb-1" />
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                <div className="font-semibold text-sm">{s.v}</div>
              </div>
            ))}
          </div>

          <div className="relative flex flex-wrap gap-2 mt-6">
            {applied ? (
              <Button disabled className="gradient-primary text-primary-foreground"><Check className="size-4 mr-2" />Applied</Button>
            ) : (
              <Button onClick={apply_} className="gradient-primary text-primary-foreground glow">Apply now</Button>
            )}
            <Button variant="outline" onClick={() => { toggleSavedJob(job.id); toast.success(savedJobs.includes(job.id) ? "Removed from saved" : "Saved"); }}>
              <Bookmark className={`size-4 mr-2 ${savedJobs.includes(job.id) ? "fill-primary text-primary" : ""}`} />
              {savedJobs.includes(job.id) ? "Saved" : "Save"}
            </Button>
            <Button variant="outline" onClick={() => { setFollowing(!following); toast.success(following ? "Unfollowed" : `Following ${job.company}`); }}>
              <Heart className={`size-4 mr-2 ${following ? "fill-destructive text-destructive" : ""}`} />
              {following ? "Following" : "Follow company"}
            </Button>
            <Button variant="outline" onClick={share}><Share2 className="size-4 mr-2" />Share</Button>
            <Link to="/interview"><Button variant="outline"><Bot className="size-4 mr-2" />Practice AI interview</Button></Link>
          </div>
        </Card>

        {/* AI Match analysis */}
        <Card className="glass p-6">
          <div className="font-semibold mb-3 flex items-center gap-2"><Sparkles className="size-4 text-neon" />AI match analysis</div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { l: "Skills overlap", v: 92 },
              { l: "Experience fit", v: 86 },
              { l: "Culture signal", v: 78 },
            ].map(m => (
              <div key={m.l} className="p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex justify-between text-xs mb-1"><span>{m.l}</span><span className="font-semibold">{m.v}%</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full gradient-primary" style={{ width: `${m.v}%` }} /></div>
              </div>
            ))}
          </div>
          <ul className="grid sm:grid-cols-2 gap-2 mt-4 text-sm">
            {["Your video resume scored 88% in clarity", "Strong overlap on 4 of 5 required skills", "Recent project aligns with team's roadmap", "Located in a preferred timezone"].map(t => (
              <li key={t} className="flex gap-2"><Check className="size-4 text-success mt-0.5 shrink-0" />{t}</li>
            ))}
          </ul>
        </Card>

        {/* About + role */}
        <div className="grid lg:grid-cols-3 gap-5">
          <Card className="glass p-6 lg:col-span-2">
            <h2 className="font-semibold mb-2">About the role</h2>
            <p className={`text-muted-foreground ${!showFullDesc ? "line-clamp-3" : ""}`}>
              {job.description} You'll work alongside a tight-knit team building the next generation of tooling for engineers worldwide. We value craft, ownership, and async communication. Day-to-day involves shipping production features, code reviews, design partnerships, and on-call rotation.
            </p>
            <button className="text-xs text-primary mt-1" onClick={() => setShowFullDesc(!showFullDesc)}>
              {showFullDesc ? "Show less" : "Read more"}
            </button>

            <h3 className="font-semibold mt-6 mb-2">Responsibilities</h3>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              {["Own end-to-end product features from spec to ship", "Collaborate with design and PM on early prototypes", "Mentor 1-2 mid-level engineers", "Drive engineering excellence across the team"].map(r => (
                <li key={r} className="flex gap-2"><Check className="size-4 text-primary mt-0.5 shrink-0" />{r}</li>
              ))}
            </ul>

            <h3 className="font-semibold mt-6 mb-2">Required skills</h3>
            <div className="flex flex-wrap gap-2">{job.skills.map(s => <Badge key={s} variant="outline">{s}</Badge>)}</div>

            <h3 className="font-semibold mt-6 mb-2">Tech stack</h3>
            <div className="flex flex-wrap gap-2">{company.stack.map(s => <Badge key={s} className="bg-primary/20 text-primary border-primary/30">{s}</Badge>)}</div>

            <h3 className="font-semibold mt-6 mb-3 flex items-center gap-2"><Coffee className="size-4 text-warning" />Benefits</h3>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              {company.benefits.map(b => (
                <div key={b} className="flex gap-2 p-2 rounded-lg bg-muted/30 border border-border">
                  <Check className="size-4 text-success shrink-0 mt-0.5" />{b}
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="glass p-5">
              <div className="font-semibold mb-3">About {job.company}</div>
              <p className="text-sm text-muted-foreground">{company.about}</p>
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="p-2 rounded-lg bg-muted/30 border border-border"><div className="text-muted-foreground">Employees</div><div className="font-semibold">{company.employees}</div></div>
                <div className="p-2 rounded-lg bg-muted/30 border border-border"><div className="text-muted-foreground">Funding</div><div className="font-semibold">{company.funding}</div></div>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border">
                <div className="text-xs text-muted-foreground mb-1">Culture</div>
                <div className="text-sm">{company.culture}</div>
              </div>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-primary mt-3 inline-flex items-center gap-1 hover:underline"><Globe className="size-3" />{job.company.toLowerCase()}.com</a>
            </Card>

            <Card className="glass p-5">
              <div className="font-semibold mb-3">Hiring team</div>
              {[
                { n: "Alex Chen", r: "Hiring Manager", a: "AC" },
                { n: "Priya Patel", r: "Recruiter", a: "PP" },
              ].map(p => (
                <div key={p.n} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="size-10 rounded-full gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm">{p.a}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{p.n}</div>
                    <div className="text-xs text-muted-foreground">{p.r}</div>
                  </div>
                  <Button size="sm" variant="outline">Message</Button>
                </div>
              ))}
            </Card>

            <Card className="glass p-5">
              <div className="font-semibold mb-3 flex items-center gap-2"><MapPin className="size-4 text-primary" />Location</div>
              <div className="aspect-video rounded-lg border border-border overflow-hidden relative" style={{ background: COMPANY_PHOTOS[2] }}>
                <div className="absolute inset-0 grid place-items-center bg-background/30">
                  <div className="text-center">
                    <MapPin className="size-8 mx-auto text-primary glow" />
                    <div className="text-sm font-semibold mt-1">{job.location}</div>
                    {job.remote && <Badge variant="outline" className="mt-1">Remote-friendly</Badge>}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Office photos carousel */}
        <Card className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold flex items-center gap-2"><GraduationCap className="size-4 text-violet" />Inside {job.company}</div>
            <div className="flex gap-1">
              <Button size="icon" variant="outline" onClick={() => setPhotoIdx((photoIdx - 1 + COMPANY_PHOTOS.length) % COMPANY_PHOTOS.length)}><ChevronLeft className="size-4" /></Button>
              <Button size="icon" variant="outline" onClick={() => setPhotoIdx((photoIdx + 1) % COMPANY_PHOTOS.length)}><ChevronRight className="size-4" /></Button>
            </div>
          </div>
          <div className="aspect-[21/9] rounded-xl border border-border relative overflow-hidden">
            <div className="absolute inset-0 transition-all duration-500" style={{ background: COMPANY_PHOTOS[photoIdx] }} />
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
              <div className="text-sm font-medium bg-background/60 backdrop-blur px-3 py-1.5 rounded-lg">
                {["HQ — open workspace", "Engineering pod", "Quarterly offsite", "Team lunch"][photoIdx]}
              </div>
              <div className="flex gap-1">
                {COMPANY_PHOTOS.map((_, i) => (
                  <button key={i} onClick={() => setPhotoIdx(i)} className={`size-2 rounded-full transition-all ${i === photoIdx ? "bg-primary w-6" : "bg-foreground/30"}`} />
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Similar jobs */}
        {similar.length > 0 && (
          <Card className="glass p-5">
            <div className="font-semibold mb-3">Similar roles</div>
            <div className="grid sm:grid-cols-3 gap-3">
              {similar.map(s => (
                <Link key={s.id} to="/jobs/$jobId" params={{ jobId: s.id }} className="p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/40 transition-all block">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-9 rounded-lg gradient-primary grid place-items-center text-primary-foreground font-bold text-sm">{s.logo}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.company}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{s.location}</span>
                    <Badge className="bg-success/20 text-success border-success/30">{s.matchScore}%</Badge>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Sticky apply bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 glass-strong rounded-full px-3 py-2 shadow-xl border border-border flex items-center gap-2 animate-in slide-in-from-bottom">
        <div className="size-8 rounded-full gradient-primary grid place-items-center text-primary-foreground font-bold text-xs">{job.logo}</div>
        <div className="text-sm pr-2 hidden sm:block">
          <div className="font-semibold leading-none">{job.title}</div>
          <div className="text-[10px] text-muted-foreground">{job.company} · {job.salary}</div>
        </div>
        {applied ? (
          <Button size="sm" disabled className="gradient-primary text-primary-foreground rounded-full"><Check className="size-3 mr-1" />Applied</Button>
        ) : (
          <Button size="sm" onClick={apply_} className="gradient-primary text-primary-foreground glow rounded-full">Apply now</Button>
        )}
      </div>
    </AppShell>
  );
}
