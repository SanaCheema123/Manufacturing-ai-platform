from crewai import Agent, Task, Crew, Process
from langchain_groq import ChatGroq
from config.settings import settings
import json
import random
from datetime import datetime


def get_llm():
    return ChatGroq(
        groq_api_key=settings.GROQ_API_KEY,
        model_name=settings.GROQ_MODEL,
        temperature=0.3,
        max_tokens=2048
    )


class ManufacturingAgents:
    def __init__(self):
        self.llm = get_llm()

    def quality_inspection_agent(self):
        return Agent(
            role="Quality Inspection Specialist",
            goal="Analyze product quality data, detect manufacturing defects, and calculate defect severity scores",
            backstory="""You are an expert quality control engineer with 15+ years in manufacturing.
            You specialize in visual inspection, defect detection, and quality assessment using advanced AI tools.
            You provide precise defect classifications and severity scores.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )

    def defect_analysis_agent(self):
        return Agent(
            role="Defect Analysis Engineer",
            goal="Classify defect categories, analyze patterns, detect anomalies, and generate defect analytics",
            backstory="""You are a manufacturing defect analysis expert with deep knowledge of 
            statistical process control, Six Sigma, and machine learning-based anomaly detection.
            You excel at identifying recurring quality issues and defect patterns.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )

    def root_cause_analysis_agent(self):
        return Agent(
            role="Root Cause Analysis Expert",
            goal="Analyze machine logs, sensor data, and production events to identify defect sources",
            backstory="""You are a seasoned process engineer specializing in root cause analysis using
            Ishikawa diagrams, 5-Why methodology, and fault tree analysis. You correlate machine data
            with production outcomes to pinpoint exact failure sources.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )

    def maintenance_agent(self):
        return Agent(
            role="Predictive Maintenance Specialist",
            goal="Monitor equipment health, predict machine failures, and generate maintenance schedules",
            backstory="""You are a reliability engineer expert in predictive maintenance, vibration analysis,
            and IoT sensor data interpretation. You use AI models to predict equipment failures before 
            they cause production downtime.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )

    def reporting_agent(self):
        return Agent(
            role="Executive Report Generator",
            goal="Generate comprehensive executive reports, production summaries, and AI insights",
            backstory="""You are a business intelligence expert who transforms complex manufacturing data
            into clear, actionable executive reports. You specialize in KPI dashboards, trend analysis,
            and strategic recommendations for manufacturing operations.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )


class ManufacturingCrew:
    def __init__(self):
        self.agents = ManufacturingAgents()

    def run_quality_inspection(self, inspection_data: dict) -> dict:
        agent = self.agents.quality_inspection_agent()
        task = Task(
            description=f"""Analyze the following manufacturing inspection data and provide a comprehensive quality assessment:
            
            Inspection Data: {json.dumps(inspection_data, indent=2)}
            
            Provide:
            1. Overall quality status (PASS/FAIL/WARNING)
            2. Defect severity score (0-100)
            3. List of detected defects with descriptions
            4. Quality metrics summary
            5. Immediate recommendations
            
            Format your response as structured JSON.""",
            agent=agent,
            expected_output="JSON formatted quality inspection report with defect analysis and recommendations"
        )
        crew = Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=False)
        result = crew.kickoff()
        return {"analysis": str(result), "status": "completed", "timestamp": datetime.now().isoformat()}

    def run_defect_analysis(self, defect_data: dict) -> dict:
        agent = self.agents.defect_analysis_agent()
        task = Task(
            description=f"""Perform comprehensive defect analysis on the following data:
            
            Defect Data: {json.dumps(defect_data, indent=2)}
            
            Provide:
            1. Defect category classifications
            2. Pattern analysis (recurring vs one-time defects)
            3. Anomaly detection results
            4. Statistical defect distribution
            5. Trend analysis and forecasting
            6. Priority defect areas requiring immediate attention
            
            Format response as structured JSON with clear sections.""",
            agent=agent,
            expected_output="Comprehensive defect analysis report with patterns, anomalies, and recommendations"
        )
        crew = Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=False)
        result = crew.kickoff()
        return {"analysis": str(result), "status": "completed", "timestamp": datetime.now().isoformat()}

    def run_root_cause_analysis(self, machine_data: dict) -> dict:
        agent = self.agents.root_cause_analysis_agent()
        task = Task(
            description=f"""Perform root cause analysis on the following machine and production data:
            
            Machine Data: {json.dumps(machine_data, indent=2)}
            
            Provide:
            1. Primary root cause identification
            2. Contributing factors analysis
            3. Machine-defect correlation matrix
            4. Production line event timeline
            5. Causal chain analysis (5-Why methodology)
            6. Corrective action recommendations
            7. Preventive measures
            
            Be specific about which machines, parameters, or processes are causing defects.""",
            agent=agent,
            expected_output="Detailed root cause analysis with causal chains and corrective actions"
        )
        crew = Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=False)
        result = crew.kickoff()
        return {"analysis": str(result), "status": "completed", "timestamp": datetime.now().isoformat()}

    def run_maintenance_analysis(self, equipment_data: dict) -> dict:
        agent = self.agents.maintenance_agent()
        task = Task(
            description=f"""Analyze equipment health and generate maintenance predictions:
            
            Equipment Data: {json.dumps(equipment_data, indent=2)}
            
            Provide:
            1. Equipment health scores for each machine (0-100)
            2. Failure probability predictions (next 7, 30, 90 days)
            3. Recommended maintenance schedule
            4. Downtime risk assessment
            5. Parts replacement recommendations
            6. Cost-benefit analysis of preventive vs reactive maintenance
            7. Priority maintenance actions
            
            Format as actionable maintenance plan.""",
            agent=agent,
            expected_output="Predictive maintenance plan with failure predictions and schedules"
        )
        crew = Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=False)
        result = crew.kickoff()
        return {"analysis": str(result), "status": "completed", "timestamp": datetime.now().isoformat()}

    def run_executive_report(self, production_data: dict) -> dict:
        agents = [
            self.agents.quality_inspection_agent(),
            self.agents.defect_analysis_agent(),
            self.agents.reporting_agent()
        ]
        
        analysis_task = Task(
            description=f"""Analyze this production data comprehensively:
            {json.dumps(production_data, indent=2)}
            
            Identify key quality metrics, defect trends, and production performance indicators.""",
            agent=agents[0],
            expected_output="Production analysis summary"
        )
        
        defect_task = Task(
            description="""Based on the previous analysis, summarize defect patterns, anomalies, and critical quality issues.""",
            agent=agents[1],
            expected_output="Defect pattern summary"
        )
        
        report_task = Task(
            description="""Generate a comprehensive executive report combining all analyses.
            
            Include:
            1. Executive Summary
            2. Production Performance KPIs
            3. Quality Metrics Overview
            4. Defect Analysis Summary
            5. Top Risks and Issues
            6. AI-Generated Recommendations
            7. Action Items with Priority
            8. 30-day Forecast
            
            Make it suitable for C-suite presentation.""",
            agent=agents[2],
            expected_output="Complete executive report in structured format"
        )
        
        crew = Crew(
            agents=agents,
            tasks=[analysis_task, defect_task, report_task],
            process=Process.sequential,
            verbose=False
        )
        result = crew.kickoff()
        return {"report": str(result), "status": "completed", "timestamp": datetime.now().isoformat()}
