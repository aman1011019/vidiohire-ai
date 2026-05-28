from typing import Dict, List, Any
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Maps user_id -> list of active websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Maps interview_id -> list of websockets (for recruiters/candidates in an interview)
        self.interview_rooms: Dict[str, List[WebSocket]] = {}
        # List of websockets subscribed to pipeline updates
        self.pipeline_subscribers: List[WebSocket] = []

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: str = None):
        if user_id and user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
                
        # Clean up from rooms
        for room_id in list(self.interview_rooms.keys()):
            if websocket in self.interview_rooms[room_id]:
                self.interview_rooms[room_id].remove(websocket)
                if not self.interview_rooms[room_id]:
                    del self.interview_rooms[room_id]
                    
        if websocket in self.pipeline_subscribers:
            self.pipeline_subscribers.remove(websocket)

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_json(message)
                
    async def join_interview_room(self, websocket: WebSocket, interview_id: str):
        if interview_id not in self.interview_rooms:
            self.interview_rooms[interview_id] = []
        if websocket not in self.interview_rooms[interview_id]:
            self.interview_rooms[interview_id].append(websocket)
        
    def leave_interview_room(self, websocket: WebSocket, interview_id: str):
        if interview_id in self.interview_rooms:
            if websocket in self.interview_rooms[interview_id]:
                self.interview_rooms[interview_id].remove(websocket)

    async def broadcast_to_interview(self, message: dict, interview_id: str):
        if interview_id in self.interview_rooms:
            for connection in self.interview_rooms[interview_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

    async def subscribe_to_pipeline(self, websocket: WebSocket):
        if websocket not in self.pipeline_subscribers:
            self.pipeline_subscribers.append(websocket)
            
    async def broadcast_pipeline_update(self, message: dict):
        for connection in self.pipeline_subscribers:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()
