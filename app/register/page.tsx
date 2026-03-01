'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiOutlineUserAdd } from 'react-icons/hi';
import { containerVariants, itemVariants } from '@/app/lib/animations';

function RegisterForm() {
  const { status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (status === 'authenticated') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Display name is required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push(
        `/login?registered=true&callbackUrl=${encodeURIComponent(callbackUrl)}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-lg bg-red-500/20 p-3 text-red-400">{error}</div>
      )}

      <motion.div variants={itemVariants}>
        <label htmlFor="name" className="mb-1 block text-sm text-gray-500">
          Display Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300/50 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-yellow-300"
          placeholder="Your name"
          required
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <label htmlFor="email" className="mb-1 block text-sm text-gray-500">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300/50 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-yellow-300"
          required
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <label htmlFor="password" className="mb-1 block text-sm text-gray-500">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300/50 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-yellow-300"
          required
          minLength={8}
        />
        <p className="mt-1 text-xs text-gray-500">
          Must be at least 8 characters
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm text-gray-500"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300/50 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-yellow-300"
          required
          minLength={8}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-yellow-500 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-600 disabled:opacity-50 dark:bg-yellow-300 dark:hover:bg-yellow-400"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-center text-sm text-gray-500"
      >
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-yellow-500 hover:underline dark:text-yellow-300"
        >
          Sign in
        </Link>
      </motion.p>
    </motion.form>
  );
}

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      {/* Gradient orbs — top-left & bottom-right of section */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-64 w-96 -translate-x-1/2 rounded-full bg-purple-500/15 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-56 w-80 translate-x-1/2 rounded-full bg-yellow-300/15 blur-[100px]" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h1 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900 dark:text-gray-200">
            <HiOutlineUserAdd className="h-8 w-8 text-purple-500 dark:text-purple-400" />
            Create Account
          </h1>
          <div className="mx-auto mt-4 h-1 w-full max-w-[8rem] rounded-full bg-gradient-to-r from-purple-500 to-yellow-300" />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-gray-300 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <Suspense
            fallback={
              <div className="text-center text-gray-500">Loading...</div>
            }
          >
            <RegisterForm />
          </Suspense>
        </motion.div>
      </motion.div>
    </div>
  );
}
