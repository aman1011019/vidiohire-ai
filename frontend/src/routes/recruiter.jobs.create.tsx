import { createFileRoute, useNavigate } from "@tanstack/react-router";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/recruiter/jobs/create")({
  head: () => ({ meta: [{ title: "Create Job · VidioHire AI" }] }),
  component: CreateJob,
});

function CreateJob() {
  const nav = useNavigate();
  const [form, setForm] = useState({ title: "", location: "Remote", salary: "", description: "", skills: "" });
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Posted: ${form.title || "Untitled role"}`);
    nav({ to: "/recruiter/jobs" });
  };

  const aiDraft = () => {
    update("description",
      "We're hiring a senior engineer to ship high-leverage AI-powered features for our hiring platform. You'll partner with design, ML and recruiting teams to build performant, accessible product experiences end to end.");
    update("skills", "React, TypeScript, Node.js, PostgreSQL");
    toast.success("AI drafted the description");
  };

  return (
    <RecruiterPage badge="Create" title="Create a new job" subtitle="Post a role, generate a description with AI and start collecting applications instantly.">
      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-4">
        <Card className="glass p-6 lg:col-span-2 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Job title</Label><Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Senior Frontend Engineer" required /></div>
            <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => update("location", e.target.value)} /></div>
            <div className="space-y-2"><Label>Salary range</Label><Input value={form.salary} onChange={(e) => update("salary", e.target.value)} placeholder="$140k – $200k" /></div>
            <div className="space-y-2"><Label>Required skills</Label><Input value={form.skills} onChange={(e) => update("skills", e.target.value)} placeholder="React, TypeScript…" /></div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Description</Label>
              <Button type="button" size="sm" variant="outline" onClick={aiDraft}><Sparkles className="size-3.5 mr-1" /> AI draft</Button>
            </div>
            <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={10} placeholder="What the role is, what success looks like, and who you're looking for…" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => nav({ to: "/recruiter/jobs" })}>Cancel</Button>
            <Button type="submit" className="gradient-primary text-primary-foreground">Publish job</Button>
          </div>
        </Card>

        <Card className="glass p-6 space-y-3 h-fit">
          <div className="text-sm font-semibold">AI assistance</div>
          <p className="text-xs text-muted-foreground">VidioHire AI will auto-rank applicants, generate interview questions and flag anti-cheat events.</p>
          <ul className="text-xs space-y-2 mt-2">
            <li>· Auto-screening with match score</li>
            <li>· AI interview question bank</li>
            <li>· Resume intelligence summary</li>
            <li>· Compliance & bias check</li>
          </ul>
        </Card>
      </form>
    </RecruiterPage>
  );
}
