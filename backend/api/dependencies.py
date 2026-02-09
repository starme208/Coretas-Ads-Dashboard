"""API dependencies for dependency injection."""
from typing import Generator
from sqlalchemy.orm import Session
from database import get_db
from repositories import CampaignRepository, MetricRepository


def get_campaign_repository(db: Session = None) -> Generator[CampaignRepository, None, None]:
    """Dependency for getting campaign repository."""
    if db is None:
        db_gen = get_db()
        db = next(db_gen)
    
    yield CampaignRepository(db)


def get_metric_repository(db: Session = None) -> Generator[MetricRepository, None, None]:
    """Dependency for getting metric repository."""
    if db is None:
        db_gen = get_db()
        db = next(db_gen)
    
    yield MetricRepository(db)
