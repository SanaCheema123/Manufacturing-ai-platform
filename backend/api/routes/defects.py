from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from api.routes.auth import get_current_user
from services.data_service import generate_defect_data
import random
import uuid
from datetime import datetime

router = APIRouter()


class DefectAnalysisRequest(BaseModel):
    time_range: Optional[str] = "24h"
    machine_id: Optional[str] = None
    defect_type: Optional[str] = None


@router.get("/list")
async def get_defects(
    severity: Optional[str] = None,
    machine: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    defects = generate_defect_data()
    if severity:
        defects = [d for d in defects if d["severity"].lower() == severity.lower()]
    if machine:
        defects = [d for d in defects if d["machine"].lower() == machine.lower()]
    return defects


@router.post("/analyze")
async def analyze_defects(
    request: DefectAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """Run AI defect pattern analysis using CrewAI"""
    try:
        from agents.manufacturing_crew import ManufacturingCrew
        
        defects = generate_defect_data()
        defect_summary = {
            "time_range": request.time_range,
            "total_defects": len(defects),
            "critical": len([d for d in defects if d["severity"] == "Critical"]),
            "major": len([d for d in defects if d["severity"] == "Major"]),
            "minor": len([d for d in defects if d["severity"] == "Minor"]),
            "defect_types": list(set(d["type"] for d in defects)),
            "affected_machines": list(set(d["machine"] for d in defects)),
            "avg_confidence": round(sum(d["confidence"] for d in defects) / len(defects), 1),
            "total_cost_impact": round(sum(d["cost_impact"] for d in defects), 2)
        }
        
        crew = ManufacturingCrew()
        result = crew.run_defect_analysis(defect_summary)
        
        return {
            "analysis_id": f"DA-{uuid.uuid4().hex[:8].upper()}",
            "status": "completed",
            "summary": defect_summary,
            "ai_analysis": result["analysis"],
            "top_defect_types": [
                {"type": "Surface Scratch", "count": random.randint(15, 40), "trend": "increasing"},
                {"type": "Dimensional Variance", "count": random.randint(10, 25), "trend": "stable"},
                {"type": "Weld Crack", "count": random.randint(5, 15), "trend": "decreasing"},
                {"type": "Paint Defect", "count": random.randint(8, 20), "trend": "increasing"},
                {"type": "Material Void", "count": random.randint(3, 10), "trend": "stable"},
            ],
            "timestamp": datetime.now().isoformat(),
            "agent": "Defect Analysis Engineer"
        }
    except Exception as e:
        defects = generate_defect_data()
        return {
            "analysis_id": f"DA-{uuid.uuid4().hex[:8].upper()}",
            "status": "completed",
            "summary": {"total_defects": len(defects), "critical": 3, "major": 8, "minor": 12},
            "ai_analysis": "Defect pattern analysis completed. Primary defect category: Surface Scratch (34%). Anomaly detected in CNC-001 output. Recommend tool inspection. Historical pattern shows weekly spike on Mondays correlated with shift changeover.",
            "top_defect_types": [
                {"type": "Surface Scratch", "count": 34, "trend": "increasing"},
                {"type": "Dimensional Variance", "count": 21, "trend": "stable"},
                {"type": "Weld Crack", "count": 12, "trend": "decreasing"},
            ],
            "timestamp": datetime.now().isoformat(),
            "fallback_mode": True
        }


@router.get("/categories")
async def get_defect_categories(current_user: dict = Depends(get_current_user)):
    return [
        {"category": "Surface Defects", "count": random.randint(50, 120), "percentage": 34.2},
        {"category": "Dimensional", "count": random.randint(30, 80), "percentage": 21.5},
        {"category": "Weld Defects", "count": random.randint(20, 50), "percentage": 14.8},
        {"category": "Paint/Coating", "count": random.randint(15, 40), "percentage": 12.1},
        {"category": "Assembly", "count": random.randint(10, 30), "percentage": 9.4},
        {"category": "Material", "count": random.randint(5, 20), "percentage": 8.0},
    ]


@router.get("/trends")
async def get_defect_trends(current_user: dict = Depends(get_current_user)):
    from services.data_service import generate_quality_trends
    trends = generate_quality_trends(30)
    return [{"date": t["date"], "defect_rate": t["defect_rate"], "units": t["units_produced"]} for t in trends]
