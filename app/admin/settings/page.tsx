'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { HiOutlineCog } from 'react-icons/hi';
import { BsTelephone } from 'react-icons/bs';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPhone, setShowPhone] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/settings');
      return;
    }
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
      return;
    }
    if (status === 'authenticated') {
      fetchSettings();
    }
  }, [status, session, router]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setShowPhone(data.showPhone);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (value: boolean) => {
    setShowPhone(value);
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showPhone: value }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setShowPhone(!value);
      }
    } catch {
      setShowPhone(!value);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-1 text-gray-500 transition-colors hover:text-yellow-500 dark:hover:text-yellow-300"
          >
            <AiOutlineArrowLeft />
            Back
          </Link>
        </div>

        <div className="mb-8 flex items-center gap-3">
          <HiOutlineCog className="h-8 w-8 text-yellow-500 dark:text-yellow-300" />
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-gray-200">
            Site Settings
          </h1>
        </div>

        {/* Contact Info Settings */}
        <div className="rounded-xl border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-200">
            Contact Information
          </h2>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500 dark:bg-yellow-300/10 dark:text-yellow-300">
                <BsTelephone className="text-lg" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-200">
                  Show Phone Number
                </p>
                <p className="text-sm text-gray-500">
                  {showPhone
                    ? 'Phone number is visible on contact page and to the AI chatbot'
                    : 'Phone number is hidden from visitors and the AI chatbot'}
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={showPhone}
              onClick={() => handleToggle(!showPhone)}
              disabled={saving}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800 ${
                showPhone
                  ? 'bg-yellow-500 dark:bg-yellow-300'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  showPhone ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {saved && (
            <p className="mt-3 text-sm text-green-600 dark:text-green-400">
              Settings saved successfully.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
