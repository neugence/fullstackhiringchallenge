# Deployment Guide - Smart Blog Editor

## Prerequisites

- GitHub account
- Vercel account (for frontend)
- Render or Railway account (for backend)
- MongoDB Atlas account (for database)

## Step 1: MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Save this connection string for later

## Step 2: Backend Deployment (Render)

### Option A: Using Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `smart-blog-editor-api`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3.10+

5. Add Environment Variables:
   ```
   MONGODB_URL=<your-atlas-connection-string>
   DATABASE_NAME=smart_blog_editor
   CORS_ORIGINS=https://your-frontend-url.vercel.app
   GEMINI_API_KEY=<optional-for-ai-features>
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy the deployed URL (e.g., `https://smart-blog-editor-api.onrender.com`)

### Option B: Using Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. Add Environment Variables (same as Render)
6. Deploy and copy the URL

## Step 3: Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   ```
   VITE_API_URL=<your-backend-url>
   ```
   Example: `https://smart-blog-editor-api.onrender.com`

6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Copy the deployed URL (e.g., `https://smart-blog-editor.vercel.app`)

## Step 4: Update CORS

1. Go back to your backend deployment (Render/Railway)
2. Update the `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS=https://your-actual-frontend-url.vercel.app
   ```
3. Redeploy the backend

## Step 5: Verify Deployment

1. Visit your frontend URL
2. Click "New Post"
3. Type some content
4. Wait for auto-save indicator
5. Refresh the page → Content should persist
6. Go back to posts list → Post should appear

## Troubleshooting

### Backend Issues

**Error: "Cannot connect to MongoDB"**
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)
- Verify connection string is correct
- Check database user permissions

**Error: "CORS policy"**
- Verify `CORS_ORIGINS` matches your frontend URL exactly
- Include `https://` in the URL
- No trailing slash

### Frontend Issues

**Error: "Network Error" or "Failed to fetch"**
- Check `VITE_API_URL` is set correctly
- Verify backend is deployed and running
- Check browser console for CORS errors

**Error: "Module not found"**
- Ensure all dependencies are in `package.json`
- Try rebuilding: `npm run build`

## Environment Variables Summary

### Backend (.env)
```bash
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/
DATABASE_NAME=smart_blog_editor
CORS_ORIGINS=https://your-frontend.vercel.app
GEMINI_API_KEY=optional
```

### Frontend (.env)
```bash
VITE_API_URL=https://your-backend.onrender.com
```

## Cost Breakdown

- **MongoDB Atlas**: Free (M0 tier, 512MB)
- **Render**: Free (with limitations: sleeps after 15min inactivity)
- **Vercel**: Free (100GB bandwidth/month)

**Total**: $0/month for development and demo purposes

## Production Recommendations

For production deployment:

1. **Upgrade Render**: $7/month for always-on instance
2. **Add Redis**: For caching and session management
3. **Enable HTTPS**: Automatic on Vercel and Render
4. **Add Monitoring**: Sentry for error tracking
5. **Set up CI/CD**: Automatic deployments on push
6. **Add Rate Limiting**: Prevent API abuse
7. **Database Backups**: Enable on MongoDB Atlas

## Demo Video Recording

Use [Loom](https://www.loom.com) or [YouTube](https://www.youtube.com):

1. Record screen showing:
   - Creating a new post
   - Typing and formatting
   - Auto-save indicator
   - Refreshing to show persistence
   - Posts list with filtering
   - Publishing a post

2. Keep it under 2 minutes
3. Upload and share the link

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs in Render/Railway dashboard
3. Verify all environment variables are set correctly
4. Test API endpoints directly at `/docs`
