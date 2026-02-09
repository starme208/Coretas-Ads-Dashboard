"""Pydantic schemas for campaigns."""
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel


class CampaignResponse(BaseModel):
    """Campaign response schema matching frontend."""
    id: int
    name: str
    platform: str
    type: str
    status: str
    objective: str
    dailyBudget: str
    productCategories: List[str]
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True


class CampaignWithMetricsResponse(BaseModel):
    """Campaign with aggregated metrics response schema."""
    id: int
    name: str
    platform: str
    type: str
    status: str
    objective: str
    dailyBudget: str
    productCategories: List[str]
    createdAt: Optional[str] = None
    totalSpend: float
    totalImpressions: int
    totalClicks: int
    totalConversions: int
    totalConversionValue: float
    ctr: float
    roas: float

    class Config:
        from_attributes = True


class CampaignCreateResponse(BaseModel):
    """Response schema for campaign creation."""
    message: str
    campaigns: List[CampaignResponse]
