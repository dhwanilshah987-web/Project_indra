import asyncio
import websockets

async def test():
    uri = "ws://127.0.0.1:8001/ws/threats"

    print("Connecting...", flush=True)

    try:
        async with websockets.connect(uri) as websocket:
            print("Connected!", flush=True)

            while True:
                message = await websocket.recv()
                print("Threat received:", message, flush=True)

    except Exception as e:
        print("ERROR:", repr(e), flush=True)

asyncio.run(test())