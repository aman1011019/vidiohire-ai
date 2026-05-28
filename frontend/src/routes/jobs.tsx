import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { JOBS } from "@/lib/mock-data";
import { Search, MapPin, Briefcase, Bookmark } from "lucide-react";
import { useApp } from "@/lib/store";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Jobs · VidioHire AI" }] }),
  component: Jobs,
});

function Jobs() {
  const [q, setQ] = useState("");
  const [remote, setRemote] = useState<"all"|"remote"|"onsite">("all");
  const [type, setType] = useState<"all"|"Full-time"|"Contract">("all");
  const { savedJobs, toggleSavedJob, apply } = useApp();
  const nav = useNavigate();

  const list = useMemo(() => JOBS.filter((j) => {
    if (q && !`${j.title} ${j.company} ${j.skills.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (remote === "remote" && !j.remote) return false;
    if (remote === "onsite" && j.remote) return false;
    if (type !== "all" && j.type !== type) return false;
    return true;
  }), [q, remote, type]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Find your next role</h1>
          <p className="text-muted-foreground">{list.length} jobs · AI-matched to your profile</p>
        </div>

        <Card className="glass p-4 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 flex-1 min-w-[220px]"><Search className="size-4 text-muted-foreground"/>
            <Input placeholder="Search title, company, skill" value={q} onChange={(e)=>setQ(e.target.value)} className="bg-transparent border-0 focus-visible:ring-0"/></div>
          <div className="flex gap-2">
            {(["all","remote","onsite"] as const).map((r) => (
              <Button key={r} size="sm" variant={remote===r?"default":"outline"} onClick={()=>setRemote(r)} className="capitalize">{r}</Button>
            ))}
          </div>
          <div className="flex gap-2">
            {(["all","Full-time","Contract"] as const).map((t) => (
              <Button key={t} size="sm" variant={type===t?"default":"outline"} onClick={()=>setType(t)}>{t}</Button>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((j) => (
            <Card key={j.id} className="glass p-5 hover:glow transition-all flex flex-col">
              <div className="flex items-start gap-3">
                <div className="size-12 rounded-lg gradient-primary grid place-items-center text-primary-foreground font-bold text-lg shrink-0">{j.logo}</div>
                <div className="flex-1 min-w-0">
                  <Link to="/jobs/$jobId" params={{ jobId: j.id }} className="font-semibold hover:gradient-text leading-tight block">{j.title}</Link>
                  <div className="text-xs text-muted-foreground">{j.company}</div>
                </div>
                <Badge className="bg-success/20 text-success border-success/30">{j.matchScore}%</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="size-3"/> {j.location}</span>
                <span className="flex items-center gap-1"><Briefcase className="size-3"/> {j.type}</span>
                <span>{j.experience}</span>
                {j.remote && <Badge variant="outline" className="text-[10px]">Remote</Badge>}
              </div>
              <div className="text-sm text-muted-foreground mt-2 line-clamp-2">{j.description}</div>
              <div className="flex flex-wrap gap-1 mt-3">
                {j.skills.slice(0,4).map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
              </div>
              <div className="text-sm font-semibold mt-3">{j.salary}</div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1 gradient-primary text-primary-foreground" onClick={()=>{apply(j.id); toast.success(`Applied to ${j.title}`); nav({to:"/applications"});}}>Apply</Button>
                <Button variant="outline" size="icon" onClick={()=>{toggleSavedJob(j.id); toast.success(savedJobs.includes(j.id)?"Unsaved":"Saved");}}>
                  <Bookmark className={`size-4 ${savedJobs.includes(j.id)?"fill-primary text-primary":""}`}/>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
