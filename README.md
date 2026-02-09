# Coretas Dashboard-First Auto-Builder

A mini application for managing multi-platform advertising campaigns with automated plan generation.

## Project Structure

```
.
├── backend/          # FastAPI backend
├── frontend/         # React frontend
└── README.md         # This file
```

## Quick Start

### Backend Setup

```bash
cd backend

# Install dependencies (requires uv)
uv sync

# Set up environment
cp .env.example .env

# Run migrations
uv run alembic upgrade head

# Start server
uv run uvicorn app:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Features

- **Unified Dashboard**: View all campaigns across Google Ads, Meta Ads, and Amazon Ads
- **Auto Plan Generation**: Generate media plans with minimal input (objective, budget, categories)
- **Multi-Platform Campaign Creation**: Automatically create campaigns on all three platforms
- **Performance Metrics**: Track spend, impressions, clicks, CTR, and conversion value
- **Real-time Updates**: Dashboard updates automatically when campaigns are created

## API Endpoints

- `GET /api/campaigns` - List campaigns with metrics
- `POST /api/plans/generate` - Generate media plan
- `POST /api/campaigns/execute` - Create campaigns from plan

See `backend/README.md` for detailed API documentation.

## Technology Stack

### Backend
- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- uv (package manager)

### Frontend
- React
- TypeScript
- Vite
- TanStack Query
- Tailwind CSS
- shadcn/ui

## Development

### Backend
- Uses `uv` for fast dependency management
- SQLite database (can be changed via `DATABASE_URL`)
- Alembic for database migrations

### Frontend
- Vite for fast development
- React Query for data fetching
- Proxy configured to backend API

## Environment Variables

### Backend (`backend/.env`)
- `DATABASE_URL` - Database connection string
- `FRONTEND_URL` - Frontend URL for CORS
- Platform API keys (optional - mock mode if not provided)

### Frontend
- `VITE_API_URL` - Backend API URL (default: `http://localhost:8000`)

## Platform Integration

Currently runs in **mock mode** by default. Platform API integrations are structured and ready for implementation when API keys are provided.

Mock mode:
- Logs intended API requests
- Returns mock campaign IDs
- Generates realistic test data

## Database

SQLite database is created automatically on first run. To reset:

```bash
cd backend
rm coretas.db
uv run alembic upgrade head
```

## License

MIT
