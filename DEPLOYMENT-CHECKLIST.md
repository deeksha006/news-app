# 📋 Render Deployment Checklist

## Pre-Deployment
- [ ] Code is committed and pushed to GitHub
- [ ] All dependencies are listed in `package.json`
- [ ] Environment variables are documented
- [ ] Database schema is ready
- [ ] NewsAPI key is available

## Render Setup
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Service configured with correct settings:
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Start Command: `npm start`
  - [ ] Environment: Node
  - [ ] Plan: Free (or preferred)

## Environment Variables Set
- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` (strong, unique secret)
- [ ] `NEWS_API_KEY` (your NewsAPI key)
- [ ] `BCRYPT_ROUNDS=12`
- [ ] `RATE_LIMIT_WINDOW_MS=900000`
- [ ] `RATE_LIMIT_MAX_REQUESTS=100`
- [ ] `LOG_LEVEL=info`
- [ ] `CACHE_DURATION_MINUTES=30`

## Persistent Storage
- [ ] Disk added for database
- [ ] Mount path: `/opt/render/project/src/database`
- [ ] Size: 1GB (or as needed)

## Post-Deployment Testing
- [ ] App loads successfully
- [ ] Health check works: `/api/health`
- [ ] User registration works
- [ ] User login works
- [ ] News articles load
- [ ] Categories work
- [ ] Search functionality works
- [ ] Bookmarks can be added/removed
- [ ] Database persists data
- [ ] HTTPS certificate is active

## Performance & Monitoring
- [ ] Check application logs
- [ ] Verify response times
- [ ] Test under load (if needed)
- [ ] Monitor error rates

## Security Verification
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Rate limiting is active
- [ ] Security headers are present
- [ ] JWT tokens are secure

## Documentation
- [ ] Update README with live URL
- [ ] Document any production-specific setup
- [ ] Share access credentials (if team project)

---

**✅ Deployment Complete!**

Your News App should now be live at: `https://your-app-name.onrender.com`
