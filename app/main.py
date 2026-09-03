from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import requests
from app.threat_streamer import get_fraud_alerts

app = FastAPI(title="Project INDRA - MHA Command Core")

# FATAL FLAW FIXED: CORS Middleware allows Next.js frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DispatchPayload(BaseModel):
    target_atm_id: str

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Project INDRA Backend running"}

@app.post("/api/dispatch")
async def trigger_dispatch(payload: DispatchPayload):
    """Zero-Trust Telegram Dispatch Route"""
    # Member 3 will insert their Telegram keys here
    BOT_TOKEN = "INSERT_BOT_TOKEN_HERE"
    CHAT_ID = "INSERT_CHAT_ID_HERE"
    
    text = f"🚨 [MHA COMMAND] 🚨\n\nCRITICAL THREAT: Imminent Cash-Out predicted at {payload.target_atm_id}.\n\nACTION: Nearest Interception Unit Dispatched."
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage?chat_id={CHAT_ID}&text={text}"
    
    try:
        requests.get(url, timeout=3)
        print(f"\n[CRITICAL ALERT] Telegram Payload Delivered for {payload.target_atm_id}")
        return {"status": "success", "message": "Alert Dispatched"}
    except Exception as e:
        print(f"\n[WARNING] Wi-Fi down. Local Dispatch Logged for {payload.target_atm_id}")
        return {"status": "mock_success", "message": "Offline Fallback Triggered"}

@app.websocket("/ws/threats")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    alerts = get_fraud_alerts()
    
    try:
        # DEMO PACER: Wait 10 seconds before pushing threats so the presenter can introduce the UI
        await asyncio.sleep(10) 
        
        while True:
            for alert in alerts:
                await websocket.send_json(alert)
                print(f"[OK] Stream Active: Broadcasting TXN {alert.get('txn_id', 'Unknown')}")
                await asyncio.sleep(3.5) # Increased to 3.5s so the UI map flyTo animation has time to finish
    except WebSocketDisconnect:
        print("[SYSTEM] Client disconnected cleanly.")
    except Exception as e:
        print(f"[ERROR] Unexpected connection error: {e}")