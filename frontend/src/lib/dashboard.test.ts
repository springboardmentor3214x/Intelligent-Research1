import { describe, it, expect } from 'vitest';
import {
  ResearcherDashboardResponse,
  StartupDashboardResponse,
  InnovationManagerDashboardResponse,
  AdminDashboardResponse,
  UnifiedDashboardOverviewResponse,
} from '@/types/dashboard';

describe('Module 9: Centralized Analytics & Role Dashboards Models', () => {
  it('validates ResearcherDashboardResponse schema and 5-pillar scoring', () => {
    const mockResearcher: ResearcherDashboardResponse = {
      user_id: 10,
      user_name: 'Dr. Jane Doe',
      role: 'researcher',
      institution: 'Stanford University',
      primary_domain: 'Artificial Intelligence',
      total_publications: 18,
      total_patents: 5,
      total_citations: 340,
      funding_recommendations: [
        {
          id: 1,
          title: 'NSF NextGen AI Grant',
          funding_agency: 'National Science Foundation',
          funding_amount: 1200000,
          application_deadline: '2026-11-15T00:00:00Z',
          match_score: 94.5,
          status: 'OPEN',
          domains: ['Artificial Intelligence'],
          eligibility_summary: 'ELIGIBLE',
        },
      ],
      research_trends: [{ year: 2025, count: 6, citation_count: 85 }],
      publication_analytics: [{ year: 2025, publications_count: 6, citations_count: 85 }],
      domain_distribution: [{ domain: 'Artificial Intelligence', count: 18 }],
      patent_insights: [
        {
          patent_id: 201,
          patent_number: 'US11223344B2',
          title: 'Neural Transformer Scaling System',
          assignee: 'Stanford University',
          filing_date: '2024-05-10',
          status: 'Active',
          jurisdiction: 'US',
        },
      ],
      top_patent_assignees: [{ assignee: 'Alphabet Inc', patent_count: 24 }],
      innovation_score: {
        overall_score: 83.5,
        overall_classification: 'High Innovation Potential',
        estimated_trl: 6,
        trl_stage: 'Engineering Prototype Validation',
        trl_name: 'System Prototype Demonstration in Operational Environment',
        research_novelty: 88.0,
        patent_strength: 82.0,
        technology_maturity: 75.0,
        market_potential: 85.0,
        funding_relevance: 90.0,
        rationale: 'Strong citation baseline with valid granted patent claims.',
      },
    };

    expect(mockResearcher.user_name).toBe('Dr. Jane Doe');
    expect(mockResearcher.funding_recommendations[0].match_score).toBe(94.5);
    expect(mockResearcher.innovation_score?.overall_score).toBe(83.5);
    expect(mockResearcher.innovation_score?.research_novelty).toBe(88.0);
    expect(mockResearcher.total_publications).toBe(18);
  });

  it('validates StartupDashboardResponse schema, whitespaces, and commercial readiness', () => {
    const mockStartup: StartupDashboardResponse = {
      user_id: 20,
      user_name: 'Alex Founder',
      role: 'startup_founder',
      focus_domain: 'Biotechnology',
      funding_opportunities: [
        {
          id: 5,
          title: 'NIH SBIR Phase II',
          funding_agency: 'National Institutes of Health',
          funding_amount: 1500000,
          opportunity_type: 'SBIR Grant',
          relevance_rationale: 'Direct alignment with biotech therapeutics.',
        },
      ],
      technology_opportunities: [
        {
          technology_area: 'CRISPR Epigenome Editing',
          growth_rate_pct: 34.2,
          maturity_stage: 'Emerging Whitespace',
          patent_saturation_pct: 18.5,
          opportunity_rationale: 'Low IP competition in target tissue delivery.',
          potential_business_use_case: 'Targeted in-vivo therapeutics platform.',
        },
      ],
      competitor_patent_intelligence: [
        {
          assignee: 'BioTech Gen Inc',
          patent_count: 14,
          top_technology_domain: 'Biotechnology',
          recent_filing_year: 2026,
          competitive_threat_level: 'MEDIUM',
        },
      ],
      commercialization_insights: [
        {
          pathway_type: 'STARTUP_SPINOUT',
          title: 'Venture Capital Spinout Formation',
          priority: 'HIGH',
          score: 88.5,
          readiness_stage: 'Lab Validation',
          rationale: 'Strong founder IP defensibility and high addressable market.',
          next_actions: ['Form Delaware C-Corp', 'File provisional patent application'],
        },
      ],
      commercialization_readiness_score: 78.0,
      commercialization_readiness_level: 'High Readiness',
    };

    expect(mockStartup.focus_domain).toBe('Biotechnology');
    expect(mockStartup.commercialization_readiness_score).toBe(78.0);
    expect(mockStartup.technology_opportunities[0].technology_area).toBe('CRISPR Epigenome Editing');
    expect(mockStartup.competitor_patent_intelligence[0].competitive_threat_level).toBe('MEDIUM');
    expect(mockStartup.commercialization_insights[0].next_actions.length).toBe(2);
  });

  it('validates InnovationManagerDashboardResponse schema and 5-stage pipeline', () => {
    const mockManager: InnovationManagerDashboardResponse = {
      user_id: 30,
      user_name: 'Director Chen',
      role: 'innovation_manager',
      total_portfolio_projects: 5,
      portfolio_projects: [
        {
          project_id: 1,
          project_name: 'Quantum Sensing Device',
          technology_domain: 'Quantum Computing',
          lead_researcher: 'Dr. Evans',
          innovation_score: 85.0,
          trl_level: 5,
          trl_stage: 'Lab Prototype',
          commercial_potential: 'High',
          status: 'Active',
        },
      ],
      pipeline_tracking: [
        { stage: 'Research Idea', project_count: 1, percentage: 20.0 },
        { stage: 'Tech Concept', project_count: 1, percentage: 20.0 },
        { stage: 'Lab Prototype', project_count: 2, percentage: 40.0 },
        { stage: 'Field Validated', project_count: 1, percentage: 20.0 },
        { stage: 'Commercialization', project_count: 0, percentage: 0.0 },
      ],
      average_portfolio_innovation_score: 79.4,
      average_portfolio_trl: 4.8,
      technology_trend_monitoring: [
        {
          technology_name: 'Quantum Computing',
          growth_direction: 'accelerating',
          growth_rate_pct: 28.5,
          maturity_stage: 'Developing',
          adoption_level: 'High',
          active_assignee_count: 12,
        },
      ],
      funding_analytics: [
        {
          domain: 'Quantum Computing',
          available_opportunities_count: 4,
          total_capital_pool_usd: 5000000,
          average_grant_amount_usd: 1250000,
        },
      ],
    };

    expect(mockManager.total_portfolio_projects).toBe(5);
    expect(mockManager.pipeline_tracking.length).toBe(5);
    expect(mockManager.portfolio_projects[0].trl_stage).toBe('Lab Prototype');
    expect(mockManager.technology_trend_monitoring[0].growth_direction).toBe('accelerating');
  });

  it('validates AdminDashboardResponse schema and system telemetry', () => {
    const mockAdmin: AdminDashboardResponse = {
      user_id: 1,
      user_name: 'Admin Root',
      role: 'administrator',
      platform_analytics: {
        total_registered_users: 120,
        total_active_users: 85,
        total_publications_indexed: 450,
        total_patents_indexed: 180,
        total_funding_rfps_active: 65,
        total_grant_pool_usd: 85000000,
      },
      user_distribution: [
        { role: 'researcher', count: 70, percentage: 58.3 },
        { role: 'startup_founder', count: 30, percentage: 25.0 },
        { role: 'innovation_manager', count: 15, percentage: 12.5 },
        { role: 'administrator', count: 5, percentage: 4.2 },
      ],
      recommendation_monitoring: {
        funding_recommendations_served: 250,
        technology_whitespaces_detected: 35,
        commercialization_pathways_computed: 80,
        innovation_scores_calculated: 120,
      },
      system_health: [
        {
          component: 'PostgreSQL Database',
          status: 'HEALTHY',
          latency_ms: 3.8,
          last_updated: '2026-10-09T18:00:00Z',
        },
      ],
      recent_users: [
        {
          id: 120,
          email: 'newuser@research.edu',
          full_name: 'Dr. New User',
          role: 'researcher',
          is_active: true,
        },
      ],
    };

    expect(mockAdmin.platform_analytics.total_registered_users).toBe(120);
    expect(mockAdmin.user_distribution.length).toBe(4);
    expect(mockAdmin.system_health[0].status).toBe('HEALTHY');
    expect(mockAdmin.recommendation_monitoring.funding_recommendations_served).toBe(250);
  });

  it('validates UnifiedDashboardOverviewResponse role switching wrapper', () => {
    const overview: UnifiedDashboardOverviewResponse = {
      user_id: 10,
      user_name: 'Dr. Jane Doe',
      user_role: 'researcher',
      current_dashboard_view: 'researcher',
      researcher_dashboard: {
        user_id: 10,
        user_name: 'Dr. Jane Doe',
        role: 'researcher',
        primary_domain: 'Artificial Intelligence',
        total_publications: 18,
        total_patents: 5,
        total_citations: 340,
        funding_recommendations: [],
        research_trends: [],
        publication_analytics: [],
        domain_distribution: [],
        patent_insights: [],
        top_patent_assignees: [],
      },
    };

    expect(overview.current_dashboard_view).toBe('researcher');
    expect(overview.researcher_dashboard?.total_publications).toBe(18);
  });
});
