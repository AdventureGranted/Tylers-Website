'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  HiUpload,
  HiPhotograph,
  HiX,
  HiSparkles,
  HiEye,
  HiDocumentText,
  HiChip,
  HiClipboardList,
} from 'react-icons/hi';
import { FaReceipt } from 'react-icons/fa';
import Image from 'next/image';
import PageTransition from '@/app/components/PageTransition';

interface ParsedItem {
  name: string;
  price: number;
  category: 'material' | 'tool' | 'misc';
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
  miscAmount: number;
  raw_text?: string;
  method: 'vision' | 'pdf';
}

export default function ReceiptParserDemo() {
  const [file, setFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isPdf, setIsPdf] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ParsedReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSampleData, setIsSampleData] = useState(false);

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
    setIsSampleData(false);

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
    setIsSampleData(false);
  };

  // Sample receipts with pre-parsed mock data for demo purposes
  const sampleReceipts = [
    {
      name: 'Hardware Store',
      description: 'Lumber, drill, screws',
      path: '/samples/receipt-hardware.svg',
      isPdf: false,
      mockData: {
        vendor: 'Hardware Depot',
        date: '2024-01-15',
        items: [
          {
            name: '2x4x8 Lumber (5)',
            price: 24.95,
            category: 'material' as const,
          },
          {
            name: 'Deck Screws 1lb Box',
            price: 8.99,
            category: 'material' as const,
          },
          {
            name: 'Wood Stain - Walnut',
            price: 14.97,
            category: 'material' as const,
          },
          {
            name: 'Paint Brush Set 3pc',
            price: 12.49,
            category: 'material' as const,
          },
          {
            name: 'Cordless Drill 20V',
            price: 89.99,
            category: 'tool' as const,
          },
          {
            name: 'Drill Bit Set 29pc',
            price: 24.99,
            category: 'tool' as const,
          },
          {
            name: 'Sandpaper Assorted',
            price: 6.99,
            category: 'material' as const,
          },
          { name: 'Tax', price: 15.13, category: 'misc' as const },
        ],
        subtotal: 183.37,
        tax: 15.13,
        total: 198.5,
        toolAmount: 114.98,
        materialAmount: 68.39,
        miscAmount: 15.13,
        method: 'vision' as const,
      },
    },
    {
      name: 'Craft Store',
      description: 'Paint, canvas, easel',
      path: '/samples/receipt-craft.svg',
      isPdf: false,
      mockData: {
        vendor: 'Craft World',
        date: '2024-02-20',
        items: [
          {
            name: 'Acrylic Paint Set 24ct',
            price: 18.99,
            category: 'material' as const,
          },
          {
            name: 'Canvas 16x20 (3pk)',
            price: 24.99,
            category: 'material' as const,
          },
          { name: 'Easel - Tabletop', price: 32.99, category: 'tool' as const },
          {
            name: 'Brush Set Artist 12pc',
            price: 15.49,
            category: 'material' as const,
          },
          {
            name: 'Palette Plastic',
            price: 4.99,
            category: 'material' as const,
          },
          {
            name: 'Frame 16x20 Wood',
            price: 19.99,
            category: 'material' as const,
          },
          { name: 'Tax', price: 8.81, category: 'misc' as const },
        ],
        subtotal: 117.44,
        tax: 8.81,
        total: 126.25,
        toolAmount: 32.99,
        materialAmount: 84.45,
        miscAmount: 8.81,
        method: 'vision' as const,
      },
    },
    {
      name: 'Home Improvement',
      description: 'Handles, hinges, tools',
      path: '/samples/receipt-home.svg',
      isPdf: false,
      mockData: {
        vendor: 'Home Improvement Center',
        date: '2024-03-05',
        items: [
          {
            name: 'Cabinet Handle Brass 5pk',
            price: 22.49,
            category: 'material' as const,
          },
          {
            name: 'Drawer Knob Chrome 10pk',
            price: 18.99,
            category: 'material' as const,
          },
          {
            name: 'Hinge Soft Close 6pk',
            price: 34.99,
            category: 'material' as const,
          },
          {
            name: 'Screwdriver Set 8pc',
            price: 19.99,
            category: 'tool' as const,
          },
          {
            name: 'Wood Filler 16oz',
            price: 8.49,
            category: 'material' as const,
          },
          {
            name: 'Spray Paint White 2pk',
            price: 15.98,
            category: 'material' as const,
          },
          {
            name: 'Painters Tape 2 Roll',
            price: 11.99,
            category: 'material' as const,
          },
          {
            name: 'Drop Cloth 9x12',
            price: 12.99,
            category: 'material' as const,
          },
          { name: 'Level 24 Inch', price: 24.99, category: 'tool' as const },
          {
            name: 'Protection Plan 2yr',
            price: 9.99,
            category: 'misc' as const,
          },
          { name: 'Tax', price: 14.48, category: 'misc' as const },
        ],
        subtotal: 180.89,
        tax: 14.48,
        total: 195.37,
        toolAmount: 44.98,
        materialAmount: 125.92,
        miscAmount: 24.47,
        method: 'vision' as const,
      },
    },
    {
      name: 'Electronics (PDF)',
      description: 'Cables, lamp, tools',
      path: '/samples/receipt-electronics.pdf',
      isPdf: true,
      mockData: {
        vendor: 'Tech Electronics',
        date: '2024-03-18',
        items: [
          {
            name: 'USB-C Cable 6ft',
            price: 12.99,
            category: 'material' as const,
          },
          {
            name: 'HDMI Cable 10ft',
            price: 24.99,
            category: 'material' as const,
          },
          {
            name: 'Power Strip 6 Outlet',
            price: 29.99,
            category: 'material' as const,
          },
          {
            name: 'LED Desk Lamp',
            price: 45.99,
            category: 'material' as const,
          },
          {
            name: 'Surge Protector',
            price: 34.99,
            category: 'material' as const,
          },
          {
            name: 'Wire Organizer Kit',
            price: 15.99,
            category: 'material' as const,
          },
          {
            name: 'Electrical Tape 3pk',
            price: 8.49,
            category: 'material' as const,
          },
          {
            name: 'Multimeter Digital',
            price: 39.99,
            category: 'tool' as const,
          },
          { name: 'Tax', price: 19.74, category: 'misc' as const },
        ],
        subtotal: 213.42,
        tax: 19.74,
        total: 233.16,
        toolAmount: 39.99,
        materialAmount: 173.43,
        miscAmount: 19.74,
        method: 'pdf' as const,
      },
    },
  ];

  const loadSampleReceipt = async (
    path: string,
    name: string,
    isPdfFile: boolean,
    mockData: ParsedReceipt
  ) => {
    setError(null);
    setFileName(name);
    setIsPdf(isPdfFile);
    setIsSampleData(true);

    try {
      const response = await fetch(path);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        setFile(e.target?.result as string);
        // Use mock data for samples to demonstrate the feature
        setResult(mockData);
      };
      reader.readAsDataURL(blob);
    } catch {
      setError('Failed to load sample receipt');
    }
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

  // Update item category and recalculate totals
  const updateItemCategory = (
    index: number,
    category: 'material' | 'tool' | 'misc'
  ) => {
    if (!result) return;

    const updatedItems = [...result.items];
    updatedItems[index] = { ...updatedItems[index], category };

    // Recalculate totals
    const toolAmount = updatedItems
      .filter((i) => i.category === 'tool')
      .reduce((sum, i) => sum + i.price, 0);
    const materialAmount = updatedItems
      .filter((i) => i.category === 'material')
      .reduce((sum, i) => sum + i.price, 0);
    const miscAmount = updatedItems
      .filter((i) => i.category === 'misc')
      .reduce((sum, i) => sum + i.price, 0);

    setResult({
      ...result,
      items: updatedItems,
      toolAmount,
      materialAmount,
      miscAmount,
    });
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
                        <p className="mb-3 text-sm text-[var(--text-muted)]">
                          Ready to parse
                        </p>
                        {file && (
                          <a
                            href={file}
                            download={fileName || 'receipt.pdf'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg bg-red-500/20 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/30"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <HiDocumentText className="h-4 w-4" />
                            View PDF
                          </a>
                        )}
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

              {/* Sample Receipts */}
              {!file && (
                <div className="mt-4">
                  <p className="mb-3 text-center text-sm text-[var(--text-muted)]">
                    Or try a sample receipt:
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {sampleReceipts.map((sample) => (
                      <button
                        key={sample.name}
                        onClick={() =>
                          loadSampleReceipt(
                            sample.path,
                            sample.name,
                            sample.isPdf,
                            sample.mockData
                          )
                        }
                        className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] p-3 text-left transition-all hover:border-yellow-500/50 hover:bg-[var(--card-bg)]"
                      >
                        {sample.isPdf ? (
                          <HiDocumentText className="mb-2 h-5 w-5 text-red-500" />
                        ) : (
                          <FaReceipt className="mb-2 h-5 w-5 text-yellow-500 dark:text-yellow-300" />
                        )}
                        <p className="text-xs font-medium text-[var(--text-primary)]">
                          {sample.name}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {sample.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Parse Button - only show for real uploads, not samples */}
              {file && !isSampleData && (
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

              {/* Sample data note */}
              {file && isSampleData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl bg-blue-500/10 p-3 text-center text-sm text-blue-400"
                >
                  This is sample data for demo purposes. Upload your own receipt
                  to test the AI parser!
                </motion.div>
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
                  <div className="flex flex-wrap gap-2">
                    {isSampleData && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                        📋 Sample Data
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-500 dark:text-purple-400">
                      {result.method === 'vision'
                        ? '👁️ Vision AI'
                        : '📄 PDF Text'}
                    </span>
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
                        Items ({result.items.length}) - click category to change
                      </p>
                      <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg bg-[var(--input-bg)] p-3">
                        {result.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="min-w-0 flex-1 truncate text-[var(--text-secondary)]">
                              {item.name}
                            </span>
                            <span className="shrink-0 text-[var(--text-primary)]">
                              {formatCurrency(item.price)}
                            </span>
                            <select
                              value={item.category}
                              onChange={(e) =>
                                updateItemCategory(
                                  i,
                                  e.target.value as 'material' | 'tool' | 'misc'
                                )
                              }
                              className={`shrink-0 cursor-pointer rounded-md border-0 px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-yellow-500 focus:outline-none ${
                                item.category === 'material'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : item.category === 'tool'
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : 'bg-orange-500/20 text-orange-400'
                              }`}
                            >
                              <option value="material">Material</option>
                              <option value="tool">Tool</option>
                              <option value="misc">Misc</option>
                            </select>
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
                  <div className="grid grid-cols-3 gap-3 rounded-xl bg-[var(--input-bg)] p-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-500">
                        {formatCurrency(result.materialAmount)}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Materials
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-purple-500">
                        {formatCurrency(result.toolAmount)}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">Tools</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-orange-500">
                        {formatCurrency(result.miscAmount)}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">Misc</p>
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
            className="mt-12"
          >
            <h2 className="mb-8 text-center text-2xl font-bold text-[var(--text-primary)]">
              How it works
            </h2>

            {/* Processing Pipeline */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Step 1: Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group relative rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6"
                style={{ boxShadow: 'var(--card-shadow)' }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                    <HiUpload className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-blue-500">
                      Step 1
                    </span>
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      Upload
                    </h3>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  Drop your receipt image (PNG, JPG) or PDF document. We support
                  both digital and scanned receipts.
                </p>
                {/* Arrow on desktop */}
                <div className="absolute top-1/2 -right-3 z-10 hidden -translate-y-1/2 text-[var(--text-muted)] md:block">
                  →
                </div>
              </motion.div>

              {/* Step 2: Process */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="group relative rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6"
                style={{ boxShadow: 'var(--card-shadow)' }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                    <HiChip className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-purple-500">
                      Step 2
                    </span>
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      AI Processing
                    </h3>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <HiEye className="h-4 w-4 text-purple-400" />
                    <span>Vision AI reads images directly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaReceipt className="h-4 w-4 text-purple-400" />
                    <span>PDF text extraction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiChip className="h-4 w-4 text-purple-400" />
                    <span>Smart categorization</span>
                  </div>
                </div>
                {/* Arrow on desktop */}
                <div className="absolute top-1/2 -right-3 z-10 hidden -translate-y-1/2 text-[var(--text-muted)] md:block">
                  →
                </div>
              </motion.div>

              {/* Step 3: Results */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="group rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6"
                style={{ boxShadow: 'var(--card-shadow)' }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg">
                    <HiClipboardList className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-yellow-500">
                      Step 3
                    </span>
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      Structured Data
                    </h3>
                  </div>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Get organized data ready to use:
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[var(--input-bg)] px-3 py-1 text-xs text-[var(--text-muted)]">
                    Vendor
                  </span>
                  <span className="rounded-full bg-[var(--input-bg)] px-3 py-1 text-xs text-[var(--text-muted)]">
                    Date
                  </span>
                  <span className="rounded-full bg-[var(--input-bg)] px-3 py-1 text-xs text-[var(--text-muted)]">
                    Items
                  </span>
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400">
                    Materials $
                  </span>
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-400">
                    Tools $
                  </span>
                  <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs text-orange-400">
                    Misc $
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-3"
            >
              <span className="text-xs text-[var(--text-muted)]">
                Powered by:
              </span>
              <span className="rounded-full bg-[var(--input-bg)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                Vision AI
              </span>
              <span className="rounded-full bg-[var(--input-bg)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                Self-hosted LLM
              </span>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
