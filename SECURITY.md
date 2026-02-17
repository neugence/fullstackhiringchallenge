# 🔐 Security Guidelines

## ⚠️ CRITICAL: Never Commit Secrets!

**This repository uses environment variables for all sensitive configuration.** Never commit actual secret values to the repository!

## 🔒 Environment Variables

### Backend Environment Variables (Required)

The following environment variables must be set in your deployment environment (Render, local .env file, etc.):

| Variable | Description | How to Generate/Obtain |
|----------|-------------|------------------------|
| `MONGO_URI` | MongoDB Atlas connection string | Get from [MongoDB Atlas Dashboard](https://cloud.mongodb.com) |
| `JWT_SECRET` | Secure random string for JWT signing (32+ characters) | Generate: `openssl rand -hex 32` |
| `GEMINI_API_KEY` | Google Gemini API key | Get from [Google AI Studio](https://aistudio.google.com/apikeys) |
| `PYTHON_VERSION` | Python runtime version | `3.11.9` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://your-backend.onrender.com` |

---

## 🚀 Setting Up Environment Variables

### Local Development

**Backend:**
1. Navigate to the `backend` directory
2. Copy the example file: `cp .env.example .env`
3. Edit `.env` with your actual values
4. **NEVER** commit the `.env` file to git

**Frontend:**
1. Navigate to the `frontend` directory
2. Copy the example file: `cp .env.example .env`
3. Edit `.env` with your local backend URL
4. **NEVER** commit the `.env` file to git

### Production Deployment (Render)

1. Go to your service dashboard on [Render](https://dashboard.render.com)
2. Navigate to the "Environment" tab
3. Add each environment variable with your actual production values:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate using `openssl rand -hex 32`
   - `GEMINI_API_KEY`: Get from Google AI Studio
   - `PYTHON_VERSION`: `3.11.9`

### Production Deployment (Vercel - Frontend)

1. Go to your project settings on [Vercel](https://vercel.com/dashboard)
2. Navigate to "Environment Variables"
3. Add:
   - `VITE_API_URL`: Your production backend URL (e.g., `https://smart-blog-editor-2yfb.onrender.com`)

---

## 🛡️ Security Best Practices

### 1. Secret Rotation

If you suspect any secret has been exposed:
1. ✅ **Immediately revoke/regenerate** the exposed secret:
   - **Gemini API Key**: Delete the key in Google AI Studio and create a new one
   - **MongoDB Password**: Change password in MongoDB Atlas
   - **JWT Secret**: Generate a new one (will invalidate all existing tokens)
2. ✅ **Update** the new value in your deployment environment
3. ✅ **Never reuse** the exposed secret

### 2. Git History

**If secrets were accidentally committed:**
1. Assume the secrets are compromised and rotate them immediately
2. Use `git filter-branch` or [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) to remove from history
3. Force push to remote (coordinate with team if applicable)
4. Notify all team members to re-clone the repository

### 3. Access Control

- **MongoDB**: Use IP whitelist and strong passwords
- **API Keys**: Enable rate limiting and monitoring
- **JWT Tokens**: Use short expiration times (30 minutes recommended)
- **CORS**: Restrict to specific domains in production

### 4. Code Review Checklist

Before committing, always verify:
- [ ] No `.env` files are staged for commit
- [ ] No API keys or secrets in code
- [ ] No connection strings with credentials
- [ ] No hardcoded passwords or tokens
- [ ] Example files (`.env.example`) contain only placeholders

---

## 🔍 Checking for Secrets

Run these commands before committing:

```bash
# Check staged files
git diff --cached

# Search for potential secrets (adjust patterns as needed)
git grep -i "api[_-]key"
git grep -i "password"
git grep -i "mongodb+srv://"
git grep -i "AIza" # Gemini API key prefix
git grep -i "jwt[_-]secret"

# Check for .env files in staging
git status | grep "\.env"
```

---

## 📋 .gitignore Configuration

Ensure your `.gitignore` files exclude sensitive data:

**Root `.gitignore`:**
```gitignore
.env
.env.local
.env.*.local
```

**Backend `.gitignore`:**
```gitignore
.env
.env.local
.env.*.local
venv/
__pycache__/
```

**Frontend `.gitignore`:**
```gitignore
.env
.env.local
.env.*.local
node_modules/
dist/
```

---

## 🚨 Incident Response

If you discover exposed secrets in the repository:

1. **Act Immediately**: Time is critical
2. **Rotate Secrets**: Follow the rotation process above
3. **Notify**: Inform the repository owner/team
4. **Document**: Record what was exposed and actions taken
5. **Review**: Audit other files/commits for similar issues

---

## 📞 Reporting Security Issues

If you discover a security vulnerability:
- **DO NOT** create a public issue
- Contact the repository owner through GitHub
- Include detailed information about the vulnerability
- Allow reasonable time for fixes before public disclosure

---

## ✅ Security Checklist for Deployment

Before deploying to production:

- [ ] All secrets are stored as environment variables
- [ ] No `.env` files are committed to the repository
- [ ] `.gitignore` properly excludes sensitive files
- [ ] MongoDB uses authentication and IP whitelisting
- [ ] JWT tokens have appropriate expiration times
- [ ] CORS is configured for specific domains
- [ ] HTTPS is enforced for all connections
- [ ] API rate limiting is enabled
- [ ] Error messages don't expose sensitive information
- [ ] Dependencies are up-to-date with security patches

---

## 🔗 Useful Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)

---

**Remember: Security is everyone's responsibility!** When in doubt, ask before committing.
