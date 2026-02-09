"""Plan generation service for creating platform-agnostic media plans."""
from typing import List
from schemas.plan import PlanInput, GeneratedPlan, CreativePack, TargetingHints


class PlanService:
    """Service for generating media plans from user input."""

    @staticmethod
    def generate_plan(input_data: PlanInput) -> GeneratedPlan:
        """
        Generate a platform-agnostic media plan from user input.
        
        This creates a plan that can be mapped to Google, Meta, and Amazon campaigns.
        """
        # Parse product categories
        categories = input_data.get_categories_list()
        if not categories:
            categories = ["Products"]  # Fallback

        # Set default geo and language
        geo = [input_data.country or "US"]
        lang = [input_data.language or "en"]

        # Generate creative pack based on categories
        creative_pack = PlanService._generate_creatives(categories, input_data.objective)

        # Generate targeting hints
        targeting_hints = PlanService._generate_targeting_hints(categories, input_data.objective)

        # Determine bidding strategy based on objective
        bidding_strategy = (
            "maximize_conversion_value" if input_data.objective.lower() == "sales"
            else "maximize_conversions"
        )

        return GeneratedPlan(
            objective=input_data.objective,
            daily_budget=input_data.dailyBudget,
            geo=geo,
            lang=lang,
            product_categories=categories,
            creative_pack=creative_pack,
            targeting_hints=targeting_hints,
            bidding_strategy=bidding_strategy,
        )

    @staticmethod
    def _generate_creatives(categories: List[str], objective: str) -> CreativePack:
        """Generate creative assets based on categories and objective."""
        first_category = categories[0] if categories else "Products"
        
        # Generate headlines
        headlines = [
            f"Best {first_category} Deals",
            f"Shop Top {first_category} Brands",
            f"Limited Time {first_category} Offers",
            f"Premium {first_category} Collection",
        ]

        # Generate descriptions
        descriptions = [
            f"Free shipping on all orders over $50. Shop now!",
            f"Discover the best selection of high-quality {first_category.lower()}.",
            f"Get the latest {first_category.lower()} at unbeatable prices.",
        ]

        # Generate primary texts (for Meta)
        primary_texts = [
            f"Explore our curated collection of {first_category.lower()}.",
            f"Find everything you need for {first_category.lower()}.",
        ]

        # Generate callouts
        callouts = [
            "Free returns",
            "Fast shipping",
            "Secure checkout",
            "24/7 support",
        ]

        # Generate image URLs (placeholder for now)
        image_urls = [
            f"https://placehold.co/600x400/2563eb/white?text={first_category.replace(' ', '+')}+Hero",
            f"https://placehold.co/600x400/16a34a/white?text={first_category.replace(' ', '+')}+Lifestyle",
        ]

        return CreativePack(
            headlines=headlines[:3],  # Limit to 3 for most platforms
            descriptions=descriptions[:2],  # Limit to 2
            image_urls=image_urls,
            primary_texts=primary_texts,
            callouts=callouts,
            logo_url="https://placehold.co/200x200/000000/white?text=Logo",
        )

    @staticmethod
    def _generate_targeting_hints(categories: List[str], objective: str) -> TargetingHints:
        """Generate targeting hints based on categories."""
        keywords = []
        audiences = []

        # Generate keywords from categories
        for category in categories:
            keywords.extend([
                f"{category} reviews",
                f"buy {category.lower()}",
                f"best {category.lower()}",
                f"{category.lower()} deals",
            ])

        # Generate audience hints
        if objective.lower() == "sales":
            audiences = [
                "Shoppers",
                "Online buyers",
                "Deal seekers",
            ]
        else:  # Leads
            audiences = [
                "Interested prospects",
                "Engaged users",
                "Potential customers",
            ]

        # Add category-specific audiences
        for category in categories[:2]:  # Limit to first 2 categories
            audiences.append(f"{category} enthusiasts")

        return TargetingHints(
            keywords=keywords[:10],  # Limit keywords
            audiences=audiences,
            placements=["shopping surfaces", "search results", "display networks"],
        )
