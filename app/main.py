from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
from app.threat_streamer import get_fraud_alerts

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Project INDRA Backend running"}

@app.websocket("/ws/threats")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # Load alerts into memory once
    alerts = get_fraud_alerts()
    
    try:
        # Loop endlessly for the hackathon demo stream
        while True:
            for alert in alerts:
                await websocket.send_json(alert)
                await asyncio.sleep(2.5)
                
    except WebSocketDisconnect:
        print("Client disconnected cleanly.")
    except Exception as e:
        print(f"Unexpected connection error: {e}")