"""Campaign repository for data access operations."""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta
from models.campaign import Campaign, Platform, CampaignType, CampaignStatus
from models.metric import CampaignMetric


class CampaignRepository:
    """Repository for campaign data access operations."""

    def __init__(self, db: Session):
        """Initialize repository with database session."""
        self.db = db

    def create(
        self,
        name: str,
        platform: Platform,
        campaign_type: CampaignType,
        objective: str,
        daily_budget: float,
        product_categories: List[str],
        platform_campaign_id: Optional[str] = None,
        status: CampaignStatus = CampaignStatus.CREATED,
    ) -> Campaign:
        """Create a new campaign."""
        campaign = Campaign(
            name=name,
            platform=platform,
            campaign_type=campaign_type,
            status=status,
            objective=objective,
            daily_budget=daily_budget,
            product_categories=product_categories,
            platform_campaign_id=platform_campaign_id,
        )
        self.db.add(campaign)
        self.db.commit()
        self.db.refresh(campaign)
        return campaign

    def get_all(
        self,
        platform: Optional[Platform] = None,
        status: Optional[CampaignStatus] = None,
    ) -> List[Campaign]:
        """Get all campaigns with optional filters."""
        query = self.db.query(Campaign)
        
        if platform:
            query = query.filter(Campaign.platform == platform)
        if status:
            query = query.filter(Campaign.status == status)
        
        return query.order_by(Campaign.created_at.desc()).all()

    def get_by_id(self, campaign_id: int) -> Optional[Campaign]:
        """Get a campaign by ID."""
        return self.db.query(Campaign).filter(Campaign.id == campaign_id).first()

    def get_with_metrics(
        self,
        days: int = 7,
        platform: Optional[Platform] = None,
        status: Optional[CampaignStatus] = None,
    ) -> List[dict]:
        """
        Get campaigns with aggregated metrics for the last N days.
        Returns list of dictionaries with campaign data and aggregated metrics.
        """
        from sqlalchemy import func, case
        
        # Base query for campaigns
        query = self.db.query(Campaign)
        
        if platform:
            query = query.filter(Campaign.platform == platform)
        if status:
            query = query.filter(Campaign.status == status)
        
        campaigns = query.order_by(Campaign.created_at.desc()).all()
        
        # Calculate date range
        end_date = datetime.utcnow().date()
        start_date = end_date - timedelta(days=days)
        
        # For each campaign, aggregate metrics
        result = []
        for campaign in campaigns:
            # Get metrics for this campaign within date range
            metrics_query = self.db.query(
                func.sum(CampaignMetric.spend).label('total_spend'),
                func.sum(CampaignMetric.impressions).label('total_impressions'),
                func.sum(CampaignMetric.clicks).label('total_clicks'),
                func.sum(CampaignMetric.conversions).label('total_conversions'),
                func.sum(CampaignMetric.conversion_value).label('total_conversion_value'),
            ).filter(
                and_(
                    CampaignMetric.campaign_id == campaign.id,
                    CampaignMetric.date >= start_date,
                    CampaignMetric.date <= end_date,
                )
            )
            
            metrics = metrics_query.first()
            
            # Calculate CTR and ROAS
            total_impressions = metrics.total_impressions or 0
            total_clicks = metrics.total_clicks or 0
            total_spend = float(metrics.total_spend or 0)
            total_conversion_value = float(metrics.total_conversion_value or 0)
            
            ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0.0
            roas = (total_conversion_value / total_spend) if total_spend > 0 else 0.0
            
            result.append({
                "id": campaign.id,
                "name": campaign.name,
                "platform": campaign.platform.value,
                "type": campaign.campaign_type.value,
                "status": campaign.status.value,
                "objective": campaign.objective,
                "dailyBudget": str(campaign.daily_budget),
                "productCategories": campaign.product_categories,
                "createdAt": campaign.created_at.isoformat() if campaign.created_at else None,
                "totalSpend": total_spend,
                "totalImpressions": metrics.total_impressions or 0,
                "totalClicks": metrics.total_clicks or 0,
                "totalConversions": metrics.total_conversions or 0,
                "totalConversionValue": total_conversion_value,
                "ctr": round(ctr, 2),
                "roas": round(roas, 2),
            })
        
        return result

    def update_status(
        self,
        campaign_id: int,
        status: CampaignStatus,
    ) -> Optional[Campaign]:
        """Update campaign status."""
        campaign = self.get_by_id(campaign_id)
        if campaign:
            campaign.status = status
            campaign.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(campaign)
        return campaign

    def update_platform_campaign_id(
        self,
        campaign_id: int,
        platform_campaign_id: str,
    ) -> Optional[Campaign]:
        """Update platform campaign ID after creation."""
        campaign = self.get_by_id(campaign_id)
        if campaign:
            campaign.platform_campaign_id = platform_campaign_id
            campaign.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(campaign)
        return campaign
