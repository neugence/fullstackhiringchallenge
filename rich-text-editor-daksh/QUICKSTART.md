# 🚀 Quick Start Guide

Get the AI Resume Platform running in 5 minutes!

---

## Prerequisites Check

Before starting, make sure you have:
- [ ] Python 3.9+ installed
- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed
- [ ] Git installed

**Check versions:**
```bash
python --version  # Should be 3.9+
node --version    # Should be 18+
psql --version    # Should be 14+
```

---

## Step 1: Database Setup (1 minute)

```bash
# Create the database
createdb resume_platform

# Verify it was created
psql -l | grep resume_platform
```

**Troubleshooting:**
- If `createdb` command not found, PostgreSQL might not be in your PATH
- On Windows, use pgAdmin or SQL Shell instead
- Default user is usually `postgres` with password `postgres`

---

## Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies (this takes ~1 minute)
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux

# Edit .env file - set your database URL
# DATABASE_URL=postgresql://postgres:password@localhost:5432/resume_platform
```

**Start the backend:**
```bash
python run.py
```

You should see:
```
Starting AI Resume Platform Backend on http://localhost:5000
API endpoints available at /api/*
Database tables created successfully!
```

✅ Backend is running on http://localhost:5000

---

## Step 3: Frontend Setup (2 minutes)

**Open a NEW terminal window** (keep backend running)

```bash
# Navigate to frontend
cd frontend

# Install dependencies (this takes ~1 minute)
npm install

# Create .env file
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux

# Start the frontend
npm run dev
```

You should see:
```
VITE v5.1.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ Frontend is running on http://localhost:5173

---

## Step 4: Test the Application (1 minute)

1. **Open browser** to http://localhost:5173

2. **Register a new account:**
   - Click "Register"
   - Enter name, email, password
   - Click "Register"

3. **Login:**
   - Enter your email and password
   - Click "Login"

4. **Try Resume Review:**
   - Click "Resume Review"
   - Paste this sample resume:
     ```
     Software Engineer with 5 years of experience in full-stack development.
     Proficient in Python, JavaScript, and React. Built scalable web applications
     serving 100K+ users. Led team of 3 developers on major projects.
     ```
   - Click "Analyze Resume"
   - See your AI-powered feedback!

5. **Try Job Match:**
   - Click "Job Match"
   - Paste the same resume
   - Paste this job description:
     ```
     Senior Software Engineer position requiring Python, React, AWS, and Docker.
     Must have experience with microservices and cloud infrastructure.
     5+ years experience required.
     ```
   - Click "Analyze Match"
   - See your match score!

✅ **Success!** Your application is working!

---

## Common Issues & Solutions

### Issue: "Database does not exist"
```bash
# Create the database
createdb resume_platform
```

### Issue: "Port 5000 already in use"
```bash
# Windows: Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux: Kill the process
lsof -ti:5000 | xargs kill
```

### Issue: "Port 5173 already in use"
```bash
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill
```

### Issue: "Module not found"
```bash
# Backend:
cd backend
pip install -r requirements.txt

# Frontend:
cd frontend
npm install
```

### Issue: "Cannot connect to database"
- Check PostgreSQL is running
- Verify DATABASE_URL in backend/.env
- Check username and password

### Issue: "CORS error"
- Make sure backend is running on port 5000
- Check VITE_API_BASE_URL in frontend/.env

---

## What's Next?

### Explore the Application
- Create multiple resume reviews
- Try different job descriptions
- Check your dashboard history

### Read the Documentation
- **README.md** - Full documentation
- **walkthrough.md** - Detailed tour
- **TESTING.md** - Run the tests

### Run the Tests
```bash
cd backend
pytest
pytest -v  # Verbose output
```

### Add OpenAI API Key (Optional)
1. Get API key from https://platform.openai.com/api-keys
2. Add to backend/.env:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart backend
4. Now you'll get real AI analysis!

**Note:** The mock service works great without an API key!

---

## Quick Commands Reference

### Start Backend
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
python run.py
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Run Tests
```bash
cd backend
pytest
```

### Stop Everything
- Press `Ctrl+C` in both terminal windows

---

## Project Structure

```
ai-resume-platform/
├── backend/          # Flask API (port 5000)
│   ├── app/         # Application code
│   ├── tests/       # Test suite
│   └── run.py       # Entry point
├── frontend/        # React app (port 5173)
│   ├── src/         # Source code
│   └── package.json
└── README.md        # Full documentation
```

---

## Need Help?

1. **Check the logs** - Look at terminal output for errors
2. **Read README.md** - Comprehensive documentation
3. **Check SETUP_GUIDE.md** - Detailed setup instructions
4. **Review error messages** - They usually tell you what's wrong

---

## Success Checklist

- [ ] PostgreSQL database created
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Can analyze a resume
- [ ] Can match a job
- [ ] Can see dashboard history

---

## 🎉 Congratulations!

You now have a fully functional AI Resume Platform running locally!

**What you can do:**
- ✅ Register and login
- ✅ Analyze resumes with AI
- ✅ Match jobs with resumes
- ✅ View historical data
- ✅ Explore the codebase
- ✅ Run the tests
- ✅ Deploy to production

**Next steps:**
- Explore the features
- Read the documentation
- Run the tests
- Customize the code
- Deploy to production

---

**Enjoy your AI Resume Platform! 🚀**
