# How to Submit Your Assignment via Pull Request

## 📋 Overview

You need to submit your Smart Blog Editor project to the Neugence hiring challenge repository by creating a Pull Request (PR).

---

## 🚀 Step-by-Step Guide

### **Step 1: Fork the Repository**

1. Go to: https://github.com/neugence/fullstackhiringchallenge
2. Click the **"Fork"** button in the top-right corner
3. This creates a copy of the repo under your GitHub account
4. Wait for the fork to complete

### **Step 2: Clone Your Fork**

Open a new terminal window (keep your dev server running in the other one):

```bash
cd ~/Downloads
git clone https://github.com/YOUR_USERNAME/fullstackhiringchallenge.git
cd fullstackhiringchallenge
```

Replace `YOUR_USERNAME` with your actual GitHub username (Vishvesh28).

### **Step 3: Create a New Branch**

```bash
git checkout -b vishvesh-smart-blog-editor
```

Use your name or a unique identifier for the branch name.

### **Step 4: Add Your Project**

You have two options:

#### **Option A: Add as a Subdirectory (Recommended)**

```bash
# Create a folder with your name
mkdir -p submissions/vishvesh-smart-blog-editor

# Copy your entire project
cp -r ~/Downloads/visual-do-it-main/* submissions/vishvesh-smart-blog-editor/

# Or if the repo has a specific structure, follow their instructions
```

#### **Option B: Follow Repository Structure**

Check if the `fullstackhiringchallenge` repo has a specific folder structure or README with submission instructions. Follow their format.

### **Step 5: Add a Submission README**

Create a file: `submissions/vishvesh-smart-blog-editor/SUBMISSION.md`

```markdown
# Smart Blog Editor - Vishvesh Submission

## Candidate Information
- **Name:** Vishvesh
- **GitHub:** https://github.com/Vishvesh28
- **Email:** [Your Email]

## Project Links
- **Live Demo:** https://smart-blog-editor-mu.vercel.app
- **Demo Video:** https://www.loom.com/share/0ff80fb2984e4df49e7fc42755dfe300
- **Source Code:** https://github.com/Vishvesh28/smart-blog-editor

## Assignment Completion

✅ All requirements met:
- Lexical rich text editor
- Auto-save with debouncing (2s)
- Zustand state management
- PostgreSQL + JSONB storage
- Tailwind CSS
- AI integration (bonus)

## Tech Stack
- React 18 + TypeScript
- Lexical Editor
- Zustand
- Supabase (PostgreSQL + Edge Functions)
- Tailwind CSS
- Gemini API

## Setup Instructions
See README.md in this directory for complete setup instructions.
```

### **Step 6: Commit Your Changes**

```bash
git add .
git commit -m "Add Smart Blog Editor submission by Vishvesh"
```

### **Step 7: Push to Your Fork**

```bash
git push origin vishvesh-smart-blog-editor
```

### **Step 8: Create the Pull Request**

1. Go to your forked repo: `https://github.com/YOUR_USERNAME/fullstackhiringchallenge`
2. You'll see a banner: **"vishvesh-smart-blog-editor had recent pushes"**
3. Click **"Compare & pull request"** button
4. Fill in the PR details:

**Title:**
```
Smart Blog Editor - Vishvesh Submission
```

**Description:**
```markdown
## Candidate Information
- **Name:** Vishvesh
- **GitHub:** @Vishvesh28
- **Email:** [Your Email]

## Project Overview
A production-ready Notion-style blog editor with rich text editing, intelligent auto-save, and AI-powered writing assistance.

## Live Links
- **Live Demo:** https://smart-blog-editor-mu.vercel.app
- **Demo Video:** https://www.loom.com/share/0ff80fb2984e4df49e7fc42755dfe300
- **Source Repository:** https://github.com/Vishvesh28/smart-blog-editor

## Features Implemented

### Core Requirements ✅
- ✅ Lexical rich text editor (Bold, Italic, Headings, Lists)
- ✅ Intelligent auto-save with custom debouncing (2-second delay)
- ✅ Zustand global state management
- ✅ PostgreSQL database with JSONB storage
- ✅ Professional Tailwind CSS design
- ✅ Draft/Published workflow

### Bonus Features ✅
- ✅ AI Integration (Generate Summary, Fix Grammar) using Gemini API
- ✅ Comprehensive documentation (6+ markdown files)
- ✅ System architecture diagram
- ✅ Production deployment on Vercel

## Tech Stack
- **Frontend:** React 18, TypeScript, Lexical, Zustand, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **AI:** Gemini API
- **Deployment:** Vercel

## Key Highlights
- Custom debounce implementation (O(1) complexity)
- Lossless Lexical state persistence
- Modular React components
- Clean architecture with custom hooks
- Production-ready with comprehensive testing

## Setup Instructions
Complete setup instructions are available in the project README.

Thank you for considering my submission!
```

5. Click **"Create pull request"**

---

## ✅ **Quick Command Summary**

Here's the complete sequence of commands:

```bash
# 1. Clone the forked repo
cd ~/Downloads
git clone https://github.com/Vishvesh28/fullstackhiringchallenge.git
cd fullstackhiringchallenge

# 2. Create a new branch
git checkout -b vishvesh-smart-blog-editor

# 3. Create submission folder
mkdir -p submissions/vishvesh-smart-blog-editor

# 4. Copy your project
cp -r ~/Downloads/visual-do-it-main/* submissions/vishvesh-smart-blog-editor/

# 5. Add and commit
git add .
git commit -m "Add Smart Blog Editor submission by Vishvesh"

# 6. Push to your fork
git push origin vishvesh-smart-blog-editor

# 7. Then go to GitHub and create PR
```

---

## 📝 **Important Notes**

1. **Check the Repository Structure First**
   - The `fullstackhiringchallenge` repo might have specific instructions
   - Look for a `CONTRIBUTING.md` or `README.md` with submission guidelines
   - Follow their folder structure if specified

2. **Include All Deliverables**
   - Source code
   - README with setup instructions
   - Live demo link
   - Demo video link
   - Architecture documentation

3. **PR Best Practices**
   - Use a descriptive branch name
   - Write a clear PR title and description
   - Include all required links
   - Be professional and concise

4. **After Submitting**
   - Don't close or delete the PR
   - Be ready to respond to any comments or questions
   - Keep your demo live and accessible

---

## 🎯 **What to Include in Your Submission**

Based on typical hiring challenge requirements:

✅ **Source Code** - Your complete project  
✅ **README.md** - Setup instructions and documentation  
✅ **Live Demo** - Deployed application URL  
✅ **Demo Video** - Walkthrough video  
✅ **Architecture Diagram** - System design  
✅ **SUBMISSION.md** - Summary of your work  

---

## 🚨 **Before You Submit**

- [ ] Test your live demo is working
- [ ] Verify demo video is accessible
- [ ] Ensure README has complete setup instructions
- [ ] Check all links are working
- [ ] Review your code for any sensitive data (.env files, API keys)
- [ ] Make sure .gitignore is properly configured

---

**Good luck with your submission!** 🚀

If you have any questions about the PR process, feel free to ask!
