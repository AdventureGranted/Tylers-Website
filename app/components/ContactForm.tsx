'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPaperAirplane } from 'react-icons/hi';
import { useToast } from '@/app/hooks/useToast';
import { containerVariants, itemVariants } from '@/app/lib/animations';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear the field's error as soon as the user starts fixing it
    setFieldErrors((prev) =>
      prev[e.target.name as keyof typeof prev]
        ? { ...prev, [e.target.name]: undefined }
        : prev
    );
  };

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!formData.name.trim()) {
      errors.name = 'Please enter your name.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      errors.message = 'Please enter a message.';
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstInvalid = ['name', 'email', 'message'].find(
        (f) => errors[f as keyof typeof errors]
      );
      if (firstInvalid) document.getElementById(firstInvalid)?.focus();
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      toast.success("Message sent successfully! I'll get back to you soon.");
    } catch (error) {
      setStatus('error');
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      setErrorMessage(message);
      toast.error(message);
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-green-500/50 bg-green-500/10 p-8 text-center md:rounded-3xl md:p-10"
      >
        <div className="mb-4 text-4xl">✓</div>
        <h3 className="mb-2 text-xl font-semibold text-green-400">
          Message Sent!
        </h3>
        <p className="text-gray-700 dark:text-gray-400">
          Thank you for reaching out. I&apos;ll get back to you as soon as
          possible.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-yellow-300 hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-gray-300 bg-white p-6 shadow-md md:rounded-3xl md:p-10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg"
    >
      <h2 className="mb-6 text-center text-xl font-semibold text-gray-900 md:text-2xl dark:text-gray-200">
        Send Me a Message
      </h2>

      {status === 'error' && (
        <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-center text-red-400">
          {errorMessage}
        </div>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-4 md:space-y-6"
      >
        <motion.div
          variants={itemVariants}
          className="grid gap-4 sm:grid-cols-2 md:gap-6"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm text-gray-700 dark:text-gray-400"
            >
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 focus:outline-none dark:bg-gray-700 dark:text-gray-200 ${
                fieldErrors.name
                  ? 'border-red-400 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Your name"
            />
            {fieldErrors.name && (
              <p
                id="name-error"
                className="mt-1 text-sm text-red-500 dark:text-red-400"
              >
                {fieldErrors.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-gray-700 dark:text-gray-400"
            >
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 focus:outline-none dark:bg-gray-700 dark:text-gray-200 ${
                fieldErrors.email
                  ? 'border-red-400 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="your@email.com"
            />
            {fieldErrors.email && (
              <p
                id="email-error"
                className="mt-1 text-sm text-red-500 dark:text-red-400"
              >
                {fieldErrors.email}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm text-gray-700 dark:text-gray-400"
          >
            Phone <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            placeholder="(123) 456-7890"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label
            htmlFor="message"
            className="mb-2 block text-sm text-gray-700 dark:text-gray-400"
          >
            Message <span className="text-red-400">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.message}
            aria-describedby={fieldErrors.message ? 'message-error' : undefined}
            className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 focus:outline-none dark:bg-gray-700 dark:text-gray-200 ${
              fieldErrors.message
                ? 'border-red-400 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="How can I help you?"
          />
          {fieldErrors.message && (
            <p
              id="message-error"
              className="mt-1 text-sm text-red-500 dark:text-red-400"
            >
              {fieldErrors.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-300 px-6 py-4 font-bold text-gray-900 transition-all duration-300 hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-300/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'loading' ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <HiPaperAirplane className="text-lg" />
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    </form>
  );
}
