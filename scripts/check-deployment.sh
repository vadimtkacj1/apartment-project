#!/bin/bash
# Deployment Check Script
# Проверяет готовность проекта к развертыванию

set -e

echo "🔍 Checking deployment readiness..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((CHECKS_PASSED++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((CHECKS_FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((CHECKS_WARNING++))
}

echo "📦 Local Environment Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    check_pass "Node.js installed: $NODE_VERSION"
else
    check_fail "Node.js not found"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    check_pass "npm installed: $NPM_VERSION"
else
    check_fail "npm not found"
fi

# Check package.json
if [ -f "package.json" ]; then
    check_pass "package.json exists"
else
    check_fail "package.json not found"
fi

# Check node_modules
if [ -d "node_modules" ]; then
    check_pass "node_modules directory exists"
else
    check_warn "node_modules not found - run 'npm install'"
fi

echo ""
echo "⚙️  Configuration Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check next.config.ts
if [ -f "next.config.ts" ]; then
    if grep -q "output.*standalone" next.config.ts; then
        check_pass "next.config.ts has standalone output"
    else
        check_fail "next.config.ts missing 'output: standalone'"
    fi
else
    check_fail "next.config.ts not found"
fi

# Check GitHub Actions workflow
if [ -f ".github/workflows/deploy.yml" ]; then
    check_pass "GitHub Actions workflow exists"
else
    check_warn "GitHub Actions workflow not found"
fi

# Check scripts
if [ -f "scripts/setup-server.sh" ]; then
    check_pass "Server setup script exists"
else
    check_warn "Server setup script not found"
fi

if [ -f "scripts/deploy-manual.sh" ]; then
    check_pass "Manual deploy script exists"
else
    check_warn "Manual deploy script not found"
fi

echo ""
echo "🔨 Build Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Try to build
if [ -d "node_modules" ]; then
    echo "Running build test..."
    if npm run build > /tmp/build.log 2>&1; then
        check_pass "Build successful"

        # Check standalone output
        if [ -d ".next/standalone" ]; then
            check_pass "Standalone build created"

            if [ -f ".next/standalone/server.js" ]; then
                check_pass "server.js exists in standalone build"
            else
                check_fail "server.js not found in standalone build"
            fi
        else
            check_fail "Standalone build directory not created"
        fi
    else
        check_fail "Build failed - check /tmp/build.log"
        cat /tmp/build.log
    fi
else
    check_warn "Skipping build test (no node_modules)"
fi

echo ""
echo "🔐 GitHub Secrets Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_warn "Cannot verify GitHub Secrets from local - please check manually:"
echo "   Required secrets:"
echo "   - SSH_HOST"
echo "   - SSH_USER"
echo "   - SSH_PRIVATE_KEY"
echo "   - DEPLOYMENT_URL (optional)"

echo ""
echo "📋 Git Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d ".git" ]; then
    check_pass "Git repository initialized"

    # Check remote
    if git remote -v | grep -q "origin"; then
        REMOTE_URL=$(git remote get-url origin)
        check_pass "Git remote configured: $REMOTE_URL"
    else
        check_warn "No git remote 'origin' configured"
    fi

    # Check current branch
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
        check_pass "On deployment branch: $CURRENT_BRANCH"
    else
        check_warn "Current branch: $CURRENT_BRANCH (deploy triggers on main/master)"
    fi
else
    check_fail "Not a git repository"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Passed:${NC}   $CHECKS_PASSED"
echo -e "${YELLOW}Warnings:${NC} $CHECKS_WARNING"
echo -e "${RED}Failed:${NC}   $CHECKS_FAILED"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Ready for deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Ensure GitHub Secrets are configured"
    echo "2. Push to main/master or manually trigger workflow"
    echo "3. Or use: SSH_HOST=your-server ./scripts/deploy-manual.sh"
    exit 0
else
    echo -e "${RED}✗ Please fix the issues above before deploying${NC}"
    exit 1
fi
