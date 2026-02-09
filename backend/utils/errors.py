"""Custom exception classes."""
from typing import Optional


class CampaignNotFoundError(Exception):
    """Raised when a campaign is not found."""
    def __init__(self, campaign_id: int):
        self.campaign_id = campaign_id
        super().__init__(f"Campaign with ID {campaign_id} not found")


class PlatformServiceError(Exception):
    """Raised when a platform service fails."""
    def __init__(self, platform: str, message: str):
        self.platform = platform
        self.message = message
        super().__init__(f"{platform} service error: {message}")


class PlanGenerationError(Exception):
    """Raised when plan generation fails."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(f"Plan generation error: {message}")
