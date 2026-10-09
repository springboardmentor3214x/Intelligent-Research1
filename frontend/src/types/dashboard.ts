export interface ResearcherFundingItem {
  id: number;
  title: string;
  funding_agency: string;
  funding_amount?: number | null;
  application_deadline?: string | null;
  match_score: number;
  status: string;
  domains: string[];
  eligibility_summary?: string | null;
}

export interface TrendDataPoint {
  year: number;
  count: number;
  citation_count: number;
}

export interface PublicationYearAnalytics {
  year: number;
  publications_count: number;
  citations_count: number;
}

export interface PublicationDomainAnalytics {
  domain: string;
  count: number;
}

export interface ResearcherPatentInsightItem {
  patent_id: number;
  patent_number: string;
  title: string;
  assignee?: string | null;
  filing_date?: string | null;
  status?: string | null;
  jurisdiction?: string | null;
}

export interface ResearcherInnovationScoreSummary {
  overall_score: number;
  overall_classification: string;
  estimated_trl: number;
  trl_stage: string;
  trl_name: string;
  research_novelty: number;
  patent_strength: number;
  technology_maturity: number;
  market_potential: number;
  funding_relevance: number;
  rationale: string;
}

export interface ResearcherDashboardResponse {
  user_id: number;
  user_name: string;
  role: string;
  institution?: string | null;
  primary_domain: string;
  total_publications: number;
  total_patents: number;
  total_citations: number;
  funding_recommendations: ResearcherFundingItem[];
  research_trends: TrendDataPoint[];
  publication_analytics: PublicationYearAnalytics[];
  domain_distribution: PublicationDomainAnalytics[];
  patent_insights: ResearcherPatentInsightItem[];
  top_patent_assignees: Array<{ assignee: string; patent_count: number; competitive_index?: number; primary_domains?: string[] }>;
  innovation_score?: ResearcherInnovationScoreSummary | null;
}

export interface StartupFundingOpportunityItem {
  id: number;
  title: string;
  funding_agency: string;
  funding_amount?: number | null;
  application_deadline?: string | null;
  funding_type?: string | null;
  opportunity_type?: string | null;
  relevance_rationale?: string | null;
}

export interface TechnologyOpportunityItem {
  technology_area: string;
  growth_rate_pct: number;
  maturity_stage: string;
  patent_saturation_pct: number;
  opportunity_rationale: string;
  potential_business_use_case: string;
}

export interface StartupCompetitorPatentItem {
  assignee: string;
  patent_count: number;
  top_technology_domain: string;
  recent_filing_year?: number | null;
  competitive_threat_level: string;
}

export interface StartupCommercializationInsightItem {
  pathway_type: string;
  title: string;
  priority: string;
  score: number;
  readiness_stage: string;
  rationale: string;
  next_actions: string[];
}

export interface StartupDashboardResponse {
  user_id: number;
  user_name: string;
  role: string;
  focus_domain: string;
  funding_opportunities: StartupFundingOpportunityItem[];
  technology_opportunities: TechnologyOpportunityItem[];
  competitor_patent_intelligence: StartupCompetitorPatentItem[];
  commercialization_insights: StartupCommercializationInsightItem[];
  commercialization_readiness_score: number;
  commercialization_readiness_level: string;
}

export interface PortfolioProjectItem {
  project_id: number;
  project_name: string;
  technology_domain: string;
  lead_researcher: string;
  innovation_score: number;
  trl_level: number;
  trl_stage: string;
  commercial_potential: string;
  status: string;
}

export interface PipelineStageDistribution {
  stage: string;
  project_count: number;
  percentage: number;
}

export interface TechTrendMonitorItem {
  technology_name: string;
  growth_direction: string;
  growth_rate_pct: number;
  maturity_stage: string;
  adoption_level: string;
  active_assignee_count: number;
}

export interface DomainFundingAnalyticsItem {
  domain: string;
  available_opportunities_count: number;
  total_capital_pool_usd: number;
  average_grant_amount_usd: number;
}

export interface InnovationManagerDashboardResponse {
  user_id: number;
  user_name: string;
  role: string;
  total_portfolio_projects: number;
  portfolio_projects: PortfolioProjectItem[];
  pipeline_tracking: PipelineStageDistribution[];
  average_portfolio_innovation_score: number;
  average_portfolio_trl: number;
  technology_trend_monitoring: TechTrendMonitorItem[];
  funding_analytics: DomainFundingAnalyticsItem[];
}

export interface UserRoleMetricItem {
  role: string;
  count: number;
  percentage: number;
}

export interface PlatformAnalyticsMetrics {
  total_registered_users: number;
  total_active_users: number;
  total_publications_indexed: number;
  total_patents_indexed: number;
  total_funding_rfps_active: number;
  total_grant_pool_usd: number;
}

export interface RecommendationMonitoringMetrics {
  funding_recommendations_served: number;
  technology_whitespaces_detected: number;
  commercialization_pathways_computed: number;
  innovation_scores_calculated: number;
}

export interface SystemReportItem {
  component: string;
  status: string;
  latency_ms: number;
  last_updated: string;
}

export interface AdminDashboardResponse {
  user_id: number;
  user_name: string;
  role: string;
  platform_analytics: PlatformAnalyticsMetrics;
  user_distribution: UserRoleMetricItem[];
  recommendation_monitoring: RecommendationMonitoringMetrics;
  system_health: SystemReportItem[];
  recent_users: Array<Record<string, any>>;
}

export interface UnifiedDashboardOverviewResponse {
  user_id: number;
  user_name: string;
  user_role: string;
  current_dashboard_view: 'researcher' | 'startup' | 'innovation_manager' | 'admin';
  researcher_dashboard?: ResearcherDashboardResponse | null;
  startup_dashboard?: StartupDashboardResponse | null;
  innovation_manager_dashboard?: InnovationManagerDashboardResponse | null;
  admin_dashboard?: AdminDashboardResponse | null;
}
