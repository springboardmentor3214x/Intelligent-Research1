from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db, get_current_user_optional, require_roles
from app.models.user import User, UserRole
from app.schemas.common import ApiResponse
from app.schemas.dashboard import (
    ResearcherDashboardResponse,
    StartupDashboardResponse,
    InnovationManagerDashboardResponse,
    AdminDashboardResponse,
    UnifiedDashboardOverviewResponse,
)
from app.services.dashboard_service import DashboardService

router = APIRouter()


@router.get(
    "/overview",
    response_model=ApiResponse[UnifiedDashboardOverviewResponse],
    status_code=status.HTTP_200_OK,
    summary="Unified Role-Based Dashboard Overview",
    description="Returns consolidated intelligence tailored to user's RBAC role (Researcher, Startup Founder, Innovation Manager, or Administrator). Supports dynamic view switching."
)
async def get_dashboard_overview(
    view: Optional[str] = Query(None, description="Optional view override: researcher | startup | innovation_manager | admin"),
    domain: Optional[str] = Query(None, description="Optional technology domain focus"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    result = await DashboardService.get_unified_overview(
        user=current_user,
        requested_view=view,
        domain=domain,
        db=db,
    )
    return ApiResponse(
        data=result,
        message=f"Retrieved {result.current_dashboard_view.replace('_', ' ').title()} Dashboard for {result.user_name}"
    )


@router.get(
    "/researcher",
    response_model=ApiResponse[ResearcherDashboardResponse],
    status_code=status.HTTP_200_OK,
    summary="Researcher Analytics Dashboard",
    description="Returns personalized funding recommendations, publication trends, patent insights, and explainable 5-pillar Innovation Score (TRL 1-9)."
)
async def get_researcher_dashboard(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    result = await DashboardService.get_researcher_dashboard(user=current_user, db=db)
    return ApiResponse(
        data=result,
        message=f"Retrieved Researcher Dashboard for {result.user_name}"
    )


@router.get(
    "/startup",
    response_model=ApiResponse[StartupDashboardResponse],
    status_code=status.HTTP_200_OK,
    summary="Startup Founder Commercialization Dashboard",
    description="Returns venture funding opportunities, technology whitespace analysis, competitor patent intelligence, and commercialization pathways."
)
async def get_startup_dashboard(
    domain: Optional[str] = Query("Artificial Intelligence", description="Technology domain focus"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    result = await DashboardService.get_startup_dashboard(user=current_user, domain=domain, db=db)
    return ApiResponse(
        data=result,
        message=f"Retrieved Startup Dashboard for {result.user_name} ({domain})"
    )


@router.get(
    "/innovation-manager",
    response_model=ApiResponse[InnovationManagerDashboardResponse],
    status_code=status.HTTP_200_OK,
    summary="Innovation Manager Portfolio Dashboard",
    description="Returns multi-project portfolio matrix, 5-stage innovation pipeline tracking, technology trend monitoring, and domain funding analytics."
)
async def get_innovation_manager_dashboard(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    result = await DashboardService.get_innovation_manager_dashboard(user=current_user, db=db)
    return ApiResponse(
        data=result,
        message=f"Retrieved Innovation Manager Dashboard for {result.user_name}"
    )


@router.get(
    "/admin",
    response_model=ApiResponse[AdminDashboardResponse],
    status_code=status.HTTP_200_OK,
    summary="Administrator Platform Governance Dashboard",
    description="Returns platform-wide user role telemetry, entity counts, recommendation execution metrics, and microservice health.",
    dependencies=[Depends(require_roles([UserRole.ADMINISTRATOR]))]
)
async def get_admin_dashboard(
    current_user: User = Depends(require_roles([UserRole.ADMINISTRATOR])),
    db: AsyncSession = Depends(get_db),
):
    result = await DashboardService.get_admin_dashboard(user=current_user, db=db)
    return ApiResponse(
        data=result,
        message="Retrieved Platform Administration Governance Dashboard"
    )
