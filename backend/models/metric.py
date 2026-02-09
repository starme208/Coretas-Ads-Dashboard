"""Campaign metrics database model."""
from datetime import date, datetime
from sqlalchemy import Column, Integer, Numeric, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class CampaignMetric(Base):
    """Campaign metrics model for daily performance data."""
    __tablename__ = "campaign_metrics"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    spend = Column(Numeric(10, 2), nullable=False, default=0.0)
    impressions = Column(Integer, nullable=False, default=0)
    clicks = Column(Integer, nullable=False, default=0)
    conversions = Column(Integer, nullable=True, default=0)
    conversion_value = Column(Numeric(10, 2), nullable=True, default=0.0)
    currency = Column(String(3), nullable=False, default="USD")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationship to campaign
    campaign = relationship("Campaign", back_populates="metrics")

    def __repr__(self):
        return f"<CampaignMetric(id={self.id}, campaign_id={self.campaign_id}, date={self.date})>"
