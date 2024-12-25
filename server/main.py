import asyncio
import json
import datetime
from nats.aio.client import Client as NATS

async def TP_TIMER(msg):
    current_time = datetime.datetime.now().isoformat()
    
    response = {
        "time": current_time
    }

    print("Received a request for the current time. Responding with: ", response)

    await msg.respond(json.dumps(response).encode())

async def TP_TEST1(msg):
    response = "I'm not JSON D:"
    
    print("Received a request for the current time. Responding with: ", response)

    await msg.respond(json.dumps(response).encode())

async def TP_TEST2(msg):
    response = msg.data.decode()
    
    print("Received a request for the current time. Responding with: ", msg)

    await msg.respond(json.dumps(response).encode())

async def run():
    nc = NATS()

    await nc.connect("nats://localhost:4222")

    await nc.subscribe("time", cb=TP_TIMER)
    await nc.subscribe("TP_TEST1", cb=TP_TEST1)
    await nc.subscribe("TP_TEST2", cb=TP_TEST2)

    print("NATS server is running and listening for requests on 'time' subject...")
    
    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        pass

    await nc.close()

# Run the server
if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())
