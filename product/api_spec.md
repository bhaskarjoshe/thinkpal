
# 📘 ThinkPal API Specification

## Table of Contents
1. [Overview](#overview)  
2. [Authentication](#authentication)  
3. [Endpoints](#endpoints)  
   - [Chat / Conversational Tutoring](#chat--conversational-tutoring)  
   - [Quiz / Assessment](#quiz--assessment)  
   - [Resources Retrieval](#resources-retrieval)  
   - [Progress Tracking](#progress-tracking)  
   - [Dynamic UI Generation](#dynamic-ui-generation)  
4. [Request & Response Schemas](#request--response-schemas)  
5. [Error Handling](#error-handling)  
6. [Usage Examples](#usage-examples)  

---

## Overview
The ThinkPal API provides endpoints to:
- Answer student queries conversationally.
- Generate interactive quizzes and coding exercises.
- Deliver curated learning resources.
- Track learner progress.
- Dynamically generate UI components for quizzes, diagrams, code editors, and flashcards.

**Stack**: FastAPI (Python), JWT Authentication, PostgreSQL/SQLite, LLaMA 2 / Mistral 7B / StarCoder LLMs, ChromaDB for knowledge retrieval.  

---

## Authentication
- **Method**: JWT Bearer Tokens  
- **Header Example**:  
```http
Authorization: Bearer <JWT_TOKEN>
```

- **JWT Payload**:
```json
{
  "user_id": "uuid",
  "role": "learner" | "educator"
}
```

- **Token Expiration**: 24 hours (configurable)  

---

## Endpoints

### Chat / Conversational Tutoring
**POST** `/chat`  
Provides AI-generated explanations in text, code, and diagrams.

**Request:**
```json
{
  "query": "Explain binary search with Python example",
  "context": ["DSA", "Searching Algorithms"],
  "output_format": ["text", "code", "diagram"]
}
```

**Response:**
```json
{
  "text": "Binary search is...",
  "code_snippet": "def binary_search(...): ...",
  "diagram_url": "https://...",
  "next_suggestion": "Try solving this exercise: find index of 42 in [...]."
}
```

---

### Quiz / Assessment
**POST** `/quiz`  
Generates a quiz or coding challenge based on topic or user progress.

**Request:**
```json
{
  "topic": "Python Functions",
  "difficulty": "medium",
  "format": "mcq" | "code" | "mixed"
}
```

**Response:**
```json
{
  "quiz_id": "uuid",
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "Which keyword defines a function in Python?",
      "options": ["func", "define", "def", "function"],
      "answer": null
    }
  ]
}
```

**POST** `/quiz/submit`
```json
{
  "quiz_id": "uuid",
  "answers": [{"question_id": "q1", "answer": "def"}]
}
```

**Response:**
```json
{
  "score": 1,
  "feedback": [
    {"question_id": "q1", "correct": true, "explanation": "In Python, functions are defined using 'def'."}
  ],
  "next_suggestion": "Review decorators before the next quiz."
}
```

---

### Resources Retrieval
**GET** `/resources`  
Fetch curated learning resources based on topic or weakness areas.

**Query Parameters:**
- `topic`: string
- `difficulty`: string (optional)
- `limit`: int (optional, default=5)

**Response:**
```json
[
  {
    "title": "Python Functions Tutorial",
    "type": "article",
    "url": "https://...",
    "source": "open-source"
  }
]
```

---

### Progress Tracking
**GET** `/progress/{user_id}`

**Response:**
```json
{
  "completed_modules": ["Python Basics", "DSA Fundamentals"],
  "current_level": "Intermediate",
  "scores": {
    "Python Functions Quiz": 90,
    "Binary Search Quiz": 80
  },
  "suggested_next": ["Advanced DSA", "OOP Concepts"]
}
```

**POST** `/progress/update`
```json
{
  "user_id": "uuid",
  "module": "Python Functions",
  "score": 95,
  "time_spent": 45
}
```

**Response:**
```json
{
  "status": "success",
  "updated_progress": true
}
```

---

### Dynamic UI Generation
**POST** `/ui/generate`  
Generates JSON schema for dynamic frontend rendering: forms, code editors, flashcards, diagrams.

**Request:**
```json
{
  "type": "quiz" | "code_editor" | "flashcard" | "diagram",
  "content": {
    "topic": "Binary Search",
    "questions": [...],
    "example_code": "..."
  }
}
```

**Response:**
```json
{
  "ui_schema": {...},
  "render_instructions": "Use React + TailwindCSS components."
}
```

---

## Request & Response Schemas
- `query`: string
- `context`: array of strings
- `output_format`: array of strings [`text`, `code`, `diagram`]
- `quiz_id`, `question_id`: UUID
- `answers`: array of objects
- `score`: integer
- `feedback`: array of objects
- `ui_schema`: JSON object (React/Tailwind-friendly)

---

## Error Handling
```json
{
  "error_code": "INVALID_REQUEST",
  "message": "Query cannot be empty"
}
```
- `401`: Unauthorized  
- `404`: Resource Not Found  
- `422`: Validation Error  
- `500`: Internal Server Error  

---

## Usage Examples
- Ask a concept: `/chat` → receive explanation, diagram, code snippet.  
- Generate quiz: `/quiz` → present interactive form.  
- Submit quiz: `/quiz/submit` → receive score + feedback.  
- Retrieve learning materials: `/resources?topic=DSA`.  
- Track progress: `/progress/{user_id}` → dashboard rendering.  
- Dynamic UI generation: `/ui/generate` → feed JSON to frontend.
