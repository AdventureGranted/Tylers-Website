'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  HiOutlineTrash,
  HiOutlineUpload,
  HiOutlineReceiptTax,
} from 'react-icons/hi';

interface Receipt {
  id: string;
  imageUrl: string;
  amount: number;
  category: string;
  description: string | null;
  createdAt: string;
}

interface ReceiptManagerProps {
  projectId: string;
  readOnly?: boolean;
  allowUpload?: boolean; // Show upload button even in readOnly mode
}

export default function ReceiptManager({
  projectId,
  readOnly = false,
  allowUpload = false,
}: ReceiptManagerProps) {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [total, setTotal] = useState(0);
  const [toolTotal, setToolTotal] = useState(0);
  const [materialTotal, setMaterialTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Form state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'material' | 'tool'>('material');
  const [description, setDescription] = useState('');

  const fetchReceipts = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/receipts`);
      if (res.ok) {
        const data = await res.json();
        setReceipts(data.receipts);
        setTotal(data.total);
        setToolTotal(data.toolTotal);
        setMaterialTotal(data.materialTotal);
      }
    } catch (error) {
      console.error('Error fetching receipts:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !amount) return;

    setUploading(true);

    try {
      // Upload image first
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('folder', 'receipts');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload image');
      }

      const { url } = await uploadRes.json();

      // Create receipt
      const receiptRes = await fetch(`/api/projects/${projectId}/receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: url,
          amount: parseFloat(amount),
          category,
          description: description || null,
        }),
      });

      if (receiptRes.ok) {
        // Reset form and refresh
        setImageFile(null);
        setImagePreview(null);
        setAmount('');
        setCategory('material');
        setDescription('');
        setShowForm(false);
        fetchReceipts();
      }
    } catch (error) {
      console.error('Error uploading receipt:', error);
      alert('Failed to upload receipt');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this receipt?')) return;

    try {
      const res = await fetch(`/api/receipts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchReceipts();
      }
    } catch (error) {
      console.error('Error deleting receipt:', error);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-gray-800 p-6">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-yellow-300" />
          Loading receipts...
        </div>
      </div>
    );
  }

  // Hide if readOnly and no receipts (unless allowUpload is enabled)
  if (readOnly && !allowUpload && receipts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-gray-800 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-200">
          <HiOutlineReceiptTax className="text-yellow-300" />
          Project Costs
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-400">Total</div>
          <div className="text-2xl font-bold text-yellow-300">
            ${total.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-gray-700 p-3">
        <div className="text-center">
          <div className="text-xs text-gray-400">Materials</div>
          <div className="font-semibold text-blue-400">
            ${materialTotal.toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400">Tools</div>
          <div className="font-semibold text-purple-400">
            ${toolTotal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Add Receipt Button */}
      {(!readOnly || allowUpload) && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 flex items-center gap-2 rounded-lg bg-yellow-300 px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-yellow-400"
        >
          <HiOutlineUpload />
          Add Receipt
        </button>
      )}

      {/* Upload Form */}
      {(!readOnly || allowUpload) && showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl bg-gray-700 p-4"
        >
          <h3 className="mb-4 font-medium text-gray-200">Upload Receipt</h3>

          <div className="mb-4">
            <label className="mb-2 block text-sm text-gray-400">
              Receipt Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-lg bg-gray-600 p-2 text-sm text-gray-200 file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-300 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-900"
              required
            />
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Amount ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg bg-gray-600 px-4 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as 'material' | 'tool')
                }
                className="w-full rounded-lg bg-gray-600 px-4 py-2 text-gray-200 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
              >
                <option value="material">Material</option>
                <option value="tool">Tool</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm text-gray-400">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Wood supplies, Paint, etc."
              className="w-full rounded-lg bg-gray-600 px-4 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={uploading || !imageFile || !amount}
              className="rounded-lg bg-yellow-300 px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Save Receipt'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setImageFile(null);
                setImagePreview(null);
                setAmount('');
                setCategory('material');
                setDescription('');
              }}
              className="rounded-lg bg-gray-600 px-4 py-2 text-gray-200 transition-colors hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Receipts List */}
      {receipts.length === 0 ? (
        <p className="text-gray-500">No receipts uploaded yet.</p>
      ) : (
        <div className="space-y-3">
          {receipts.map((receipt) => (
            <div
              key={receipt.id}
              className="flex items-center gap-3 rounded-xl bg-gray-700 p-3"
            >
              <button
                onClick={() => setSelectedImage(receipt.imageUrl)}
                className="flex-shrink-0"
              >
                <Image
                  src={receipt.imageUrl}
                  alt="Receipt"
                  width={50}
                  height={50}
                  className="rounded-lg object-cover transition-opacity hover:opacity-80"
                />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-yellow-300">
                    ${receipt.amount.toFixed(2)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      receipt.category === 'tool'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {receipt.category === 'tool' ? 'Tool' : 'Material'}
                  </span>
                </div>
                {receipt.description && (
                  <div className="truncate text-sm text-gray-400">
                    {receipt.description}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  {new Date(receipt.createdAt).toLocaleDateString()}
                </div>
              </div>
              {!readOnly && (
                <button
                  onClick={() => handleDelete(receipt.id)}
                  className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
                  title="Delete receipt"
                >
                  <HiOutlineTrash className="text-lg" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl">
            <Image
              src={selectedImage}
              alt="Receipt"
              width={800}
              height={800}
              className="rounded-lg object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
