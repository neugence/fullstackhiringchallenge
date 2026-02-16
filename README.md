# Smart Blog Editor 📝

A production-ready, Notion-style blog editor featuring a rich text interface, intelligent auto-saving, and AI-powered content summarization.

## PR Link : https://github.com/neugence/fullstackhiringchallenge/pull/1

## Archtitecture Diagram : frontend\public\Archtitecture_Diagram.png

## 🛠️ Tech Stack

* **Frontend:** React, Tailwind CSS, Zustand, Lexical.
* **Backend:** FastAPI (Python), SQLAlchemy ORM.
* **Database:** SQLite.
* **AI:** Google Gemini API.
* **Security:** JWT (JSON Web Tokens) & Bcrypt hashing.

## 🚀 Key Features

* **Notion-Style Editor:** Built with the Lexical Framework for a seamless writing experience.
* **JWT Authentication:** Secure user signup and login flow.
* **User Isolation:** Users can only view and edit their own personal drafts.
* **Intelligent Auto-Save:** Custom debouncing algorithm to save changes without spamming the API.
* **AI Summarization:** One-click summary generation using Google Gemini 2.0.
* **Responsive UI:** Minimalist design crafted with Tailwind CSS and Lucide icons.

## 📂 Project Structure

````
For a detailed breakdown of design decisions, please refer to [ARCHITECTURE.md](./ARCHITECTURE.md).

## ⚙️ Setup & Installation

### 1. Backend Setup (Python FastAPI)
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # Mac/Linux:
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install fastapi uvicorn sqlalchemy pydantic python-jose[cryptography] "passlib[bcrypt]" "bcrypt==3.2.2" google-generativeai
    ```
4.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```

### 2. Frontend Setup (React)
1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```