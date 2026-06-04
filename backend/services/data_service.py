import random
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Any
import uuid


def generate_sensor_readings(machine_id: str, hours: int = 24) -> List[Dict]:
    """Generate realistic sensor readings for a machine"""
    readings = []
    base_time = datetime.now() - timedelta(hours=hours)
    
    base_temp = random.uniform(65, 85)
    base_vibration = random.uniform(0.5, 2.5)
    base_pressure = random.uniform(4.5, 6.5)
    
    for i in range(hours * 12):  # every 5 minutes
        timestamp = base_time + timedelta(minutes=i * 5)
        
        # Add realistic drift and anomalies
        temp_drift = np.sin(i * 0.1) * 5 + random.gauss(0, 1)
        vib_drift = random.gauss(0, 0.2)
        
        readings.append({
            "timestamp": timestamp.isoformat(),
            "machine_id": machine_id,
            "temperature": round(base_temp + temp_drift, 2),
            "vibration": round(max(0, base_vibration + vib_drift), 3),
            "pressure": round(base_pressure + random.gauss(0, 0.1), 2),
            "rpm": round(random.uniform(2800, 3200), 0),
            "current": round(random.uniform(12, 18), 2),
            "power_kw": round(random.uniform(45, 75), 2),
        })
    
    return readings


def generate_production_metrics() -> Dict:
    """Generate realistic production metrics"""
    return {
        "total_units_produced": random.randint(8500, 12000),
        "units_passed": random.randint(7800, 11000),
        "units_failed": random.randint(200, 800),
        "production_efficiency": round(random.uniform(82, 96), 1),
        "oee_score": round(random.uniform(75, 92), 1),
        "first_pass_yield": round(random.uniform(87, 95), 1),
        "defect_rate": round(random.uniform(2.1, 8.5), 2),
        "cycle_time_avg": round(random.uniform(45, 75), 1),
        "throughput_per_hour": random.randint(320, 480),
        "downtime_minutes": random.randint(15, 120),
        "quality_score": round(random.uniform(88, 97), 1),
        "timestamp": datetime.now().isoformat()
    }


def generate_defect_data() -> List[Dict]:
    """Generate realistic defect records"""
    defect_types = [
        "Surface Scratch", "Dimensional Variance", "Material Void",
        "Assembly Misalignment", "Paint Defect", "Weld Crack",
        "Contamination", "Porosity", "Burr Formation", "Edge Damage"
    ]
    
    severity_levels = ["Critical", "Major", "Minor"]
    machines = ["CNC-001", "WELD-002", "PAINT-003", "ASSEMBLY-004", "PRESS-005"]
    
    defects = []
    for i in range(random.randint(15, 35)):
        defects.append({
            "id": str(uuid.uuid4())[:8],
            "type": random.choice(defect_types),
            "severity": random.choice(severity_levels),
            "machine": random.choice(machines),
            "product_id": f"PROD-{random.randint(1000, 9999)}",
            "detected_at": (datetime.now() - timedelta(hours=random.randint(0, 48))).isoformat(),
            "confidence": round(random.uniform(78, 99), 1),
            "location": f"Zone-{random.randint(1,5)}-Station-{random.randint(1,8)}",
            "status": random.choice(["Open", "Under Review", "Resolved", "Escalated"]),
            "repair_time": random.randint(5, 120),
            "cost_impact": round(random.uniform(50, 2500), 2)
        })
    
    return defects


def generate_machine_health() -> List[Dict]:
    """Generate machine health data"""
    machines = [
        {"id": "CNC-001", "name": "CNC Machining Center 1", "type": "CNC"},
        {"id": "WELD-002", "name": "Robotic Welding Station 2", "type": "Welding"},
        {"id": "PAINT-003", "name": "Automated Paint Line 3", "type": "Painting"},
        {"id": "ASSEMBLY-004", "name": "Assembly Robot 4", "type": "Assembly"},
        {"id": "PRESS-005", "name": "Hydraulic Press 5", "type": "Pressing"},
        {"id": "INSPECT-006", "name": "Vision Inspection System", "type": "Inspection"},
    ]
    
    health_data = []
    for m in machines:
        health_score = random.randint(55, 98)
        health_data.append({
            **m,
            "health_score": health_score,
            "status": "Critical" if health_score < 65 else ("Warning" if health_score < 80 else "Healthy"),
            "next_maintenance": (datetime.now() + timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d"),
            "last_maintenance": (datetime.now() - timedelta(days=random.randint(5, 60))).strftime("%Y-%m-%d"),
            "uptime_percent": round(random.uniform(88, 99.5), 1),
            "mtbf_hours": random.randint(400, 2000),
            "temperature": round(random.uniform(62, 92), 1),
            "vibration": round(random.uniform(0.3, 3.5), 2),
            "failure_probability_7d": round(random.uniform(2, 35), 1),
            "failure_probability_30d": round(random.uniform(10, 65), 1),
            "parts_to_replace": random.randint(0, 3),
            "work_orders_open": random.randint(0, 5)
        })
    
    return health_data


def generate_quality_trends(days: int = 30) -> List[Dict]:
    """Generate daily quality trend data"""
    trends = []
    base_date = datetime.now() - timedelta(days=days)
    
    base_quality = 92.0
    
    for i in range(days):
        date = base_date + timedelta(days=i)
        quality = base_quality + np.sin(i * 0.3) * 3 + random.gauss(0, 1)
        quality = min(99, max(75, quality))
        
        trends.append({
            "date": date.strftime("%Y-%m-%d"),
            "quality_score": round(quality, 1),
            "defect_rate": round(max(0.5, 100 - quality) * 0.15, 2),
            "units_produced": random.randint(380, 520),
            "units_passed": int(random.randint(380, 520) * quality / 100),
            "oee": round(random.uniform(78, 94), 1),
            "efficiency": round(random.uniform(82, 96), 1)
        })
    
    return trends


def generate_alert_data() -> List[Dict]:
    """Generate system alerts"""
    alert_types = [
        {"type": "Machine Anomaly", "severity": "High", "icon": "warning"},
        {"type": "Quality Threshold Breach", "severity": "Critical", "icon": "error"},
        {"type": "Maintenance Due", "severity": "Medium", "icon": "info"},
        {"type": "Sensor Malfunction", "severity": "High", "icon": "warning"},
        {"type": "Production Slowdown", "severity": "Medium", "icon": "info"},
        {"type": "Defect Spike Detected", "severity": "Critical", "icon": "error"},
    ]
    
    machines = ["CNC-001", "WELD-002", "PAINT-003", "ASSEMBLY-004", "PRESS-005"]
    
    alerts = []
    for i in range(random.randint(8, 15)):
        alert = random.choice(alert_types)
        alerts.append({
            "id": str(uuid.uuid4())[:8],
            "type": alert["type"],
            "severity": alert["severity"],
            "machine": random.choice(machines),
            "message": f"{alert['type']} detected on {random.choice(machines)}",
            "timestamp": (datetime.now() - timedelta(minutes=random.randint(1, 480))).isoformat(),
            "status": random.choice(["Active", "Acknowledged", "Resolved"]),
            "assigned_to": random.choice(["Team Alpha", "Team Beta", "Maintenance Crew", "QA Team"])
        })
    
    return sorted(alerts, key=lambda x: x["timestamp"], reverse=True)


def generate_root_cause_data() -> List[Dict]:
    """Generate root cause analysis data"""
    causes = [
        {
            "id": "RCA-001",
            "defect_type": "Surface Scratch",
            "primary_cause": "Worn Tool Bit on CNC-001",
            "contributing_factors": ["Exceeded tool life by 15%", "Vibration increase at 3.2Hz", "Coolant flow reduced"],
            "confidence": 94.2,
            "affected_units": 127,
            "corrective_action": "Replace tool bit, recalibrate spindle speed",
            "status": "In Progress",
            "priority": "High"
        },
        {
            "id": "RCA-002",
            "defect_type": "Weld Crack",
            "primary_cause": "Temperature Variance in WELD-002",
            "contributing_factors": ["Ambient temperature spike +8°C", "Gas flow inconsistency", "Wire feed speed deviation"],
            "confidence": 88.7,
            "affected_units": 43,
            "corrective_action": "Recalibrate temperature sensors, check gas flow regulator",
            "status": "Open",
            "priority": "Critical"
        },
        {
            "id": "RCA-003",
            "defect_type": "Dimensional Variance",
            "primary_cause": "Thermal Expansion in Press Tooling",
            "contributing_factors": ["Extended operation without cool-down", "Bearing wear detected", "Lubrication insufficient"],
            "confidence": 91.3,
            "affected_units": 89,
            "corrective_action": "Implement cool-down cycles, replace bearings, improve lubrication schedule",
            "status": "Resolved",
            "priority": "Medium"
        }
    ]
    
    return causes
