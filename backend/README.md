# AI Companion Backend

A production-ready FastAPI backend for an AI Companion system, featuring modular architecture, asynchronous PostgreSQL integration, and scalable service-oriented logic.

## Features
- **FastAPI**: High-performance web framework.
- **PostgreSQL + SQLAlchemy 2.0**: Asynchronous ORM for scalable data management.
- **Modular Structure**: Clean separation of models, schemas, routes, and services.
- **JWT Authentication**: Secure user registration and login.
- **AI Companion Framework**: Extensible logic for personas, mood tracking, and memory storage.

## Tech Stack
- **Framework**: FastAPI
- **Database**: PostgreSQL (Async with asyncpg)
- **ORM**: SQLAlchemy
- **Environment**: Pydantic Settings
- **Auth**: Python-JOSE & Passlib

## Getting Started

### Prerequisites
- Python 3.10+
- PostgreSQL database

### Installation

1. **Clone the repository** (or navigate to the directory).
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure Environment**:
   Copy `.env.example` to `.env` and fill in your details.
   ```bash
   cp .env.example .env
   ```
4. **Run the Application**:
   ```bash
   uvicorn app.main:app --reload
   ```

### API Documentation
Once running, visit:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Project Structure
```text
app/
├── api/
│   └── routes/         # API Endpoints
├── core/               # App configuration and DB setup
├── models/             # SQLAlchemy Data Models
├── schemas/            # Pydantic validation schemas
├── services/           # Business logic (AI, Auth)
└── main.py             # App entry point
```

## Future Roadmap
- [ ] Implement vector storage for Long-term Memory.
- [ ] Integrate OpenAI/Anthropic for real-time chat.
- [ ] Add Image Analysis for companion visual awareness.
- [ ] Advanced Mood Tracking analytics.
