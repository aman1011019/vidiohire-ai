import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp, type Role } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · VidioHire AI" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useApp();
  const nav = useNavigate();
  const [role, setRole] = useState<Role>("candidate");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !pw) return toast.error("Enter email and password");
    setLoading(true);
    try {
      const u = await login(email, pw);
      toast.success(`Welcome back, ${u.name.split(" ")[0]}!`);
      nav({ to: u.role === "recruiter" ? "/recruiter" : "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col p-12 relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2"><div className="size-8 rounded-lg gradient-primary grid place-items-center glow"><Bot className="size-4 text-primary-foreground"/></div><span className="font-bold gradient-text">VidioHire AI</span></Link>
        <div className="my-auto space-y-6 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs"><Sparkles className="size-3 text-neon"/> AI-native hiring</div>
          <h1 className="text-4xl font-bold leading-tight">Sign in to the future of <span className="gradient-text">hiring</span>.</h1>
          <p className="text-muted-foreground">Continue where you left off — your candidates, interviews, and pipelines are ready.</p>
          <div className="glass-strong rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm"><div className="size-2 rounded-full bg-success animate-pulse"/>5,124 candidates discovered today</div>
            <div className="flex items-center gap-2 text-sm"><div className="size-2 rounded-full bg-neon animate-pulse"/>329 AI interviews completed in the last hour</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="glass-strong w-full max-w-md p-8">
          <Link to="/" className="text-xs text-muted-foreground inline-flex items-center gap-1 mb-4 hover:text-foreground"><ArrowLeft className="size-3"/> Back home</Link>
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-sm text-muted-foreground">Sign in to continue.</p>

          <Tabs value={role} onValueChange={(v) => setRole(v as Role)} className="mt-5">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="candidate">Candidate</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
            <TabsContent value={role}>
              <form onSubmit={submit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2"><Checkbox defaultChecked /> Remember me</label>
                  <button type="button" onClick={() => toast.info("Contact support to reset your password")} className="text-primary hover:underline">Forgot password?</button>
                </div>
                <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground glow">{loading ? "Signing in…" : "Sign in"}</Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-sm text-muted-foreground mt-5 text-center">No account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></p>
        </Card>
      </div>
    </div>
  );
}
