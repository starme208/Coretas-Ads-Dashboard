"""Campaign execution service for creating campaigns across all platforms."""
import logging
from typing import List, Tuple
from sqlalchemy.orm import Session
from schemas.plan import GeneratedPlan
from models.campaign import Platform, CampaignType, CampaignStatus
from repositories import CampaignRepository, MetricRepository
from services.google_service import GoogleService
from services.meta_service import MetaService
from services.amazon_service import AmazonService

logger = logging.getLogger(__name__)


class CampaignExecutionService:
    """Service for executing plans and creating campaigns across platforms."""

    def __init__(self, db: Session):
        """Initialize service with database session."""
        self.db = db
        self.campaign_repo = CampaignRepository(db)
        self.metric_repo = MetricRepository(db)

    def execute_plan(self, plan: GeneratedPlan) -> Tuple[List[dict], List[str]]:
        """
        Execute a plan by creating campaigns across all platforms.
        
        Returns:
            Tuple of (created_campaigns, errors)
            - created_campaigns: List of successfully created campaign dictionaries
            - errors: List of error messages for failed platforms
        """
        created_campaigns = []
        errors = []

        # Create campaigns for each platform
        platforms = [
            ("google", GoogleService, Platform.GOOGLE, CampaignType.PMAX),
            ("meta", MetaService, Platform.META, CampaignType.SHOPPING),
            ("amazon", AmazonService, Platform.AMAZON, CampaignType.SPONSORED_BRANDS),
        ]

        for platform_name, service_class, platform_enum, campaign_type_enum in platforms:
            try:
                logger.info(f"Creating {platform_name} campaign...")
                
                # Create campaign via platform service
                platform_result = service_class.create_campaign(plan)
                
                # Save to database
                campaign = self.campaign_repo.create(
                    name=platform_result["name"],
                    platform=platform_enum,
                    campaign_type=campaign_type_enum,
                    objective=plan.objective,
                    daily_budget=platform_result["daily_budget"],
                    product_categories=plan.product_categories,
                    platform_campaign_id=platform_result.get("platform_campaign_id"),
                    status=CampaignStatus.CREATED,
                )
                
                # Generate initial mock metrics
                self.metric_repo.generate_mock_metrics(campaign.id, days=7)
                
                # Convert to response format
                campaign_dict = {
                    "id": campaign.id,
                    "name": campaign.name,
                    "platform": campaign.platform.value,
                    "type": campaign.campaign_type.value,
                    "status": campaign.status.value,
                    "objective": campaign.objective,
                    "dailyBudget": str(campaign.daily_budget),
                    "productCategories": campaign.product_categories,
                    "createdAt": campaign.created_at.isoformat() if campaign.created_at else None,
                }
                
                created_campaigns.append(campaign_dict)
                logger.info(f"Successfully created {platform_name} campaign: {campaign.id}")
                
            except Exception as e:
                error_msg = f"Failed to create {platform_name} campaign: {str(e)}"
                logger.error(error_msg, exc_info=True)
                errors.append(error_msg)
                # Continue with other platforms even if one fails

        return created_campaigns, errors
