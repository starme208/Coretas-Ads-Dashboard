# Coretas Project Automation
# Install just: https://github.com/casey/just

# Default recipe - show available commands
default:
    @just --list

# ============================================
# Setup & Installation
# ============================================

# Install all dependencies (backend + frontend)
install:
    @echo "📦 Installing all dependencies..."
    just install-backend
    just install-frontend

# Install backend dependencies
install-backend:
    @echo "🐍 Installing backend dependencies..."
    cd backend && uv sync

# Install frontend dependencies
install-frontend:
    @echo "📱 Installing frontend dependencies..."
    cd frontend && npm install

# Setup environment files
setup-env:
    @echo "⚙️  Setting up environment files..."
    @if [ ! -f backend/.env ]; then \
        cp backend/.env.example backend/.env && \
        echo "✅ Created backend/.env"; \
    else \
        echo "⚠️  backend/.env already exists"; \
    fi

# Full project setup
setup: install setup-env
    @echo "🚀 Running database migrations..."
    just migrate
    @echo "✅ Setup complete!"

# ============================================
# Development Servers
# ============================================

# Run backend server
dev-backend:
    @echo "🔧 Starting backend server..."
    @cd backend && uv run uvicorn app:app --reload --port 8000

# Run frontend dev server
dev-frontend:
    @echo "🎨 Starting frontend dev server..."
    cd frontend && npm run dev

    # ============================================
# Database
# ============================================

# Run database migrations
migrate:
    @echo "🗄️  Running database migrations..."
    cd backend && uv run alembic upgrade head

# Create a new migration
migrate-create MESSAGE:
    @echo "📝 Creating migration: {{MESSAGE}}"
    cd backend && uv run alembic revision --autogenerate -m "{{MESSAGE}}"

# Reset database (WARNING: deletes all data)
reset-db:
    @echo "⚠️  Resetting database..."
    @cd backend && \
    if [ -f coretas.db ]; then \
        rm -f coretas.db && \
        echo "✅ Database deleted"; \
    else \
        echo "⚠️  Database file not found"; \
    fi
    just migrate
    @echo "✅ Database reset complete"

# ============================================
# Building
# ============================================

# Build frontend for production
build-frontend:
    @echo "🏗️  Building frontend..."
    cd frontend && npm run build

# Build everything
build: build-frontend
    @echo "✅ Build complete!"

# ============================================
# Testing & Quality
# ============================================

# Type check frontend
check-frontend:
    @echo "🔍 Type checking frontend..."
    cd frontend && npm run check

# Lint backend (if configured)
lint-backend:
    @echo "🔍 Linting backend..."
    cd backend && uv run ruff check . || echo "⚠️  Ruff not installed, skipping..."

# Format backend code
format-backend:
    @echo "✨ Formatting backend..."
    cd backend && uv run ruff format . || echo "⚠️  Ruff not installed, skipping..."

# ============================================
# Cleanup
# ============================================

# Clean build artifacts
clean:
    @echo "🧹 Cleaning build artifacts..."
    rm -rf frontend/dist
    rm -rf frontend/node_modules/.vite
    @echo "✅ Clean complete"

# Clean everything including dependencies
clean-all: clean
    @echo "🧹 Cleaning dependencies..."
    @rm -rf frontend/node_modules
    @rm -rf backend/.venv
    @rm -rf backend/__pycache__
    @find backend -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
    @find backend -type f -name "*.pyc" -delete 2>/dev/null || true
    @echo "✅ Deep clean complete"

# ============================================
# Database Inspection
# ============================================

# Show database info
db-info:
    @echo "📊 Database Information:"
    @if [ -f backend/coretas.db ]; then \
        echo "  Database file: backend/coretas.db" && \
        if command -v du >/dev/null 2>&1; then \
            echo "  Size: $$(du -h backend/coretas.db | cut -f1)"; \
        fi; \
    else \
        echo "  ⚠️  Database file not found"; \
    fi

# ============================================
# Utility Commands
# ============================================

# Show project status
status:
    @echo "📊 Project Status:"
    @echo ""
    @echo "Backend:"
    @cd backend && uv --version 2>/dev/null && echo "  ✅ uv installed" || echo "  ❌ uv not installed"
    @echo ""
    @echo "Frontend:"
    @cd frontend && npm --version >/dev/null 2>&1 && echo "  ✅ npm installed" || echo "  ❌ npm not installed"
    @echo ""
    @just db-info

# Open backend API docs
docs:
    @echo "📚 Opening API documentation..."
    @echo "Backend API docs: http://localhost:8000/docs"
    @echo "Backend API redoc: http://localhost:8000/redoc"
    @if command -v open >/dev/null 2>&1; then \
        open http://localhost:8000/docs; \
    elif command -v xdg-open >/dev/null 2>&1; then \
        xdg-open http://localhost:8000/docs; \
    else \
        echo "Please open http://localhost:8000/docs in your browser"; \
    fi

# Show logs (tail backend logs if available)
logs:
    @echo "📋 Recent logs:"
    @if [ -f backend/logs/app.log ]; then \
        tail -n 50 backend/logs/app.log; \
    else \
        echo "No log file found at backend/logs/app.log"; \
    fi

# ============================================
# Production
# ============================================

# Run production backend
prod-backend:
    @echo "🚀 Starting production backend..."
    @cd backend && uv run uvicorn app:app --host 0.0.0.0 --port 8000

# Preview production build
preview:
    @echo "👀 Previewing production build..."
    just build-frontend
    cd frontend && npm run preview
