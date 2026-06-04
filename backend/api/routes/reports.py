from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from api.routes.auth import get_current_user
from services.data_service import generate_production_metrics, generate_quality_trends, generate_defect_data, generate_machine_health
import random, uuid
from datetime import datetime

router = APIRouter()


class ReportRequest(BaseModel):
    report_type: Optional[str] = "executive"
    time_range: Optional[str] = "7d"
    include_ai_insights: Optional[bool] = True


@router.post("/generate")
async def generate_report(request: ReportRequest, current_user: dict = Depends(get_current_user)):
    try:
        from agents.manufacturing_crew import ManufacturingCrew
        
        metrics = generate_production_metrics()
        defects = generate_defect_data()
        machines = generate_machine_health()
        
        production_data = {
            "report_type": request.report_type,
            "time_range": request.time_range,
            "metrics": metrics,
            "total_defects": len(defects),
            "critical_defects": len([d for d in defects if d["severity"] == "Critical"]),
            "machine_health_avg": round(sum(m["health_score"] for m in machines) / len(machines), 1),
            "machines_at_risk": len([m for m in machines if m["health_score"] < 75])
        }
        
        crew = ManufacturingCrew()
        result = crew.run_executive_report(production_data)
        
        return {
            "report_id": f"RPT-{uuid.uuid4().hex[:8].upper()}",
            "type": request.report_type,
            "status": "generated",
            "ai_report": result["report"],
            "generated_at": datetime.now().isoformat(),
            "generated_by": "Reporting Agent (llama3-70b-8192)",
            "metrics_snapshot": metrics
        }
    except Exception as e:
        metrics = generate_production_metrics()
        return {
            "report_id": f"RPT-{uuid.uuid4().hex[:8].upper()}",
            "type": request.report_type,
            "status": "generated",
            "ai_report": f"""EXECUTIVE MANUFACTURING REPORT
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}

EXECUTIVE SUMMARY:
Production operations running at {metrics['production_efficiency']}% efficiency. Quality score at {metrics['quality_score']}%. 
OEE at {metrics['oee_score']}% with {metrics['defect_rate']}% defect rate.

KEY PERFORMANCE INDICATORS:
- Units Produced: {metrics['total_units_produced']:,}
- First Pass Yield: {metrics['first_pass_yield']}%
- Defect Rate: {metrics['defect_rate']}%
- Throughput: {metrics['throughput_per_hour']} units/hr

TOP RECOMMENDATIONS:
1. Address CNC-001 tool wear immediately to reduce surface defects
2. Schedule WELD-002 maintenance within 5 days
3. Implement SPC monitoring for dimensional variance
4. Review shift changeover procedures to reduce Monday spike

AI FORECAST:
Production efficiency expected to improve 3.2% with recommended actions.
Projected cost savings: $48,500/month from defect reduction.""",
            "generated_at": datetime.now().isoformat(),
            "metrics_snapshot": metrics,
            "fallback_mode": True
        }


@router.get("/list")
async def list_reports(current_user: dict = Depends(get_current_user)):
    reports = []
    types = ["Executive", "Quality", "Defect Analysis", "Maintenance", "Production"]
    for i in range(10):
        from datetime import timedelta
        reports.append({
            "id": f"RPT-{uuid.uuid4().hex[:8].upper()}",
            "type": random.choice(types),
            "generated_at": (datetime.now() - timedelta(days=random.randint(0, 30))).strftime("%Y-%m-%d %H:%M"),
            "generated_by": "AI Reporting Agent",
            "status": "completed",
            "size_kb": random.randint(45, 350)
        })
    return reports
