
# Technical Specification – ThinkPal (CSE Curriculum Agent)

## 1. Project Overview
The ThinkPal is an intelligent agent designed to teach concepts across the Computer Science & Engineering (CSE) curriculum. It leverages open-source Large Language Models (LLMs), generative UI components, and an agentic reasoning loop to provide personalized learning, quizzes, and dynamic explanations. All components are built with free and open-source tools, ensuring accessibility and scalability.

---

## 2. System Architecture (Open Source Only)
- **Frontend (Generative UI):**
  - Framework: React + TailwindCSS + shadcn/ui (open-source)
  - Dynamic components rendered using JSON schema from backend
  - Supports forms (for quizzes/tests), code editor, diagrams, and chat-like UI

- **Backend:**
  - Framework: FastAPI (open-source, lightweight, Python-based)
  - API Endpoints:
    - `/chat`: For conversational tutoring
    - `/quiz`: For test/question generation & validation
    - `/resources`: Retrieve curated learning resources
  - Authentication: JWT (PyJWT – open-source)

- **LLM & Orchestration:**
  - Model Hosting:
    - LLaMA 2 (Meta, free for research & commercial use with license)
    - Mistral 7B (Apache 2.0, free)
    - StarCoder (for code tutoring, open-source)
  - Framework: LangChain or Haystack (both open-source)
  - Model Serving: Hugging Face Transformers + Text Generation Inference (TGI)

- **Knowledge Base & Vector Search:**
  - Vector DB: ChromaDB (open-source) or Weaviate (open-source)
  - Document Preprocessing: Haystack / LangChain Document Loaders
  - Sources:
    - CSE curriculum textbooks (open-source/public domain)
    - Research papers (arXiv, open access)
    - Tutorials (free licensed docs)

- **Database (User Data & Progress):**
  - PostgreSQL (open-source)
  - SQLite for local deployment

- **Containerization & Deployment:**
  - Docker CE (Community Edition, free)
  - Deployment Options:
    - Hugging Face Spaces (free tier)
    - Railway.app (free tier)
    - Render.com (free tier)
    - Local deployment on user’s machine

---

## 3. Core Components Mapping to Project Framework
- **Knowledge Base 📚**
  - Public domain books, open CSE resources, arXiv papers
  - Indexed with ChromaDB for semantic retrieval

- **Documents 📄**
  - Course notes, uploaded PDFs, or markdown files
  - Parsed with open-source libraries (pdfplumber, PyMuPDF)

- **Tools / MCP 🔧**
  - Quiz Generator (uses LLM + question templates)
  - Code Validator (runs test cases in sandboxed environment like Code Runner / Pyodide)
  - Progress Tracker (stores in Postgres/SQLite)

- **Generative UI 🎨**
  - Auto-generated forms for quizzes
  - Interactive coding playground (Monaco Editor – open-source)
  - Dynamic flashcards (rendered from backend JSON)
  - Chatbot interface for Q&A

- **Agentic Loop 🔄**
  - User asks a query → Agent retrieves relevant documents → Generates explanation → Creates UI dynamically (quiz, form, diagram, or flashcard) → Observes user interaction → Improves feedback loop

---

## 4. Workflow
1. User opens Tutor UI → presented with chatbot + dynamic dashboard.
2. User types: *“Explain Python functions with examples”*.
3. Backend parses → Queries Knowledge Base + LLM (Mistral/LLaMA2).
4. Returns explanation + auto-generates:
   - Code editor with runnable examples.
   - Quiz form with multiple-choice questions.
   - Resource links (free sources).
5. User interacts (writes code, answers quiz).
6. Agentic loop evaluates performance → adapts next questions/resources.

---

## 5. Benefits of Open-Source Stack
- **No vendor lock-in** → Fully self-hostable.
- **Low cost** → Uses free models & infra tiers.
- **Flexibility** → Swap models or UI components easily.
- **Community-driven** → Hugging Face ecosystem, LangChain, ChromaDB.
- **Privacy** → Run locally without external API calls.

---

## 6. Future Enhancements
- Multi-agent system: one agent for teaching, another for quizzing, another for coding help.
- Integration with Jupyter notebooks for hands-on labs.
- Gamification: badges, progress streaks.
- Support for speech-based tutoring (using open-source TTS/STT like Coqui.ai).

