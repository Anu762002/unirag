````markdown
# 🎓 UniRAG

### RAG-Based University Academic Assistant

An AI-powered academic assistant that enables students and faculty to query official university documents using natural language. It leverages Retrieval-Augmented Generation (RAG) to deliver accurate, citation-backed answers from uploaded institutional documents while minimizing hallucinations.

## Overview

UniRAG lets students and faculty search official university policies using natural language queries. It uses a Retrieval-Augmented Generation (RAG) architecture to answer questions strictly from uploaded university PDF documents, attributing answers with clickable page-level citations.

It features role-based interfaces (Student vs Administrator), PDF viewing and downloading, password eye toggle, and persistent cloud storage.

Built as a full-stack project using React, FastAPI, ChromaDB, LangChain, and MongoDB Atlas.

## Features

- **Document-Grounded RAG** — Answers queries strictly using retrieved passages from official university PDF documents to prevent AI hallucinations.
- **Clickable Source Citations** — Page-level citations (e.g., `Academic_Regulations.pdf p.17`) that open or download the exact source document.
- **Interactive PDF Viewer & Downloader** — View PDF documents directly in the browser or download them for offline reference.
- **Role-Based Access (RBAC)** — Student interface for queries and FAQ browsing; Admin interface for PDF uploads, ChromaDB vector indexing, and document deletion.
- **MongoDB Cloud Persistence** — User registration, authentication, roles, and session chat history stored securely in MongoDB Atlas.
- **Password Visibility Toggle** — Eye icon toggle for password fields during sign-in and registration.
- **Configurable Knowledge Base** — Supports indexing and querying official documents from any university or educational institution without requiring application code changes.

## 🎯 Multi-University Support

UniRAG is designed to work with **any university or educational institution**.

The application can be adapted to a new institution by simply uploading its official policy documents through the Admin Dashboard. The RAG pipeline automatically processes, indexes, generates embeddings, and stores documents in ChromaDB, allowing the assistant to answer institution-specific queries without requiring any code changes.

The current implementation is configured using publicly available **MNNIT Allahabad** documents solely for demonstration purposes.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, Lucide Icons |
| Backend | Python 3.10+, FastAPI, Uvicorn |
| Vector Database | ChromaDB (Persistent Local Vector Store) |
| Embedding Model | BAAI/bge-small-en-v1.5 (SentenceTransformers) |
| LLM | Google Gemini API (`gemini-2.5-flash`) |
| RAG Framework | LangChain |
| Database | MongoDB Atlas (Motor Async Driver) |
| Authentication | JWT (JSON Web Tokens) + bcrypt |

## Project Structure

```text
UniRAG/
├── backend/
│   ├── auth/                  # JWT authentication & security
│   ├── db/                    # MongoDB Atlas connection manager
│   ├── rag/                   # Vector embeddings & RAG pipeline
│   ├── routers/               # API routes (Auth, Documents, Chat)
│   ├── services/              # Document upload & chat processing
│   ├── storage/               # Uploaded PDFs & ChromaDB vector store
│   ├── main.py                # FastAPI application entry point
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/        # UI components
    │   ├── pages/             # Application pages
    │   ├── services/          # Axios API integration
    │   ├── hooks/
    │   ├── utils/
    │   └── App.jsx
    └── package.json
```

## Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
GEMINI_API_KEY=your_gemini_api_key

MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB_NAME=UniversityDocChecker

JWT_SECRET=your_jwt_secret_key

EMBEDDING_MODEL_NAME=BAAI/bge-small-en-v1.5

TOP_K=3
CHUNK_SIZE=512
CHUNK_OVERLAP=50
```

### Where to get these

- **Gemini API** — Google AI Studio (Free API Key)
- **MongoDB URI** — MongoDB Atlas (Free Cluster)
- **JWT Secret** — Any secure random string

## Local Setup

### Prerequisites

- Python (3.10+)
- Node.js (18+)
- npm

### Backend

```bash
cd backend

# Create & activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed default admin user
python create_admin.py admin@university.edu admin123 "System Administrator"

# Index uploaded university documents
python ingest_documents.py

# Start FastAPI server
python main.py
```

Runs on:

```
http://localhost:8005
```

### Frontend

```bash
cd frontend

npm install

npm run dev -- --port 5175
```

Runs on:

```
http://localhost:5175
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new student account |
| POST | `/auth/login` | Login user (Student/Admin) |
| GET | `/auth/me` | Get current user profile |
| GET | `/documents` | List uploaded documents |
| POST | `/upload` | Upload and index PDF files (Admin only) |
| DELETE | `/documents/:docId` | Delete document and vector index (Admin only) |
| GET | `/documents/view/id/:docId` | View PDF document |
| GET | `/documents/view/file/:filename` | View PDF using filename |
| GET | `/documents/download/id/:docId` | Download PDF |
| POST | `/chat` | Submit a question to the RAG pipeline |

## Deployment Notes

- Frontend can be deployed on **Vercel**.
- Backend can be deployed on **Render** or **Railway**.
- Database is hosted on **MongoDB Atlas**.
- Update the allowed CORS origins in `backend/config/settings.py` before deployment.

## Future Improvements

- [ ] Multi-tenant deployment supporting multiple universities from a single application instance
- [ ] OCR support for scanned PDF documents
- [ ] Voice-based query input
- [ ] Email notifications for newly uploaded policy documents
- [ ] Analytics dashboard for frequently asked questions

## License

This project is intended for educational and personal use.
````
