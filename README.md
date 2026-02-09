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

### Prerequisites

- [just](https://github.com/casey/just) - Command runner (install with `npm install -g just-install` or via package manager)
- [uv](https://github.com/astral-sh/uv) - Python package manager  
- [Node.js](https://nodejs.org/) - For frontend development

### Quick Setup (Recommended)

```bash
# Install all dependencies and setup environment
just setup

# Start backend (in one terminal)
just dev-backend

# Start frontend (in another terminal)
just dev-frontend
```

Backend: `http://localhost:8000`  
Frontend: `http://localhost:5173`

> **Note**: On Windows, run `dev-backend` and `dev-frontend` in separate PowerShell/CMD windows.

### Available Commands (just)

Run `just` or `just --list` to see all available commands:

- `just setup` - Full project setup (install deps + env + migrate)
- `just dev` - Run both backend and frontend
- `just dev-backend` - Run backend only
- `just dev-frontend` - Run frontend only
- `just migrate` - Run database migrations
- `just build` - Build frontend for production
- `just clean` - Clean build artifacts
- `just status` - Show project status
- `just docs` - Open API documentation

See `justfile` for complete list of commands.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Dashboard                               │
│                    (React Frontend)                             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐         │
│  │ Campaign List│   │ Create Modal │   │   Metrics    │         │
│  │   & Filters  │   │  (Minimal    │   │   Cards      │         │
│  │              │   │   Input)     │   │              │         │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘         │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API (FastAPI)                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ GET /api/campaigns                                       │   │
│  │ POST /api/plans/generate                                 │   │
│  │ POST /api/campaigns/execute                              │   │
│  │ GET /api/metrics                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────┬──────────────────┬──────────────────┬─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Planner                                 │
│                      (PlanService)                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Input: Objective + Budget + Categories                    │  │
│  │ Output: Platform-agnostic plan with:                      │  │
│  │   - Creative Pack (headlines, descriptions, images)       │  │
│  │   - Targeting Hints (keywords, audiences)                 │  │
│  │   - Bidding Strategy                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────┬───────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Platform Mappers                             │
│  ┌──────────────┐   ┌──────────────┐   ┌───────────────┐        │
│  │   Google     │   │     Meta     │   │    Amazon     │        │
│  │   Service    │   │   Service    │   │   Service     │        │
│  │              │   │              │   │               │        │
│  │ Performance  │   │  Shopping/   │   │   Sponsored   │        │
│  │    Max       │   │ Catalog Sales│   │    Brands     │        │
│  └──────┬───────┘   └──────┬───────┘   └──────┬────────┘        │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          │ (Mock Mode)      │ (Mock Mode)      │ (Mock Mode)
          ▼                  ▼                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Reporting                                   │
│                 (MetricRepository)                               │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ - Aggregate metrics (spend, impressions, clicks)         │    │
│  │ - Calculate CTR, ROAS                                    │    │
│  │ - Store daily campaign performance                       │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────┬────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Database (SQLite)                            │
│  ┌──────────────┐              ┌──────────────┐                 │
│  │  Campaigns   │              │   Metrics    │                 │
│  │   Table      │◄─────────────┤   Table      │                 │
│  └──────────────┘              └──────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

## Deliverables

### Git Repository

This repository contains a fully runnable application with:
- Complete backend API (FastAPI)
- Complete frontend dashboard (React + TypeScript)
- Database migrations (Alembic)
- Automated setup scripts (`justfile`)
- Comprehensive documentation

### Setup, Environment Variables, and Run Instructions

See [Quick Start](#quick-start) section above for setup instructions.

#### Environment Variables

**Backend (`backend/.env`):**
- `DATABASE_URL` - Database connection string (default: `sqlite:///./coretas.db`)
- `FRONTEND_URL` - Frontend URL for CORS (default: `http://localhost:5173`)
- `GOOGLE_ADS_API_KEY` - Google Ads API key (optional, defaults to mock mode)
- `GOOGLE_ADS_CUSTOMER_ID` - Google Ads customer ID (optional)
- `META_ACCESS_TOKEN` - Meta Ads API access token (optional, defaults to mock mode)
- `META_AD_ACCOUNT_ID` - Meta Ads account ID (optional)
- `AMAZON_CLIENT_ID` - Amazon Ads API client ID (optional, defaults to mock mode)
- `AMAZON_CLIENT_SECRET` - Amazon Ads API client secret (optional)
- `ENVIRONMENT` - Environment name (default: `development`)

**Frontend:**
- `VITE_API_URL` - Backend API URL (default: `http://localhost:8000`)

### API Calls: Real vs Mocked

**All platform API calls are currently MOCKED** by default. The application runs in mock mode when API keys are not provided.

#### Mock Mode Behavior

When running in mock mode (default):
- **Google Ads**: Logs campaign creation request with payload details, returns mock campaign ID (`google_YYYYMMDDHHMMSS`)
- **Meta Ads**: Logs campaign creation request with payload details, returns mock campaign ID (`meta_YYYYMMDDHHMMSS`)
- **Amazon Ads**: Logs campaign creation request with payload details, returns mock campaign ID (`amazon_YYYYMMDDHHMMSS`)

All mock responses:
- Return realistic campaign IDs
- Store campaigns in the local database
- Generate mock metrics for testing
- Log intended API requests to console

#### Real API Integration

The code structure is ready for real API integration. To enable real API calls:

1. Set the appropriate API keys in `backend/.env`
2. Implement the actual API client calls in:
   - `backend/services/google_service.py` (line 81-85)
   - `backend/services/meta_service.py` (line 92-95)
   - `backend/services/amazon_service.py` (line 88-91)

Currently, even with API keys set, the services will log a warning and fall back to mock mode, as the real API client implementations are not yet complete.

### Creative Generation Approach

**Approach: Rule-Based (Template-Based)**

Creative generation uses a **rule-based template system** rather than prompt-based AI generation. The `PlanService._generate_creatives()` method:

1. **Takes input**: Product categories and campaign objective
2. **Applies templates**: Uses predefined templates with category names inserted
3. **Generates variants**: Creates multiple headlines, descriptions, and callouts

#### Headlines Generation
- Template: `"Best {category} Deals"`, `"Shop Top {category} Brands"`, etc.
- Category-aware: Uses the first product category from user input
- Generates 3-4 headline variants

#### Descriptions Generation
- Template: `"Free shipping on all orders over $50. Shop now!"`
- Category-aware: `"Discover the best selection of high-quality {category}."`
- Generates 2-3 description variants

#### Primary Texts (Meta-specific)
- Template: `"Explore our curated collection of {category}."`
- Generates 2 variants for Meta Ads

#### Callouts
- Static list: "Free returns", "Fast shipping", "Secure checkout", "24/7 support"
- Not category-specific

#### Images
- Placeholder URLs using `placehold.co` service
- Category name embedded in image URL text

**Why Rule-Based?**
- Fast and deterministic
- No external API dependencies
- Predictable output
- Easy to customize templates
- Suitable for MVP/demo purposes

**Future Enhancement**: Could be upgraded to prompt-based AI generation using OpenAI/Anthropic APIs for more creative and contextual copy.

### Endpoints Used Per Platform

#### Google Ads (Performance Max)

**Campaign Creation Endpoint** (Mocked):
- **Intended Endpoint**: Google Ads API `/customers/{customerId}/campaigns:mutate`
- **Campaign Type**: Performance Max (`PERFORMANCE_MAX`)
- **Budget Allocation**: 40% of total daily budget
- **Bidding Strategy**: `MAXIMIZE_CONVERSION_VALUE` (for sales objective) or `MAXIMIZE_CONVERSIONS`
- **Assets**: Up to 15 headlines, 4 descriptions, 20 images, logo
- **Targeting**: Geo targets, language targets, audience targets

**Current Status**: Mocked - logs payload and returns mock campaign ID

#### Meta Ads (Shopping/Catalog Sales)

**Campaign Creation Endpoint** (Mocked):
- **Intended Endpoint**: Meta Marketing API `/act_{adAccountId}/campaigns`
- **Campaign Type**: Catalog Sales (`CATALOG_SALES`)
- **Budget Allocation**: 40% of total daily budget
- **Bidding Strategy**: `LOWEST_COST_WITHOUT_CAP`
- **Optimization Goal**: `OFFSITE_CONVERSIONS`
- **Targeting**: Countries, age (18-65), genders (all), platforms (Facebook, Instagram)
- **Creative**: Image, headline, primary text, call-to-action

**Current Status**: Mocked - logs payload and returns mock campaign ID

#### Amazon Ads (Sponsored Brands)

**Campaign Creation Endpoint** (Mocked):
- **Intended Endpoint**: Amazon Advertising API `/sb/campaigns`
- **Campaign Type**: Sponsored Brands (`SPONSORED_BRANDS`)
- **Budget Allocation**: 20% of total daily budget
- **Bidding Strategy**: `dynamicDownOnly` (Dynamic bids - down only)
- **Targeting**: Manual keyword targeting (broad match)
- **Creative**: Brand name, headline, logo, landing page URL

**Current Status**: Mocked - logs payload and returns mock campaign ID

### Architecture Diagram

See [Architecture Diagram](#architecture-diagram) section above for a visual representation of the system architecture showing the flow from Dashboard → Planner → Platform Mappers → Reporting.

## Acceptance Criteria

### ✅ User can enter Objective + Budget + Categories, generate a plan, and run Create All

**Implementation:**
- **Minimal Input Modal**: Located at `frontend/src/features/campaigns/components/CreateCampaignModal.tsx`
- **Input Fields**: 
  - Objective (dropdown: Sales, Leads, Awareness)
  - Daily Budget (number input)
  - Product Categories (comma-separated text input)
- **Plan Generation**: `POST /api/plans/generate` endpoint calls `PlanService.generate_plan()`
- **Create All**: `POST /api/campaigns/execute` endpoint creates campaigns on all three platforms (Google, Meta, Amazon)
- **User Flow**: User fills form → clicks "Generate Plan" → reviews plan → clicks "Create All" → campaigns created

### ✅ Dashboard displays three campaigns (one per platform) with the five metrics visible

**Implementation:**
- **Dashboard**: `frontend/src/pages/Dashboard.tsx`
- **Campaign Table**: Displays all campaigns with columns:
  - Campaign Name
  - Platform (Google, Meta, Amazon)
  - Type (Performance Max, Shopping, Sponsored Brands)
  - Status
  - **Spend** (metric)
  - **Impressions** (metric)
  - **Clicks** (metric)
  - **CTR** (metric)
  - **Conversion Value** (metric)
- **Metrics Aggregation**: `GET /api/campaigns` endpoint aggregates metrics over last 7 days (configurable)
- **Five Metrics**: Spend, Impressions, Clicks, CTR (calculated), Conversion Value

### ✅ Generated creatives and copy are coherent and aligned with input categories

**Implementation:**
- **Category Integration**: `PlanService._generate_creatives()` uses the first product category from user input
- **Coherent Copy**: 
  - Headlines include category name: `"Best {category} Deals"`, `"Shop Top {category} Brands"`
  - Descriptions reference category: `"Discover the best selection of high-quality {category}"`
  - Primary texts are category-aware: `"Explore our curated collection of {category}"`
- **Alignment**: All creative assets (headlines, descriptions, images) consistently reference the input categories
- **Example**: If user enters "Electronics, Laptops", headlines will be "Best Electronics Deals", "Shop Top Electronics Brands", etc.


## Assumptions

1. **No OAuth Required**: The application uses API keys, sandbox tokens, or mocked credentials. No OAuth flow is implemented.

2. **Mock Mode Default**: The application runs in mock mode by default for demonstration purposes. Real API integrations require API keys and implementation of actual API clients.

3. **Budget Allocation**: 
   - Google Ads: 40% of total daily budget
   - Meta Ads: 40% of total daily budget
   - Amazon Ads: 20% of total daily budget

4. **Campaign Status**: All campaigns are created in `PAUSED` or `DRAFT` status to allow manual review before activation.

5. **Single Country/Language**: The MVP supports single country and language selection. Multi-country/language campaigns would require additional UI and backend logic.

6. **Product Categories**: Categories are entered as comma-separated text. The first category is used for creative generation.

7. **Metrics**: Metrics are generated as mock data for demonstration. Real metrics would require:
   - Platform API integration for metric retrieval
   - Scheduled jobs to sync metrics
   - Webhook handlers for real-time updates

8. **Image Assets**: Uses placeholder image URLs. Production would require:
   - Image upload/storage service
   - Image optimization
   - Platform-specific image requirements validation

9. **Landing Pages**: All campaigns use placeholder landing page URLs (`https://example.com/products`). Production would require actual landing page URLs.

10. **Database**: Uses SQLite for simplicity. Production would use PostgreSQL or similar.

## Sandbox Limitations

1. **No Real Campaign Creation**: All platform API calls are mocked. Campaigns are not actually created on Google Ads, Meta Ads, or Amazon Ads platforms.

2. **No Real Metrics**: Metrics are generated as mock data. Real performance data is not retrieved from platform APIs.

3. **No Real-Time Updates**: Campaign status and metrics do not update in real-time from platform APIs. Changes require manual database updates or re-running mock data generation.

4. **Limited Platform Features**: Only basic campaign creation features are implemented:
   - Google: Performance Max campaigns only
   - Meta: Catalog Sales campaigns only
   - Amazon: Sponsored Brands campaigns only
   - No support for other campaign types or advanced targeting options

5. **No Error Handling for Platform APIs**: Since APIs are mocked, real-world error scenarios (rate limits, invalid credentials, API changes) are not handled.

6. **No Campaign Management**: Once created, campaigns cannot be:
   - Edited
   - Paused/activated
   - Deleted
   - Budget adjusted
   - Targeting modified

7. **No Creative Asset Management**: Image URLs are placeholders. No actual image upload, storage, or management.

8. **No A/B Testing**: No support for testing multiple creative variants or targeting strategies.

9. **No Reporting Exports**: Metrics cannot be exported to CSV, PDF, or other formats.

10. **No User Authentication**: The application does not implement user authentication or multi-tenancy.

## Features

- **Unified Dashboard**: View all campaigns across Google Ads, Meta Ads, and Amazon Ads
- **Auto Plan Generation**: Generate media plans with minimal input (objective, budget, categories)
- **Multi-Platform Campaign Creation**: Automatically create campaigns on all three platforms
- **Performance Metrics**: Track spend, impressions, clicks, CTR, and conversion value
- **Real-time Updates**: Dashboard updates automatically when campaigns are created
- **Responsive Design**: Dashboard adapts to mobile, tablet, and desktop screens
- **Filtering & Search**: Filter campaigns by platform, type, and search by name

## API Endpoints

### Campaigns

- `GET /api/campaigns` - List campaigns with aggregated metrics
  - Query params: `platform`, `campaign_type`, `status`, `days` (default: 7)
- `POST /api/campaigns/execute` - Create campaigns from plan (creates on all platforms)

### Plans

- `POST /api/plans/generate` - Generate platform-agnostic media plan
  - Body: `{ objective, dailyBudget, categories, country?, language? }`

### Metrics

- `GET /api/metrics` - Get campaign metrics
  - Query params: `campaign_id` (optional), `days` (default: 7)

See `backend/README.md` for detailed API documentation.

## Technology Stack

### Backend
- FastAPI - Modern Python web framework
- SQLAlchemy - ORM for database operations
- Alembic - Database migrations
- Pydantic - Data validation and serialization
- uv - Fast Python package manager

### Frontend
- React 18 - UI library
- TypeScript - Type safety
- Vite - Build tool and dev server
- TanStack Query - Data fetching and caching
- Tailwind CSS - Utility-first CSS framework
- shadcn/ui - Component library
- Wouter - Lightweight router
- Framer Motion - Animation library

## Development

### Backend
- Uses `uv` for fast dependency management
- SQLite database (can be changed via `DATABASE_URL`)
- Alembic for database migrations
- Structured logging with Python's logging module

### Frontend
- Vite for fast development and HMR
- React Query for data fetching and caching
- Proxy configured to backend API in `vite.config.ts`
- Component-based architecture with feature folders

## Database

SQLite database (`coretas.db`) is created automatically on first run. 

**Schema:**
- `campaigns` table: Stores campaign information (name, platform, type, budget, status)
- `campaign_metrics` table: Stores daily performance metrics (spend, impressions, clicks, conversions, conversion_value)

**To reset database:**
```bash
cd backend
rm coretas.db
uv run alembic upgrade head
```

Or use: `just reset-db`