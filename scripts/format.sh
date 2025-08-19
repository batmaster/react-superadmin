#!/bin/bash

# React SuperAdmin Code Formatting Script
# This script formats all code files using Prettier and ESLint

set -e

echo "🎨 React SuperAdmin Code Formatting"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f ".prettierrc" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm is not installed. Please install it first."
    exit 1
fi

echo "📦 Installing dependencies if needed..."
pnpm install

echo ""
echo "🔍 Checking code formatting..."
if pnpm format:check; then
    echo "✅ Code is already properly formatted!"
else
    echo "⚠️  Code formatting issues found. Fixing..."
    echo ""
    echo "🎯 Running Prettier..."
    pnpm format
    
    echo ""
    echo "🔧 Running ESLint fixes..."
    pnpm lint
    
    echo ""
    echo "✅ Code formatting completed!"
fi

echo ""
echo "🚀 You can now commit your changes!"
echo "   The pre-commit hooks will ensure formatting is maintained." 