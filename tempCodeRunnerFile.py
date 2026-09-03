_import asyncio
import websockets

async def test():
    uri = "ws://localhost:8001/ws/threats"

    async with websockets.connect(uri) as websocket:
        print("Connected!")

        while True:
            message = await websocket.recv()
            print("Threat received:", message)

asyncio.run(test())