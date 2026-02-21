# Quick Setup Guide

## Prerequisites Installation

### 1. Install Python 3.9+
- **Windows**: Download from [python.org](https://www.python.org/downloads/)
- **Mac**: `brew install python@3.9`
- **Linux**: `sudo apt-get install python3.9`

### 2. Install Node.js 18+
- **Windows/Mac**: Download from [nodejs.org](https://nodejs.org/)
- **Linux**: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`

### 3. Install PostgreSQL 14+
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **Mac**: `brew install postgresql@14`
- **Linux**: `sudo apt-get install postgresql-14`

## Quick Start (5 minutes)

### Step 1: Clone and Setup Database
```bash
# Create PostgreSQL database
createdb resume_platform

# Or using psql
psql -U postgres
CREATE DATABASE resume_platform;
\q
```

### Step 2: Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux

# Edit .env and set your database URL
# DATABASE_URL=postgresql://postgres:password@localhost:5432/resume_platform

# Run the backend
python run.py
```

Backend should now be running on `http://localhost:5000`

### Step 3: Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux

# Start frontend
npm run dev
```

Frontend should now be running on `http://localhost:5173`

### Step 4: Test the Application
1. Open browser to `http://localhost:5173`
2. Click "Register" and create an account
3. Login with your credentials
4. Try the Resume Review feature
5. Try the Job Match feature

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'flask'`
- **Solution**: Make sure virtual environment is activated and dependencies are installed
  ```bash
  pip install -r requirements.txt
  ```

**Problem**: `psycopg2.OperationalError: could not connect to server`
- **Solution**: Make sure PostgreSQL is running
  ```bash
  # Windows: Check Services
  # Mac: brew services start postgresql@14
  # Linux: sudo systemctl start postgresql
  ```

**Problem**: `sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) FATAL: database "resume_platform" does not exist`
- **Solution**: Create the database
  ```bash
  createdb resume_platform
  ```

### Frontend Issues

**Problem**: `Cannot find module 'react'`
- **Solution**: Install dependencies
  ```bash
  npm install
  ```

**Problem**: `Failed to fetch` or `Network Error`
- **Solution**: Make sure backend is running on port 5000
- Check VITE_API_BASE_URL in frontend/.env

**Problem**: Port 5173 already in use
- **Solution**: Kill the process or use a different port
  ```bash
  # Windows: netstat -ano | findstr :5173
  # Mac/Linux: lsof -ti:5173 | xargs kill
  ```

## Running Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth_service.py

# Run property tests with statistics
pytest --hypothesis-show-statistics
```

## Optional: OpenAI API Setup

To use real AI analysis instead of mock data:

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add to backend/.env:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart the backend

**Note**: OpenAI API calls cost money (~$0.01-0.02 per analysis). The mock service works great for development!

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Watch the [walkthrough.md](walkthrough.md) for a complete tour
- Explore the code and make it your own!

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review error messages carefully
- Make sure all prerequisites are installed
- Verify environment variables are set correctly

Happy coding! 🚀
