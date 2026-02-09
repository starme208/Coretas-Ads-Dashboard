"""Amazon Ads service for creating Sponsored Brands campaigns."""
from typing import Optional
from datetime import datetime
from schemas.plan import GeneratedPlan
from models.campaign import Platform, CampaignType, CampaignStatus
from config import settings
from utils.logger import get_logger

logger = get_logger(__name__)


class AmazonService:
    """Service for Amazon Ads Sponsored Brands campaign creation."""

    @staticmethod
    def create_campaign(plan: GeneratedPlan) -> dict:
        """
        Create an Amazon Ads Sponsored Brands campaign.
        
        Returns a dictionary with campaign creation details.
        In mock mode, logs the request and returns a mock campaign ID.
        """
        # Calculate budget allocation (20% of total daily budget)
        daily_budget = plan.daily_budget * 0.2

        # Build campaign payload
        campaign_payload = {
            "campaign": {
                "name": f"SB - {plan.product_categories[0] if plan.product_categories else 'Products'}",
                "campaignType": "SPONSORED_BRANDS",
                "targetingType": "MANUAL",
                "state": "draft",  # Start as draft
                "dailyBudget": {
                    "amount": daily_budget,
                    "currencyCode": "USD",
                },
                "startDate": datetime.utcnow().strftime("%Y-%m-%d"),
                "endDate": None,  # No end date
                "bidding": {
                    "strategy": "dynamicDownOnly",  # Dynamic bids - down only
                },
            },
            "adGroup": {
                "name": f"Ad Group - {plan.product_categories[0] if plan.product_categories else 'Products'}",
                "defaultBid": {
                    "amount": daily_budget / 10,  # Default bid is 10% of daily budget
                    "currencyCode": "USD",
                },
                "keywords": [
                    {
                        "keywordText": keyword,
                        "matchType": "broad",  # broad, phrase, exact
                    }
                    for keyword in plan.targeting_hints.keywords[:10]
                ],
            },
            "creative": {
                "brandName": plan.product_categories[0] if plan.product_categories else "Brand",
                "headline": plan.creative_pack.headlines[0],
                "logo": {
                    "imageUrl": plan.creative_pack.logo_url or plan.creative_pack.image_urls[0] if plan.creative_pack.image_urls else None,
                },
                "landingPage": {
                    "url": "https://example.com/products",  # Placeholder URL
                },
            },
        }

        if settings.use_mock_mode or not settings.AMAZON_CLIENT_ID:
            # Mock mode: log the request and return mock campaign ID
            logger.info(f"[MOCK] Amazon Ads Campaign Creation Request:")
            logger.info(f"Campaign Name: {campaign_payload['campaign']['name']}")
            logger.info(f"Daily Budget: ${daily_budget:.2f}")
            logger.info(f"Campaign Type: {campaign_payload['campaign']['campaignType']}")
            logger.info(f"Keywords: {len(campaign_payload['adGroup']['keywords'])}")
            
            # Return mock campaign ID
            mock_campaign_id = f"amazon_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
            return {
                "platform": Platform.AMAZON.value,
                "campaign_type": CampaignType.SPONSORED_BRANDS.value,
                "name": campaign_payload["campaign"]["name"],
                "daily_budget": daily_budget,
                "platform_campaign_id": mock_campaign_id,
                "status": CampaignStatus.CREATED,
                "payload": campaign_payload,  # Include for debugging
            }
        else:
            # Real API call would go here
            logger.warning("Amazon Ads API integration not yet implemented. Using mock mode.")
            return AmazonService.create_campaign(plan)  # Recursive call with mock mode
