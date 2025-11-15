#!/bin/bash

echo "🚀 Oyo Ilaqa Attendance System - Quick Start"
echo "==========================================="
echo ""

if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your configuration."
    echo ""
fi

if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🏗️  Building TypeScript..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Update .env file with your MongoDB URI and SMTP credentials"
    echo "   2. Run 'npm run dev' to start the development server"
    echo "   3. Check API_TESTING.md for endpoint examples"
    echo ""
    echo "🎯 Quick commands:"
    echo "   npm run dev        - Start development server"
    echo "   npm run build      - Build TypeScript"
    echo "   npm test           - Run tests"
    echo ""
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
