"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

# Create FastAPI app
app = FastAPI(
    title="Coretas API",
    description="Dashboard-First Auto-Builder Backend API",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Health check endpoint."""
    return {"message": "Coretas API is running", "version": "0.1.0"}


@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "healthy"}
