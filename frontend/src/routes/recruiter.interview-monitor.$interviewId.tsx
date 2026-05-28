import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import RecruiterPage from "@/components/RecruiterPage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { wsClient } from "@/lib/websocket";
import { useRealtimeStore } from "@/hooks/useRealtime";
import { Mic, AlertTriangle, Activity, Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/recruiter/interview-monitor/$interviewId")({
  component: InterviewMonitor,
});

function InterviewMonitor() {
  const { interviewId } = Route.useParams();
  const { 
    transcripts, 
    aiAnalysis, 
    antiCheatAlerts, 
    isConnected,
    setActiveInterview
  } = useRealtimeStore();

  useEffect(() => {
    if (wsClient && isConnected) {
      wsClient.send("join_interview", { interview_id: interviewId });
      setActiveInterview(interviewId);
    }
    return () => setActiveInterview(null);
  }, [interviewId, isConnected, setActiveInterview]);

  return (
    <RecruiterPage
      badge="Live Monitor"
      title={`Interview: ${interviewId}`}
      subtitle="Real-time AI analysis and transcription of the ongoing interview."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
        {/* Left Column: Live Transcript & Video Feed Placeholder */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="glass relative overflow-hidden flex-shrink-0 h-[300px] flex items-center justify-center bg-black/5">
             <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="destructive" className="animate-pulse flex items-center gap-1">
                  <div className="size-2 rounded-full bg-white" /> LIVE
                </Badge>
                {isConnected ? (
                  <Badge className="bg-success/80 text-white">Connected</Badge>
                ) : (
                  <Badge variant="secondary">Connecting...</Badge>
                )}
             </div>
             {/* Simulating Candidate Video Stream */}
             <div className="text-muted-foreground text-sm flex flex-col items-center">
               <Mic className="size-8 mb-2 animate-pulse text-primary" />
               <p>Receiving Candidate Stream...</p>
             </div>
          </Card>

          <Card className="glass p-4 flex-1 flex flex-col min-h-0">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Activity className="size-4 text-primary" /> Live Transcript
            </h3>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {transcripts.map((t, idx) => (
                  <div key={idx} className={`p-3 rounded-lg text-sm ${t.role === 'candidate' ? 'bg-primary/5 ml-auto w-3/4' : 'bg-muted mr-auto w-3/4'}`}>
                    <div className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">{t.role}</div>
                    <div>{t.text}</div>
                  </div>
                ))}
                {transcripts.length === 0 && (
                  <div className="text-sm text-muted-foreground italic text-center mt-10">Waiting for speech...</div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Right Column: AI Analysis & Anti-Cheat */}
        <div className="flex flex-col gap-4 min-h-0">
          <Card className="glass p-4 flex-1 flex flex-col min-h-0">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Brain className="size-4 text-primary" /> AI Live Evaluation
            </h3>
            {aiAnalysis ? (
              <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-sm mb-1">
                     <span>Technical Depth</span>
                     <span className="font-medium">{aiAnalysis.technical_depth}%</span>
                   </div>
                   <Progress value={aiAnalysis.technical_depth} className="h-2" />
                </div>
                <div>
                   <div className="flex justify-between text-sm mb-1">
                     <span>Communication</span>
                     <span className="font-medium">{aiAnalysis.communication}%</span>
                   </div>
                   <Progress value={aiAnalysis.communication} className="h-2" />
                </div>
                <div>
                   <div className="flex justify-between text-sm mb-1">
                     <span>Confidence</span>
                     <span className="font-medium">{aiAnalysis.confidence}%</span>
                   </div>
                   <Progress value={aiAnalysis.confidence} className="h-2" />
                </div>
                <div className="pt-4 border-t border-border mt-4">
                   <div className="text-sm text-muted-foreground mb-1">Current Sentiment</div>
                   <Badge variant="outline" className="text-sm px-3 py-1 bg-primary/5">{aiAnalysis.sentiment}</Badge>
                </div>
              </div>
            ) : (
               <div className="text-sm text-muted-foreground flex-1 flex items-center justify-center">
                 Awaiting enough context for AI analysis...
               </div>
            )}
          </Card>

          <Card className="glass p-4 flex-1 flex flex-col min-h-0">
             <h3 className="font-semibold mb-4 flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-4" /> Anti-Cheat Logs
            </h3>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3">
                {antiCheatAlerts.map((alert, idx) => (
                  <div key={idx} className={`p-3 rounded border text-sm ${
                    alert.evaluation.severity === 'critical' ? 'border-destructive bg-destructive/10 text-destructive' :
                    alert.evaluation.severity === 'high' ? 'border-orange-500 bg-orange-500/10 text-orange-600' :
                    'border-yellow-500 bg-yellow-500/10 text-yellow-600'
                  }`}>
                    <div className="font-semibold mb-1 flex justify-between items-center">
                      {alert.event}
                      <span className="text-xs opacity-80">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-xs opacity-90">{alert.evaluation.message}</div>
                  </div>
                ))}
                {antiCheatAlerts.length === 0 && (
                   <div className="text-sm text-muted-foreground text-center mt-10">No suspicious activity detected.</div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </RecruiterPage>
  );
}
