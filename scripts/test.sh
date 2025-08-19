#!/bin/bash

# React SuperAdmin Test Runner
# This script provides an easy way to run tests for the framework

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if package exists
check_package() {
    if [ ! -d "packages/$1" ]; then
        print_error "Package '$1' not found!"
        exit 1
    fi
}

# Function to run tests for a specific package
run_package_tests() {
    local package=$1
    local args=${2:-""}
    
    print_status "Running tests for $package package..."
    
    cd "packages/$package"
    
    if [ -z "$args" ]; then
        pnpm test
    else
        pnpm test $args
    fi
    
    cd ../..
    print_success "Tests completed for $package package"
}

# Function to show help
show_help() {
    echo "React SuperAdmin Test Runner"
    echo ""
    echo "Usage: ./scripts/test.sh [OPTIONS] [PACKAGE]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -w, --watch         Run tests in watch mode"
    echo "  -c, --coverage      Generate coverage reports"
    echo "  -v, --verbose       Run tests with verbose output"
    echo "  -p, --pattern       Run tests matching pattern"
    echo ""
    echo "Packages:"
    echo "  core                Run tests for core package only"
    echo "  web                 Run tests for web package only"
    echo "  all                 Run tests for all packages (default)"
    echo ""
    echo "Examples:"
    echo "  ./scripts/test.sh                    # Run all tests"
    echo "  ./scripts/test.sh core               # Run core package tests"
    echo "  ./scripts/test.sh -w web            # Run web tests in watch mode"
    echo "  ./scripts/test.sh -c                 # Generate coverage for all"
    echo "  ./scripts/test.sh -p \"createResource\" # Run tests matching pattern"
}

# Parse command line arguments
WATCH_MODE=false
COVERAGE_MODE=false
VERBOSE_MODE=false
TEST_PATTERN=""
PACKAGE="all"

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -w|--watch)
            WATCH_MODE=true
            shift
            ;;
        -c|--coverage)
            COVERAGE_MODE=true
            shift
            ;;
        -v|--verbose)
            VERBOSE_MODE=true
            shift
            ;;
        -p|--pattern)
            TEST_PATTERN="$2"
            shift 2
            ;;
        core|web|all)
            PACKAGE="$1"
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Build arguments string
ARGS=""
if [ "$WATCH_MODE" = true ]; then
    ARGS="$ARGS --watch"
fi

if [ "$COVERAGE_MODE" = true ]; then
    ARGS="$ARGS --coverage"
fi

if [ "$VERBOSE_MODE" = true ]; then
    ARGS="$ARGS --verbose"
fi

if [ -n "$TEST_PATTERN" ]; then
    ARGS="$ARGS --testNamePattern=\"$TEST_PATTERN\""
fi

# Main execution
print_status "Starting React SuperAdmin test suite..."

case $PACKAGE in
    core)
        check_package "core"
        run_package_tests "core" "$ARGS"
        ;;
    web)
        check_package "web"
        run_package_tests "web" "$ARGS"
        ;;
    all)
        print_status "Running tests for all packages..."
        
        # Run core tests
        if [ -d "packages/core" ]; then
            run_package_tests "core" "$ARGS"
        fi
        
        # Run web tests
        if [ -d "packages/web" ]; then
            run_package_tests "web" "$ARGS"
        fi
        
        print_success "All tests completed!"
        ;;
    *)
        print_error "Invalid package: $PACKAGE"
        exit 1
        ;;
esac

print_success "Test execution completed successfully!"
