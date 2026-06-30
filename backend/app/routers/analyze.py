from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os
import json

from app.database import get_db
from app.models import Project, Document, TestCase

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str
    project_name: str = "Untitled Project"

@router.post("/analyze")
async def analyze_requirements(request: AnalyzeRequest, db: Session = Depends(get_db)):
    prompt = "You are a QA expert. Return ONLY valid JSON, no extra text. "
    prompt += "Structure: "
    prompt += '{"functional_tests":[{"title":"t","steps":"s","expected":"e","priority":"High"}],'
    prompt += '"edge_cases":[{"title":"t","description":"d"}],'
    prompt += '"risks":[{"area":"a","severity":"High","description":"d"}]}'
    prompt += " Requirements: " + request.text

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        text = response.choices[0].message.content.strip()
        if "```" in text:
            parts = text.split("```")
            text = parts[1]
            if text.startswith("json"):
                text = text[4:]
        result = json.loads(text.strip())

        # ---- Save to database ----
        project = Project(name=request.project_name, description=request.text[:200])
        db.add(project)
        db.commit()
        db.refresh(project)

        document = Document(
            project_id=project.id,
            file_name=request.project_name,
            extracted_text=request.text
        )
        db.add(document)
        db.commit()
        db.refresh(document)

        for tc in result.get("functional_tests", []):
            test_case = TestCase(
                document_id=document.id,
                type="functional",
                title=tc.get("title", ""),
                steps=tc.get("steps", ""),
                expected_result=tc.get("expected", ""),
                priority=tc.get("priority", "Medium")
            )
            db.add(test_case)

        for ec in result.get("edge_cases", []):
            test_case = TestCase(
                document_id=document.id,
                type="edge_case",
                title=ec.get("title", ""),
                description=ec.get("description", "")
            )
            db.add(test_case)

        for r in result.get("risks", []):
            test_case = TestCase(
                document_id=document.id,
                type="risk",
                title=r.get("area", ""),
                description=r.get("description", ""),
                priority=r.get("severity", "Medium")
            )
            db.add(test_case)

        db.commit()

        result["project_id"] = str(project.id)
        result["project_name"] = project.name

        return result

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/projects")
async def get_all_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).order_by(Project.created_at.desc()).all()
    result = []
    for p in projects:
        documents = db.query(Document).filter(Document.project_id == p.id).all()
        test_count = 0
        for doc in documents:
            test_count += db.query(TestCase).filter(TestCase.document_id == doc.id).count()
        result.append({
            "id": str(p.id),
            "name": p.name,
            "description": p.description,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "test_case_count": test_count
        })
    return result


@router.get("/projects/{project_id}")
async def get_project_details(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    documents = db.query(Document).filter(Document.project_id == project.id).all()
    all_test_cases = []
    for doc in documents:
        test_cases = db.query(TestCase).filter(TestCase.document_id == doc.id).all()
        for tc in test_cases:
            all_test_cases.append({
                "id": str(tc.id),
                "type": tc.type,
                "title": tc.title,
                "steps": tc.steps,
                "description": tc.description,
                "expected_result": tc.expected_result,
                "priority": tc.priority
            })

    return {
        "id": str(project.id),
        "name": project.name,
        "description": project.description,
        "created_at": project.created_at.isoformat() if project.created_at else None,
        "test_cases": all_test_cases
    }