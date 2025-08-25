# 🚀 Startup Genie - Render Deployment Guide

This guide will help you deploy both the frontend and backend of Startup Genie on Render.

## 📋 Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **GitHub Repository**: Make sure your code is pushed to GitHub

## 🏗️ Deployment Architecture

We'll deploy two services:
- **Backend**: Node.js MCP Server (Web Service)
- **Frontend**: React App (Static Site)

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "🚀 Prepare for Render deployment"
   git push origin main
   ```

2. **Verify your repository structure**:
   ```
   startup-genie/
   ├── src/                    # Frontend React code
   ├── mcp-server/            # Backend Node.js code
   ├── package.json           # Frontend dependencies
   ├── render.yaml            # Render configuration
   ├── Dockerfile             # Frontend Docker config
   └── nginx.conf             # Nginx configuration
   
   startup-genie/mcp-server/
   ├── src/                   # Backend source code
   ├── package.json           # Backend dependencies
   ├── tsconfig.json          # TypeScript config
   └── Dockerfile             # Backend Docker config
   ```

### Step 2: Deploy Backend First

1. **Go to Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)

2. **Create New Web Service**:
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure Backend Service**:
   - **Name**: `startup-genie-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `startup-genie/mcp-server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if needed)

4. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `3001`

5. **Click "Create Web Service"**

6. **Wait for deployment** and note the URL (e.g., `https://startup-genie-backend.onrender.com`)

### Step 3: Deploy Frontend

1. **Create New Static Site**:
   - Click "New +"
   - Select "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend Service**:
   - **Name**: `startup-genie-frontend`
   - **Environment**: `Static Site`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: `startup-genie`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

3. **Environment Variables**:
   - `VITE_API_URL`: `https://startup-genie-backend.onrender.com` (use your backend URL)

4. **Click "Create Static Site"**

5. **Wait for deployment** and note the URL (e.g., `https://startup-genie-frontend.onrender.com`)

### Step 4: Configure Custom Domain (Optional)

1. **In your frontend service**:
   - Go to Settings → Custom Domains
   - Add your domain (e.g., `startupgenie.com`)
   - Configure DNS as instructed

2. **In your backend service**:
   - Go to Settings → Custom Domains
   - Add your API domain (e.g., `api.startupgenie.com`)

## 🔧 Alternative: Using render.yaml (Blue-Green Deployment)

If you want to deploy both services at once:

1. **Push the render.yaml file** to your repository
2. **In Render Dashboard**:
   - Click "New +"
   - Select "Blueprint"
   - Connect your repository
   - Render will automatically create both services

## 🧪 Testing Your Deployment

### Test Backend:
```bash
curl https://your-backend-url.onrender.com/api/health
```
Should return: `{"status":"OK","message":"Startup Genie MCP Server is running!"}`

### Test Frontend:
1. Visit your frontend URL
2. Try the authentication flow
3. Test the AI tools (Idea Validator, Business Model, Pitch Creator)

## 🔍 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Verify all dependencies are in package.json
   - Ensure TypeScript compilation works locally

2. **API Connection Issues**:
   - Verify the `VITE_API_URL` environment variable is correct
   - Check CORS settings in backend
   - Test backend health endpoint

3. **Runtime Errors**:
   - Check application logs in Render dashboard
   - Verify environment variables are set correctly
   - Test locally with production build

### Debug Commands:

```bash
# Test backend locally
cd startup-genie/mcp-server
npm install
npm run build
npm start

# Test frontend locally
cd startup-genie
npm install
npm run build
npm run preview
```

## 📊 Monitoring

1. **Health Checks**: Both services have health check endpoints
2. **Logs**: View real-time logs in Render dashboard
3. **Metrics**: Monitor performance and usage
4. **Alerts**: Set up notifications for downtime

## 🔄 Continuous Deployment

Render automatically redeploys when you push to your main branch. To disable:
1. Go to service settings
2. Toggle "Auto-Deploy" off

## 💰 Cost Optimization

- **Free Tier**: Both services can run on free tier
- **Sleep Mode**: Free services sleep after 15 minutes of inactivity
- **Upgrade**: Consider paid plans for production use

## 🚀 Production Checklist

- [ ] Both services deployed successfully
- [ ] Health checks passing
- [ ] Frontend can connect to backend
- [ ] All AI tools working
- [ ] Authentication working
- [ ] Custom domain configured (if needed)
- [ ] SSL certificates active
- [ ] Monitoring set up
- [ ] Error tracking configured

## 📞 Support

If you encounter issues:
1. Check Render documentation: [docs.render.com](https://docs.render.com)
2. View service logs in Render dashboard
3. Test locally to isolate issues
4. Check GitHub issues for similar problems

---

**Your Startup Genie is now live! 🎉**

Visit your frontend URL to start using the AI-powered startup assistant platform.
