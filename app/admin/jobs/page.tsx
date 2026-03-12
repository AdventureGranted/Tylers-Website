'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DndContext,
  DragEndEvent,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';

// --- Types ---

interface Job {
  id: string;
  company: string;
  position: string;
  status: string;
  source: string;
  applicationDate: string;
  followUpDate: string | null;
  url: string | null;
  notes: string | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// --- Constants ---

const STATUS_LABELS: Record<string, string> = {
  APPLIED: 'Applied',
  PHONE_SCREEN: 'Phone Screen',
  ONLINE_ASSESSMENT: 'Online Assessment',
  BEHAVIORAL_INTERVIEW: 'Behavioral',
  TECHNICAL_INTERVIEW: 'Technical',
  ONSITE: 'Onsite',
  OFFER: 'Offer',
  NEGOTIATING: 'Negotiating',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

const STATUS_COLORS: Record<string, string> = {
  APPLIED: 'bg-blue-500/20 text-blue-400',
  PHONE_SCREEN: 'bg-purple-500/20 text-purple-400',
  ONLINE_ASSESSMENT: 'bg-indigo-500/20 text-indigo-400',
  BEHAVIORAL_INTERVIEW: 'bg-cyan-500/20 text-cyan-400',
  TECHNICAL_INTERVIEW: 'bg-teal-500/20 text-teal-400',
  ONSITE: 'bg-emerald-500/20 text-emerald-400',
  OFFER: 'bg-green-500/20 text-green-400',
  NEGOTIATING: 'bg-yellow-500/20 text-yellow-400',
  ACCEPTED: 'bg-green-600/20 text-green-300',
  REJECTED: 'bg-red-500/20 text-red-400',
  WITHDRAWN: 'bg-gray-500/20 text-gray-400',
};

const STATUS_ORDER = [
  'APPLIED',
  'PHONE_SCREEN',
  'ONLINE_ASSESSMENT',
  'BEHAVIORAL_INTERVIEW',
  'TECHNICAL_INTERVIEW',
  'ONSITE',
  'OFFER',
  'NEGOTIATING',
  'ACCEPTED',
  'REJECTED',
  'WITHDRAWN',
];

const SOURCE_LABELS: Record<string, string> = {
  LINKEDIN: 'LinkedIn',
  COMPANY_SITE: 'Company Site',
  REFERRAL: 'Referral',
  INDEED: 'Indeed',
  RECRUITER_OUTREACH: 'Recruiter',
  OTHER: 'Other',
};

type SortField =
  | 'company'
  | 'position'
  | 'status'
  | 'applicationDate'
  | 'followUpDate';

// --- Follow-up helpers ---

function getFollowUpIndicator(followUpDate: string | null): {
  className: string;
  label: string;
} | null {
  if (!followUpDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const fDate = new Date(followUpDate);
  fDate.setHours(0, 0, 0, 0);

  if (fDate < today) {
    return { className: 'bg-red-500/20', label: 'Overdue' };
  }
  if (fDate.getTime() === today.getTime()) {
    return { className: 'bg-yellow-500/20', label: 'Today' };
  }
  return null;
}

// --- Draggable Card ---

function DraggableJobCard({ job }: { job: Job }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: job.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  const followUp = getFollowUpIndicator(job.followUpDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`rounded-lg border border-gray-700 p-3 transition-shadow ${
        followUp ? followUp.className : 'bg-gray-800'
      } ${isDragging ? 'opacity-50 shadow-xl' : 'hover:shadow-lg'}`}
    >
      <Link
        href={`/admin/jobs/${job.id}`}
        onClick={(e) => e.stopPropagation()}
        className="block"
      >
        <p className="font-semibold text-gray-200">{job.company}</p>
        <p className="text-sm text-gray-400">{job.position}</p>
        <p className="mt-1 text-xs text-gray-500">
          {new Date(job.applicationDate).toLocaleDateString()}
        </p>
        {followUp && (
          <span className="mt-1 inline-block rounded px-1.5 py-0.5 text-xs font-medium text-yellow-300">
            Follow-up: {followUp.label}
          </span>
        )}
      </Link>
    </div>
  );
}

// --- Droppable Column ---

function DroppableColumn({ status, jobs }: { status: string; jobs: Job[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[200px] w-64 flex-shrink-0 flex-col rounded-xl border p-3 transition-colors ${
        isOver
          ? 'border-yellow-300/50 bg-yellow-300/5'
          : 'border-gray-700 bg-gray-800/50'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[status] || ''}`}
        >
          {STATUS_LABELS[status] || status}
        </span>
        <span className="text-xs text-gray-500">{jobs.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {jobs.map((job) => (
          <DraggableJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

// --- Main Page ---

export default function AdminJobsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  // View toggle
  const [view, setView] = useState<'table' | 'kanban'>(() => {
    if (typeof window !== 'undefined') {
      return (
        (localStorage.getItem('jobsView') as 'table' | 'kanban') || 'table'
      );
    }
    return 'table';
  });

  // Table state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [sortField, setSortField] = useState<SortField>('applicationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Kanban state
  const [kanbanJobs, setKanbanJobs] = useState<Job[]>([]);
  const [kanbanLoading, setKanbanLoading] = useState(false);

  // Auth check
  useEffect(() => {
    if (authStatus === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, authStatus, router]);

  // Persist view
  useEffect(() => {
    localStorage.setItem('jobsView', view);
  }, [view]);

  // Fetch table data
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: '20',
        sort: sortField,
        order: sortOrder,
      });
      if (statusFilter) params.set('status', statusFilter);
      if (sourceFilter) params.set('source', sourceFilter);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/admin/jobs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    sortField,
    sortOrder,
    statusFilter,
    sourceFilter,
    searchQuery,
  ]);

  // Fetch kanban data
  const fetchKanbanJobs = useCallback(async () => {
    setKanbanLoading(true);
    try {
      const res = await fetch('/api/admin/jobs?limit=1000');
      if (res.ok) {
        const data = await res.json();
        setKanbanJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error fetching kanban jobs:', error);
    } finally {
      setKanbanLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === 'loading' || !session || session.user.role !== 'admin')
      return;
    if (view === 'table') {
      fetchJobs();
    } else {
      fetchKanbanJobs();
    }
  }, [authStatus, session, view, fetchJobs, fetchKanbanJobs]);

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return '';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  // Kanban drag handler
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id as string;
    const newStatus = over.id as string;

    const job = kanbanJobs.find((j) => j.id === jobId);
    if (!job || job.status === newStatus) return;

    // Optimistic update
    setKanbanJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );

    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        // Revert on failure
        setKanbanJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: job.status } : j))
        );
      }
    } catch {
      // Revert on error
      setKanbanJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: job.status } : j))
      );
    }
  };

  // Loading state
  if (
    authStatus === 'loading' ||
    (loading && view === 'table' && jobs.length === 0)
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-yellow-500 dark:border-gray-700 dark:border-t-yellow-300" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-2 inline-block text-sm text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-300"
            >
              ← Back to Admin
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
              Job Applications
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-700">
              <button
                onClick={() => setView('table')}
                className={`rounded-l-lg px-4 py-2 text-sm font-medium transition-colors ${
                  view === 'table'
                    ? 'bg-yellow-500 text-gray-900 dark:bg-yellow-300'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setView('kanban')}
                className={`rounded-r-lg px-4 py-2 text-sm font-medium transition-colors ${
                  view === 'kanban'
                    ? 'bg-yellow-500 text-gray-900 dark:bg-yellow-300'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Kanban
              </button>
            </div>
            <Link
              href="/admin/jobs/dashboard"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/jobs/new"
              className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-yellow-400 dark:bg-yellow-300 dark:hover:bg-yellow-200"
            >
              New Application
            </Link>
          </div>
        </div>

        {/* Table View */}
        {view === 'table' && (
          <>
            {/* Filters */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Search company or position..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:border-yellow-300 dark:focus:ring-yellow-300"
              />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-yellow-300 dark:focus:ring-yellow-300"
              >
                <option value="">All Statuses</option>
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <select
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-yellow-300 dark:focus:ring-yellow-300"
              >
                <option value="">All Sources</option>
                {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-300 dark:border-gray-700">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  <tr>
                    {(
                      [
                        ['company', 'Company'],
                        ['position', 'Position'],
                        ['status', 'Status'],
                        ['applicationDate', 'Applied'],
                        ['followUpDate', 'Follow-up'],
                      ] as [SortField, string][]
                    ).map(([field, label]) => (
                      <th
                        key={field}
                        onClick={() => handleSort(field)}
                        className="cursor-pointer px-4 py-3 font-medium text-gray-600 transition-colors hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-300"
                      >
                        {label}
                        {sortIndicator(field)}
                      </th>
                    ))}
                    <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {jobs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-12 text-center text-gray-500"
                      >
                        No jobs found.
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => {
                      const followUp = getFollowUpIndicator(job.followUpDate);
                      return (
                        <tr
                          key={job.id}
                          onClick={() => router.push(`/admin/jobs/${job.id}`)}
                          className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/80 ${
                            followUp
                              ? followUp.className
                              : 'bg-white dark:bg-gray-900'
                          }`}
                        >
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-200">
                            {job.company}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-400">
                            {job.position}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                                STATUS_COLORS[job.status] || ''
                              }`}
                            >
                              {STATUS_LABELS[job.status] || job.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-400">
                            {new Date(job.applicationDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-400">
                            {job.followUpDate ? (
                              <span className="flex items-center gap-1">
                                {new Date(
                                  job.followUpDate
                                ).toLocaleDateString()}
                                {followUp && (
                                  <span className="text-xs font-medium text-yellow-300">
                                    ({followUp.label})
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-400">
                            {SOURCE_LABELS[job.source] || job.source}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{' '}
                  of {pagination.total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={pagination.page <= 1}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={pagination.page >= pagination.totalPages}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Kanban View */}
        {view === 'kanban' && (
          <>
            {kanbanLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-yellow-500 dark:border-gray-700 dark:border-t-yellow-300" />
              </div>
            ) : (
              <DndContext onDragEnd={handleDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {STATUS_ORDER.map((status) => (
                    <DroppableColumn
                      key={status}
                      status={status}
                      jobs={kanbanJobs.filter((j) => j.status === status)}
                    />
                  ))}
                </div>
              </DndContext>
            )}
          </>
        )}
      </div>
    </main>
  );
}
