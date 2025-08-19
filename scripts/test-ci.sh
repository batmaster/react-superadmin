#!/bin/bash

echo "🧪 Testing CI Commands Locally"
echo "================================"

# Test dependency installation
echo "📦 Testing dependency installation..."
pnpm install
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Dependency installation failed"
    exit 1
fi

# Test linting
echo "🔍 Testing linting..."
pnpm lint
if [ $? -eq 0 ]; then
    echo "✅ Linting passed"
else
    echo "❌ Linting failed"
fi

# Test building
echo "🏗️  Testing build..."
pnpm build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
fi

# Test TypeScript check (if available)
if pnpm run type-check >/dev/null 2>&1; then
    echo "🔍 Testing TypeScript check..."
    pnpm type-check
    if [ $? -eq 0 ]; then
        echo "✅ TypeScript check passed"
    else
        echo "❌ TypeScript check failed"
    fi
fi

echo "================================"
echo "🎉 Local CI testing completed!"
