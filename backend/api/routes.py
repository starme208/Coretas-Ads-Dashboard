"""API routes for campaigns and plans."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from repositories import CampaignRepository, MetricRepository
from services import PlanService, CampaignExecutionService
from schemas import (
    PlanInput,
    GeneratedPlan,
    CampaignWithMetricsResponse,
    CampaignCreateResponse,
    CampaignResponse,
)

router = APIRouter(prefix="/api", tags=["campaigns"])


@router.get("/campaigns", response_model=List[CampaignWithMetricsResponse])
def get_campaigns(
    platform: Optional[str] = Query(None, description="Filter by platform (google, meta, amazon)"),
    status: Optional[str] = Query(None, description="Filter by status"),
    days: int = Query(7, ge=1, le=90, description="Number of days for metrics aggregation"),
    db: Session = Depends(get_db),
):
    """
    Get all campaigns with aggregated metrics.
    
    Returns campaigns with performance metrics aggregated over the specified number of days.
    """
    from models.campaign import Platform, CampaignStatus
    
    # Parse filters
    platform_enum = None
    if platform:
        try:
            platform_enum = Platform[platform.upper()]
        except KeyError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid platform: {platform}. Must be one of: google, meta, amazon"
            )
    
    status_enum = None
    if status:
        try:
            status_enum = CampaignStatus[status.upper()]
        except KeyError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status: {status}. Must be one of: created, pending, active, failed"
            )
    
    # Get campaigns with metrics
    campaign_repo = CampaignRepository(db)
    campaigns_data = campaign_repo.get_with_metrics(
        days=days,
        platform=platform_enum,
        status=status_enum,
    )
    
    return campaigns_data


@router.post("/plans/generate", response_model=GeneratedPlan)
def generate_plan(
    plan_input: PlanInput,
):
    """
    Generate a platform-agnostic media plan from user input.
    
    Takes campaign objective, budget, and product categories and generates
    a complete media plan with creatives and targeting hints.
    """
    try:
        plan = PlanService.generate_plan(plan_input)
        return plan
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate plan: {str(e)}"
        )


@router.post("/campaigns/execute", response_model=CampaignCreateResponse, status_code=201)
def execute_plan(
    plan: GeneratedPlan,
    db: Session = Depends(get_db),
):
    """
    Execute a media plan by creating campaigns across all platforms.
    
    Creates campaigns on Google Ads, Meta Ads, and Amazon Ads based on the plan.
    Returns the created campaigns and any errors encountered.
    """
    try:
        execution_service = CampaignExecutionService(db)
        created_campaigns, errors = execution_service.execute_plan(plan)
        
        if not created_campaigns:
            raise HTTPException(
                status_code=500,
                detail="Failed to create any campaigns. All platforms failed."
            )
        
        # Build response message
        message = f"Successfully created {len(created_campaigns)} campaign(s)"
        if errors:
            message += f". {len(errors)} platform(s) failed: {', '.join(errors)}"
        
        return CampaignCreateResponse(
            message=message,
            campaigns=created_campaigns,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to execute plan: {str(e)}"
        )


@router.get("/metrics")
def get_metrics(
    campaign_id: Optional[int] = Query(None, description="Filter by campaign ID"),
    days: int = Query(7, ge=1, le=90, description="Number of days to retrieve"),
    db: Session = Depends(get_db),
):
    """
    Get campaign metrics.
    
    Returns metrics for all campaigns or a specific campaign if campaign_id is provided.
    """
    metric_repo = MetricRepository(db)
    
    if campaign_id:
        # Get metrics for specific campaign
        from datetime import datetime, timedelta
        end_date = datetime.utcnow().date()
        start_date = end_date - timedelta(days=days)
        
        metrics = metric_repo.get_by_campaign(
            campaign_id=campaign_id,
            start_date=start_date,
            end_date=end_date,
        )
        
        return [
            {
                "id": m.id,
                "campaign_id": m.campaign_id,
                "date": m.date.isoformat(),
                "spend": float(m.spend),
                "impressions": m.impressions,
                "clicks": m.clicks,
                "conversions": m.conversions,
                "conversion_value": float(m.conversion_value) if m.conversion_value else None,
                "currency": m.currency,
            }
            for m in metrics
        ]
    else:
        # Get aggregated metrics for all campaigns
        from repositories import CampaignRepository
        from datetime import datetime, timedelta
        
        campaign_repo = CampaignRepository(db)
        campaigns = campaign_repo.get_all()
        
        end_date = datetime.utcnow().date()
        start_date = end_date - timedelta(days=days)
        
        result = []
        for campaign in campaigns:
            aggregated = metric_repo.aggregate_metrics(
                campaign_id=campaign.id,
                start_date=start_date,
                end_date=end_date,
            )
            result.append({
                "campaign_id": campaign.id,
                "campaign_name": campaign.name,
                **aggregated,
            })
        
        return result
