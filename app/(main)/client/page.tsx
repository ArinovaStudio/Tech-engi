'use client';

import { useState, useEffect, Suspense } from 'react';
import { Loader, AlertCircle, Filter, Search, Calendar, LucideLoader } from 'lucide-react';
import ClientOverview from '@/components/clients/analytics/ClientOverview';
import DesignOverview from '@/components/clients/analytics/DesignOverview';
import LatestUpdates from '@/components/clients/analytics/LatestUpdates';
// import RiskBlockage from '@/components/clients/analytics/RiskBlockage';
import Milestones from '@/components/clients/analytics/Milestones';
import BudgetAndDocs from '@/components/clients/analytics/BudgetAndDocs';
import DesignPreviewSection from '@/components/clients/analytics/DesignPreviewSection';
import { useAuth } from '@/app/hooks/useAuth';

interface Project {
  id: string;
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  basicDetails: string;
  membersCount: number;
  progress: number;
  budget: number;
  projectType: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface ClientOverviewData {
  project: {
    id: string;
    name: string;
    description: string;
    type: string;
    budget: number;
    currency: string;
    status: string;
    priority: string;
  };
  timeline: {
    startDate: string;
    deadline: string;
    daysRemaining: number;
  };
  team: {
    projectManager: string;
    projectManagerEmail: string | null;
    teamSize: number;
  };
  progress: {
    overall: number;
    advancePaid: boolean;
    finalPaymentMade: boolean;
    paidAmount: number;
    remainingAmount: number;
  };
}

interface DesignOverviewData {
  projectTitle: string;
  designSystemAvailable: boolean;
  design: {
    id: string;
    brandName: string;
    colors: string[];
    theme: string[];
    brandFeel: string;
  } | null;
  previewImages: Array<{
    id: string;
    title: string;
    url: string;
    type: string;
    createdAt: string;
  }>;
}

interface Update {
  id: string;
  title: string;
  date: string;
  createdAt: string;
}

interface Milestone {
  id: string;
  title: string;
  type: string;
  content: string;
  completed: boolean;
  createdAt: string;
  addedBy: string;
}

interface BudgetData {
  scopeTitle: string;
  scopeDate: string;
  paymentDate: string;
  invoiceName: string;
  paidAmount: number;
  remainingAmount: number;
  totalBudget: number;
  progress: number;
  remainingProgress: number;
  docs: Array<{
    id: string;
    title: string;
    url: string;
    type: string;
    createdAt: string;
  }>;
}

interface AllAnalyticsData {
  updates: Update[];
  milestones: Milestone[];
  budget: BudgetData | null;
  design: DesignOverviewData | null;
  overview: ClientOverviewData | null;
  designOverview: DesignOverviewData | null;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const ClientAnalyticsDashboard = () => {
  // ✅ FIX #1: Consolidated state management - removed duplicates
  const [clientId, setClientId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allData, setAllData] = useState<AllAnalyticsData | null>(null);

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [showProjects, setShowProjects] = useState(true);

  const { user } = useAuth() as { user: User };

  // ✅ FIX #2: Debounce search input (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // ✅ FIX #3: Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  // ✅ FIX #4: Fetch projects with proper error handling
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user?.id) return;

        setLoading(true);

        const query = new URLSearchParams({
          search: debouncedSearch,
          status: statusFilter,
          page: page.toString(),
          limit: '15'
        }).toString();

        const projectsResponse = await fetch(`/api/client/projects?${query}`);

        if (!projectsResponse.ok) {
          throw new Error('Failed to fetch projects');
        }

        const projectsResult = await projectsResponse.json();

        if (projectsResult.success && projectsResult.projects?.length > 0) {
          setProjects(projectsResult.projects);

          // ✅ FIX #5: Set project from URL or use first project
          const urlProjectId = new URLSearchParams(window.location.search).get('projectId');
          const selectedProjectId = urlProjectId || projectsResult.projects[0].id;
          setProjectId(selectedProjectId);
          setShowProjects(false);
        } else {
          setProjects([]);
          setProjectId(null);
          setShowProjects(true);
        }

        setClientId(user.id);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        setProjects([]);
        setShowProjects(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [debouncedSearch, statusFilter, page, user?.id]);

  // ✅ FIX #6: Fetch all analytics data with proper dependency management
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!clientId || !projectId) {
        setAllData(null);
        return;
      }

      try {
        setLoading(true);

        // ✅ FIX #7: Proper Promise.all with all required endpoints
        const [
          updatesRes,
          milestonesRes,
          budgetRes,
          designPreviewRes,
          overviewRes,
          designRes
        ] = await Promise.all([
          fetch(`/api/client/analytics/updates?projectId=${projectId}`),
          fetch(`/api/client/analytics/milestone?projectId=${projectId}`),
          fetch(`/api/client/analytics/budget?projectId=${projectId}`),
          fetch(`/api/client/analytics/design-preview?projectId=${projectId}`),
          fetch(`/api/client/analytics/overview?projectId=${projectId}`),
          fetch(`/api/client/analytics/design?projectId=${projectId}`)
        ]);

        // ✅ FIX #8: Validate all responses
        if (!updatesRes.ok || !milestonesRes.ok || !budgetRes.ok || !designPreviewRes.ok || !overviewRes.ok || !designRes.ok) {
          throw new Error('One or more analytics endpoints failed');
        }

        const [updates, milestones, budget, designPreview, overview, design] = await Promise.all([
          updatesRes.json(),
          milestonesRes.json(),
          budgetRes.json(),
          designPreviewRes.json(),
          overviewRes.json(),
          designRes.json()
        ]);

        // ✅ FIX #9: Properly format response data with fallbacks
        setAllData({
          updates: updates.success && Array.isArray(updates.data) ? updates.data : [],
          milestones: milestones.success && Array.isArray(milestones.data) ? milestones.data : [],
          budget: budget.success ? budget.data : null,
          design: designPreview.success ? designPreview.data : null,
          overview: overview.success && overview.data ? overview.data : null,  // ← Add null check
          designOverview: design.success && design.data ? design.data : null   // ← Add null check
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
        setAllData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [clientId, projectId]);

  // ✅ FIX #10: Helper function for priority badge colors
  const getPriorityColor = (priority: string): string => {
    const colorMap: Record<string, string> = {
      'HIGH': 'bg-red-500/20 text-red-500 border-red-200 dark:border-red-800',
      'MEDIUM': 'bg-yellow-500/20 text-yellow-500 border-yellow-200 dark:border-yellow-800',
      'LOW': 'bg-green-500/20 text-green-500 border-green-200 dark:border-green-800'
    };
    return colorMap[priority] || 'bg-gray-100/20 text-gray-500 border-gray-200 dark:border-gray-700';
  };

  // ✅ FIX #11: Filter projects locally
  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || project.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // ✅ FIX #12: Loading state
  if (loading && !allData) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-[var(--primary)] mx-auto mb-4" size={40} />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ FIX #13: Error state
  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ✅ FIX #14: Show project selection if no projectId or showProjects is true
  if (!projectId || showProjects) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Projects</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Select a project to view analytics
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none cursor-pointer"
              >
                <option value="ALL">All Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {projects.length === 0 ? 'No Projects' : 'No Results'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {projects.length === 0
                ? "You haven't been assigned to any projects yet."
                : 'No projects match your search criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  setProjectId(project.id);
                  setShowProjects(false);
                  window.history.pushState({}, '', `?projectId=${project.id}`);
                }}
                className="group block cursor-pointer"
              >
                <div className="relative bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 group-hover:border-blue-300 dark:group-hover:border-blue-600">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 flex-1">
                      {project.title}
                    </h3>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>

                  {/* Project Summary */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {project.description || 'No summary available'}
                  </p>

                  {/* Project Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }}
                      />
                    </div>
                  </div>

                  {/* Basic Details Preview */}
                  {project.basicDetails && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {project.basicDetails}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ✅ FIX #15: Show loading indicator while fetching detailed data
  if (!allData) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <LucideLoader className="animate-spin text-[var(--primary)] mx-auto mb-4" size={40} />
          <p className="text-lg text-[var(--primary)]">Loading project data...</p>
        </div>
      </div>
    );
  }

  const currentProject = projects.find(p => p.id === projectId);

  // ✅ FIX #16: Main analytics dashboard
  return (
    <div className="space-y-10">
      {/* Project Header with Switch Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentProject?.title || 'Project Analytics'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analytics dashboard for your project
          </p>
        </div>
        <button
          onClick={() => setShowProjects(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          Switch Project
        </button>
      </div>

      {/* Overview Section */}
       <ClientOverview data={allData.overview} />

      {/* Design Overview Section */}
      {allData.designOverview && (
        <DesignOverview data={allData.designOverview} designPreview={allData.design} />
      )}

      {/* Updates and Milestones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {allData.updates && (
            <LatestUpdates updates={allData.updates} />
          )}
        </div>
        <div className="lg:col-span-1 space-y-6">
          {allData.milestones && (
            <Milestones milestones={allData.milestones} />
          )}
        </div>
      </div>

      {/* Budget and Docs Section */}
      {allData.budget && (
        <BudgetAndDocs
          scopeTitle={allData.budget.scopeTitle}
          scopeDate={allData.budget.scopeDate}
          paymentDate={allData.budget.paymentDate}
          invoiceName={allData.budget.invoiceName}
          paidAmount={allData.budget.paidAmount}
          remainingAmount={allData.budget.remainingAmount}
          totalBudget={allData.budget.totalBudget}
          remainingProgress={allData.budget.remainingProgress}
        // docs={allData.budget.docs || []}
        />
      )}

      {/* Design Preview Section */}
      {allData.design && <DesignPreviewSection data={allData.design} />}
    </div>
  );
};

const ClientPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ClientAnalyticsDashboard />
    </Suspense>
  );
};

export default ClientPage;