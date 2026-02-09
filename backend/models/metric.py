"""Campaign metric database model."""
from sqlalchemy import Column, Integer, Numeric, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class CampaignMetric(Base):
    """Campaign metric model for storing daily performance data."""
    __tablename__ = "campaign_metrics"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    spend = Column(Numeric(10, 2), nullable=False, default=0.00)
    impressions = Column(Integer, nullable=False, default=0)
    clicks = Column(Integer, nullable=False, default=0)
    conversions = Column(Integer, nullable=True)
    conversion_value = Column(Numeric(10, 2), nullable=True)
    currency = Column(String(3), nullable=False, default="USD")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationship to campaign
    campaign = relationship("Campaign", back_populates="metrics")

    def __repr__(self):
        return f"<CampaignMetric(id={self.id}, campaign_id={self.campaign_id}, date={self.date})>"
