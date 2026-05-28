import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics · VidioHire AI" }] }),
  component: Analytics,
});

const trend = Array.from({length:14}).map((_,i)=>({d:`D${i+1}`,views:30+Math.round(Math.random()*70),plays:10+Math.round(Math.random()*50)}));
const skills = [{n:"React",v:88},{n:"TS",v:84},{n:"Node",v:74},{n:"AWS",v:62},{n:"GraphQL",v:70}];
const sources = [{name:"Search",value:42},{name:"Feed",value:28},{name:"Saved",value:18},{name:"Referral",value:12}];
const COLORS = ["oklch(0.72 0.20 265)","oklch(0.68 0.24 295)","oklch(0.82 0.16 200)","oklch(0.72 0.18 155)"];

function Analytics() {
  return (
    <AppShell>
      <div className="space-y-5">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="grid lg:grid-cols-2 gap-5">
          <Card className="glass p-5">
            <div className="text-sm font-semibold mb-2">Views & plays · last 14 days</div>
            <div className="h-64"><ResponsiveContainer>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.72 0.20 265)" stopOpacity={0.6}/><stop offset="100%" stopColor="oklch(0.72 0.20 265)" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.68 0.24 295)" stopOpacity={0.6}/><stop offset="100%" stopColor="oklch(0.68 0.24 295)" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="d" stroke="oklch(0.7 0.03 260)" fontSize={11}/><YAxis stroke="oklch(0.7 0.03 260)" fontSize={11}/>
                <Tooltip contentStyle={{background:"oklch(0.18 0.035 270)",border:"1px solid oklch(0.30 0.04 270 / 0.5)",borderRadius:8}}/>
                <Area type="monotone" dataKey="views" stroke="oklch(0.72 0.20 265)" fill="url(#ga)" strokeWidth={2}/>
                <Area type="monotone" dataKey="plays" stroke="oklch(0.68 0.24 295)" fill="url(#gb)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer></div>
          </Card>
          <Card className="glass p-5">
            <div className="text-sm font-semibold mb-2">Top skills by score</div>
            <div className="h-64"><ResponsiveContainer>
              <BarChart data={skills}><XAxis dataKey="n" stroke="oklch(0.7 0.03 260)" fontSize={11}/><YAxis stroke="oklch(0.7 0.03 260)" fontSize={11}/>
                <Tooltip contentStyle={{background:"oklch(0.18 0.035 270)",border:"1px solid oklch(0.30 0.04 270 / 0.5)",borderRadius:8}}/>
                <Bar dataKey="v" fill="oklch(0.72 0.20 265)" radius={[8,8,0,0]}/></BarChart>
            </ResponsiveContainer></div>
          </Card>
          <Card className="glass p-5">
            <div className="text-sm font-semibold mb-2">Traffic sources</div>
            <div className="h-64"><ResponsiveContainer>
              <PieChart><Pie data={sources} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {sources.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie><Legend/></PieChart>
            </ResponsiveContainer></div>
          </Card>
          <Card className="glass p-5">
            <div className="text-sm font-semibold mb-2">AI score trend</div>
            <div className="h-64"><ResponsiveContainer>
              <LineChart data={trend}><XAxis dataKey="d" stroke="oklch(0.7 0.03 260)" fontSize={11}/><YAxis stroke="oklch(0.7 0.03 260)" fontSize={11}/>
                <Tooltip contentStyle={{background:"oklch(0.18 0.035 270)",border:"1px solid oklch(0.30 0.04 270 / 0.5)",borderRadius:8}}/>
                <Line type="monotone" dataKey="views" stroke="oklch(0.82 0.16 200)" strokeWidth={2} dot={false}/></LineChart>
            </ResponsiveContainer></div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
