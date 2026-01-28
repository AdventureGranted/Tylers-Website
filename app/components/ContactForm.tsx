'use client';

import { useState } from 'react';
import { HiPaperAirplane } from 'react-icons/hi';

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
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-green-500/50 bg-green-500/10 p-8 text-center md:rounded-3xl md:p-10">
        <div className="mb-4 text-4xl">✓</div>
        <h3 className="mb-2 text-xl font-semibold text-green-400">
          Message Sent!
        </h3>
        <p className="text-gray-400">
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
      className="rounded-2xl border border-gray-700 bg-gray-800 p-6 md:rounded-3xl md:p-10"
    >
      <h2 className="mb-6 text-center text-xl font-semibold text-gray-200 md:text-2xl">
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
            <label htmlFor="name" className="mb-2 block text-sm text-gray-400">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-gray-200 placeholder-gray-500 transition-colors focus:border-yellow-300 focus:outline-none"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-gray-400">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-gray-200 placeholder-gray-500 transition-colors focus:border-yellow-300 focus:outline-none"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm text-gray-400">
            Phone <span className="text-gray-600">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-gray-200 placeholder-gray-500 transition-colors focus:border-yellow-300 focus:outline-none"
            placeholder="(123) 456-7890"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm text-gray-400">
            Message <span className="text-red-400">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full resize-none rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-gray-200 placeholder-gray-500 transition-colors focus:border-yellow-300 focus:outline-none"
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
