'use client';

import { useState } from 'react';
import { HiPaperAirplane } from 'react-icons/hi';
import { useToast } from '@/app/hooks/useToast';

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
  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="rounded-2xl border border-green-500/50 bg-green-500/10 p-8 text-center md:rounded-3xl md:p-10">
        <div className="mb-4 text-4xl">✓</div>
        <h3 className="mb-2 text-xl font-semibold text-green-400">
          Message Sent!
        </h3>
        <p className="text-[var(--text-secondary)]">
          Thank you for reaching out. I&apos;ll get back to you as soon as
          possible.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-yellow-300 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 md:rounded-3xl md:p-10"
      style={{ boxShadow: 'var(--card-shadow)' }}
    >
      <h2 className="mb-6 text-center text-xl font-semibold text-[var(--text-primary)] md:text-2xl">
        Send Me a Message
      </h2>

      {status === 'error' && (
        <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-center text-red-400">
          {errorMessage}
        </div>
      )}

      <div className="space-y-4 md:space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm text-[var(--text-secondary)]"
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
              className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-yellow-300 focus:outline-none"
              placeholder="Your name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-[var(--text-secondary)]"
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
              className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-yellow-300 focus:outline-none"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm text-[var(--text-secondary)]"
          >
            Phone <span className="text-[var(--text-muted)]">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-yellow-300 focus:outline-none"
            placeholder="(123) 456-7890"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm text-[var(--text-secondary)]"
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
            className="w-full resize-none rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-yellow-300 focus:outline-none"
            placeholder="How can I help you?"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-300 px-6 py-4 font-bold text-gray-900 transition-all duration-300 hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-300/20 disabled:cursor-not-allowed disabled:opacity-50"
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
      </div>
    </form>
  );
}
