"""Campaign database model."""
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, Numeric, JSON, DateTime, Enum
from sqlalchemy.orm import relationship
from database import Base


class Platform(PyEnum):
    """Supported advertising platforms."""
    GOOGLE = "google"
    META = "meta"
    AMAZON = "amazon"


class CampaignType(PyEnum):
    """Campaign types per platform."""
    PMAX = "pmax"  # Google Performance Max
    SHOPPING = "shopping"  # Meta Shopping/Catalog Sales
    SPONSORED_BRANDS = "sponsored_brands"  # Amazon Sponsored Brands


class CampaignStatus(PyEnum):
    """Campaign status."""
    CREATED = "created"
    PENDING = "pending"
    ACTIVE = "active"
    FAILED = "failed"


class Campaign(Base):
    """Campaign model."""
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    platform = Column(Enum(Platform), nullable=False, index=True)
    campaign_type = Column(Enum(CampaignType), nullable=False)
    status = Column(Enum(CampaignStatus), nullable=False, default=CampaignStatus.CREATED, index=True)
    objective = Column(String, nullable=False)
    daily_budget = Column(Numeric(10, 2), nullable=False)
    product_categories = Column(JSON, nullable=False)  # Array of strings
    platform_campaign_id = Column(String, nullable=True)  # External platform campaign ID
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationship to metrics
    metrics = relationship("CampaignMetric", back_populates="campaign", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Campaign(id={self.id}, name='{self.name}', platform={self.platform.value})>"
