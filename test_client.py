import asyncio
import json
import time
import websockets

SERVER_URI = "ws://127.0.0.1:8000/ws/threats"

async def test_threat_stream():
    print(f"Connecting to {SERVER_URI}...")
    
    async with websockets.connect(SERVER_URI) as websocket:
        print("Connected successfully! Listening for alerts...\n")
        
        last_received_time = None
        alert_count = 0

        try:
            while True:
                message = await websocket.recv()
                current_time = time.time()
                alert_count += 1
                
                data = json.loads(message)
                
                if last_received_time is not None:
                    elapsed = current_time - last_received_time
                    interval_info = f"[+{elapsed:.2f}s elapsed]"
                else:
                    interval_info = "[First Alert]"
                
                last_received_time = current_time
                
                print(f"Alert #{alert_count} {interval_info}")
                print(json.dumps(data, indent=2))
                print("-" * 50)
                
        except websockets.exceptions.ConnectionClosed:
            print("\nWebSocket connection was closed by the server.")

if __name__ == "__main__":
    asyncio.run(test_threat_stream())