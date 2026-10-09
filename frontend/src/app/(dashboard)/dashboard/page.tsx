'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  Sliders,
  Briefcase,
  FileText,
  Clock,
  ShieldCheck,
  TrendingUp,
  Award,
  Building,
  Target,
  BarChart3,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Cpu,
  Activity,
  Users,
  Compass,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { authStorage } from '@/lib/auth';
import { User, UserRole } from '@/types/user';
import { api } from '@/lib/api';
import { formatRoleName } from '@/lib/utils';
import {
  UnifiedDashboardOverviewResponse,
  ResearcherDashboardResponse,
  StartupDashboardResponse,
  InnovationManagerDashboardResponse,
  AdminDashboardResponse,
} from '@/types/dashboard';

type DashboardRoleView = 'researcher' | 'startup' | 'innovation_manager' | 'admin';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<DashboardRoleView>('researcher');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dashboard Data State
  const [overviewData, setOverviewData] = useState<UnifiedDashboardOverviewResponse | null>(null);

  const fetchDashboardData = useCallback(async (viewToFetch: DashboardRoleView) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.get<{ data: UnifiedDashboardOverviewResponse }>(
        `/dashboard/overview?view=${viewToFetch}`
      );
      setOverviewData(res.data.data);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setErrorMsg('Unable to retrieve role dashboard analytics from backend gateway.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const currentUser = authStorage.getUser();
    setUser(currentUser);

    // Initial default view based on user role if available
    let initialView: DashboardRoleView = 'researcher';
    if (currentUser?.role === 'startup_founder') {
      initialView = 'startup';
    } else if (currentUser?.role === 'innovation_manager') {
      initialView = 'innovation_manager';
    } else if (currentUser?.role === 'administrator') {
      initialView = 'admin';
    }
    setActiveView(initialView);
    fetchDashboardData(initialView);
  }, [fetchDashboardData]);

  const handleViewChange = (newView: DashboardRoleView) => {
    setActiveView(newView);
    fetchDashboardData(newView);
  };

  const researcher = overviewData?.researcher_dashboard;
  const startup = overviewData?.startup_dashboard;
  const innovationManager = overviewData?.innovation_manager_dashboard;
  const admin = overviewData?.admin_dashboard;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Header & Role Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Module 9: Centralized Analytics & Role Dashboards
              </span>
              <span className="text-xs text-slate-400">
                Logged in as: <strong className="text-indigo-300 capitalize">{user ? formatRoleName(user.role) : 'Researcher'}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {activeView === 'researcher' && 'Researcher Analytics & Insights'}
              {activeView === 'startup' && 'Startup Founder Venture Radar'}
              {activeView === 'innovation_manager' && 'Innovation Portfolio Command'}
              {activeView === 'admin' && 'Platform Governance & Telemetry'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {activeView === 'researcher' && 'Consolidated research trends, grants vector-matched to your profile, patent landscape, and explainable 5-pillar innovation scoring.'}
              {activeView === 'startup' && 'Identified technology whitespaces, competitor IP saturation, non-dilutive grant solicitations, and commercial spinout pathways.'}
              {activeView === 'innovation_manager' && 'Cross-domain project portfolio tracking, 5-stage innovation pipeline health, technology trend monitoring, and grant capital allocation.'}
              {activeView === 'admin' && 'Platform-wide telemetry, user role distribution, recommendation system monitoring, and microservice infrastructure health.'}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Link
                href="/reports"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Module 11 Reports</span>
              </Link>
              <button
                onClick={() => fetchDashboardData(activeView)}
                disabled={loading}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Refresh Analytics"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic 4-Role Navigation Tabs */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">
            Switch View:
          </span>
          <button
            onClick={() => handleViewChange('researcher')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeView === 'researcher'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Researcher</span>
          </button>
          <button
            onClick={() => handleViewChange('startup')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeView === 'startup'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Startup Founder</span>
          </button>
          <button
            onClick={() => handleViewChange('innovation_manager')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeView === 'innovation_manager'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Innovation Manager</span>
          </button>
          <button
            onClick={() => handleViewChange('admin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeView === 'admin'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 font-bold">×</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. RESEARCHER DASHBOARD VIEW                                              */}
      {/* ========================================================================= */}
      {activeView === 'researcher' && researcher && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Publications</span>
              <div className="text-2xl font-extrabold text-white mt-1">{researcher.total_publications}</div>
              <span className="text-[9px] text-blue-400 block mt-1">Indexed in profile</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Patents</span>
              <div className="text-2xl font-extrabold text-purple-400 mt-1">{researcher.total_patents}</div>
              <span className="text-[9px] text-purple-300 block mt-1">IP Claims</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Citations</span>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1">{researcher.total_citations}</div>
              <span className="text-[9px] text-cyan-300 block mt-1">Academic Impact</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Primary Domain</span>
              <div className="text-sm font-bold text-slate-200 mt-2 truncate">{researcher.primary_domain}</div>
              <span className="text-[9px] text-slate-500 block mt-1">Specialization</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Innovation Score</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                {researcher.innovation_score?.overall_score ?? 75.0} <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <span className="text-[9px] text-emerald-300 block mt-1">
                TRL {researcher.innovation_score?.estimated_trl ?? 5}
              </span>
            </div>
          </div>

          {/* Grid: Funding Recommendations & Explainable Innovation Score */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funding Recommendations (Module 4) */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-400" />
                  Personalized Funding Recommendations
                </h3>
                <Link href="/funding" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                  <span>Explore Radar</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {researcher.funding_recommendations.map((grant) => (
                  <div key={grant.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-white line-clamp-1">{grant.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                        {grant.match_score}% Match
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Agency: <strong className="text-slate-300">{grant.funding_agency}</strong></span>
                      <span className="text-emerald-400 font-mono font-semibold">
                        {grant.funding_amount ? `$${(grant.funding_amount / 1000).toLocaleString()}k` : 'Open Budget'}
                      </span>
                    </div>
                    {grant.application_deadline && (
                      <div className="text-[10px] text-slate-500 font-mono">
                        Deadline: {new Date(grant.application_deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Explainable 5-Pillar Innovation Score (Module 7) */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  5-Pillar Innovation Score & TRL
                </h3>
                <Link href="/scoring" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                  <span>Full Scoring</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {researcher.innovation_score ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Readiness Classification</span>
                      <span className="text-sm font-bold text-emerald-400">
                        {researcher.innovation_score.overall_classification}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Maturity Level</span>
                      <span className="px-2.5 py-1 rounded text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        TRL {researcher.innovation_score.estimated_trl} ({researcher.innovation_score.trl_stage})
                      </span>
                    </div>
                  </div>

                  {/* 5 Pillar Bars */}
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Research Novelty (25%)</span>
                        <span className="font-mono text-blue-400 font-bold">{researcher.innovation_score.research_novelty}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${researcher.innovation_score.research_novelty}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Patent Strength (25%)</span>
                        <span className="font-mono text-purple-400 font-bold">{researcher.innovation_score.patent_strength}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${researcher.innovation_score.patent_strength}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Technology Maturity (20%)</span>
                        <span className="font-mono text-cyan-400 font-bold">{researcher.innovation_score.technology_maturity}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${researcher.innovation_score.technology_maturity}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Market Potential (15%)</span>
                        <span className="font-mono text-emerald-400 font-bold">{researcher.innovation_score.market_potential}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${researcher.innovation_score.market_potential}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Funding Relevance (15%)</span>
                        <span className="font-mono text-amber-400 font-bold">{researcher.innovation_score.funding_relevance}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${researcher.innovation_score.funding_relevance}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                    &quot;{researcher.innovation_score.rationale}&quot;
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-500 py-6 text-center">No innovation score calculated yet.</div>
              )}
            </div>
          </div>

          {/* Research Publication Trends & Patent Landscape Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Publication & Citation Growth (Module 3) */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Publication & Citation Trajectory
                </h3>
                <Link href="/research-intelligence" className="text-xs text-cyan-400 hover:underline">
                  Full Trends
                </Link>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-400 font-semibold pb-1 border-b border-slate-800">
                  <span>Year</span>
                  <span>Publications</span>
                  <span>Citations</span>
                </div>
                {researcher.publication_analytics.map((row) => (
                  <div key={row.year} className="grid grid-cols-3 gap-2 text-center text-xs py-1.5 rounded bg-slate-950/60">
                    <span className="font-mono text-slate-300">{row.year}</span>
                    <span className="text-blue-400 font-bold">{row.publications_count}</span>
                    <span className="text-cyan-400 font-bold">{row.citations_count}</span>
                  </div>
                ))}
              </div>

              {/* Domain distribution */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-2">Topic Coverage</span>
                <div className="flex flex-wrap gap-1.5">
                  {researcher.domain_distribution.map((dom) => (
                    <span key={dom.domain} className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700">
                      {dom.domain} <strong className="text-indigo-400">({dom.count})</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Patent Insights & Top Assignees (Module 5) */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  Patent Landscape & Competitor Assignees
                </h3>
                <Link href="/patents" className="text-xs text-purple-400 hover:underline">
                  View Patents
                </Link>
              </div>

              <div className="space-y-2.5">
                {researcher.patent_insights.map((p) => (
                  <div key={p.patent_id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 line-clamp-1">{p.title}</span>
                      <span className="font-mono text-[10px] text-purple-400 shrink-0 ml-2">{p.patent_number}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>Assignee: <strong className="text-slate-300">{p.assignee || 'Independent'}</strong></span>
                      <span className="text-slate-500 font-mono text-[10px]">{p.jurisdiction} • {p.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-2">Top Assignees</span>
                <div className="flex flex-wrap gap-2">
                  {researcher.top_patent_assignees.map((a, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-purple-950/40 text-purple-300 border border-purple-800/40">
                      {a.assignee} ({a.patent_count} patents)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STARTUP FOUNDER DASHBOARD VIEW                                         */}
      {/* ========================================================================= */}
      {activeView === 'startup' && startup && (
        <div className="space-y-6">
          {/* Key Startup Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Focus Domain</span>
              <div className="text-lg font-bold text-purple-300 mt-1 truncate">{startup.focus_domain}</div>
              <span className="text-[9px] text-slate-500 block mt-1">Venture Target</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Commercial Readiness</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                {startup.commercialization_readiness_score} <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <span className="text-[9px] text-emerald-300 block mt-1">{startup.commercialization_readiness_level}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Whitespaces Detected</span>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1">{startup.technology_opportunities.length}</div>
              <span className="text-[9px] text-cyan-300 block mt-1">Uncrowded IP Niches</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Funding Solicitations</span>
              <div className="text-2xl font-extrabold text-blue-400 mt-1">{startup.funding_opportunities.length}</div>
              <span className="text-[9px] text-blue-300 block mt-1">Non-Dilutive Grants</span>
            </div>
          </div>

          {/* Whitespace Opportunities & Competitor IP Landscape */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emerging Technology Opportunities & Whitespaces (Module 6) */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Technology Opportunities & Whitespaces
                </h3>
                <Link href="/technology-intelligence" className="text-xs text-purple-400 hover:underline">
                  Analyze Gaps
                </Link>
              </div>

              <div className="space-y-3">
                {startup.technology_opportunities.map((opp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{opp.technology_area}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {opp.maturity_stage}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{opp.opportunity_rationale}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                      <span>Growth Score: <strong className="text-cyan-400">{opp.growth_rate_pct}</strong></span>
                      <span>Patent Saturation: <strong className="text-amber-400">{opp.patent_saturation_pct}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Patent Intelligence (Module 5) */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-rose-400" />
                  Competitor Patent Intelligence & Threat Matrix
                </h3>
                <Link href="/patents" className="text-xs text-rose-400 hover:underline">
                  Full Matrix
                </Link>
              </div>

              <div className="space-y-2.5">
                {startup.competitor_patent_intelligence.map((comp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-200">{comp.assignee}</div>
                      <div className="text-[11px] text-slate-400">
                        Domain: {comp.top_technology_domain} • <span className="font-mono text-slate-300">{comp.patent_count} patents</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase ${
                      comp.competitive_threat_level === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : comp.competitive_threat_level === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {comp.competitive_threat_level} Threat
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Commercialization Action Plan (Module 8) */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                Commercialization Pathways & Strategic Recommendations
              </h3>
              <Link href="/commercialization" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                <span>View Full Roadmap</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {startup.commercialization_insights.map((comm, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{comm.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                      {comm.priority} Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{comm.rationale}</p>
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Required Next Steps:</span>
                    {comm.next_actions.map((act, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. INNOVATION MANAGER DASHBOARD VIEW                                      */}
      {/* ========================================================================= */}
      {activeView === 'innovation_manager' && innovationManager && (
        <div className="space-y-6">
          {/* Key Portfolio Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Portfolio Projects</span>
              <div className="text-2xl font-extrabold text-white mt-1">{innovationManager.total_portfolio_projects}</div>
              <span className="text-[9px] text-emerald-400 block mt-1">Cross-domain initiatives</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Average Innovation Score</span>
              <div className="text-2xl font-extrabold text-indigo-400 mt-1">
                {innovationManager.average_portfolio_innovation_score} <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <span className="text-[9px] text-indigo-300 block mt-1">Composite Portfolio Health</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Average Maturity Level</span>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1">
                TRL {innovationManager.average_portfolio_trl}
              </div>
              <span className="text-[9px] text-cyan-300 block mt-1">Technology Readiness</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tracked Technologies</span>
              <div className="text-2xl font-extrabold text-purple-400 mt-1">
                {innovationManager.technology_trend_monitoring.length}
              </div>
              <span className="text-[9px] text-purple-300 block mt-1">Emerging Domains</span>
            </div>
          </div>

          {/* 5-Stage Visual Innovation Pipeline Tracker */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                5-Stage Innovation Pipeline Progression
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">TRL 1-9 Funnel</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {innovationManager.pipeline_tracking.map((stage) => (
                <div key={stage.stage} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-slate-300">{stage.stage}</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-white">{stage.project_count}</span>
                    <span className="text-[10px] text-slate-500">projects ({stage.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${stage.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Project Portfolio Matrix */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Multi-Project Portfolio Matrix & TRL Progression
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-semibold">Project Name</th>
                    <th className="pb-2 font-semibold">Technology Domain</th>
                    <th className="pb-2 font-semibold">Lead PI</th>
                    <th className="pb-2 font-semibold">Innovation Score</th>
                    <th className="pb-2 font-semibold">TRL Level & Stage</th>
                    <th className="pb-2 font-semibold">Commercial Potential</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {innovationManager.portfolio_projects.map((proj) => (
                    <tr key={proj.project_id} className="hover:bg-slate-950/40">
                      <td className="py-2.5 font-bold text-white">{proj.project_name}</td>
                      <td className="py-2.5 text-slate-300">{proj.technology_domain}</td>
                      <td className="py-2.5 text-slate-400">{proj.lead_researcher}</td>
                      <td className="py-2.5 font-bold text-indigo-400">{proj.innovation_score}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          TRL {proj.trl_level}: {proj.trl_stage}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className="text-emerald-400 font-semibold">{proj.commercial_potential}</span>
                      </td>
                      <td className="py-2.5 text-slate-400">{proj.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Domain Grant Capital Allocation (Module 4) */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" />
              Domain Funding Capital Allocation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {innovationManager.funding_analytics.map((fund) => (
                <div key={fund.domain} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-white">{fund.domain}</span>
                  <div className="text-lg font-extrabold text-amber-400">
                    ${(fund.total_capital_pool_usd / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {fund.available_opportunities_count} solicitations • avg ${(fund.average_grant_amount_usd / 1000).toFixed(0)}k
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ADMINISTRATOR DASHBOARD VIEW                                            */}
      {/* ========================================================================= */}
      {activeView === 'admin' && admin && (
        <div className="space-y-6">
          {/* Platform Analytics Telemetry */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Users</span>
              <div className="text-2xl font-extrabold text-white mt-1">{admin.platform_analytics.total_registered_users}</div>
              <span className="text-[9px] text-slate-500 block mt-1">{admin.platform_analytics.total_active_users} active</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Indexed Papers</span>
              <div className="text-2xl font-extrabold text-blue-400 mt-1">{admin.platform_analytics.total_publications_indexed}</div>
              <span className="text-[9px] text-blue-300 block mt-1">Cross-domain DOIs</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Patents</span>
              <div className="text-2xl font-extrabold text-purple-400 mt-1">{admin.platform_analytics.total_patents_indexed}</div>
              <span className="text-[9px] text-purple-300 block mt-1">USPTO/EPO</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Grant Solicitations</span>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1">{admin.platform_analytics.total_funding_rfps_active}</div>
              <span className="text-[9px] text-cyan-300 block mt-1">Active RFPs</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Grant Capital Pool</span>
              <div className="text-xl font-extrabold text-emerald-400 mt-1">
                ${(admin.platform_analytics.total_grant_pool_usd / 1000000).toFixed(1)}M
              </div>
              <span className="text-[9px] text-emerald-300 block mt-1">Global Pipeline</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Scores Calculated</span>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">{admin.recommendation_monitoring.innovation_scores_calculated}</div>
              <span className="text-[9px] text-amber-300 block mt-1">TRL & 5-Pillar</span>
            </div>
          </div>

          {/* User Distribution & Recommendation Engine Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Distribution by Role */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                User Distribution by RBAC Role
              </h3>
              <div className="space-y-3">
                {admin.user_distribution.map((roleItem) => (
                  <div key={roleItem.role} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="capitalize text-slate-300">{roleItem.role.replace(/_/g, ' ')}</span>
                      <span className="font-mono text-indigo-300 font-semibold">{roleItem.count} ({roleItem.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${roleItem.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation & Analytics Monitoring */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Recommendation Engine Executions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Grants Served</span>
                  <div className="text-xl font-extrabold text-cyan-400 mt-1">
                    {admin.recommendation_monitoring.funding_recommendations_served}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Whitespaces Found</span>
                  <div className="text-xl font-extrabold text-purple-400 mt-1">
                    {admin.recommendation_monitoring.technology_whitespaces_detected}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Commercial Pathways</span>
                  <div className="text-xl font-extrabold text-emerald-400 mt-1">
                    {admin.recommendation_monitoring.commercialization_pathways_computed}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Scoring Invocations</span>
                  <div className="text-xl font-extrabold text-amber-400 mt-1">
                    {admin.recommendation_monitoring.innovation_scores_calculated}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Microservice Infrastructure Telemetry */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Microservice Infrastructure Health & Telemetry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {admin.system_health.map((sys, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{sys.component}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Latency: <strong className="text-emerald-400 font-mono">{sys.latency_ms}ms</strong></span>
                    <span className="font-bold text-emerald-300">{sys.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* System Status Footer */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Module 9 Analytics Hub: <strong>100% Operational</strong></span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">Modules 1–11 Fully Integrated</span>
      </div>
    </div>
  );
}
