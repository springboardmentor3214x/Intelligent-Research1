from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.models.user import UserRole


# =====================================================================
# 1. Researcher Dashboard Schemas
# =====================================================================

class ResearcherFundingItem(BaseModel):
    id: int
    title: str
    funding_agency: str
    funding_amount: Optional[float] = None
    application_deadline: Optional[str] = None
    match_score: float
    status: str
    domains: List[str] = []
    eligibility_summary: Optional[str] = None


class TrendDataPoint(BaseModel):
    year: int
    count: int
    citation_count: int = 0


class PublicationYearAnalytics(BaseModel):
    year: int
    publications_count: int
    citations_count: int


class PublicationDomainAnalytics(BaseModel):
    domain: str
    count: int


class ResearcherPatentInsightItem(BaseModel):
    patent_id: int
    patent_number: str
    title: str
    assignee: Optional[str] = None
    filing_date: Optional[str] = None
    status: Optional[str] = None
    jurisdiction: Optional[str] = None


class ResearcherInnovationScoreSummary(BaseModel):
    overall_score: float
    overall_classification: str
    estimated_trl: int
    trl_stage: str
    trl_name: str
    research_novelty: float
    patent_strength: float
    technology_maturity: float
    market_potential: float
    funding_relevance: float
    rationale: str


class ResearcherDashboardResponse(BaseModel):
    user_id: int
    user_name: str
    role: UserRole
    institution: Optional[str] = None
    primary_domain: str
    total_publications: int
    total_patents: int
    total_citations: int
    funding_recommendations: List[ResearcherFundingItem] = []
    research_trends: List[TrendDataPoint] = []
    publication_analytics: List[PublicationYearAnalytics] = []
    domain_distribution: List[PublicationDomainAnalytics] = []
    patent_insights: List[ResearcherPatentInsightItem] = []
    top_patent_assignees: List[Dict[str, Any]] = []
    innovation_score: Optional[ResearcherInnovationScoreSummary] = None


# =====================================================================
# 2. Startup Founder Dashboard Schemas
# =====================================================================

class StartupFundingOpportunityItem(BaseModel):
    id: int
    title: str
    funding_agency: str
    funding_amount: Optional[float] = None
    application_deadline: Optional[str] = None
    funding_type: Optional[str] = None
    opportunity_type: Optional[str] = None
    relevance_rationale: Optional[str] = None


class TechnologyOpportunityItem(BaseModel):
    technology_area: str
    growth_rate_pct: float
    maturity_stage: str
    patent_saturation_pct: float
    opportunity_rationale: str
    potential_business_use_case: str


class StartupCompetitorPatentItem(BaseModel):
    assignee: str
    patent_count: int
    top_technology_domain: str
    recent_filing_year: Optional[int] = None
    competitive_threat_level: str


class StartupCommercializationInsightItem(BaseModel):
    pathway_type: str
    title: str
    priority: str
    score: float
    readiness_stage: str
    rationale: str
    next_actions: List[str] = []


class StartupDashboardResponse(BaseModel):
    user_id: int
    user_name: str
    role: UserRole
    focus_domain: str
    funding_opportunities: List[StartupFundingOpportunityItem] = []
    technology_opportunities: List[TechnologyOpportunityItem] = []
    competitor_patent_intelligence: List[StartupCompetitorPatentItem] = []
    commercialization_insights: List[StartupCommercializationInsightItem] = []
    commercialization_readiness_score: float
    commercialization_readiness_level: str


# =====================================================================
# 3. Innovation Manager Dashboard Schemas
# =====================================================================

class PortfolioProjectItem(BaseModel):
    project_id: int
    project_name: str
    technology_domain: str
    lead_researcher: str
    innovation_score: float
    trl_level: int
    trl_stage: str
    commercial_potential: str
    status: str


class PipelineStageDistribution(BaseModel):
    stage: str
    project_count: int
    percentage: float


class TechTrendMonitorItem(BaseModel):
    technology_name: str
    growth_direction: str
    growth_rate_pct: float
    maturity_stage: str
    adoption_level: str
    active_assignee_count: int


class DomainFundingAnalyticsItem(BaseModel):
    domain: str
    available_opportunities_count: int
    total_capital_pool_usd: float
    average_grant_amount_usd: float


class InnovationManagerDashboardResponse(BaseModel):
    user_id: int
    user_name: str
    role: UserRole
    total_portfolio_projects: int
    portfolio_projects: List[PortfolioProjectItem] = []
    pipeline_tracking: List[PipelineStageDistribution] = []
    average_portfolio_innovation_score: float
    average_portfolio_trl: float
    technology_trend_monitoring: List[TechTrendMonitorItem] = []
    funding_analytics: List[DomainFundingAnalyticsItem] = []


# =====================================================================
# 4. Administrator Dashboard Schemas
# =====================================================================

class UserRoleMetricItem(BaseModel):
    role: UserRole
    count: int
    percentage: float


class PlatformAnalyticsMetrics(BaseModel):
    total_registered_users: int
    total_active_users: int
    total_publications_indexed: int
    total_patents_indexed: int
    total_funding_rfps_active: int
    total_grant_pool_usd: float


class RecommendationMonitoringMetrics(BaseModel):
    funding_recommendations_served: int
    technology_whitespaces_detected: int
    commercialization_pathways_computed: int
    innovation_scores_calculated: int


class SystemReportItem(BaseModel):
    component: str
    status: str
    latency_ms: float
    last_updated: str


class AdminDashboardResponse(BaseModel):
    user_id: int
    user_name: str
    role: UserRole
    platform_analytics: PlatformAnalyticsMetrics
    user_distribution: List[UserRoleMetricItem] = []
    recommendation_monitoring: RecommendationMonitoringMetrics
    system_health: List[SystemReportItem] = []
    recent_users: List[Dict[str, Any]] = []


# =====================================================================
# 5. Unified Dashboard Overview Response
# =====================================================================

class UnifiedDashboardOverviewResponse(BaseModel):
    user_id: int
    user_name: str
    user_role: UserRole
    current_dashboard_view: str
    researcher_dashboard: Optional[ResearcherDashboardResponse] = None
    startup_dashboard: Optional[StartupDashboardResponse] = None
    innovation_manager_dashboard: Optional[InnovationManagerDashboardResponse] = None
    admin_dashboard: Optional[AdminDashboardResponse] = None
