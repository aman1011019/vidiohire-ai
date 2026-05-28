import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { Search, BookOpen, MessageCircle, Mail } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help Center · VidioHire AI" }] }),
  component: Help,
});

const FAQ = [
  { q: "How do I record a video resume?", a: "Go to My Video Resume → upload or record. Keep it under 60 seconds." },
  { q: "How does the AI score me?", a: "We analyze clarity, pacing, confidence, filler words, and emotional cues." },
  { q: "Can I retake an AI interview?", a: "Yes, unlimited retakes — your highest score is shown to recruiters." },
  { q: "Is my video private?", a: "Yes — only visible to recruiters when your profile is public." },
];

function Help() {
  const [q, setQ] = useState("");
  const filtered = FAQ.filter((f) => f.q.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold">How can we help?</h1>
          <p className="text-muted-foreground">Search our docs or chat with us.</p>
          <div className="mt-4 max-w-md mx-auto flex items-center gap-2 glass rounded-lg px-3">
            <Search className="size-4 text-muted-foreground"/>
            <Input placeholder="Search articles…" value={q} onChange={(e)=>setQ(e.target.value)} className="bg-transparent border-0 focus-visible:ring-0"/>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {i:BookOpen,t:"Getting started",d:"Set up your profile in 3 minutes"},
            {i:MessageCircle,t:"Live chat",d:"Avg reply in 4 min"},
            {i:Mail,t:"Email us",d:"help@vidiohire.ai"},
          ].map((x)=>(
            <Card key={x.t} className="glass p-5 hover:glow transition-all cursor-pointer">
              <x.i className="size-5 text-neon mb-2"/>
              <div className="font-semibold">{x.t}</div>
              <div className="text-xs text-muted-foreground mt-1">{x.d}</div>
            </Card>
          ))}
        </div>

        <Card className="glass p-2">
          <Accordion type="single" collapsible className="px-3">
            {filtered.map((f,i)=>(
              <AccordionItem key={i} value={`f${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </AppShell>
  );
}
