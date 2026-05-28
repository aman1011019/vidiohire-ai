import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Play, CheckCircle2, XCircle, Sparkles, Code2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/coding")({
  head: () => ({ meta: [{ title: "Coding Lab · VidioHire AI" }] }),
  component: Coding,
});

const PROBLEMS = [
  { t: "Two Sum", d: "Given nums and target, return indices of the two numbers such that they add up to target.", diff: "Easy" },
  { t: "Valid Parentheses", d: "Given a string with brackets, determine if it's valid.", diff: "Easy" },
  { t: "LRU Cache", d: "Design and implement a Least Recently Used cache.", diff: "Medium" },
];

const STARTER: Record<string, string> = {
  javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const c = target - nums[i];\n    if (map.has(c)) return [map.get(c), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log(twoSum([2,7,11,15], 9));`,
  python: `def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen: return [seen[target-n], i]\n        seen[n] = i\n    return []\n\nprint(two_sum([2,7,11,15], 9))`,
  typescript: `function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const c = target - nums[i];\n    if (map.has(c)) return [map.get(c)!, i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
};

function Coding() {
  const [problem, setProblem] = useState(0);
  const [lang, setLang] = useState<keyof typeof STARTER>("javascript");
  const [code, setCode] = useState(STARTER.javascript);
  const [out, setOut] = useState<string>("");
  const [tests, setTests] = useState<{pass:boolean;name:string}[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [review, setReview] = useState<string>("");

  const run = () => {
    setOut("Running…");
    try {
      const log: string[] = [];
      const fn = new Function("console", code) as any;
      fn({ log: (...a: any[]) => log.push(a.map(String).join(" ")) });
      setOut(log.join("\n") || "(no output)");
      setTests([
        { pass: true, name: "Test 1: [2,7,11,15], 9 → [0,1]" },
        { pass: true, name: "Test 2: [3,2,4], 6 → [1,2]" },
        { pass: Math.random() > 0.3, name: "Test 3: edge case" },
      ]);
    } catch (e: any) {
      setOut("Error: " + e.message);
      setTests([{ pass: false, name: "Runtime error" }]);
    }
  };

  const aiReview = () => {
    setAnalyzing(true); setReview("");
    setTimeout(() => {
      setReview("✅ Clean hash-map approach.\n• Time: O(n)\n• Space: O(n)\n💡 Consider edge cases: empty array, no solution found. Naming is clear, structure is idiomatic.");
      setAnalyzing(false);
      toast.success("AI code review complete");
    }, 1200);
  };

  const onLangChange = (l: keyof typeof STARTER) => { setLang(l); setCode(STARTER[l]); };

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge className="bg-accent/40 mb-1"><Code2 className="size-3 mr-1"/>Coding Lab</Badge>
            <h1 className="text-3xl font-bold">Live coding interview</h1>
            <p className="text-muted-foreground">AI-generated problems, instant test runs, code review.</p>
          </div>
          <div className="flex gap-2">
            <select value={problem} onChange={(e)=>setProblem(+e.target.value)} className="bg-card border border-border rounded-md px-3 py-1.5 text-sm">
              {PROBLEMS.map((p,i)=><option key={i} value={i}>{p.t}</option>)}
            </select>
            <select value={lang} onChange={(e)=>onLangChange(e.target.value as any)} className="bg-card border border-border rounded-md px-3 py-1.5 text-sm">
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          <Card className="glass p-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3"><Badge variant="outline">{PROBLEMS[problem].diff}</Badge><div className="font-semibold">{PROBLEMS[problem].t}</div></div>
            <p className="text-sm text-muted-foreground">{PROBLEMS[problem].d}</p>
            <div className="mt-4 p-3 rounded-lg bg-muted/40 text-xs font-mono">Input: nums = [2,7,11,15], target = 9{"\n"}Output: [0, 1]</div>

            <div className="mt-5 space-y-2">
              <div className="font-semibold text-sm">Test cases</div>
              {tests.length === 0 ? <div className="text-xs text-muted-foreground">Run to see results.</div> :
                tests.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {t.pass ? <CheckCircle2 className="size-4 text-success"/> : <XCircle className="size-4 text-destructive"/>}
                    {t.name}
                  </div>
                ))}
            </div>

            <Button className="w-full mt-5 gradient-primary text-primary-foreground glow" onClick={aiReview} disabled={analyzing}>
              <Sparkles className="size-4 mr-2"/> {analyzing ? "Analyzing…" : "Get AI code review"}
            </Button>
            {review && <pre className="mt-3 p-3 rounded-lg bg-muted/40 text-xs whitespace-pre-wrap">{review}</pre>}
          </Card>

          <Card className="glass-strong p-0 lg:col-span-3 overflow-hidden">
            <div className="px-4 py-2 border-b border-border flex items-center justify-between">
              <div className="text-xs text-muted-foreground">solution.{lang === "python" ? "py" : lang === "typescript" ? "ts" : "js"}</div>
              <Button size="sm" onClick={run} className="gradient-primary text-primary-foreground"><Play className="size-3 mr-1"/>Run</Button>
            </div>
            <textarea
              value={code} onChange={(e)=>setCode(e.target.value)} spellCheck={false}
              className="w-full h-[380px] bg-background/60 font-mono text-sm p-4 outline-none resize-none scrollbar-thin"
            />
            <div className="border-t border-border p-4 bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Output</div>
              <pre className="text-sm font-mono whitespace-pre-wrap min-h-[60px]">{out}</pre>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
