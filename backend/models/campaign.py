"""Campaign database model."""
from sqlalchemy import Column, Integer, String, Numeric, JSON, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from database import Base


class Platform(str, enum.Enum):
    """Supported advertising platforms."""
    GOOGLE = "google"
    META = "meta"
    AMAZON = "amazon"


class CampaignType(str, enum.Enum):
    """Campaign types per platform."""
    PMAX = "pmax"  # Google Performance Max
    SHOPPING = "shopping"  # Meta Shopping/Catalog Sales
    SPONSORED_BRANDS = "sponsored_brands"  # Amazon Sponsored Brands


class CampaignStatus(str, enum.Enum):
    """Campaign status."""
    CREATED = "created"
    PENDING = "pending"
    ACTIVE = "active"
    FAILED = "failed"


class Campaign(Base):
    """Campaign model representing a campaign across platforms."""
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    platform = Column(Enum(Platform), nullable=False, index=True)
    campaign_type = Column(Enum(CampaignType), nullable=False)
    status = Column(Enum(CampaignStatus), nullable=False, default=CampaignStatus.CREATED)
    objective = Column(String, nullable=False)  # "Sales" or "Leads"
    daily_budget = Column(Numeric(10, 2), nullable=False)
    product_categories = Column(JSON, nullable=False)  # Array of strings
    platform_campaign_id = Column(String, nullable=True)  # External platform ID
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationship to metrics
    metrics = relationship("CampaignMetric", back_populates="campaign", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Campaign(id={self.id}, name='{self.name}', platform='{self.platform.value}')>"
