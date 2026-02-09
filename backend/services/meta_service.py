"""Meta Ads service for creating Shopping/Catalog Sales campaigns."""
from typing import Optional
from datetime import datetime
from schemas.plan import GeneratedPlan
from models.campaign import Platform, CampaignType, CampaignStatus
from config import settings
from utils.logger import get_logger

logger = get_logger(__name__)


class MetaService:
    """Service for Meta Ads Shopping/Catalog Sales campaign creation."""

    @staticmethod
    def create_campaign(plan: GeneratedPlan) -> dict:
        """
        Create a Meta Ads Shopping/Catalog Sales campaign.
        
        Returns a dictionary with campaign creation details.
        In mock mode, logs the request and returns a mock campaign ID.
        """
        # Calculate budget allocation (40% of total daily budget)
        daily_budget = plan.daily_budget * 0.4

        # Build campaign payload
        campaign_payload = {
            "campaign": {
                "name": f"Advantage+ Shopping - {plan.product_categories[0] if plan.product_categories else 'Products'}",
                "objective": "CATALOG_SALES",
                "status": "PAUSED",  # Start paused
                "special_ad_categories": [],
            },
            "adSet": {
                "name": f"Ad Set - {plan.product_categories[0] if plan.product_categories else 'Products'}",
                "billing_event": "IMPRESSIONS",
                "optimization_goal": "OFFSITE_CONVERSIONS",
                "bid_strategy": "LOWEST_COST_WITHOUT_CAP",
                "daily_budget": int(daily_budget * 100),  # Convert to cents
                "targeting": {
                    "geo_locations": {
                        "countries": plan.geo,
                    },
                    "age_min": 18,
                    "age_max": 65,
                    "genders": [1, 2],  # All genders
                    "publisher_platforms": ["facebook", "instagram"],
                    "device_platforms": ["mobile", "desktop"],
                },
                "promoted_object": {
                    "product_set_id": "default",  # Would use actual catalog product set
                },
            },
            "ad": {
                "name": f"Ad - {plan.product_categories[0] if plan.product_categories else 'Products'}",
                "creative": {
                    "object_story_spec": {
                        "page_id": "your_page_id",  # Placeholder
                        "link_data": {
                            "image_url": plan.creative_pack.image_urls[0] if plan.creative_pack.image_urls else None,
                            "message": plan.creative_pack.primary_texts[0] if plan.creative_pack.primary_texts else plan.creative_pack.descriptions[0],
                            "headline": plan.creative_pack.headlines[0],
                            "call_to_action": {
                                "type": "SHOP_NOW",
                            },
                        },
                    },
                },
                "status": "PAUSED",
            },
        }

        if settings.use_mock_mode or not settings.META_ACCESS_TOKEN:
            # Mock mode: log the request and return mock campaign ID
            logger.info(f"[MOCK] Meta Ads Campaign Creation Request:")
            logger.info(f"Campaign Name: {campaign_payload['campaign']['name']}")
            logger.info(f"Daily Budget: ${daily_budget:.2f}")
            logger.info(f"Objective: {campaign_payload['campaign']['objective']}")
            logger.info(f"Targeting: {campaign_payload['adSet']['targeting']}")
            
            # Return mock campaign ID
            mock_campaign_id = f"meta_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
            return {
                "platform": Platform.META.value,
                "campaign_type": CampaignType.SHOPPING.value,
                "name": campaign_payload["campaign"]["name"],
                "daily_budget": daily_budget,
                "platform_campaign_id": mock_campaign_id,
                "status": CampaignStatus.CREATED,
                "payload": campaign_payload,  # Include for debugging
            }
        else:
            # Real API call would go here
            logger.warning("Meta Ads API integration not yet implemented. Using mock mode.")
            return MetaService.create_campaign(plan)  # Recursive call with mock mode
