#!/bin/bash

# React SuperAdmin Documentation Validation Script
# This script validates that documentation builds correctly

set -e

echo "📚 React SuperAdmin Documentation Validation"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "docs" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm is not installed. Please install it first."
    exit 1
fi

echo "📦 Checking dependencies..."
pnpm install

echo ""
echo "🔍 Validating documentation structure..."
if [ ! -f "docs/docusaurus.config.ts" ]; then
    echo "❌ Error: Docusaurus config not found"
    exit 1
fi

if [ ! -f "docs/package.json" ]; then
    echo "❌ Error: Docs package.json not found"
    exit 1
fi

echo "✅ Documentation structure looks good"

echo ""
echo "🏗️  Building documentation..."
if pnpm docs:build; then
    echo "✅ Documentation build successful!"
    
    # Check if build output exists
    if [ -d "docs/build" ]; then
        echo "✅ Build output directory created"
        
        # Check for essential files
        if [ -f "docs/build/index.html" ]; then
            echo "✅ Main HTML file generated"
        else
            echo "⚠️  Warning: Main HTML file not found"
        fi
        
        if [ -d "docs/build/static" ]; then
            echo "✅ Static assets directory created"
        else
            echo "⚠️  Warning: Static assets directory not found"
        fi
        
    else
        echo "❌ Error: Build output directory not found"
        exit 1
    fi
    
else
    echo "❌ Documentation build failed!"
    echo ""
    echo "🔍 Common issues to check:"
    echo "1. Docusaurus dependencies are installed"
    echo "2. All markdown files are properly formatted"
    echo "3. No syntax errors in configuration files"
    echo "4. All referenced files exist"
    echo ""
    echo "Try running: pnpm docs:build --verbose"
    exit 1
fi

echo ""
echo "🧹 Cleaning up build artifacts..."
rm -rf docs/build

echo ""
echo "🎉 Documentation validation completed successfully!"
echo "Your docs are ready to build and deploy!" 