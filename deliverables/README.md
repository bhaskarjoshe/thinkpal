# ThinkPal AI Tutor - CSE Curriculum Learning Assistant

## 📚 Project Overview

ThinkPal is an intelligent, interactive learning assistant designed to guide students through the complete Computer Science & Engineering (CSE) curriculum. It combines conversational learning, personalized content delivery, dynamic assessments, and interactive user interfaces to create a modern, engaging educational experience.

## LOOM Video Demonstrations

[ThinkPal AI Tutor Demo](https://www.loom.com/share/d8ded6def0c54999a3fce24a7a481ef8?sid=39f5e6ed-b973-43a4-b822-77125434d7ea)

### 🎯 Key Features

- **Conversational Learning**: Natural language Q&A with AI tutor
- **Generative UI**: Dynamic interface generation (quizzes, code editors, diagrams)
- **Multi-Agent Architecture**: Specialized agents for different learning modalities
- **Personalized Pathways**: Adaptive learning based on user progress
- **Interactive Assessments**: Auto-generated quizzes and coding challenges
- **Progress Tracking**: Real-time feedback and learning analytics

### 🏗️ Architecture

The project follows a modern full-stack architecture with:

- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: FastAPI (Python) with multi-agent orchestration
- **Database**: PostgreSQL with SQLAlchemy ORM
- **AI/ML**: Google Gemini integration with specialized agents
- **Authentication**: JWT-based user management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- PostgreSQL database
- Google Gemini API key

### Frontend Setup

```bash
cd client/web
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd server
# Install dependencies using uv (recommended)
uv sync

# Or using pip
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Database Setup

1. Create a PostgreSQL database
2. Update the database URL in your `.env` file
3. The tables will be created automatically on first run

## 🏛️ Project Structure

```
ai_tutor/
├── client/web/                 # React frontend
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── agents/         # Specialized agent components
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   ├── store/             # Zustand state management
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   └── ...
├── server/                     # FastAPI backend
│   ├── app/
│   │   ├── agent/             # AI agent implementations
│   │   ├── config/            # Configuration modules
│   │   ├── models/            # Database models
│   │   ├── routes/            # API endpoints
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   └── utils/             # Utility functions
│   └── ...
├── product/                   # Product documentation
├── development_docs/          # Development guides
└── deliverables/              # Project deliverables
```

## 🤖 Multi-Agent Architecture

The system uses specialized AI agents for different learning modalities:

### Core Agents

1. **KnowledgeAgent**: Handles general knowledge queries and explanations
2. **CodeAgent**: Provides code solutions, explanations, and examples
3. **QuizAgent**: Generates interactive quizzes and assessments
4. **VisualLearningAgent**: Creates diagrams and visual learning materials
5. **RoadmapAgent**: Provides learning paths and curriculum guidance

### Agent Orchestration

The `TutorAgent` orchestrates these specialized agents using:
- **Keyword Routing**: Direct routing based on query keywords
- **LLM Routing**: AI-powered agent selection for complex queries
- **Context Awareness**: Maintains chat history for better responses

## 🎨 Frontend Architecture

### Component Structure

- **Agent Components**: Specialized UI for each agent type
- **AIComponentRenderer**: Dynamic component rendering based on agent responses
- **ChatContainer**: Main chat interface with message handling
- **State Management**: Zustand stores for auth, chat, and UI state

### Key Features

- **Dynamic UI Generation**: Renders different components based on agent responses
- **Real-time Chat**: WebSocket-like experience with immediate responses
- **Code Highlighting**: Syntax highlighting for code snippets
- **Responsive Design**: Mobile-first approach with TailwindCSS

## 🔧 Backend Architecture

### API Endpoints

- **Authentication**: `/api/auth/*` - User registration and login
- **Chat**: `/api/chat` - Main chat interface
- **User Management**: `/api/user/*` - Profile and progress tracking

### Database Models

- **User**: User profiles and authentication
- **Chat**: Chat history and message storage
- **Progress**: Learning progress and analytics

### Services

- **ChatService**: Handles chat requests and agent orchestration
- **AuthService**: User authentication and JWT management
- **KnowledgeBaseService**: Knowledge retrieval and management

## 🛠️ Development Guidelines

### Code Style

- **Frontend**: ESLint + Prettier configuration
- **Backend**: Black + Ruff for Python formatting
- **TypeScript**: Strict type checking enabled

### Testing

```bash
# Frontend tests
cd client/web
npm run test

# Backend tests
cd server
pytest
```

### Environment Variables

Create a `.env` file in the server directory:

```env
APP_ENV=development
JWT_SECRET=your-secret-key
DB_URL=postgresql://user:password@localhost/dbname
GOOGLE_API_KEY=your-gemini-api-key
```

## 📊 Current Status

### ✅ Completed Features

- [x] Multi-agent architecture implementation
- [x] Dynamic UI component rendering
- [x] JWT authentication system
- [x] Chat interface with real-time responses
- [x] Code agent with syntax highlighting
- [x] Quiz generation and assessment
- [x] Progress tracking system
- [x] Responsive frontend design

### 🚧 In Progress

- [ ] Knowledge base integration
- [ ] Visual learning agent enhancements
- [ ] Advanced progress analytics
- [ ] Performance optimizations

### 📋 Planned Features

- [ ] Code playground integration
- [ ] Collaborative learning features
- [ ] Advanced assessment types
- [ ] Mobile app development
- [ ] Offline learning capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

1. **Feature Development**: Create feature branches from `main`
2. **Code Review**: All changes require review before merge
3. **Testing**: Ensure all tests pass before submitting PR
4. **Documentation**: Update docs for new features

## 📚 Documentation

- **Product Spec**: `product/spec.md` - Detailed product requirements
- **Architecture**: `product/architecture.md` - System architecture
- **API Spec**: `product/api_spec.md` - API documentation
- **Development**: `development_docs/` - Development guides

## 🚀 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Production Considerations

- Use environment-specific configurations
- Set up proper logging and monitoring
- Configure database backups
- Implement rate limiting
- Set up SSL/TLS certificates

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Bhaskar Chandra Joshi** - Lead Developer (bhaskar.chandra@think41.com)

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `development_docs/`

---

**ThinkPal AI Tutor** - Empowering CSE education through intelligent, interactive learning experiences.
