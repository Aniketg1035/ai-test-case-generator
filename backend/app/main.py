from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import upload, analyze, export

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Test Case Generator",
    description="AI-Powered Test Case Generation API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(analyze.router, prefix="/api", tags=["Analyze"])
app.include_router(export.router, prefix="/api", tags=["Export"])

@app.get("/")
def root():
    return {"message": "AI Test Case Generator API is running!"}

@app.get("/health")
def health():
    return {"status": "ok"}