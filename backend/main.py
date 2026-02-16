from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from typing import List
from jose import JWTError, jwt
import google.generativeai as genai
import os

import models
import schemas
import auth
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CONFIGURATION ---
os.environ["GOOGLE_API_KEY"] = "AIzaSyAxJ1btQO2wzn4I6jjt-gjtmxUK25FOYxs" 
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- AUTH DEPENDENCY ---
# This function checks if the user sends a valid token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# --- AUTH ENDPOINTS ---

@app.post("/api/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = auth.create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token = auth.create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# --- POSTS ENDPOINTS (PROTECTED) ---

@app.post("/api/posts/", response_model=schemas.PostResponse)
def create_post(
    post: schemas.PostCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) # <--- ADDED PROTECTION
):
    # Assign the new post to the current user
    db_post = models.Post(title="Untitled", content="{}", status="draft", owner_id=current_user.id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@app.get("/api/posts/", response_model=List[schemas.PostResponse])
def get_posts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) # <--- ADDED PROTECTION
):
    # Only return posts belonging to the current user
    posts = db.query(models.Post).filter(models.Post.owner_id == current_user.id).all()
    return posts

@app.get("/api/posts/{post_id}", response_model=schemas.PostResponse)
def get_post(
    post_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    post = db.query(models.Post).filter(models.Post.id == post_id, models.Post.owner_id == current_user.id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@app.patch("/api/posts/{post_id}", response_model=schemas.PostResponse)
def update_post(
    post_id: int, 
    post_update: schemas.PostUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_post = db.query(models.Post).filter(models.Post.id == post_id, models.Post.owner_id == current_user.id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post_update.title is not None:
        db_post.title = post_update.title
    if post_update.content is not None:
        db_post.content = post_update.content
    if post_update.status is not None:
        db_post.status = post_update.status
        
    db.commit()
    db.refresh(db_post)
    return db_post

@app.post("/api/posts/{post_id}/publish")
def publish_post(
    post_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_post = db.query(models.Post).filter(models.Post.id == post_id, models.Post.owner_id == current_user.id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db_post.status = "published"
    db.commit()
    return {"status": "published"}

@app.post("/api/ai/generate")
def generate_summary(request: schemas.AIRequest):
    try:
        model = genai.GenerativeModel('gemini-flash-latest') 
        prompt = f"Summarize the following blog post in 2-3 concise sentences:\n\n{request.content}"
        response = model.generate_content(prompt)
        return {"summary": response.text}
    except Exception as e:
        print(f"AI Error: {e}")
        return {"summary": "AI Quota Exceeded. (Mock Summary): This is a great blog post about technology."}