# AI Resume Reviewer & Job Match Platform

A full-stack SaaS application that helps users improve their resumes and match them against job descriptions using AI-powered analysis.

## 🎯 Product Overview

This platform provides:
- **AI-Powered Resume Analysis**: Get detailed feedback on your resume including scores, missing skills, and improvement suggestions
- **Job Matching**: Compare your resume against job descriptions to see how well you match
- **Historical Tracking**: View all your past reviews and matches in one dashboard
- **Secure & Private**: Your data is isolated and protected with JWT authentication

## 🏗️ Tech Stack

### Backend
- **Framework**: Flask (Python 3.9+)
- **Database**: PostgreSQL 14+ with SQLAlchemy ORM
- **Authentication**: JWT tokens via Flask-JWT-Extended
- **AI Integration**: OpenAI API (GPT-3.5) with mock fallback
- **Testing**: Pytest + Hypothesis (property-based testing)

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **State Management**: Context API
- **Styling**: CSS3 with responsive design

### Architecture
- **Pattern**: Three-tier architecture (Presentation, Business Logic, Data)
- **API**: RESTful endpoints with JSON responses
- **Security**: Bcrypt password hashing, CORS protection, JWT tokens

## 📁 Project Structure

```
ai-resume-platform/
├── backend/                    # Flask REST API
│   ├── app/
│   │   ├── models/            # SQLAlchemy database models
│   │   │   ├── user.py
│   │   │   ├── resume_review.py
│   │   │   └── job_match.py
│   │   ├── routes/            # API endpoints
│   │   │   ├── auth.py        # /api/auth/*
│   │   │   ├── resume.py      # /api/resume/*
│   │   │   └── job.py         # /api/job/*
│   │   ├── services/          # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── ai_service.py
│   │   │   ├── resume_service.py
│   │   │   └── job_match_service.py
│   │   ├── utils/             # Helper functions
│   │   │   ├── password.py
│   │   │   └── validators.py
│   │   ├── config.py          # Configuration
│   │   ├── extensions.py      # Flask extensions
│   │   ├── database.py        # DB initialization
│   │   └── main.py            # App factory
│   ├── tests/                 # Unit & property tests
│   ├── requirements.txt
│   └── run.py                 # Entry point
├── frontend/                   # React application
│   ├── src/
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResumeReview.jsx
│   │   │   └── JobMatch.jsx
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/           # State management
│   │   │   └── AuthContext.jsx
│   │   ├── api/               # API client
│   │   │   └── axios.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Unix/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   # Copy example file
   copy .env.example .env  # Windows
   cp .env.example .env    # Unix/Mac
   ```

   Edit `.env` and configure:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/resume_platform
   JWT_SECRET_KEY=your-secret-key-change-this-in-production
   OPENAI_API_KEY=sk-your-openai-api-key-here-optional
   FLASK_ENV=development
   ```

5. **Create PostgreSQL database**
   ```bash
   # Using psql
   createdb resume_platform

   # Or using SQL
   psql -U postgres
   CREATE DATABASE resume_platform;
   \q
   ```

6. **Run the application**
   ```bash
   python run.py
   ```

   Backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy example file
   copy .env.example .env  # Windows
   cp .env.example .env    # Unix/Mac
   ```

   Edit `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will start on `http://localhost:5173`

### Running Tests

**Backend Tests:**
```bash
cd backend
pytest                          # Run all tests
pytest -v                       # Verbose output
pytest tests/test_models.py     # Run specific test file
```

## 🔑 Key Technical Decisions

### 1. **AI Service with Fallback**
- Primary: OpenAI API for production-quality analysis
- Fallback: Mock service for development without API costs
- Automatic detection based on API key presence

### 2. **JWT Authentication**
- Stateless authentication for scalability
- 24-hour token expiration
- Automatic token refresh on frontend

### 3. **Property-Based Testing**
- Uses Hypothesis library for comprehensive test coverage
- Generates 100+ random test cases per property
- Validates universal correctness properties

### 4. **Clean Architecture**
- Separation of concerns (routes, services, models)
- Easy to test and maintain
- Scalable for future features

### 5. **PostgreSQL with JSON Fields**
- Relational data for users and relationships
- JSON fields for flexible AI feedback storage
- Indexed queries for performance

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Resume Review
- `POST /api/resume/review` - Submit resume for analysis (Protected)
- `GET /api/resume/history` - Get user's review history (Protected)

### Job Match
- `POST /api/job/match` - Match resume with job description (Protected)
- `GET /api/job/history` - Get user's match history (Protected)

### Health Check
- `GET /api/health` - Check API status

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt
- **JWT Tokens**: Secure authentication
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: SQLAlchemy ORM
- **Data Isolation**: Users can only access their own data

## ⚠️ Known Risks & Limitations

1. **OpenAI API Costs**: Each analysis costs ~$0.01-0.02
2. **Rate Limiting**: No rate limiting implemented yet
3. **File Upload**: Currently only supports text paste, not file upload
4. **Email Verification**: No email verification on registration
5. **Password Reset**: No password reset functionality
6. **Caching**: No caching for AI responses (could reduce costs)

## 🚀 Future Improvements

1. **Resume Templates**: Provide downloadable templates
2. **ATS Optimization**: Check resume compatibility with ATS systems
3. **Cover Letter Generation**: AI-powered cover letter writing
4. **Interview Prep**: Generate interview questions from job descriptions
5. **Skill Gap Analysis**: Detailed learning paths for missing skills
6. **Resume Versions**: Track and compare multiple resume versions
7. **PDF Export**: Generate formatted PDF resumes
8. **Collaboration**: Share reviews with mentors or coaches
9. **Analytics Dashboard**: Track improvement over time
10. **LinkedIn Integration**: Import profile data automatically

## 🎥 Demo & Walkthrough

See `walkthrough.md` for a detailed 10-15 minute walkthrough script covering:
- Product demo
- Backend architecture
- Frontend structure
- AI integration
- Testing strategy
- Deployment considerations

## 📝 License

This project is for educational and portfolio purposes.

## 👥 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

## 📧 Contact

For questions or feedback, please open an issue in the repository.

---

**Built with ❤️ using Flask, React, and OpenAI**
