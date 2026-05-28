import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MESSAGES } from "@/lib/mock-data";
import { Send, Paperclip, Search, CheckCheck } from "lucide-react";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Messages · VidioHire AI" }] }),
  component: Messages,
});

function Messages() {
  const [active, setActive] = useState(MESSAGES[0].id);
  const [msgs, setMsgs] = useState<Record<string, {me:boolean;text:string;time:string}[]>>({
    m1: [
      { me: false, text: "Loved your video — got 10 min this week?", time: "10:02" },
      { me: true, text: "Yes! Thursday works.", time: "10:04" },
    ],
    m2: [{ me: false, text: "Sending over the take-home now.", time: "9:30" }],
    m3: [{ me: false, text: "Our team really enjoyed the chat.", time: "Yesterday" }],
    m4: [{ me: false, text: "Quick question about your project…", time: "Mon" }],
  });
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);

  const send = () => {
    if (!text.trim()) return;
    setMsgs((m) => ({ ...m, [active]: [...(m[active]||[]), { me: true, text, time: "now" }] }));
    setText("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => ({ ...m, [active]: [...(m[active]||[]), { me: false, text: "Got it — replying shortly!", time: "now" }] }));
      setTyping(false);
    }, 1200);
  };

  const conv = MESSAGES.find((c) => c.id === active)!;
  return (
    <AppShell>
      <Card className="glass-strong p-0 grid grid-cols-1 md:grid-cols-[300px_1fr] h-[calc(100vh-10rem)] overflow-hidden">
        <div className="border-r border-border flex flex-col">
          <div className="p-3 flex items-center gap-2 border-b border-border"><Search className="size-4 text-muted-foreground"/>
            <Input placeholder="Search" className="bg-transparent border-0 focus-visible:ring-0"/></div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {MESSAGES.map((c)=>(
              <button key={c.id} onClick={()=>setActive(c.id)} className={`w-full text-left p-3 flex items-center gap-3 hover:bg-accent/30 ${active===c.id?"bg-accent/40":""}`}>
                <div className="relative">
                  <div className="size-10 rounded-full gradient-primary grid place-items-center text-xs text-primary-foreground font-semibold">{c.avatar}</div>
                  {c.online && <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-success border-2 border-background"/>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between"><span className="text-sm font-medium truncate">{c.from}</span><span className="text-[10px] text-muted-foreground">{c.time}</span></div>
                  <div className="text-xs text-muted-foreground truncate">{c.last}</div>
                </div>
                {c.unread > 0 && <span className="size-5 rounded-full gradient-primary text-[10px] grid place-items-center text-primary-foreground">{c.unread}</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="p-3 border-b border-border flex items-center gap-3">
            <div className="size-10 rounded-full gradient-primary grid place-items-center text-xs text-primary-foreground font-semibold">{conv.avatar}</div>
            <div><div className="font-semibold text-sm">{conv.from}</div><div className="text-xs text-success">{conv.online?"Online":"Offline"}</div></div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {(msgs[active]||[]).map((m,i)=>(
              <div key={i} className={`flex ${m.me?"justify-end":"justify-start"}`}>
                <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${m.me?"gradient-primary text-primary-foreground":"bg-muted/60"}`}>
                  {m.text}
                  <div className="text-[10px] opacity-70 mt-1 flex items-center gap-1">{m.time}{m.me && <CheckCheck className="size-3"/>}</div>
                </div>
              </div>
            ))}
            {typing && <div className="text-xs text-muted-foreground italic">{conv.from} is typing…</div>}
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <Button size="icon" variant="outline"><Paperclip className="size-4"/></Button>
            <Input value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&send()} placeholder="Type a message…"/>
            <Button onClick={send} className="gradient-primary text-primary-foreground"><Send className="size-4"/></Button>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
