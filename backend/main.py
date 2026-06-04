from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn
from api.routes import (
    inspection, defects, rootcause, maintenance, reports,
    dashboard, sensors, auth
)
from config.settings import settings

app = FastAPI(
    title="AI Manufacturing Quality Inspection Platform",
    description="Enterprise Grade AI Manufacturing Quality Inspection and Root Cause Analysis Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(inspection.router, prefix="/api/inspection", tags=["Quality Inspection"])
app.include_router(defects.router, prefix="/api/defects", tags=["Defect Analysis"])
app.include_router(rootcause.router, prefix="/api/rootcause", tags=["Root Cause Analysis"])
app.include_router(maintenance.router, prefix="/api/maintenance", tags=["Maintenance"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(sensors.router, prefix="/api/sensors", tags=["Sensors"])

@app.get("/")
async def root():
    return {
        "message": "AI Manufacturing Quality Inspection Platform API",
        "version": "1.0.0",
        "developer": "Sana Cheema",
        "company": "AIVONEX",
        "status": "operational"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "manufacturing-ai-platform"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
