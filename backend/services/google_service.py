"""Google Ads service for creating Performance Max campaigns."""
from typing import Optional
from datetime import datetime
from schemas.plan import GeneratedPlan
from models.campaign import Platform, CampaignType, CampaignStatus
from config import settings
from utils.logger import get_logger

logger = get_logger(__name__)


class GoogleService:
    """Service for Google Ads Performance Max campaign creation."""

    @staticmethod
    def create_campaign(plan: GeneratedPlan) -> dict:
        """
        Create a Google Ads Performance Max campaign.
        
        Returns a dictionary with campaign creation details.
        In mock mode, logs the request and returns a mock campaign ID.
        """
        # Calculate budget allocation (40% of total daily budget)
        daily_budget = plan.daily_budget * 0.4

        # Build campaign payload
        campaign_payload = {
            "campaign": {
                "name": f"PMax - {plan.product_categories[0] if plan.product_categories else 'Products'} - {datetime.utcnow().strftime('%Y-%m-%d')}",
                "advertisingChannelType": "PERFORMANCE_MAX",
                "status": "PAUSED",  # Start paused, activate manually
                "campaignBudget": {
                    "amountMicros": int(daily_budget * 1_000_000),  # Convert to micros
                    "deliveryMethod": "STANDARD",
                },
                "biddingStrategy": {
                    "type": "MAXIMIZE_CONVERSION_VALUE" if plan.bidding_strategy == "maximize_conversion_value" else "MAXIMIZE_CONVERSIONS",
                },
                "startDate": datetime.utcnow().strftime("%Y-%m-%d"),
                "endDate": None,  # No end date
            },
            "assetGroup": {
                "name": f"Asset Group - {plan.product_categories[0] if plan.product_categories else 'Products'}",
                "headlines": plan.creative_pack.headlines[:15],  # PMax supports up to 15 headlines
                "descriptions": plan.creative_pack.descriptions[:4],  # PMax supports up to 4 descriptions
                "images": [
                    {"url": url, "type": "IMAGE"}
                    for url in plan.creative_pack.image_urls[:20]  # PMax supports up to 20 images
                ],
                "logo": {"url": plan.creative_pack.logo_url} if plan.creative_pack.logo_url else None,
                "finalUrls": ["https://example.com/products"],  # Placeholder URL
            },
            "targeting": {
                "geoTargets": plan.geo,
                "languageTargets": plan.lang,
                "audienceTargets": plan.targeting_hints.audiences[:10],
            },
            "keywords": plan.targeting_hints.keywords[:10],
        }

        if settings.use_mock_mode or not settings.GOOGLE_ADS_API_KEY:
            # Mock mode: log the request and return mock campaign ID
            logger.info(f"[MOCK] Google Ads Campaign Creation Request:")
            logger.info(f"Campaign Name: {campaign_payload['campaign']['name']}")
            logger.info(f"Daily Budget: ${daily_budget:.2f}")
            logger.info(f"Bidding Strategy: {plan.bidding_strategy}")
            logger.info(f"Headlines: {len(campaign_payload['assetGroup']['headlines'])}")
            logger.info(f"Descriptions: {len(campaign_payload['assetGroup']['descriptions'])}")
            
            # Return mock campaign ID
            mock_campaign_id = f"google_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
            return {
                "platform": Platform.GOOGLE.value,
                "campaign_type": CampaignType.PMAX.value,
                "name": campaign_payload["campaign"]["name"],
                "daily_budget": daily_budget,
                "platform_campaign_id": mock_campaign_id,
                "status": CampaignStatus.CREATED,
                "payload": campaign_payload,  # Include for debugging
            }
        else:
            # Real API call would go here
            # For now, we'll still use mock mode
            logger.warning("Google Ads API integration not yet implemented. Using mock mode.")
            return GoogleService.create_campaign(plan)  # Recursive call with mock mode
