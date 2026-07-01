from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import shutil
import os
import fitz  # pymupdf
import docx

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def extract_text_from_pdf(file_path):
    text = ""
    doc = fitz.open(file_path)
    for page in doc:
        text += page.get_text()
    doc.close()
    return text.strip()

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text.strip()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename.lower()

    # Extension check (mobile pe bhi kaam karega)
    if not (filename.endswith(".pdf") or filename.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Only PDF or DOCX files allowed!")

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text based on file type
    try:
        if filename.endswith(".pdf"):
            extracted_text = extract_text_from_pdf(file_path)
        else:
            extracted_text = extract_text_from_docx(file_path)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not read file: {str(e)}")

    if not extracted_text:
        raise HTTPException(status_code=422, detail="Could not extract text from file. Is it a scanned image?")

    return JSONResponse({
        "filename": file.filename,
        "message": "File uploaded and text extracted successfully!",
        "extracted_text": extracted_text,
        "extracted_text_preview": extracted_text[:500]
    })