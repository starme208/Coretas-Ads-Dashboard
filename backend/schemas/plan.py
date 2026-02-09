"""Pydantic schemas for plan generation."""
from typing import List, Optional
from pydantic import BaseModel, Field


class PlanInput(BaseModel):
    """Input schema for generating a media plan."""
    objective: str = Field(..., description="Campaign objective: Sales or Leads")
    dailyBudget: float = Field(..., gt=0, description="Daily budget in USD")
    productCategories: str = Field(..., description="Comma-separated product categories")
    country: Optional[str] = Field(None, description="Target country code (e.g., US)")
    language: Optional[str] = Field(None, description="Target language code (e.g., en)")

    def get_categories_list(self) -> List[str]:
        """Parse product categories string into list."""
        return [cat.strip() for cat in self.productCategories.split(",") if cat.strip()]


class CreativePack(BaseModel):
    """Creative assets for campaigns."""
    headlines: List[str] = Field(..., min_items=1, description="Headline variations")
    descriptions: List[str] = Field(..., min_items=1, description="Description variations")
    image_urls: List[str] = Field(default_factory=list, description="Image URLs")
    long_headlines: List[str] = Field(default_factory=list, description="Long headline variations")
    primary_texts: List[str] = Field(default_factory=list, description="Primary text variations")
    callouts: List[str] = Field(default_factory=list, description="Callout text")
    logo_url: Optional[str] = Field(None, description="Logo URL")


class TargetingHints(BaseModel):
    """Targeting hints for campaign optimization."""
    keywords: List[str] = Field(default_factory=list, description="Target keywords")
    audiences: List[str] = Field(default_factory=list, description="Target audiences")
    placements: List[str] = Field(default_factory=list, description="Placement hints")


class GeneratedPlan(BaseModel):
    """Generated platform-agnostic media plan."""
    objective: str
    daily_budget: float
    geo: List[str] = Field(default_factory=list, description="Target geographies")
    lang: List[str] = Field(default_factory=list, description="Target languages")
    product_categories: List[str]
    creative_pack: CreativePack
    targeting_hints: TargetingHints
    bidding_strategy: str

    class Config:
        json_schema_extra = {
            "example": {
                "objective": "Sales",
                "daily_budget": 150.0,
                "geo": ["US"],
                "lang": ["en"],
                "product_categories": ["running shoes", "trail gear"],
                "creative_pack": {
                    "headlines": ["Best Running Shoes Deals", "Shop Top Brands"],
                    "descriptions": ["Free shipping on all orders over $50"],
                    "image_urls": ["https://example.com/image1.jpg"],
                },
                "targeting_hints": {
                    "keywords": ["trail shoes", "running gear"],
                    "audiences": ["runners", "outdoor enthusiasts"],
                },
                "bidding_strategy": "maximize_conversion_value",
            }
        }
