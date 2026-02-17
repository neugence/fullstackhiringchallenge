# 🚀 DEPLOYMENT GUIDE - Smart Blog Editor

## 📋 Prerequisites Checklist

✅ Backend deployed on Render: https://smart-blog-editor-2yfb.onrender.com  
✅ Frontend code updated with environment variables  
✅ Backend CORS configured for Vercel  
✅ Git repository ready: https://github.com/Jayasimha-2005/smart-blog-editor

> **🔒 SECURITY:** Before deploying, review [SECURITY.md](SECURITY.md) for important security guidelines. Never commit secrets to the repository!

---

## 🎯 STEP-BY-STEP DEPLOYMENT

### 🔧 STEP 1: Push Updated Code to GitHub

```bash
# Add all changes
git add .

# Commit with deployment message
git commit -m "Prepare frontend for production deployment"

# Push to GitHub
git push origin main
```

---

### 🌐 STEP 2: Deploy Backend on Render

**✅ Already Done!** Your backend is live at:  
`https://smart-blog-editor-2yfb.onrender.com`

**Verify it's working:**
```bash
curl https://smart-blog-editor-2yfb.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Smart Blog Editor API"
}
```

---

### 🚀 STEP 3: Deploy Frontend on Vercel

#### A. Go to Vercel Dashboard

1. Visit: https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**

#### B. Import Your Repository

1. Select: `Jayasimha-2005/smart-blog-editor`
2. Click **"Import"**

#### C. Configure Project Settings

**Framework Preset:** Vite  
**Root Directory:** `frontend` ⚠️ **IMPORTANT**  
**Build Command:** `npm run build` (auto-detected)  
**Output Directory:** `dist` (auto-detected)  

#### D. Add Environment Variable

Click **"Environment Variables"** section:

```
Key: VITE_API_URL
Value: https://smart-blog-editor-2yfb.onrender.com
```

**Environment:** Production, Preview, Development (select all)

#### E. Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Your app will be live at: `https://smart-blog-editor.vercel.app`

---

## 🎯 STEP 4: Test Your Production App

### Visit Your Live App
`https://smart-blog-editor.vercel.app`

### Test All Features

1. ✅ **Register a new account**
   - Email: test@example.com
   - Password: Test1234!

2. ✅ **Login**
   - Should redirect to dashboard

3. ✅ **Create a new post**
   - Click "New Draft"
   - Type content
   - Auto-save should trigger (check "Saved X ago")

4. ✅ **Test AI Features**
   - Click "✨ Summary" - should generate and show preview card
   - Click "📝 Grammar" - select text and fix grammar

5. ✅ **Publish post**
   - Click "Publish" button
   - Should show green "Published" badge

---

## 🔒 STEP 5: Secure Backend CORS (if needed)

If you want to restrict CORS to only your Vercel domain:

**Edit backend/main.py:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://smart-blog-editor.vercel.app",  # Your exact domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then redeploy backend on Render.

---

## 🎨 OPTIONAL: Custom Domain

### For Frontend (Vercel)

1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your custom domain (e.g., `blog.yourdomain.com`)
4. Update DNS records as instructed

### For Backend (Render)

1. Upgrade to paid plan (required for custom domains)
2. Go to Render service settings
3. Add custom domain (e.g., `api.yourdomain.com`)
4. Update `VITE_API_URL` in Vercel to use new domain

---

## 🚨 Troubleshooting

### Issue: "Network Error" in frontend

**Solution:**
- Check backend is running: `curl https://smart-blog-editor-2yfb.onrender.com/health`
- Verify CORS settings in backend
- Check browser console for CORS errors

### Issue: "401 Unauthorized" after some time

**Cause:** JWT token expired (30 minutes default)  
**Solution:** Login again (this is expected behavior)

### Issue: Backend won't start on Render

**Common fixes:**
- Ensure Root Directory is empty (not "backend")
- Check environment variables are set correctly (MONGO_URI, JWT_SECRET, GEMINI_API_KEY)
- **IMPORTANT:** Never include actual secret values in render.yaml or code
- Review build logs for Python errors

> **🔒 Security Tip:** Environment variables should be set in the Render dashboard, not in configuration files. See [SECURITY.md](SECURITY.md) for details.

### Issue: Frontend build fails on Vercel

**Common fixes:**
- Ensure Root Directory is set to "frontend"
- Check `VITE_API_URL` environment variable is added
- Review build logs for npm errors

---

## 📊 Monitoring Your App

### Render (Backend)
- View logs: Dashboard → Logs
- Check metrics: Dashboard → Metrics
- Monitor deployments: Dashboard → Events

### Vercel (Frontend)
- View deployments: Dashboard → Deployments
- Check analytics: Dashboard → Analytics
- Monitor errors: Dashboard → Speed Insights

---

## 🏆 What You've Built

✅ **Production-ready full-stack SaaS application**  
✅ **FastAPI backend** with JWT authentication  
✅ **React frontend** with Lexical rich text editor  
✅ **MongoDB Atlas** cloud database  
✅ **Google Gemini AI** integration  
✅ **Auto-save** with debouncing  
✅ **Responsive design** (mobile-first)  
✅ **Premium UI/UX** (Notion/Medium style)  
✅ **Secure authentication** with JWT tokens  
✅ **Real-time features** (auto-save, publish)  
✅ **AI-powered features** (summary, grammar)  

---

## 🎯 Next Steps (Optional Enhancements)

1. **Dark Mode** - Add theme toggle
2. **Rich Media** - Support image uploads
3. **Collaboration** - Multiple authors per post
4. **Analytics** - Track views and engagement
5. **SEO** - Meta tags and social sharing
6. **Email** - Verification and notifications
7. **Export** - Download posts as Markdown/PDF
8. **Search** - Full-text search across posts
9. **Tags/Categories** - Better organization
10. **Comments** - Reader engagement

---

## 📞 Support

**Backend Logs:** https://dashboard.render.com  
**Frontend Logs:** https://vercel.com/dashboard  
**MongoDB:** https://cloud.mongodb.com  

---

## 🎉 Congratulations!

You've successfully deployed a **production-grade SaaS application**.

**Live URLs:**
- Frontend: https://smart-blog-editor.vercel.app
- Backend: https://smart-blog-editor-2yfb.onrender.com
- API Docs: https://smart-blog-editor-2yfb.onrender.com/docs

---

*Built with FastAPI, React, MongoDB, Gemini AI, and deployed on Render & Vercel.*
