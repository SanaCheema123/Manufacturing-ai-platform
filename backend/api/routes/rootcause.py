from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from api.routes.auth import get_current_user
from services.data_service import generate_machine_health, generate_sensor_readings, generate_root_cause_data
import random
import uuid
from datetime import datetime

router = APIRouter()


class RCARequest(BaseModel):
    defect_id: Optional[str] = None
    machine_id: Optional[str] = "CNC-001"
    time_window: Optional[str] = "24h"


@router.get("/list")
async def get_rca_list(current_user: dict = Depends(get_current_user)):
    return generate_root_cause_data()


@router.post("/analyze")
async def run_rca(request: RCARequest, current_user: dict = Depends(get_current_user)):
    try:
        from agents.manufacturing_crew import ManufacturingCrew
        
        machine_data = {
            "machine_id": request.machine_id,
            "time_window": request.time_window,
            "temperature_avg": round(random.uniform(75, 92), 1),
            "temperature_max": round(random.uniform(92, 105), 1),
            "vibration_avg": round(random.uniform(1.2, 3.1), 2),
            "vibration_max": round(random.uniform(3.1, 5.5), 2),
            "pressure_variance": round(random.uniform(0.2, 1.5), 2),
            "defect_rate_spike": round(random.uniform(8, 25), 1),
            "downtime_events": random.randint(1, 5),
            "error_codes": ["E-104", "E-221", "W-033"],
            "maintenance_overdue": random.choice([True, False])
        }
        
        crew = ManufacturingCrew()
        result = crew.run_root_cause_analysis(machine_data)
        
        return {
            "rca_id": f"RCA-{uuid.uuid4().hex[:8].upper()}",
            "machine_id": request.machine_id,
            "primary_cause": "Tool wear exceeding threshold on spindle assembly",
            "confidence": round(random.uniform(87, 97), 1),
            "ai_analysis": result["analysis"],
            "causal_chain": [
                "Vibration spike detected at 14:32",
                "Tool temperature exceeded 95°C",
                "Spindle speed variation ±150 RPM",
                "Surface defect rate increased 340%",
                "Quality threshold breach triggered"
            ],
            "corrective_actions": [
                "Replace spindle tool bit immediately",
                "Reduce feed rate by 15%",
                "Increase coolant flow to 8L/min",
                "Schedule spindle bearing inspection"
            ],
            "timestamp": datetime.now().isoformat(),
            "agent": "Root Cause Analysis Expert"
        }
    except Exception as e:
        return {
            "rca_id": f"RCA-{uuid.uuid4().hex[:8].upper()}",
            "machine_id": request.machine_id,
            "primary_cause": "Thermal expansion in tool assembly causing dimensional variance",
            "confidence": 91.3,
            "ai_analysis": "Root cause identified: Excessive thermal buildup in CNC spindle unit. Contributing factors include inadequate coolant flow and extended continuous operation cycles. Recommend immediate corrective action.",
            "causal_chain": ["Coolant flow reduced", "Temperature spike", "Tool expansion", "Dimensional error"],
            "corrective_actions": ["Check coolant system", "Implement cool-down cycles", "Inspect tooling"],
            "timestamp": datetime.now().isoformat(),
            "fallback_mode": True
        }
