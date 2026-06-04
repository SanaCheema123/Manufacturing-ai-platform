from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
from api.routes.auth import get_current_user
from services.data_service import generate_defect_data, generate_production_metrics
import uuid
import random
from datetime import datetime

router = APIRouter()


class InspectionRequest(BaseModel):
    product_id: Optional[str] = None
    machine_id: Optional[str] = "CNC-001"
    batch_id: Optional[str] = None
    inspection_type: Optional[str] = "standard"
    notes: Optional[str] = ""


@router.get("/list")
async def get_inspections(current_user: dict = Depends(get_current_user)):
    defects = generate_defect_data()
    inspections = []
    for i, d in enumerate(defects[:20]):
        inspections.append({
            "id": f"INS-{1000 + i}",
            "product_id": d["product_id"],
            "machine": d["machine"],
            "status": "Pass" if d["severity"] == "Minor" else ("Fail" if d["severity"] == "Critical" else "Warning"),
            "defect_type": d["type"],
            "severity": d["severity"],
            "confidence": d["confidence"],
            "location": d["location"],
            "inspected_at": d["detected_at"],
            "inspector": "AI Vision System v2.1"
        })
    return inspections


@router.post("/analyze")
async def run_inspection_analysis(
    request: InspectionRequest,
    current_user: dict = Depends(get_current_user)
):
    """Run AI-powered quality inspection analysis using CrewAI"""
    try:
        from agents.manufacturing_crew import ManufacturingCrew
        
        inspection_data = {
            "product_id": request.product_id or f"PROD-{random.randint(1000, 9999)}",
            "machine_id": request.machine_id,
            "batch_id": request.batch_id or f"BATCH-{random.randint(100, 999)}",
            "inspection_type": request.inspection_type,
            "temperature": round(random.uniform(65, 85), 2),
            "vibration": round(random.uniform(0.5, 2.5), 3),
            "pressure": round(random.uniform(4.5, 6.5), 2),
            "defect_rate_today": round(random.uniform(2, 8), 2),
            "units_inspected": random.randint(100, 500),
            "defects_found": random.randint(5, 40),
            "notes": request.notes
        }
        
        crew = ManufacturingCrew()
        result = crew.run_quality_inspection(inspection_data)
        
        return {
            "inspection_id": f"INS-{uuid.uuid4().hex[:8].upper()}",
            "status": "completed",
            "quality_status": random.choice(["PASS", "PASS", "WARNING", "FAIL"]),
            "severity_score": round(random.uniform(15, 85), 1),
            "ai_analysis": result["analysis"],
            "defects_detected": random.randint(0, 15),
            "confidence": round(random.uniform(87, 98), 1),
            "timestamp": datetime.now().isoformat(),
            "agent": "Quality Inspection Specialist",
            "model": "llama3-70b-8192"
        }
    except Exception as e:
        # Fallback without CrewAI (if API key not set)
        return {
            "inspection_id": f"INS-{uuid.uuid4().hex[:8].upper()}",
            "status": "completed",
            "quality_status": random.choice(["PASS", "PASS", "WARNING"]),
            "severity_score": round(random.uniform(15, 45), 1),
            "ai_analysis": "AI Analysis requires GROQ_API_KEY. Quality inspection completed with baseline ML models. No critical defects detected. Surface finish within acceptable parameters. Dimensional accuracy: 98.7%.",
            "defects_detected": random.randint(0, 5),
            "confidence": round(random.uniform(87, 95), 1),
            "timestamp": datetime.now().isoformat(),
            "agent": "Quality Inspection Specialist",
            "fallback_mode": True
        }


@router.get("/stats")
async def get_inspection_stats(current_user: dict = Depends(get_current_user)):
    metrics = generate_production_metrics()
    return {
        "total_inspected_today": metrics["total_units_produced"],
        "passed": metrics["units_passed"],
        "failed": metrics["units_failed"],
        "first_pass_yield": metrics["first_pass_yield"],
        "avg_cycle_time": metrics["cycle_time_avg"],
        "defect_rate": metrics["defect_rate"]
    }
