'use client';

import { FileText, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns/format';

interface ClientOverviewProps {
  data: {
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
  } | null;
}

const ClientOverview = ({ data }: ClientOverviewProps) => {
  // ✅ FIX #1: Guard against null data
  if (!data) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg text-red-600 dark:text-red-400">Error loading overview data</div>
      </div>
    );
  }

  // ✅ FIX #2: Guard against missing project
  if (!data.project) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg text-red-600 dark:text-red-400">No project data available</div>
      </div>
    );
  }

  // ✅ FIX #3: Safe destructuring with fallbacks
  const {
    project = {},
    timeline = {},
    team = {},
    progress = {}
  } = data;

  const projectName = project.name || 'N/A';
  const projectType = project.type || 'N/A';
  const projectBudget = project.budget || 0;
  const projectDescription = project.description || 'No description available';
  const currency = project.currency || 'USD';

  const startDate = timeline.startDate ? format(new Date(timeline.startDate), "dd MMM.yyyy") : 'N/A';
  const deadline = timeline.deadline ? format(new Date(timeline.deadline), "dd MMM.yyyy") : 'N/A';
  const daysRemaining = timeline.daysRemaining ?? 0;

  const projectManager = team.projectManager || 'Unassigned';
  const teamSize = team.teamSize ?? 0;

  const overallProgress = progress.overall ?? 0;
  const advancePaid = progress.advancePaid ?? false;
  const finalPaymentMade = progress.finalPaymentMade ?? false;
  const paidAmount = progress.paidAmount ?? 0;
  const remainingAmount = progress.remainingAmount ?? 0;

  return (
    <div className="dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-4">

            {/* Top 3 Cards Row */}
            <div className="grid grid-cols-3 h-35 gap-4">

              {/* Project Name Card */}
              <div className="bg-gradient-to-r content-end from-blue-600/60 to-blue-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 w-10 h-10 bg-gray-100/40 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-1">{projectName}</h2>
                  <p className="text-blue-100 text-sm">Project Name</p>
                </div>
              </div>

              {/* Project Type Card */}
              <div className="bg-gradient-to-r content-end from-yellow-400/70 to-yellow-800/80 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 w-10 h-10 bg-gray-100/40 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-1">{projectType}</h2>
                  <p className="text-yellow-100 text-sm">Project Type</p>
                </div>
              </div>

              {/* Project Budget Card */}
              <div className="bg-gradient-to-r content-end from-purple-600/50 to-purple-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 w-10 h-10 bg-gray-100/40 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-1">
                    {currency} {projectBudget.toLocaleString()}
                  </h2>
                  <p className="text-purple-100 text-sm">Project Budget</p>
                </div>
              </div>

            </div>

            {/* Bottom Row - Description and Date Cards */}
            <div className="grid grid-cols-2 gap-4">

              {/* Description Card */}
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {projectDescription}
                </p>
              </div>

              {/* Date & Manager Cards */}
              <div className="flex flex-col gap-4 col-span-1">

                <div className="flex gap-4 w-full h-30">
                  {/* Start Date Card */}
                  <div className="bg-gray-100 dark:bg-gray-800 max-h-50 w-full rounded-2xl p-5 shadow-sm border border-gray-400/50 dark:border-gray-700">
                    <div className="flex items-end justify-end gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Start Date</span>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {startDate}
                      </p>
                    </div>
                  </div>

                  {/* Deadline Card */}
                  <div className="bg-gray-100 dark:bg-gray-800 justify-end max-h-40 w-full rounded-2xl p-5 shadow-sm border border-gray-400/50 dark:border-gray-700">
                    <div className="flex justify-end items-end gap-2 mb-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-start">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Deadline</span>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {deadline}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 w-full h-20">
                  {/* Project Manager Card */}
                  <div className="bg-gray-100 dark:bg-gray-800 items-end w-80 rounded-2xl p-5 shadow-sm border border-gray-400/50 dark:border-gray-700">
                    <div className="flex flex-col items-start justify-start gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Project Manager</span>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{projectManager}</p>
                    </div>
                  </div>

                  {/* Days Remaining Card */}
                  <div className="bg-gray-100 items-end justify-end dark:bg-gray-800 w-40 rounded-2xl p-5 shadow-sm border border-gray-400/50 dark:border-gray-700">
                    <div className="flex flex-col items-start justify-start gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Days Remaining</span>
                      <p className="text-xl font-bold text-gray-900 justify-center dark:text-white">
                        {daysRemaining > 0 ? daysRemaining : 'Completed'}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Section - Overall Progress */}
          <div className="lg:col-span-4">
            <div className="bg-gray-100 dark:bg-gray-800 h-full rounded-2xl p-6 shadow-sm border dark:border-gray-700 flex flex-col items-center justify-center">
              <h3 className="block text-left font-bold text-gray-900 dark:text-white mb-8">
                Overall Progress
              </h3>

              {/* Progress Circle */}
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#e5e7eb"
                    className="dark:stroke-gray-600"
                    strokeWidth="20"
                  />

                  {/* Progress circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="20"
                    strokeDasharray={`${(overallProgress / 100) * 503.3} 503.3`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {overallProgress}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="mt-8 w-full space-y-3">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Advance Payment</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    advancePaid 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {advancePaid ? 'Paid' : 'Pending'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Final Payment</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    finalPaymentMade 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {finalPaymentMade ? 'Paid' : 'Pending'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount Paid</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {currency} {paidAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Remaining</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {currency} {remainingAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClientOverview;