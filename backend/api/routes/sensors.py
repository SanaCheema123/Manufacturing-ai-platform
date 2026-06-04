from fastapi import APIRouter, Depends
from api.routes.auth import get_current_user
from services.data_service import generate_sensor_readings, generate_machine_health
import random

router = APIRouter()


@router.get("/readings/{machine_id}")
async def get_sensor_readings(machine_id: str, hours: int = 24, current_user: dict = Depends(get_current_user)):
    return generate_sensor_readings(machine_id, hours)


@router.get("/live")
async def get_live_sensors(current_user: dict = Depends(get_current_user)):
    machines = ["CNC-001", "WELD-002", "PAINT-003", "ASSEMBLY-004", "PRESS-005", "INSPECT-006"]
    live_data = []
    for m in machines:
        live_data.append({
            "machine_id": m,
            "temperature": round(random.uniform(62, 95), 1),
            "vibration": round(random.uniform(0.3, 3.8), 3),
            "pressure": round(random.uniform(4.2, 7.1), 2),
            "rpm": round(random.uniform(2700, 3300), 0),
            "current_amps": round(random.uniform(11, 19), 2),
            "humidity": round(random.uniform(35, 65), 1),
            "noise_db": round(random.uniform(68, 92), 1),
            "status": random.choice(["Normal", "Normal", "Normal", "Warning", "Alert"])
        })
    return live_data


@router.get("/thresholds")
async def get_sensor_thresholds(current_user: dict = Depends(get_current_user)):
    return {
        "temperature": {"min": 60, "max": 90, "critical": 100, "unit": "°C"},
        "vibration": {"min": 0, "max": 3.0, "critical": 4.5, "unit": "mm/s"},
        "pressure": {"min": 4.0, "max": 7.0, "critical": 8.5, "unit": "bar"},
        "rpm": {"min": 2500, "max": 3500, "critical": 4000, "unit": "RPM"},
        "current": {"min": 10, "max": 18, "critical": 22, "unit": "A"},
        "humidity": {"min": 30, "max": 70, "critical": 85, "unit": "%"}
    }
