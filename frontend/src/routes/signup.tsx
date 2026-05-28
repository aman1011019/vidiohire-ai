import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useApp, type Role } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up · VidioHire AI" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useApp();
  const nav = useNavigate();
  const [role, setRole] = useState<Role>("candidate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name || !email || !pw) return toast.error("Fill all fields");
    if (pw.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const u = await signup(name, email, pw, role);
      toast.success(`Welcome to VidioHire, ${u.name.split(" ")[0]}!`);
      nav({ to: role === "recruiter" ? "/recruiter" : "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 order-2 lg:order-1">
        <Card className="glass-strong w-full max-w-md p-8">
          <Link to="/" className="text-xs text-muted-foreground inline-flex items-center gap-1 mb-4 hover:text-foreground"><ArrowLeft className="size-3"/> Back home</Link>
          <h2 className="text-2xl font-bold">Create your account</h2>
          <p className="text-sm text-muted-foreground">Join VidioHire AI</p>

          <div className="space-y-4 mt-6">
            <div>
              <Label className="mb-2 block">I am a…</Label>
              <RadioGroup value={role} onValueChange={(v) => setRole(v as Role)} className="grid grid-cols-2 gap-2">
                {(["candidate","recruiter"] as Role[]).map((r) => (
                  <label key={r} className={`flex flex-col items-start gap-1 rounded-lg border p-3 cursor-pointer text-sm ${role===r?"border-primary glow bg-accent/30":"border-border"}`}>
                    <RadioGroupItem value={r} className="hidden" />
                    <span className="capitalize font-medium">{r}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Jordan Lee"/></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@company.com"/></div>
            <div className="space-y-2"><Label>Password</Label><Input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} placeholder="At least 6 characters"/></div>
            <Button onClick={submit} disabled={loading} className="w-full gradient-primary text-primary-foreground glow">{loading ? "Creating…" : "Create account"}</Button>
          </div>

          <p className="text-sm text-muted-foreground mt-5 text-center">Have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></p>
        </Card>
      </div>
      <div className="hidden lg:flex flex-col p-12 order-1 lg:order-2 relative overflow-hidden">
        <div className="ml-auto flex items-center gap-2"><div className="size-8 rounded-lg gradient-primary grid place-items-center glow"><Bot className="size-4 text-primary-foreground"/></div><span className="font-bold gradient-text">VidioHire AI</span></div>
        <div className="my-auto space-y-6 max-w-md">
          <h1 className="text-4xl font-bold leading-tight">Join the <span className="gradient-text">hiring revolution</span>.</h1>
          <ul className="space-y-3">
            {["60-second video resumes","Live AI interviews tailored to your CV","Get matched with top companies","Detailed AI feedback to level up"].map(t => (
              <li key={t} className="flex items-center gap-2"><div className="size-5 rounded-full gradient-primary grid place-items-center"><Check className="size-3 text-primary-foreground"/></div>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
