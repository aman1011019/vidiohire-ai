import { create } from 'zustand';
import { wsClient } from '../lib/websocket';
import { useEffect } from 'react';

export interface AntiCheatAlert {
  event: string;
  evaluation: {
    severity: string;
    action: string;
    message: string;
  };
  timestamp: string;
}

export interface TranscriptEntry {
  text: string;
  role: 'candidate' | 'ai';
  timestamp: number;
}

export interface AIAnalysis {
  confidence: number;
  communication: number;
  fluency: number;
  professionalism: number;
  technical_depth: number;
  sentiment: string;
}

interface RealtimeState {
  isConnected: boolean;
  activeInterviewId: string | null;
  transcripts: TranscriptEntry[];
  aiAnalysis: AIAnalysis | null;
  antiCheatAlerts: AntiCheatAlert[];
  pipelineData: any[]; // Using any for brevity in this example
  
  setConnected: (status: boolean) => void;
  setActiveInterview: (id: string | null) => void;
  addTranscript: (entry: TranscriptEntry) => void;
  setAIAnalysis: (analysis: AIAnalysis) => void;
  addAntiCheatAlert: (alert: AntiCheatAlert) => void;
  setPipelineData: (data: any[]) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  isConnected: false,
  activeInterviewId: null,
  transcripts: [],
  aiAnalysis: null,
  antiCheatAlerts: [],
  pipelineData: [],

  setConnected: (status) => set({ isConnected: status }),
  setActiveInterview: (id) => set({ activeInterviewId: id }),
  addTranscript: (entry) => set((state) => ({ transcripts: [...state.transcripts, entry] })),
  setAIAnalysis: (analysis) => set({ aiAnalysis: analysis }),
  addAntiCheatAlert: (alert) => set((state) => ({ antiCheatAlerts: [alert, ...state.antiCheatAlerts] })),
  setPipelineData: (data) => set({ pipelineData: data }),
}));

export const useWebSocketInitialization = () => {
  const { setConnected, addTranscript, setAIAnalysis, addAntiCheatAlert, setPipelineData } = useRealtimeStore();

  useEffect(() => {
    wsClient.connect();
    
    // Simulate connected status for UI purposes if ws is connecting/open
    setConnected(true);

    const handleTranscript = (data: any) => {
      addTranscript({
        text: data.text,
        role: data.role,
        timestamp: Date.now(),
      });
    };

    const handleAnalysis = (data: any) => {
      setAIAnalysis(data.analysis);
    };

    const handleAntiCheat = (data: any) => {
      addAntiCheatAlert(data);
    };
    
    const handlePipeline = (data: any) => {
        setPipelineData(data.data || []);
    }

    wsClient.on('live_transcript', handleTranscript);
    wsClient.on('ai_analysis_update', handleAnalysis);
    wsClient.on('anti_cheat_alert', handleAntiCheat);
    wsClient.on('pipeline_sync', handlePipeline);

    return () => {
      wsClient.off('live_transcript', handleTranscript);
      wsClient.off('ai_analysis_update', handleAnalysis);
      wsClient.off('anti_cheat_alert', handleAntiCheat);
      wsClient.off('pipeline_sync', handlePipeline);
      wsClient.disconnect();
    };
  }, []);
};
