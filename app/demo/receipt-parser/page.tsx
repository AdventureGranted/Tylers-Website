'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiUpload, HiPhotograph, HiX, HiSparkles } from 'react-icons/hi';
import { FaReceipt } from 'react-icons/fa';
import Image from 'next/image';
import PageTransition from '@/app/components/PageTransition';

interface ParsedItem {
  name: string;
  price: number;
}

interface ParsedReceipt {
  vendor: string | null;
  date: string | null;
  items: ParsedItem[];
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  toolAmount: number;
  materialAmount: number;
  raw_text?: string;
  method: 'vision' | 'ocr' | 'pdf';
}

export default function ReceiptParserDemo() {
  const [file, setFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isPdf, setIsPdf] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ParsedReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback((fileInput: File) => {
    const isImage = fileInput.type.startsWith('image/');
    const filePdf = fileInput.type === 'application/pdf';

    if (!isImage && !filePdf) {
      setError('Please upload an image or PDF file');
      return;
    }

    if (fileInput.size > 10 * 1024 * 1024) {
      setError('File must be less than 10MB');
      return;
    }

    setFileName(fileInput.name);
    setIsPdf(filePdf);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setFile(e.target?.result as string);
    };
    reader.readAsDataURL(fileInput);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearFile = () => {
    setFile(null);
    setFileName('');
    setIsPdf(false);
    setResult(null);
    setError(null);
  };

  const parseReceipt = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/receipts/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to parse receipt');
        return;
      }

      setResult(data);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '—';
    return `$${amount.toFixed(2)}`;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--background)]">
        <main className="mx-auto max-w-4xl px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-yellow-500 dark:text-yellow-300">
              <HiSparkles />
              <span className="text-sm font-medium">AI-Powered Demo</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold text-[var(--text-primary)]">
              Receipt Parser
            </h1>
            <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">
              Upload a receipt image and watch AI extract vendor info, line
              items, totals, and automatically categorize expenses into tools vs
              materials.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                className={`relative rounded-2xl border-2 border-dashed p-8 transition-all ${
                  dragActive
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-[var(--card-border)] bg-[var(--card-bg)]'
                }`}
                onDrop={handleDrop}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                style={{ boxShadow: 'var(--card-shadow)' }}
              >
                {file ? (
                  <div className="relative">
                    <button
                      onClick={clearFile}
                      className="absolute -top-2 -right-2 z-10 rounded-full bg-red-500 p-1 text-white shadow-lg transition-transform hover:scale-110"
                    >
                      <HiX className="h-5 w-5" />
                    </button>
                    {isPdf ? (
                      <div className="flex aspect-[3/4] flex-col items-center justify-center rounded-xl bg-[var(--input-bg)]">
                        <FaReceipt className="mb-4 h-16 w-16 text-red-500" />
                        <p className="text-lg font-medium text-[var(--text-primary)]">
                          PDF Document
                        </p>
                        <p className="text-sm text-[var(--text-muted)]">
                          Ready to parse
                        </p>
                      </div>
                    ) : (
                      <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                        <Image
                          src={file}
                          alt="Receipt preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <p className="mt-3 truncate text-center text-sm text-[var(--text-muted)]">
                      {fileName}
                    </p>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center">
                    <div className="mb-4 rounded-full bg-[var(--input-bg)] p-4">
                      <HiUpload className="h-8 w-8 text-[var(--text-muted)]" />
                    </div>
                    <p className="mb-2 text-lg font-medium text-[var(--text-primary)]">
                      Drop your receipt here
                    </p>
                    <p className="mb-4 text-sm text-[var(--text-muted)]">
                      or click to browse
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <HiPhotograph />
                      <span>PNG, JPG, PDF up to 10MB</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleInputChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Parse Button */}
              {file && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={parseReceipt}
                  disabled={isLoading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 px-6 py-4 font-bold text-gray-900 transition-all hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-yellow-300 dark:hover:bg-yellow-400"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
                      Parsing...
                    </>
                  ) : (
                    <>
                      <FaReceipt />
                      Parse Receipt
                    </>
                  )}
                </motion.button>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 rounded-xl bg-red-500/10 p-4 text-red-500"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6"
              style={{ boxShadow: 'var(--card-shadow)' }}
            >
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[var(--text-primary)]">
                <FaReceipt className="text-yellow-500 dark:text-yellow-300" />
                Parsed Results
              </h2>

              {result ? (
                <div className="space-y-4">
                  {/* Method Badge */}
                  <div className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-500 dark:text-purple-400">
                    {result.method === 'vision'
                      ? '👁️ Vision AI'
                      : result.method === 'pdf'
                        ? '📄 PDF Text'
                        : '📝 OCR + AI'}
                  </div>

                  {/* Vendor & Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Vendor</p>
                      <p className="font-medium text-[var(--text-primary)]">
                        {result.vendor || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Date</p>
                      <p className="font-medium text-[var(--text-primary)]">
                        {result.date || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  {result.items.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs text-[var(--text-muted)]">
                        Items ({result.items.length})
                      </p>
                      <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg bg-[var(--input-bg)] p-3">
                        {result.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-sm text-[var(--text-secondary)]"
                          >
                            <span className="truncate pr-2">{item.name}</span>
                            <span className="shrink-0">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="space-y-2 border-t border-[var(--card-border)] pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">Subtotal</span>
                      <span className="text-[var(--text-primary)]">
                        {formatCurrency(result.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">Tax</span>
                      <span className="text-[var(--text-primary)]">
                        {formatCurrency(result.tax)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-[var(--text-primary)]">Total</span>
                      <span className="text-yellow-500 dark:text-yellow-300">
                        {formatCurrency(result.total)}
                      </span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="grid grid-cols-2 gap-4 rounded-xl bg-[var(--input-bg)] p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-500">
                        {formatCurrency(result.toolAmount)}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">Tools</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">
                        {formatCurrency(result.materialAmount)}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Materials
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-[var(--input-bg)] p-4">
                    <FaReceipt className="h-8 w-8 text-[var(--text-muted)]" />
                  </div>
                  <p className="text-[var(--text-muted)]">
                    Upload a receipt and click &quot;Parse Receipt&quot; to see
                    results
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6"
            style={{ boxShadow: 'var(--card-shadow)' }}
          >
            <h2 className="mb-4 text-xl font-bold text-[var(--text-primary)]">
              How it works
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10 font-bold text-yellow-500 dark:text-yellow-300">
                  1
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  <strong>Images:</strong> Vision AI (llama3.2-vision) directly
                  reads the receipt
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10 font-bold text-yellow-500 dark:text-yellow-300">
                  2
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  <strong>Fallback:</strong> OCR (Tesseract) extracts text, then
                  AI parses it
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10 font-bold text-yellow-500 dark:text-yellow-300">
                  3
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  <strong>PDFs:</strong> Text extracted directly, then AI parses
                  the content
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10 font-bold text-yellow-500 dark:text-yellow-300">
                  4
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  <strong>Output:</strong> Structured data with tool/material
                  categorization
                </p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
