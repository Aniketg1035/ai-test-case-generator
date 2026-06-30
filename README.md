# 🤖 AI-Powered Test Case Generation & Software Quality Assistant

An AI-powered web application that automatically generates functional test cases, edge cases, and risk analysis from software requirements — built as part of a 10-day internship project at PY Digital Services Pvt. Ltd.

## 📋 Project Overview

This tool helps QA teams and developers save time by automatically generating comprehensive test cases from plain text requirements or uploaded requirement documents (PDF/Word), using AI to analyze the input and produce structured, actionable test cases.

## ✨ Features

- **AI-Powered Test Case Generation** — Paste requirements and get functional tests, edge cases, and risk analysis instantly using Groq AI (LLaMA 3.3 70B)
- **File Upload Support** — Upload PDF or Word documents and automatically extract requirements text
- **Export Options** — Download generated test cases as Excel (.xlsx) or PDF reports
- **Dashboard** — View history of all generated projects with saved test cases
- **Persistent Storage** — All projects and test cases are saved to a PostgreSQL database

## 🛠️ Tech Stack

**Backend:**
- FastAPI (Python)
- SQLAlchemy ORM
- PostgreSQL
- Groq API (LLaMA 3.3 70B Versatile)
- PyMuPDF & python-docx (file text extraction)
- openpyxl & reportlab (Excel/PDF export)

**Frontend:**
- React.js
- Axios
- React Router DOM

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js
- PostgreSQL
- Groq API key ([console.groq.com](https://console.groq.com))

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder: