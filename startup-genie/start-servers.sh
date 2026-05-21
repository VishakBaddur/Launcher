#!/bin/bash

# Start Backend Server
echo "🚀 Starting Backend Server on port 3001..."
cd mcp-server
npm run dev &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait a moment for backend to start
sleep 3

# Start Frontend Server
echo "🎨 Starting Frontend Server on port 5173..."
cd ..
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Servers starting..."
echo "📡 Backend: http://localhost:3001"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
wait


