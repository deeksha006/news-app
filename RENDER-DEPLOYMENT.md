# 🚀 Deploy News App to Render

This guide will help you deploy your News Flow application to Render, a modern cloud platform.

## 📋 Prerequisites

1. **GitHub Account**: Your code needs to be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **NewsAPI Key**: Get your API key from [newsapi.org](https://newsapi.org)

## 🛠️ Deployment Steps

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - News App for Render deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/news-app.git
   git push -u origin main
   ```

### Step 2: Deploy to Render

1. **Go to Render Dashboard**:
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"

2. **Connect Your Repository**:
   - Connect your GitHub account
   - Select your news-app repository
   - Click "Connect"

3. **Configure Your Service**:
   - **Name**: `news-app` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Step 3: Set Environment Variables

In the Render dashboard, add these environment variables:

**Required Variables:**
- `NODE_ENV` = `production`
- `PORT` = `10000` (Render will set this automatically)
- `JWT_SECRET` = `your-super-secure-jwt-secret-here`
- `NEWS_API_KEY` = `your-newsapi-key-here`

**Optional Variables:**
- `BCRYPT_ROUNDS` = `12`
- `RATE_LIMIT_WINDOW_MS` = `900000`
- `RATE_LIMIT_MAX_REQUESTS` = `100`
- `LOG_LEVEL` = `info`
- `CACHE_DURATION_MINUTES` = `30`

### Step 4: Add Persistent Disk (For Database)

1. In your service settings, go to "Disks"
2. Click "Add Disk"
3. **Name**: `news-app-disk`
4. **Mount Path**: `/opt/render/project/src/database`
5. **Size**: `1 GB` (free tier)

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your app
3. Wait for the deployment to complete (usually 2-5 minutes)

## 🔧 Configuration Files Created

The following files have been added to your project for Render deployment:

### `render.yaml`
```yaml
services:
  - type: web
    name: news-app
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    # ... environment variables and disk configuration
```

### `Procfile`
```
web: node server.js
```

### Updated `package.json`
Added build script:
```json
"scripts": {
  "build": "npm run init-db"
}
```

## 🌐 Access Your App

After deployment:
- Your app will be available at: `https://your-app-name.onrender.com`
- The API will be at: `https://your-app-name.onrender.com/api`
- Health check: `https://your-app-name.onrender.com/api/health`

## 🔒 Security Notes

1. **JWT Secret**: Use a strong, unique secret for production
2. **NewsAPI Key**: Keep your API key secure and don't commit it to version control
3. **HTTPS**: Render provides free SSL certificates
4. **CORS**: Configured to work with your Render domain

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Database Issues**:
   - Ensure the persistent disk is properly mounted
   - Check database initialization logs

3. **Environment Variables**:
   - Verify all required variables are set
   - Check for typos in variable names

4. **CORS Errors**:
   - The app is configured to work with Render's domains
   - If you have a custom domain, update FRONTEND_URL

### Viewing Logs:
- Go to your service in Render dashboard
- Click "Logs" to see real-time application logs
- Look for startup messages and any errors

## 📊 Monitoring

- **Health Check**: `/api/health` endpoint
- **Logs**: Available in Render dashboard
- **Metrics**: Basic metrics available in free tier

## 🔄 Updates

To update your app:
1. Push changes to your GitHub repository
2. Render will automatically redeploy
3. Or manually trigger deployment in dashboard

## 💰 Costs

- **Free Tier**: Includes 750 hours/month
- **Database**: 1GB persistent disk (free)
- **SSL**: Free HTTPS certificate
- **Custom Domain**: Free (if you have one)

## 🆘 Support

If you encounter issues:
1. Check Render's [documentation](https://render.com/docs)
2. Review application logs in dashboard
3. Verify environment variables
4. Test API endpoints directly

---

**🎉 Your News App is now live on Render!**

Visit your deployed application and test all features:
- User registration/login
- News browsing by category
- Bookmarking articles
- Search functionality
