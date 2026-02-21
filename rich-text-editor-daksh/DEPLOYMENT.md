# Deployment Guide

This guide covers deploying the AI Resume Platform to production.

## Prerequisites

- Domain name (optional but recommended)
- PostgreSQL database (managed service recommended)
- OpenAI API key (optional, mock service works without it)

---

## Option 1: Deploy to Heroku (Easiest)

### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name-backend
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET_KEY="your-secure-random-key"
   heroku config:set OPENAI_API_KEY="sk-your-key" # Optional
   heroku config:set FLASK_ENV="production"
   ```

5. **Create Procfile**
   ```bash
   echo "web: gunicorn run:app" > Procfile
   ```

6. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

7. **Initialize Database**
   ```bash
   heroku run python -c "from app.main import create_app; from app.database import init_db; app = create_app(); init_db(app)"
   ```

### Frontend Deployment

1. **Deploy to Vercel**
   ```bash
   cd frontend
   npm install -g vercel
   vercel
   ```

2. **Set Environment Variable**
   - In Vercel dashboard, set `VITE_API_BASE_URL` to your Heroku backend URL

---

## Option 2: Deploy to AWS

### Backend (Elastic Beanstalk)

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**
   ```bash
   cd backend
   eb init -p python-3.9 your-app-name
   ```

3. **Create Environment**
   ```bash
   eb create production-env
   ```

4. **Set Environment Variables**
   ```bash
   eb setenv JWT_SECRET_KEY="your-key" OPENAI_API_KEY="sk-key" FLASK_ENV="production"
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

### Frontend (S3 + CloudFront)

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

3. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

4. **Configure CloudFront**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Enable HTTPS

### Database (RDS)

1. **Create RDS PostgreSQL Instance**
   - Use AWS Console or CLI
   - Choose appropriate instance size
   - Enable automated backups

2. **Update Backend Environment**
   ```bash
   eb setenv DATABASE_URL="postgresql://user:pass@host:5432/db"
   ```

---

## Option 3: Deploy to DigitalOcean

### Backend (App Platform)

1. **Connect GitHub Repository**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repo

2. **Configure App**
   - Select Python
   - Set build command: `pip install -r requirements.txt`
   - Set run command: `gunicorn run:app`

3. **Add Database**
   - Add managed PostgreSQL database
   - Connection string auto-configured

4. **Set Environment Variables**
   - Add JWT_SECRET_KEY
   - Add OPENAI_API_KEY (optional)
   - Add FLASK_ENV=production

### Frontend (App Platform)

1. **Add Frontend Component**
   - Select Node.js
   - Set build command: `npm run build`
   - Set output directory: `dist`

2. **Set Environment Variable**
   - VITE_API_BASE_URL: Your backend URL

---

## Production Checklist

### Security

- [ ] Use strong JWT secret key (32+ random characters)
- [ ] Enable HTTPS for all communications
- [ ] Configure CORS for production domains only
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add request size limits
- [ ] Enable security headers

### Database

- [ ] Enable automated backups
- [ ] Set up connection pooling
- [ ] Create database indexes
- [ ] Configure read replicas (if needed)
- [ ] Set up monitoring and alerts

### Application

- [ ] Use production WSGI server (Gunicorn)
- [ ] Configure logging
- [ ] Set up error tracking (Sentry)
- [ ] Enable monitoring (New Relic, DataDog)
- [ ] Configure health checks
- [ ] Set up auto-scaling (if needed)

### Frontend

- [ ] Build production bundle
- [ ] Enable gzip compression
- [ ] Configure CDN
- [ ] Set cache headers
- [ ] Minify assets
- [ ] Enable HTTPS

---

## Environment Variables

### Backend (.env)
```env
# Required
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET_KEY=your-secure-random-key-min-32-chars

# Optional
OPENAI_API_KEY=sk-your-openai-key
FLASK_ENV=production
SECRET_KEY=another-secure-key
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

---

## Production Configuration

### Gunicorn Configuration (gunicorn.conf.py)
```python
bind = "0.0.0.0:5000"
workers = 4
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
errorlog = "-"
accesslog = "-"
loglevel = "info"
```

### Nginx Configuration (if using)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Monitoring

### Application Monitoring
- Set up error tracking (Sentry, Rollbar)
- Monitor response times
- Track API usage
- Monitor database performance

### Infrastructure Monitoring
- CPU and memory usage
- Disk space
- Network traffic
- Database connections

### Logging
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

---

## Scaling Considerations

### Horizontal Scaling
- Add more application instances
- Use load balancer
- Implement session storage (Redis)

### Database Scaling
- Add read replicas
- Implement connection pooling
- Use database caching (Redis)

### Caching
- Cache AI responses
- Use CDN for static assets
- Implement API response caching

---

## Backup Strategy

### Database Backups
- Automated daily backups
- Point-in-time recovery
- Test restore procedures
- Store backups in different region

### Application Backups
- Version control (Git)
- Environment variable backups
- Configuration backups

---

## Rollback Plan

1. **Keep Previous Version**
   - Tag releases in Git
   - Keep previous deployment

2. **Quick Rollback**
   ```bash
   # Heroku
   heroku rollback

   # AWS EB
   eb deploy --version previous-version

   # Manual
   git revert HEAD
   git push
   ```

3. **Database Rollback**
   - Have migration rollback scripts
   - Test rollback procedures

---

## Cost Optimization

### Free Tier Options
- **Heroku**: Free tier available (sleeps after 30 min)
- **Vercel**: Free for personal projects
- **Railway**: Free tier with limits
- **Render**: Free tier available

### Paid Options (Estimated Monthly)
- **Heroku Hobby**: $7/month (backend) + $9/month (database)
- **AWS**: $10-50/month depending on usage
- **DigitalOcean**: $12-25/month
- **OpenAI API**: ~$10-50/month depending on usage

### Cost Saving Tips
- Use mock AI service for development
- Implement caching for AI responses
- Use CDN for static assets
- Optimize database queries
- Set up auto-scaling with minimum instances

---

## Troubleshooting

### Common Issues

**Issue**: Database connection fails
- Check DATABASE_URL format
- Verify database is running
- Check firewall rules

**Issue**: CORS errors
- Verify CORS configuration
- Check frontend URL in CORS settings
- Ensure credentials are included

**Issue**: JWT token errors
- Verify JWT_SECRET_KEY is set
- Check token expiration
- Ensure consistent secret across instances

**Issue**: OpenAI API errors
- Verify API key is valid
- Check API quota
- Ensure fallback to mock works

---

## Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connection
4. Check API endpoints
5. Review error messages

---

## Next Steps After Deployment

1. Set up monitoring and alerts
2. Configure automated backups
3. Implement rate limiting
4. Add analytics
5. Set up CI/CD pipeline
6. Create staging environment
7. Document deployment process
8. Train team on deployment

---

**Remember**: Always test in staging before deploying to production!
