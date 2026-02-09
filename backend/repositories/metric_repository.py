"""Campaign metrics repository for data access operations."""
from typing import List, Optional
from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from models.metric import CampaignMetric
from models.campaign import Campaign


class MetricRepository:
    """Repository for campaign metrics data access operations."""

    def __init__(self, db: Session):
        """Initialize repository with database session."""
        self.db = db

    def create(
        self,
        campaign_id: int,
        metric_date: date,
        spend: float = 0.0,
        impressions: int = 0,
        clicks: int = 0,
        conversions: Optional[int] = None,
        conversion_value: Optional[float] = None,
        currency: str = "USD",
    ) -> CampaignMetric:
        """Create a new metric record."""
        metric = CampaignMetric(
            campaign_id=campaign_id,
            date=metric_date,
            spend=spend,
            impressions=impressions,
            clicks=clicks,
            conversions=conversions,
            conversion_value=conversion_value,
            currency=currency,
        )
        self.db.add(metric)
        self.db.commit()
        self.db.refresh(metric)
        return metric

    def get_by_campaign(
        self,
        campaign_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> List[CampaignMetric]:
        """Get metrics for a specific campaign within date range."""
        query = self.db.query(CampaignMetric).filter(
            CampaignMetric.campaign_id == campaign_id
        )
        
        if start_date:
            query = query.filter(CampaignMetric.date >= start_date)
        if end_date:
            query = query.filter(CampaignMetric.date <= end_date)
        
        return query.order_by(CampaignMetric.date.desc()).all()

    def aggregate_metrics(
        self,
        campaign_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> dict:
        """
        Aggregate metrics for a campaign within date range.
        Returns dictionary with aggregated values and calculated metrics.
        """
        query = self.db.query(
            func.sum(CampaignMetric.spend).label('total_spend'),
            func.sum(CampaignMetric.impressions).label('total_impressions'),
            func.sum(CampaignMetric.clicks).label('total_clicks'),
            func.sum(CampaignMetric.conversions).label('total_conversions'),
            func.sum(CampaignMetric.conversion_value).label('total_conversion_value'),
        ).filter(CampaignMetric.campaign_id == campaign_id)
        
        if start_date:
            query = query.filter(CampaignMetric.date >= start_date)
        if end_date:
            query = query.filter(CampaignMetric.date <= end_date)
        
        result = query.first()
        
        total_impressions = result.total_impressions or 0
        total_clicks = result.total_clicks or 0
        total_spend = float(result.total_spend or 0)
        total_conversions = result.total_conversions or 0
        total_conversion_value = float(result.total_conversion_value or 0)
        
        # Calculate CTR and ROAS
        ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0.0
        roas = (total_conversion_value / total_spend) if total_spend > 0 else 0.0
        
        return {
            "total_spend": total_spend,
            "total_impressions": total_impressions,
            "total_clicks": total_clicks,
            "total_conversions": total_conversions,
            "total_conversion_value": total_conversion_value,
            "ctr": round(ctr, 2),
            "roas": round(roas, 2),
        }

    def create_bulk(
        self,
        metrics: List[dict],
    ) -> List[CampaignMetric]:
        """Create multiple metric records in bulk."""
        metric_objects = [
            CampaignMetric(
                campaign_id=m["campaign_id"],
                date=m["date"],
                spend=m.get("spend", 0.0),
                impressions=m.get("impressions", 0),
                clicks=m.get("clicks", 0),
                conversions=m.get("conversions"),
                conversion_value=m.get("conversion_value"),
                currency=m.get("currency", "USD"),
            )
            for m in metrics
        ]
        self.db.bulk_save_objects(metric_objects)
        self.db.commit()
        return metric_objects

    def generate_mock_metrics(
        self,
        campaign_id: int,
        days: int = 7,
    ) -> List[CampaignMetric]:
        """
        Generate mock metrics for a campaign for the last N days.
        Used for initial campaign setup when real metrics are not available.
        """
        import random
        from decimal import Decimal
        
        metrics = []
        end_date = datetime.utcnow().date()
        
        for i in range(days):
            metric_date = end_date - timedelta(days=i)
            
            # Generate realistic mock data
            impressions = random.randint(500, 5000)
            ctr = random.uniform(0.01, 0.06)  # 1-6% CTR
            clicks = int(impressions * ctr)
            spend = Decimal(random.uniform(0.5, 2.0) * clicks).quantize(Decimal('0.01'))
            conversions = int(clicks * random.uniform(0.0, 0.1))  # 0-10% conversion rate
            conversion_value = Decimal(conversions * random.uniform(20, 70)).quantize(Decimal('0.01')) if conversions > 0 else Decimal('0.00')
            
            metric = CampaignMetric(
                campaign_id=campaign_id,
                date=metric_date,
                spend=spend,
                impressions=impressions,
                clicks=clicks,
                conversions=conversions if conversions > 0 else None,
                conversion_value=conversion_value if conversion_value > 0 else None,
                currency="USD",
            )
            metrics.append(metric)
        
        self.db.bulk_save_objects(metrics)
        self.db.commit()
        return metrics
