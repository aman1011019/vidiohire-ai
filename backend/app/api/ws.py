from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.websocket.manager import manager
from app.services.ai_service import AIService
from app.services.anti_cheat_service import AntiCheatService
import asyncio

router = APIRouter(tags=["websocket"])

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_json()
            event_type = data.get("type")
            
            if event_type == "join_interview":
                interview_id = data.get("interview_id")
                await manager.join_interview_room(websocket, interview_id)
                
            elif event_type == "subscribe_pipeline":
                await manager.subscribe_to_pipeline(websocket)
                
            elif event_type == "anti_cheat":
                interview_id = data.get("interview_id")
                event = data.get("event")
                evaluation = AntiCheatService.evaluate_event(event)
                
                await manager.broadcast_to_interview({
                    "type": "anti_cheat_alert",
                    "event": event,
                    "evaluation": evaluation,
                    "timestamp": data.get("timestamp")
                }, interview_id)
                
            elif event_type == "transcript_chunk":
                interview_id = data.get("interview_id")
                text = data.get("text")
                
                # Broadcast raw transcript immediately for real-time feel
                await manager.broadcast_to_interview({
                    "type": "live_transcript",
                    "text": text,
                    "role": "candidate"
                }, interview_id)
                
                # Async analyze transcript snippet
                analysis = await AIService.analyze_live_transcript(text)
                await manager.broadcast_to_interview({
                    "type": "ai_analysis_update",
                    "analysis": analysis
                }, interview_id)
                
            elif event_type == "pipeline_update":
                # Typically this would be triggered via REST API after DB update, 
                # but we can allow direct WS publish for instant feel
                await manager.broadcast_pipeline_update({
                    "type": "pipeline_sync",
                    "data": data.get("data")
                })
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
