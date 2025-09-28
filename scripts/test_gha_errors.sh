#!/bin/bash
# Test script for GitHub Actions Error Summarizer

set -euo pipefail

echo "🧪 Testing GitHub Actions Error Summarizer Setup"
echo "================================================"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository"
    exit 1
fi

# Check dependencies
echo "📋 Checking dependencies..."

if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI (gh) is installed"
    gh --version
else
    echo "❌ GitHub CLI (gh) is not installed"
    echo "   Install with: brew install gh (macOS) or apt install gh (Ubuntu)"
    exit 1
fi

if command -v jq &> /dev/null; then
    echo "✅ jq is installed"
    jq --version
else
    echo "❌ jq is not installed"
    echo "   Install with: brew install jq (macOS) or apt install jq (Ubuntu)"
    exit 1
fi

# Check GitHub CLI authentication
echo "🔐 Checking GitHub CLI authentication..."
if gh auth status &> /dev/null; then
    echo "✅ GitHub CLI is authenticated"
    gh auth status
else
    echo "❌ GitHub CLI is not authenticated"
    echo "   Run: gh auth login"
    exit 1
fi

# Check if the main script exists and is executable
if [[ -f "scripts/gha_errors.sh" ]]; then
    echo "✅ Main script exists"
    if [[ -x "scripts/gha_errors.sh" ]]; then
        echo "✅ Main script is executable"
    else
        echo "⚠️  Main script is not executable (this is normal on Windows)"
    fi
else
    echo "❌ Main script not found at scripts/gha_errors.sh"
    exit 1
fi

# Check if we can detect the repository
echo "🔍 Testing repository detection..."
if REPO=$(gh repo view --json owner,name 2>/dev/null | jq -r '.owner.login + "/" + .name'); then
    echo "✅ Repository detected: $REPO"
else
    echo "❌ Could not detect repository"
    echo "   Make sure you're in a git repository with GitHub remote"
    exit 1
fi

# Test GitHub API access
echo "🌐 Testing GitHub API access..."
if gh api "repos/$REPO" --jq '.name' &> /dev/null; then
    echo "✅ GitHub API access working"
else
    echo "❌ GitHub API access failed"
    echo "   Check your authentication and repository permissions"
    exit 1
fi

echo ""
echo "🎉 All tests passed! You can now run:"
echo "   ./scripts/gha_errors.sh"
echo ""
echo "Or with custom settings:"
echo "   LIMIT_RUNS=10 ./scripts/gha_errors.sh"
echo "   REPO=\"owner/repo\" ./scripts/gha_errors.sh"
