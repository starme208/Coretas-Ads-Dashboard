"""Configuration management for the application."""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)


class Settings:
    """Application settings loaded from environment variables."""
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./coretas.db")
    
    # Platform API Keys (optional)
    GOOGLE_ADS_API_KEY: str = os.getenv("GOOGLE_ADS_API_KEY", "")
    GOOGLE_ADS_CUSTOMER_ID: str = os.getenv("GOOGLE_ADS_CUSTOMER_ID", "")
    META_ACCESS_TOKEN: str = os.getenv("META_ACCESS_TOKEN", "")
    META_AD_ACCOUNT_ID: str = os.getenv("META_AD_ACCOUNT_ID", "")
    AMAZON_CLIENT_ID: str = os.getenv("AMAZON_CLIENT_ID", "")
    AMAZON_CLIENT_SECRET: str = os.getenv("AMAZON_CLIENT_SECRET", "")
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Server
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")


settings = Settings()
