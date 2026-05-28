import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect, useRef, useState } from "react";
import { Upload, Play, Pause, Volume2, VolumeX, Maximize, Trash2, Sparkles, Gauge } from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/video-resume")({
  head: () => ({ meta: [{ title: "My Video Resume · VidioHire AI" }] }),
  component: VideoResume,
});

function VideoResume() {
  const { videoResume, setVideoResume } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [drag, setDrag] = useState(false);

  const onFile = (f: File) => {
    if (!f.type.startsWith("video/")) return toast.error("Please upload a video file");
    setUploading(true); setProgress(0);
    const url = URL.createObjectURL(f);
    let p = 0;
    const id = setInterval(() => {
      p += Math.random()*22;
      setProgress(Math.min(100, p));
      if (p >= 100) {
        clearInterval(id);
        setUploading(false);
        setVideoResume({ url, duration: 0, uploadedAt: new Date().toISOString() });
        toast.success("Video uploaded — AI analysis ready");
      }
    }, 220);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0]; if (f) onFile(f);
  };

  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    v.playbackRate = speed;
    v.muted = muted;
  }, [speed, muted, videoResume]);

  const togglePlay = () => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex justify-between flex-wrap gap-3 items-end">
          <div>
            <h1 className="text-3xl font-bold">Video Resume</h1>
            <p className="text-muted-foreground">A 60-second pitch beats a 2-page PDF. AI analyzes communication, confidence, and clarity.</p>
          </div>
          <Link to="/interview"><Button variant="outline"><Sparkles className="size-4 mr-2"/>Run AI Interview</Button></Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <Card className="glass-strong p-6 lg:col-span-2">
            {!videoResume ? (
              <div
                onDragOver={(e)=>{e.preventDefault(); setDrag(true);}}
                onDragLeave={()=>setDrag(false)} onDrop={onDrop}
                className={`rounded-xl border-2 border-dashed p-12 text-center transition-all ${drag?"border-primary bg-accent/30 glow":"border-border"}`}>
                <Upload className="size-10 mx-auto text-muted-foreground"/>
                <div className="mt-3 font-semibold">Drop your video here or click to upload</div>
                <div className="text-xs text-muted-foreground">MP4, WebM, MOV · up to 200MB · max 90 seconds</div>
                <Button onClick={()=>fileRef.current?.click()} className="mt-4 gradient-primary text-primary-foreground glow">Choose file</Button>
                <input ref={fileRef} type="file" accept="video/*" hidden onChange={(e)=>e.target.files?.[0]&&onFile(e.target.files[0])}/>
                {uploading && <div className="mt-4"><Progress value={progress}/><div className="text-xs text-muted-foreground mt-1">Uploading {Math.round(progress)}%</div></div>}
              </div>
            ) : (
              <div>
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                  <video ref={videoRef} src={videoResume.url} className="w-full h-full" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-2">
                    <Button size="icon" onClick={togglePlay}>{playing?<Pause className="size-4"/>:<Play className="size-4"/>}</Button>
                    <Button size="icon" variant="ghost" onClick={()=>setMuted(!muted)}>{muted?<VolumeX className="size-4"/>:<Volume2 className="size-4"/>}</Button>
                    <select value={speed} onChange={(e)=>setSpeed(parseFloat(e.target.value))} className="bg-background/40 backdrop-blur text-xs rounded px-2 py-1 border border-border">
                      {[0.5,1,1.25,1.5,2].map(x=><option key={x} value={x}>{x}x</option>)}
                    </select>
                    <Button size="icon" variant="ghost" className="ml-auto" onClick={()=>videoRef.current?.requestFullscreen?.()}><Maximize className="size-4"/></Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="outline" onClick={()=>fileRef.current?.click()}>Replace</Button>
                  <Button variant="destructive" onClick={()=>{setVideoResume(null); toast.success("Video removed");}}><Trash2 className="size-4 mr-2"/>Remove</Button>
                  <input ref={fileRef} type="file" accept="video/*" hidden onChange={(e)=>e.target.files?.[0]&&onFile(e.target.files[0])}/>
                </div>
              </div>
            )}
          </Card>

          <Card className="glass p-5">
            <div className="flex items-center gap-2 mb-3"><Gauge className="size-4 text-neon"/><div className="font-semibold">AI Insights</div></div>
            {videoResume ? (
              <div className="space-y-3">
                {[
                  {l:"Communication",v:88},{l:"Confidence",v:92},{l:"Clarity",v:81},
                  {l:"Speaking speed",v:74,note:"148 wpm · ideal"},
                  {l:"Filler words",v:65,note:"7 detected"},
                  {l:"Emotional intelligence",v:84},
                ].map(m=>(
                  <div key={m.l}>
                    <div className="flex justify-between text-xs"><span>{m.l}</span><span>{m.v}</span></div>
                    <div className="h-1.5 rounded-full bg-muted mt-1 overflow-hidden"><div className="h-full gradient-primary" style={{width:`${m.v}%`}}/></div>
                    {m.note && <div className="text-[10px] text-muted-foreground mt-0.5">{m.note}</div>}
                  </div>
                ))}
                <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border text-xs">
                  <strong className="block mb-1">AI tip</strong>
                  Reduce filler words ("um", "like"). Try 5 deep breaths and 2 takes before recording.
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">Upload a video to unlock AI insights.</div>
            )}
          </Card>
        </div>

        <Card className="glass p-5">
          <div className="font-semibold mb-3">Pitch script suggestions</div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {t:"The Storyteller", d:"Open with a moment, end with a number. 60s arc."},
              {t:"The Specialist", d:"Lead with your craft, deepen with one project, close with curiosity."},
              {t:"The Builder", d:"What you shipped, why it mattered, what's next."},
            ].map(s=>(
              <div key={s.t} className="p-4 rounded-xl border border-border bg-muted/30">
                <Badge className="mb-2 bg-accent/40">{s.t}</Badge>
                <div className="text-sm text-muted-foreground">{s.d}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
