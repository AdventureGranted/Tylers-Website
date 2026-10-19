'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiOutlineLockClosed } from 'react-icons/hi';
import { containerVariants, itemVariants } from '@/app/lib/animations';

function LoginForm() {
  const { status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const registered = searchParams.get('registered');
  const [success, setSuccess] = useState(() =>
    registered === 'true' ? 'Account created successfully! Please sign in.' : ''
  );

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
    setSuccess('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push(callbackUrl);
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

      {success && (
        <div className="rounded-lg bg-green-500/20 p-3 text-green-400">
          {success}
        </div>
      )}

      <motion.div variants={itemVariants}>
        <label htmlFor="email" className="mb-1 block text-sm text-gray-500">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus:border-accent focus:ring-accent/50 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
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
          className="focus:border-accent focus:ring-accent/50 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          required
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <button
          type="submit"
          disabled={loading}
          className="bg-accent-fill hover:bg-accent-fill-hover w-full rounded-lg py-2 font-semibold text-gray-900 transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-center text-sm text-gray-500"
      >
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-accent hover:underline">
          Create one
        </Link>
      </motion.p>
    </motion.form>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-clip bg-gray-100 px-4 dark:bg-gray-900">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative w-full max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="relative mb-8 text-center"
        >
          <h1 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900 dark:text-gray-200">
            <HiOutlineLockClosed className="h-8 w-8 text-purple-500 dark:text-purple-400" />
            Sign In
          </h1>
          <div className="bg-accent mx-auto mt-4 h-1 w-full max-w-[8rem] rounded-full" />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative rounded-2xl border border-gray-300 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <Suspense
            fallback={
              <div className="text-center text-gray-500">Loading...</div>
            }
          >
            <LoginForm />
          </Suspense>
        </motion.div>
      </motion.div>
    </div>
  );
}
