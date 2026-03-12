'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STATUS_LABELS: Record<string, string> = {
  APPLIED: 'Applied',
  PHONE_SCREEN: 'Phone Screen',
  ONLINE_ASSESSMENT: 'Online Assessment',
  BEHAVIORAL_INTERVIEW: 'Behavioral Interview',
  TECHNICAL_INTERVIEW: 'Technical Interview',
  ONSITE: 'Onsite',
  OFFER: 'Offer',
  NEGOTIATING: 'Negotiating',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

const SOURCE_LABELS: Record<string, string> = {
  LINKEDIN: 'LinkedIn',
  COMPANY_SITE: 'Company Site',
  REFERRAL: 'Referral',
  INDEED: 'Indeed',
  RECRUITER_OUTREACH: 'Recruiter',
  OTHER: 'Other',
};

const INTERVIEW_TYPE_LABELS: Record<string, string> = {
  PHONE_SCREEN: 'Phone Screen',
  ONLINE_ASSESSMENT: 'Online Assessment',
  BEHAVIORAL: 'Behavioral',
  TECHNICAL: 'Technical',
  ONSITE: 'Onsite',
  OTHER: 'Other',
};

const LOCATION_TYPE_LABELS: Record<string, string> = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ONSITE: 'Onsite',
};

interface Interview {
  id: string;
  type: string;
  scheduledDate: string;
  interviewerNames: string | null;
  prepNotes: string | null;
  questionsAsked: string | null;
  yourAnswers: string | null;
  debriefNotes: string | null;
  rating: number | null;
  followUpSentAt: string | null;
  expectedResponseDate: string | null;
  responseReceivedAt: string | null;
}

interface Contact {
  id: string;
  name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
}

interface Job {
  id: string;
  company: string;
  position: string;
  status: string;
  applicationDate: string;
  source: string;
  sourceDetail: string | null;
  postingUrl: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryNotes: string | null;
  location: string | null;
  locationType: string | null;
  resumeVersion: string | null;
  followUpDate: string | null;
  followUpNotes: string | null;
  notes: string | null;
  interviews: Interview[];
  contacts: Contact[];
}

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-yellow-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-yellow-300';

const cardClass =
  'rounded-xl border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-800';

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function toDateInputValue(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
}

function toDateTimeLocalValue(dateStr: string | null) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function RatingDisplay({ rating }: { rating: number | null }) {
  if (rating === null) return null;
  return (
    <span className="ml-2 text-yellow-500 dark:text-yellow-300">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < rating ? '\u2605' : '\u2606'}</span>
      ))}
    </span>
  );
}

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { status: sessionStatus } = useSession();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Application form state
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('APPLIED');
  const [applicationDate, setApplicationDate] = useState('');
  const [source, setSource] = useState('OTHER');
  const [sourceDetail, setSourceDetail] = useState('');
  const [postingUrl, setPostingUrl] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [salaryNotes, setSalaryNotes] = useState('');
  const [location, setLocation] = useState('');
  const [locationType, setLocationType] = useState('');
  const [resumeVersion, setResumeVersion] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Interview state
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [expandedInterview, setExpandedInterview] = useState<string | null>(
    null
  );
  const [editingInterview, setEditingInterview] = useState<string | null>(null);
  const [editInterviewData, setEditInterviewData] = useState<
    Record<string, string>
  >({});
  const [showAddInterview, setShowAddInterview] = useState(false);
  const [newInterview, setNewInterview] = useState({
    type: 'PHONE_SCREEN',
    scheduledDate: '',
    interviewerNames: '',
    prepNotes: '',
  });
  const [savingInterview, setSavingInterview] = useState(false);

  // Contact state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [editContactData, setEditContactData] = useState<
    Record<string, string>
  >({});
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [savingContact, setSavingContact] = useState(false);

  const populateForm = useCallback((data: Job) => {
    setCompany(data.company);
    setPosition(data.position);
    setStatus(data.status);
    setApplicationDate(toDateInputValue(data.applicationDate));
    setSource(data.source);
    setSourceDetail(data.sourceDetail || '');
    setPostingUrl(data.postingUrl || '');
    setSalaryMin(data.salaryMin !== null ? String(data.salaryMin) : '');
    setSalaryMax(data.salaryMax !== null ? String(data.salaryMax) : '');
    setSalaryNotes(data.salaryNotes || '');
    setLocation(data.location || '');
    setLocationType(data.locationType || '');
    setResumeVersion(data.resumeVersion || '');
    setFollowUpDate(toDateInputValue(data.followUpDate));
    setFollowUpNotes(data.followUpNotes || '');
    setNotes(data.notes || '');
    setInterviews(data.interviews);
    setContacts(data.contacts);
  }, []);

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }
    if (sessionStatus !== 'authenticated') return;

    async function fetchJob() {
      try {
        const res = await fetch(`/api/admin/jobs/${id}`);
        if (!res.ok) throw new Error('Failed to fetch job application');
        const data: Job = await res.json();
        setJob(data);
        populateForm(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load application'
        );
      } finally {
        setFetching(false);
      }
    }

    fetchJob();
  }, [id, sessionStatus, router, populateForm]);

  // ── Save application ──
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          position,
          status,
          applicationDate,
          source,
          sourceDetail: sourceDetail || null,
          postingUrl: postingUrl || null,
          salaryMin: salaryMin ? parseInt(salaryMin) : null,
          salaryMax: salaryMax ? parseInt(salaryMax) : null,
          salaryNotes: salaryNotes || null,
          location: location || null,
          locationType: locationType || null,
          resumeVersion: resumeVersion || null,
          notes: notes || null,
          followUpDate: followUpDate || null,
          followUpNotes: followUpNotes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      const updated: Job = await res.json();
      setJob(updated);
      populateForm(updated);
      setSuccess('Changes saved successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete application ──
  const handleDeleteJob = async () => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/admin/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  // ── Interview CRUD ──
  const handleAddInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInterview(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/jobs/${id}/interviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newInterview.type,
          scheduledDate: newInterview.scheduledDate,
          interviewerNames: newInterview.interviewerNames || null,
          prepNotes: newInterview.prepNotes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add interview');
      }

      const interview: Interview = await res.json();
      setInterviews((prev) =>
        [...prev, interview].sort(
          (a, b) =>
            new Date(a.scheduledDate).getTime() -
            new Date(b.scheduledDate).getTime()
        )
      );
      setNewInterview({
        type: 'PHONE_SCREEN',
        scheduledDate: '',
        interviewerNames: '',
        prepNotes: '',
      });
      setShowAddInterview(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add interview');
    } finally {
      setSavingInterview(false);
    }
  };

  const startEditInterview = (interview: Interview) => {
    setEditingInterview(interview.id);
    setEditInterviewData({
      type: interview.type,
      scheduledDate: toDateTimeLocalValue(interview.scheduledDate),
      interviewerNames: interview.interviewerNames || '',
      prepNotes: interview.prepNotes || '',
      questionsAsked: interview.questionsAsked || '',
      yourAnswers: interview.yourAnswers || '',
      debriefNotes: interview.debriefNotes || '',
      rating: interview.rating !== null ? String(interview.rating) : '',
      followUpSentAt: toDateInputValue(interview.followUpSentAt),
      expectedResponseDate: toDateInputValue(interview.expectedResponseDate),
      responseReceivedAt: toDateInputValue(interview.responseReceivedAt),
    });
  };

  const handleSaveInterview = async (interviewId: string) => {
    setSavingInterview(true);
    setError('');

    try {
      const res = await fetch(
        `/api/admin/jobs/${id}/interviews/${interviewId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: editInterviewData.type,
            scheduledDate: editInterviewData.scheduledDate,
            interviewerNames: editInterviewData.interviewerNames || null,
            prepNotes: editInterviewData.prepNotes || null,
            questionsAsked: editInterviewData.questionsAsked || null,
            yourAnswers: editInterviewData.yourAnswers || null,
            debriefNotes: editInterviewData.debriefNotes || null,
            rating: editInterviewData.rating
              ? parseInt(editInterviewData.rating)
              : null,
            followUpSentAt: editInterviewData.followUpSentAt || null,
            expectedResponseDate:
              editInterviewData.expectedResponseDate || null,
            responseReceivedAt: editInterviewData.responseReceivedAt || null,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update interview');
      }

      const updated: Interview = await res.json();
      setInterviews((prev) =>
        prev
          .map((i) => (i.id === interviewId ? updated : i))
          .sort(
            (a, b) =>
              new Date(a.scheduledDate).getTime() -
              new Date(b.scheduledDate).getTime()
          )
      );
      setEditingInterview(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update interview'
      );
    } finally {
      setSavingInterview(false);
    }
  };

  const handleDeleteInterview = async (interviewId: string) => {
    if (!confirm('Delete this interview?')) return;

    try {
      const res = await fetch(
        `/api/admin/jobs/${id}/interviews/${interviewId}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Failed to delete interview');
      setInterviews((prev) => prev.filter((i) => i.id !== interviewId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete interview'
      );
    }
  };

  // ── Contact CRUD ──
  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/jobs/${id}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newContact.name,
          title: newContact.title || null,
          email: newContact.email || null,
          phone: newContact.phone || null,
          notes: newContact.notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add contact');
      }

      const contact: Contact = await res.json();
      setContacts((prev) => [...prev, contact]);
      setNewContact({ name: '', title: '', email: '', phone: '', notes: '' });
      setShowAddContact(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add contact');
    } finally {
      setSavingContact(false);
    }
  };

  const startEditContact = (contact: Contact) => {
    setEditingContact(contact.id);
    setEditContactData({
      name: contact.name,
      title: contact.title || '',
      email: contact.email || '',
      phone: contact.phone || '',
      notes: contact.notes || '',
    });
  };

  const handleSaveContact = async (contactId: string) => {
    setSavingContact(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/jobs/${id}/contacts/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editContactData.name,
          title: editContactData.title || null,
          email: editContactData.email || null,
          phone: editContactData.phone || null,
          notes: editContactData.notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update contact');
      }

      const updated: Contact = await res.json();
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? updated : c))
      );
      setEditingContact(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contact');
    } finally {
      setSavingContact(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Delete this contact?')) return;

    try {
      const res = await fetch(`/api/admin/jobs/${id}/contacts/${contactId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete contact');
      setContacts((prev) => prev.filter((c) => c.id !== contactId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact');
    }
  };

  if (sessionStatus === 'loading' || fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-red-400">{error || 'Application not found.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/jobs"
              className="text-gray-500 transition-colors hover:text-yellow-500 dark:hover:text-yellow-300"
            >
              &larr; Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
              {company}
            </h1>
          </div>
          <button
            onClick={handleDeleteJob}
            className="text-red-400 transition-colors hover:text-red-300"
          >
            Delete
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/20 p-3 text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-lg bg-green-500/20 p-3 text-green-400">
            {success}
          </div>
        )}

        {/* ── Application Info ── */}
        <div className={`${cardClass} mb-8`}>
          <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            Application Info
          </h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label
                htmlFor="company"
                className="mb-1 block text-sm text-gray-500"
              >
                Company
              </label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label
                htmlFor="position"
                className="mb-1 block text-sm text-gray-500"
              >
                Position
              </label>
              <input
                type="text"
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="status"
                  className="mb-1 block text-sm text-gray-500"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputClass}
                >
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="applicationDate"
                  className="mb-1 block text-sm text-gray-500"
                >
                  Application Date
                </label>
                <input
                  type="date"
                  id="applicationDate"
                  value={applicationDate}
                  onChange={(e) => setApplicationDate(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="source"
                  className="mb-1 block text-sm text-gray-500"
                >
                  Source
                </label>
                <select
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className={inputClass}
                >
                  {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              {(source === 'REFERRAL' || source === 'OTHER') && (
                <div>
                  <label
                    htmlFor="sourceDetail"
                    className="mb-1 block text-sm text-gray-500"
                  >
                    Source Detail
                  </label>
                  <input
                    type="text"
                    id="sourceDetail"
                    value={sourceDetail}
                    onChange={(e) => setSourceDetail(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="postingUrl"
                className="mb-1 block text-sm text-gray-500"
              >
                Posting URL
              </label>
              <input
                type="url"
                id="postingUrl"
                value={postingUrl}
                onChange={(e) => setPostingUrl(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="border-t border-gray-300 pt-6 dark:border-gray-700">
              <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-400">
                Compensation
              </h3>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="salaryMin"
                    className="mb-1 block text-sm text-gray-500"
                  >
                    Salary Min
                  </label>
                  <input
                    type="number"
                    id="salaryMin"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="salaryMax"
                    className="mb-1 block text-sm text-gray-500"
                  >
                    Salary Max
                  </label>
                  <input
                    type="number"
                    id="salaryMax"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="salaryNotes"
                  className="mb-1 block text-sm text-gray-500"
                >
                  Salary Notes
                </label>
                <input
                  type="text"
                  id="salaryNotes"
                  value={salaryNotes}
                  onChange={(e) => setSalaryNotes(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="border-t border-gray-300 pt-6 dark:border-gray-700">
              <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-400">
                Location
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="location"
                    className="mb-1 block text-sm text-gray-500"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State or Remote"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="locationType"
                    className="mb-1 block text-sm text-gray-500"
                  >
                    Location Type
                  </label>
                  <select
                    id="locationType"
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">--</option>
                    {Object.entries(LOCATION_TYPE_LABELS).map(
                      ([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-6 dark:border-gray-700">
              <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-400">
                Additional Details
              </h3>

              <div className="mb-4">
                <label
                  htmlFor="resumeVersion"
                  className="mb-1 block text-sm text-gray-500"
                >
                  Resume Version
                </label>
                <input
                  type="text"
                  id="resumeVersion"
                  value={resumeVersion}
                  onChange={(e) => setResumeVersion(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="notes"
                  className="mb-1 block text-sm text-gray-500"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="followUpDate"
                    className="mb-1 block text-sm text-gray-500"
                  >
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    id="followUpDate"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="followUpNotes"
                    className="mb-1 block text-sm text-gray-500"
                  >
                    Follow-up Notes
                  </label>
                  <input
                    type="text"
                    id="followUpNotes"
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-yellow-500 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-600 disabled:opacity-50 dark:bg-yellow-300 dark:hover:bg-yellow-400"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* ── Interviews ── */}
        <div className={`${cardClass} mb-8`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Interviews
            </h2>
            <button
              onClick={() => setShowAddInterview(!showAddInterview)}
              className="text-sm text-yellow-600 transition-colors hover:text-yellow-500 dark:text-yellow-300 dark:hover:text-yellow-200"
            >
              {showAddInterview ? 'Cancel' : '+ Add Interview'}
            </button>
          </div>

          {/* Add interview form */}
          {showAddInterview && (
            <form
              onSubmit={handleAddInterview}
              className="mb-6 space-y-4 rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/50"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-500">
                    Type
                  </label>
                  <select
                    value={newInterview.type}
                    onChange={(e) =>
                      setNewInterview((p) => ({ ...p, type: e.target.value }))
                    }
                    className={inputClass}
                  >
                    {Object.entries(INTERVIEW_TYPE_LABELS).map(
                      ([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-500">
                    Scheduled Date
                  </label>
                  <input
                    type="datetime-local"
                    value={newInterview.scheduledDate}
                    onChange={(e) =>
                      setNewInterview((p) => ({
                        ...p,
                        scheduledDate: e.target.value,
                      }))
                    }
                    className={inputClass}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-500">
                  Interviewer Names
                </label>
                <input
                  type="text"
                  value={newInterview.interviewerNames}
                  onChange={(e) =>
                    setNewInterview((p) => ({
                      ...p,
                      interviewerNames: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-500">
                  Prep Notes
                </label>
                <textarea
                  value={newInterview.prepNotes}
                  onChange={(e) =>
                    setNewInterview((p) => ({
                      ...p,
                      prepNotes: e.target.value,
                    }))
                  }
                  rows={3}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={savingInterview}
                className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-600 disabled:opacity-50 dark:bg-yellow-300 dark:hover:bg-yellow-400"
              >
                {savingInterview ? 'Adding...' : 'Add Interview'}
              </button>
            </form>
          )}

          {/* Interview list */}
          {interviews.length === 0 && !showAddInterview && (
            <p className="text-sm text-gray-500">No interviews yet.</p>
          )}

          <div className="space-y-3">
            {interviews.map((interview) => {
              const isExpanded = expandedInterview === interview.id;
              const isEditing = editingInterview === interview.id;

              return (
                <div
                  key={interview.id}
                  className="rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  {/* Interview header */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedInterview(isExpanded ? null : interview.id)
                    }
                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900 dark:text-gray-200">
                        {INTERVIEW_TYPE_LABELS[interview.type] ||
                          interview.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDateTime(interview.scheduledDate)}
                      </span>
                      {interview.interviewerNames && (
                        <span className="text-sm text-gray-400">
                          with {interview.interviewerNames}
                        </span>
                      )}
                      <RatingDisplay rating={interview.rating} />
                    </div>
                    <span className="text-gray-400">
                      {isExpanded ? '\u25B2' : '\u25BC'}
                    </span>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-600">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="mb-1 block text-sm text-gray-500">
                                Type
                              </label>
                              <select
                                value={editInterviewData.type}
                                onChange={(e) =>
                                  setEditInterviewData((p) => ({
                                    ...p,
                                    type: e.target.value,
                                  }))
                                }
                                className={inputClass}
                              >
                                {Object.entries(INTERVIEW_TYPE_LABELS).map(
                                  ([key, label]) => (
                                    <option key={key} value={key}>
                                      {label}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                            <div>
                              <label className="mb-1 block text-sm text-gray-500">
                                Scheduled Date
                              </label>
                              <input
                                type="datetime-local"
                                value={editInterviewData.scheduledDate}
                                onChange={(e) =>
                                  setEditInterviewData((p) => ({
                                    ...p,
                                    scheduledDate: e.target.value,
                                  }))
                                }
                                className={inputClass}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="mb-1 block text-sm text-gray-500">
                              Interviewer Names
                            </label>
                            <input
                              type="text"
                              value={editInterviewData.interviewerNames}
                              onChange={(e) =>
                                setEditInterviewData((p) => ({
                                  ...p,
                                  interviewerNames: e.target.value,
                                }))
                              }
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm text-gray-500">
                              Prep Notes
                            </label>
                            <textarea
                              value={editInterviewData.prepNotes}
                              onChange={(e) =>
                                setEditInterviewData((p) => ({
                                  ...p,
                                  prepNotes: e.target.value,
                                }))
                              }
                              rows={3}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm text-gray-500">
                              Questions Asked
                            </label>
                            <textarea
                              value={editInterviewData.questionsAsked}
                              onChange={(e) =>
                                setEditInterviewData((p) => ({
                                  ...p,
                                  questionsAsked: e.target.value,
                                }))
                              }
                              rows={3}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm text-gray-500">
                              Your Answers
                            </label>
                            <textarea
                              value={editInterviewData.yourAnswers}
                              onChange={(e) =>
                                setEditInterviewData((p) => ({
                                  ...p,
                                  yourAnswers: e.target.value,
                                }))
                              }
                              rows={3}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm text-gray-500">
                              Debrief Notes
                            </label>
                            <textarea
                              value={editInterviewData.debriefNotes}
                              onChange={(e) =>
                                setEditInterviewData((p) => ({
                                  ...p,
                                  debriefNotes: e.target.value,
                                }))
                              }
                              rows={3}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm text-gray-500">
                              Rating (1-5)
                            </label>
                            <select
                              value={editInterviewData.rating}
                              onChange={(e) =>
                                setEditInterviewData((p) => ({
                                  ...p,
                                  rating: e.target.value,
                                }))
                              }
                              className={inputClass}
                            >
                              <option value="">--</option>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="mb-1 block text-sm text-gray-500">
                                Follow-up Sent
                              </label>
                              <input
                                type="date"
                                value={editInterviewData.followUpSentAt}
                                onChange={(e) =>
                                  setEditInterviewData((p) => ({
                                    ...p,
                                    followUpSentAt: e.target.value,
                                  }))
                                }
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-sm text-gray-500">
                                Expected Response
                              </label>
                              <input
                                type="date"
                                value={editInterviewData.expectedResponseDate}
                                onChange={(e) =>
                                  setEditInterviewData((p) => ({
                                    ...p,
                                    expectedResponseDate: e.target.value,
                                  }))
                                }
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-sm text-gray-500">
                                Response Received
                              </label>
                              <input
                                type="date"
                                value={editInterviewData.responseReceivedAt}
                                onChange={(e) =>
                                  setEditInterviewData((p) => ({
                                    ...p,
                                    responseReceivedAt: e.target.value,
                                  }))
                                }
                                className={inputClass}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSaveInterview(interview.id)}
                              disabled={savingInterview}
                              className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-600 disabled:opacity-50 dark:bg-yellow-300 dark:hover:bg-yellow-400"
                            >
                              {savingInterview ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingInterview(null)}
                              className="rounded-lg px-4 py-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {interview.prepNotes && (
                            <div>
                              <span className="text-xs font-medium text-gray-400 uppercase">
                                Prep Notes
                              </span>
                              <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                {interview.prepNotes}
                              </p>
                            </div>
                          )}
                          {interview.questionsAsked && (
                            <div>
                              <span className="text-xs font-medium text-gray-400 uppercase">
                                Questions Asked
                              </span>
                              <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                {interview.questionsAsked}
                              </p>
                            </div>
                          )}
                          {interview.yourAnswers && (
                            <div>
                              <span className="text-xs font-medium text-gray-400 uppercase">
                                Your Answers
                              </span>
                              <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                {interview.yourAnswers}
                              </p>
                            </div>
                          )}
                          {interview.debriefNotes && (
                            <div>
                              <span className="text-xs font-medium text-gray-400 uppercase">
                                Debrief Notes
                              </span>
                              <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                {interview.debriefNotes}
                              </p>
                            </div>
                          )}
                          {(interview.followUpSentAt ||
                            interview.expectedResponseDate ||
                            interview.responseReceivedAt) && (
                            <div className="flex gap-6 text-sm text-gray-500">
                              {interview.followUpSentAt && (
                                <span>
                                  Follow-up sent:{' '}
                                  {formatDate(interview.followUpSentAt)}
                                </span>
                              )}
                              {interview.expectedResponseDate && (
                                <span>
                                  Expected response:{' '}
                                  {formatDate(interview.expectedResponseDate)}
                                </span>
                              )}
                              {interview.responseReceivedAt && (
                                <span>
                                  Response received:{' '}
                                  {formatDate(interview.responseReceivedAt)}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => startEditInterview(interview)}
                              className="text-sm text-yellow-600 transition-colors hover:text-yellow-500 dark:text-yellow-300 dark:hover:text-yellow-200"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteInterview(interview.id)
                              }
                              className="text-sm text-red-400 transition-colors hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Contacts ── */}
        <div className={`${cardClass} mb-8`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Contacts
            </h2>
            <button
              onClick={() => setShowAddContact(!showAddContact)}
              className="text-sm text-yellow-600 transition-colors hover:text-yellow-500 dark:text-yellow-300 dark:hover:text-yellow-200"
            >
              {showAddContact ? 'Cancel' : '+ Add Contact'}
            </button>
          </div>

          {/* Add contact form */}
          {showAddContact && (
            <form
              onSubmit={handleAddContact}
              className="mb-6 space-y-4 rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/50"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-500">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact((p) => ({ ...p, name: e.target.value }))
                    }
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-500">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newContact.title}
                    onChange={(e) =>
                      setNewContact((p) => ({ ...p, title: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-500">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact((p) => ({ ...p, email: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-500">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact((p) => ({ ...p, phone: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-500">
                  Notes
                </label>
                <textarea
                  value={newContact.notes}
                  onChange={(e) =>
                    setNewContact((p) => ({ ...p, notes: e.target.value }))
                  }
                  rows={2}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={savingContact}
                className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-600 disabled:opacity-50 dark:bg-yellow-300 dark:hover:bg-yellow-400"
              >
                {savingContact ? 'Adding...' : 'Add Contact'}
              </button>
            </form>
          )}

          {/* Contact list */}
          {contacts.length === 0 && !showAddContact && (
            <p className="text-sm text-gray-500">No contacts yet.</p>
          )}

          <div className="space-y-3">
            {contacts.map((contact) => {
              const isEditing = editingContact === contact.id;

              return (
                <div
                  key={contact.id}
                  className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-600"
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-sm text-gray-500">
                            Name
                          </label>
                          <input
                            type="text"
                            value={editContactData.name}
                            onChange={(e) =>
                              setEditContactData((p) => ({
                                ...p,
                                name: e.target.value,
                              }))
                            }
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm text-gray-500">
                            Title
                          </label>
                          <input
                            type="text"
                            value={editContactData.title}
                            onChange={(e) =>
                              setEditContactData((p) => ({
                                ...p,
                                title: e.target.value,
                              }))
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-sm text-gray-500">
                            Email
                          </label>
                          <input
                            type="email"
                            value={editContactData.email}
                            onChange={(e) =>
                              setEditContactData((p) => ({
                                ...p,
                                email: e.target.value,
                              }))
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm text-gray-500">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={editContactData.phone}
                            onChange={(e) =>
                              setEditContactData((p) => ({
                                ...p,
                                phone: e.target.value,
                              }))
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-500">
                          Notes
                        </label>
                        <textarea
                          value={editContactData.notes}
                          onChange={(e) =>
                            setEditContactData((p) => ({
                              ...p,
                              notes: e.target.value,
                            }))
                          }
                          rows={2}
                          className={inputClass}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveContact(contact.id)}
                          disabled={savingContact}
                          className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-600 disabled:opacity-50 dark:bg-yellow-300 dark:hover:bg-yellow-400"
                        >
                          {savingContact ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingContact(null)}
                          className="rounded-lg px-4 py-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-gray-200">
                            {contact.name}
                          </span>
                          {contact.title && (
                            <span className="ml-2 text-sm text-gray-500">
                              {contact.title}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => startEditContact(contact)}
                            className="text-sm text-yellow-600 transition-colors hover:text-yellow-500 dark:text-yellow-300 dark:hover:text-yellow-200"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteContact(contact.id)}
                            className="text-sm text-red-400 transition-colors hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-4 text-sm">
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-yellow-600 hover:text-yellow-500 dark:text-yellow-300 dark:hover:text-yellow-200"
                          >
                            {contact.email}
                          </a>
                        )}
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-yellow-600 hover:text-yellow-500 dark:text-yellow-300 dark:hover:text-yellow-200"
                          >
                            {contact.phone}
                          </a>
                        )}
                      </div>
                      {contact.notes && (
                        <p className="mt-1 text-sm text-gray-500">
                          {contact.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
