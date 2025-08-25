#!/bin/bash

echo "🚀 Startup Genie - Render Deployment Script"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not found. Please initialize git first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "mcp-server" ]; then
    echo "❌ Error: Please run this script from the startup-genie directory"
    exit 1
fi

echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "📦 Building backend..."
cd mcp-server
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Backend build failed"
    exit 1
fi

cd ..

echo "✅ Build successful!"
echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m '🚀 Prepare for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy on Render:"
echo "   - Go to https://dashboard.render.com"
echo "   - Create Web Service for backend (startup-genie/mcp-server)"
echo "   - Create Static Site for frontend (startup-genie)"
echo ""
echo "3. Set environment variables:"
echo "   Backend: NODE_ENV=production, PORT=3001"
echo "   Frontend: VITE_API_URL=https://your-backend-url.onrender.com"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
