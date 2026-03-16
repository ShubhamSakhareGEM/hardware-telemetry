from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import asyncio

app = FastAPI(title="Hardware Telemetry API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/telemetry")
async def get_telemetry():
    # simulating a micro-delay representing hardware sensor polling (1-5ms)
    await asyncio.sleep(random.uniform(0.001, 0.005))
    
    return {
        "status": "OK",
        "data": {
            "server_temperature_c": round(random.uniform(35.0, 85.0), 1),
            "network_latency_ms": round(random.uniform(1.0, 50.0), 2),
            "cpu_utilization_pct": round(random.uniform(10.0, 99.0), 1),
            "optical_node_status": random.choices(["Active", "Warning", "Offline"], weights=[85, 10, 5])[0]
        }
    }