from fastapi import APIRouter, Depends
from api.routes.auth import get_current_user
from services.data_service import (
    generate_production_metrics, generate_machine_health,
    generate_quality_trends, generate_alert_data, generate_defect_data
)

router = APIRouter()


@router.get("/overview")
async def get_dashboard_overview(current_user: dict = Depends(get_current_user)):
    metrics = generate_production_metrics()
    machines = generate_machine_health()
    alerts = generate_alert_data()
    
    critical_machines = [m for m in machines if m["status"] == "Critical"]
    warning_machines = [m for m in machines if m["status"] == "Warning"]
    
    return {
        "kpis": {
            "total_units": metrics["total_units_produced"],
            "passed_units": metrics["units_passed"],
            "failed_units": metrics["units_failed"],
            "defect_rate": metrics["defect_rate"],
            "oee": metrics["oee_score"],
            "quality_score": metrics["quality_score"],
            "efficiency": metrics["production_efficiency"],
            "throughput": metrics["throughput_per_hour"]
        },
        "machine_summary": {
            "total": len(machines),
            "healthy": len([m for m in machines if m["status"] == "Healthy"]),
            "warning": len(warning_machines),
            "critical": len(critical_machines)
        },
        "alerts": {
            "total": len(alerts),
            "critical": len([a for a in alerts if a["severity"] == "Critical"]),
            "active": len([a for a in alerts if a["status"] == "Active"])
        },
        "recent_alerts": alerts[:5],
        "timestamp": metrics["timestamp"]
    }


@router.get("/production-metrics")
async def get_production_metrics(current_user: dict = Depends(get_current_user)):
    return generate_production_metrics()


@router.get("/quality-trends")
async def get_quality_trends(days: int = 30, current_user: dict = Depends(get_current_user)):
    return generate_quality_trends(days)


@router.get("/alerts")
async def get_alerts(current_user: dict = Depends(get_current_user)):
    return generate_alert_data()


@router.get("/machine-health")
async def get_machine_health(current_user: dict = Depends(get_current_user)):
    return generate_machine_health()
