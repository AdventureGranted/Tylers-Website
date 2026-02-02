'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  HiOutlineTrash,
  HiOutlineUpload,
  HiOutlineReceiptTax,
  HiOutlineDocumentDownload,
  HiOutlinePencil,
  HiSparkles,
} from 'react-icons/hi';

interface ReceiptItem {
  id?: string;
  name: string;
  price: number;
  category: 'material' | 'tool' | 'misc';
}

interface Receipt {
  id: string;
  imageUrl: string | null;
  toolAmount: number;
  materialAmount: number;
  miscAmount: number;
  description: string | null;
  createdAt: string;
  items?: ReceiptItem[];
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
  const [miscTotal, setMiscTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Form state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPdfFile, setIsPdfFile] = useState(false);
  const [toolAmount, setToolAmount] = useState('');
  const [materialAmount, setMaterialAmount] = useState('');
  const [miscAmount, setMiscAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [formItems, setFormItems] = useState<ReceiptItem[]>([]);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [editToolAmount, setEditToolAmount] = useState('');
  const [editMaterialAmount, setEditMaterialAmount] = useState('');
  const [editMiscAmount, setEditMiscAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editItems, setEditItems] = useState<ReceiptItem[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchReceipts = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/receipts`);
      if (res.ok) {
        const data = await res.json();
        setReceipts(data.receipts);
        setTotal(data.total);
        setToolTotal(data.toolTotal);
        setMaterialTotal(data.materialTotal);
        setMiscTotal(data.miscTotal || 0);
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
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      alert('Please upload an image or PDF file');
      return;
    }

    setImageFile(file);
    setIsPdfFile(isPdf);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Calculate totals from items
  const calculateTotalsFromItems = (
    items: ReceiptItem[],
    setters: {
      setTool: (v: string) => void;
      setMaterial: (v: string) => void;
      setMisc: (v: string) => void;
    }
  ) => {
    const tool = items
      .filter((i) => i.category === 'tool')
      .reduce((sum, i) => sum + i.price, 0);
    const material = items
      .filter((i) => i.category === 'material')
      .reduce((sum, i) => sum + i.price, 0);
    const misc = items
      .filter((i) => i.category === 'misc')
      .reduce((sum, i) => sum + i.price, 0);

    setters.setTool(tool > 0 ? tool.toFixed(2) : '');
    setters.setMaterial(material > 0 ? material.toFixed(2) : '');
    setters.setMisc(misc > 0 ? misc.toFixed(2) : '');
  };

  // Update a single item's category in create form
  const updateFormItemCategory = (
    index: number,
    category: 'material' | 'tool' | 'misc'
  ) => {
    const updated = [...formItems];
    updated[index] = { ...updated[index], category };
    setFormItems(updated);
    calculateTotalsFromItems(updated, {
      setTool: setToolAmount,
      setMaterial: setMaterialAmount,
      setMisc: setMiscAmount,
    });
  };

  // Update a single item's category in edit form
  const updateEditItemCategory = (
    index: number,
    category: 'material' | 'tool' | 'misc'
  ) => {
    const updated = [...editItems];
    updated[index] = { ...updated[index], category };
    setEditItems(updated);
    calculateTotalsFromItems(updated, {
      setTool: setEditToolAmount,
      setMaterial: setEditMaterialAmount,
      setMisc: setEditMiscAmount,
    });
  };

  // Add a new item manually
  const addFormItem = () => {
    setFormItems([...formItems, { name: '', price: 0, category: 'material' }]);
  };

  const addEditItem = () => {
    setEditItems([...editItems, { name: '', price: 0, category: 'material' }]);
  };

  // Remove an item
  const removeFormItem = (index: number) => {
    const updated = formItems.filter((_, i) => i !== index);
    setFormItems(updated);
    calculateTotalsFromItems(updated, {
      setTool: setToolAmount,
      setMaterial: setMaterialAmount,
      setMisc: setMiscAmount,
    });
  };

  const removeEditItem = (index: number) => {
    const updated = editItems.filter((_, i) => i !== index);
    setEditItems(updated);
    calculateTotalsFromItems(updated, {
      setTool: setEditToolAmount,
      setMaterial: setEditMaterialAmount,
      setMisc: setEditMiscAmount,
    });
  };

  // Update item name or price
  const updateFormItem = (
    index: number,
    field: 'name' | 'price',
    value: string
  ) => {
    const updated = [...formItems];
    if (field === 'price') {
      updated[index] = { ...updated[index], price: parseFloat(value) || 0 };
      calculateTotalsFromItems(updated, {
        setTool: setToolAmount,
        setMaterial: setMaterialAmount,
        setMisc: setMiscAmount,
      });
    } else {
      updated[index] = { ...updated[index], name: value };
    }
    setFormItems(updated);
  };

  const updateEditItem = (
    index: number,
    field: 'name' | 'price',
    value: string
  ) => {
    const updated = [...editItems];
    if (field === 'price') {
      updated[index] = { ...updated[index], price: parseFloat(value) || 0 };
      calculateTotalsFromItems(updated, {
        setTool: setEditToolAmount,
        setMaterial: setEditMaterialAmount,
        setMisc: setEditMiscAmount,
      });
    } else {
      updated[index] = { ...updated[index], name: value };
    }
    setEditItems(updated);
  };

  const handleAutoParse = async () => {
    if (!imagePreview) return;

    setIsParsing(true);
    setParseError(null);

    try {
      const response = await fetch('/api/receipts/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: imagePreview }),
      });

      const data = await response.json();

      if (!response.ok) {
        setParseError(data.error || 'Failed to parse receipt');
        return;
      }

      // Store parsed items for editing
      if (data.items && data.items.length > 0) {
        setFormItems(data.items);
        calculateTotalsFromItems(data.items, {
          setTool: setToolAmount,
          setMaterial: setMaterialAmount,
          setMisc: setMiscAmount,
        });
      } else {
        // Fallback if no items parsed - use the totals directly
        if (data.toolAmount > 0) {
          setToolAmount(data.toolAmount.toFixed(2));
        }
        if (data.materialAmount > 0) {
          setMaterialAmount(data.materialAmount.toFixed(2));
        }
        if (data.miscAmount > 0) {
          setMiscAmount(data.miscAmount.toFixed(2));
        }
      }

      // Build description from vendor and items
      const parts: string[] = [];
      if (data.vendor) parts.push(data.vendor);
      if (data.items && data.items.length > 0) {
        const itemNames = data.items
          .slice(0, 3)
          .map((item: { name: string }) => item.name)
          .join(', ');
        parts.push(itemNames);
        if (data.items.length > 3) {
          parts.push(`+${data.items.length - 3} more`);
        }
      }
      if (parts.length > 0) {
        setDescription(parts.join(' - '));
      }
    } catch {
      setParseError('Network error. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // At least one amount must be provided
    const toolAmt = parseFloat(toolAmount) || 0;
    const materialAmt = parseFloat(materialAmount) || 0;
    const miscAmt = parseFloat(miscAmount) || 0;
    if (toolAmt === 0 && materialAmt === 0 && miscAmt === 0) {
      alert('Please enter at least one amount (tool, material, or misc)');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = null;

      // Upload image if provided
      if (imageFile) {
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

        const data = await uploadRes.json();
        imageUrl = data.url;
      }

      // Create receipt with items
      const itemsToSave = formItems.filter(
        (item) => item.name.trim() && item.price > 0
      );
      const receiptRes = await fetch(`/api/projects/${projectId}/receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          toolAmount: toolAmt,
          materialAmount: materialAmt,
          miscAmount: miscAmt,
          description: description || null,
          items: itemsToSave.length > 0 ? itemsToSave : undefined,
        }),
      });

      if (receiptRes.ok) {
        // Reset form and refresh
        setImageFile(null);
        setImagePreview(null);
        setIsPdfFile(false);
        setToolAmount('');
        setMaterialAmount('');
        setMiscAmount('');
        setDescription('');
        setFormItems([]);
        setShowForm(false);
        fetchReceipts();
        // Notify other components (like BudgetTracker) that receipts changed
        window.dispatchEvent(new Event('receipt-updated'));
      }
    } catch (error) {
      console.error('Error uploading receipt:', error);
      alert('Failed to upload receipt');
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (receipt: Receipt) => {
    setEditingReceipt(receipt);
    setEditToolAmount(
      receipt.toolAmount > 0 ? receipt.toolAmount.toString() : ''
    );
    setEditMaterialAmount(
      receipt.materialAmount > 0 ? receipt.materialAmount.toString() : ''
    );
    setEditMiscAmount(
      (receipt.miscAmount || 0) > 0 ? receipt.miscAmount.toString() : ''
    );
    setEditDescription(receipt.description || '');
    // Load existing items
    setEditItems(
      receipt.items?.map((item) => ({
        name: item.name,
        price: item.price,
        category: item.category as 'material' | 'tool' | 'misc',
      })) || []
    );
  };

  const closeEditModal = () => {
    setEditingReceipt(null);
    setEditToolAmount('');
    setEditMaterialAmount('');
    setEditMiscAmount('');
    setEditDescription('');
    setEditItems([]);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReceipt) return;

    const toolAmt = parseFloat(editToolAmount) || 0;
    const materialAmt = parseFloat(editMaterialAmount) || 0;
    const miscAmt = parseFloat(editMiscAmount) || 0;

    if (toolAmt === 0 && materialAmt === 0 && miscAmt === 0) {
      alert('Please enter at least one amount');
      return;
    }

    setIsUpdating(true);

    try {
      const itemsToSave = editItems.filter(
        (item) => item.name.trim() && item.price > 0
      );
      const res = await fetch(`/api/receipts/${editingReceipt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolAmount: toolAmt,
          materialAmount: materialAmt,
          miscAmount: miscAmt,
          description: editDescription || null,
          items: itemsToSave,
        }),
      });

      if (res.ok) {
        closeEditModal();
        fetchReceipts();
        window.dispatchEvent(new Event('receipt-updated'));
      } else {
        alert('Failed to update receipt');
      }
    } catch (error) {
      console.error('Error updating receipt:', error);
      alert('Failed to update receipt');
    } finally {
      setIsUpdating(false);
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
        // Notify other components (like BudgetTracker) that receipts changed
        window.dispatchEvent(new Event('receipt-updated'));
      }
    } catch (error) {
      console.error('Error deleting receipt:', error);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-[var(--input-bg)] p-6">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--card-border)] border-t-yellow-500 dark:border-t-yellow-300" />
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
    <div className="rounded-2xl bg-[var(--input-bg)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--text-primary)]">
          <HiOutlineReceiptTax className="text-yellow-500 dark:text-yellow-300" />
          Project Costs
        </h2>
        <div className="text-right">
          <div className="text-sm text-[var(--text-muted)]">Total</div>
          <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-300">
            ${total.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl bg-[var(--card-border)] p-3">
        <div className="text-center">
          <div className="text-xs text-[var(--text-muted)]">Materials</div>
          <div className="font-semibold text-blue-500 dark:text-blue-400">
            ${materialTotal.toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-[var(--text-muted)]">Tools</div>
          <div className="font-semibold text-purple-500 dark:text-purple-400">
            ${toolTotal.toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-[var(--text-muted)]">Misc</div>
          <div className="font-semibold text-orange-500 dark:text-orange-400">
            ${miscTotal.toFixed(2)}
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

      {/* Upload Form Modal */}
      {(!readOnly || allowUpload) && showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => {
            setShowForm(false);
            setImageFile(null);
            setImagePreview(null);
            setIsPdfFile(false);
            setToolAmount('');
            setMaterialAmount('');
            setMiscAmount('');
            setDescription('');
            setFormItems([]);
            setParseError(null);
          }}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-[var(--card-bg)] p-6 shadow-2xl"
          >
            <h3 className="mb-6 text-xl font-semibold text-[var(--text-primary)]">
              Upload Receipt
            </h3>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
                Receipt Image (optional)
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-lg border-2 border-dashed transition-colors ${
                  isDragging
                    ? 'border-yellow-500 bg-yellow-300/10 dark:border-yellow-300'
                    : 'border-[var(--card-border)] hover:border-[var(--text-muted)]'
                }`}
              >
                {imagePreview ? (
                  <div className="p-4">
                    <div className="flex justify-center">
                      <div className="relative">
                        {isPdfFile ? (
                          <div className="flex h-[250px] w-[250px] flex-col items-center justify-center rounded-lg bg-[var(--nav-hover)]">
                            <HiOutlineReceiptTax className="mb-2 h-16 w-16 text-red-500" />
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                              PDF Document
                            </span>
                            <span className="text-xs text-[var(--text-muted)]">
                              Ready to parse
                            </span>
                          </div>
                        ) : (
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={250}
                            height={250}
                            className="rounded-lg object-cover"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            setIsPdfFile(false);
                            setParseError(null);
                          }}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {/* Auto-parse button */}
                    <button
                      type="button"
                      onClick={handleAutoParse}
                      disabled={isParsing}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-500/20 px-4 py-2 text-sm font-medium text-purple-400 transition-colors hover:bg-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isParsing ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
                          Parsing with AI...
                        </>
                      ) : (
                        <>
                          <HiSparkles />
                          Auto-fill with AI
                        </>
                      )}
                    </button>
                    {parseError && (
                      <p className="mt-2 text-center text-xs text-red-400">
                        {parseError}
                      </p>
                    )}
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center p-8">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <HiOutlineUpload className="mb-2 h-10 w-10 text-[var(--text-muted)]" />
                    <span className="text-sm text-[var(--text-muted)]">
                      {isDragging
                        ? 'Drop file here'
                        : 'Click or drag image/PDF to upload'}
                    </span>
                    <span className="mt-1 text-xs text-[var(--text-muted)]">
                      Or leave empty to add cost without receipt
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Line Items Editor */}
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--text-muted)]">
                  Line Items
                </label>
                <button
                  type="button"
                  onClick={addFormItem}
                  className="rounded-md bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-500 transition-colors hover:bg-yellow-500/30 dark:text-yellow-300"
                >
                  + Add Item
                </button>
              </div>
              {formItems.length > 0 ? (
                <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg bg-[var(--input-bg)] p-3">
                  {formItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateFormItem(index, 'name', e.target.value)
                        }
                        placeholder="Item name"
                        className="min-w-0 flex-1 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                      />
                      <div className="relative shrink-0">
                        <span className="absolute top-1/2 left-2 -translate-y-1/2 text-[var(--text-muted)]">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.price || ''}
                          onChange={(e) =>
                            updateFormItem(index, 'price', e.target.value)
                          }
                          placeholder="0.00"
                          className="w-20 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] py-1 pr-2 pl-5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                        />
                      </div>
                      <select
                        value={item.category}
                        onChange={(e) =>
                          updateFormItemCategory(
                            index,
                            e.target.value as 'material' | 'tool' | 'misc'
                          )
                        }
                        className={`shrink-0 rounded-md border-0 px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-yellow-500 focus:outline-none ${
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
                      <button
                        type="button"
                        onClick={() => removeFormItem(index)}
                        className="shrink-0 rounded-md p-1 text-red-400 transition-colors hover:bg-red-500/20"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg bg-[var(--input-bg)] p-3 text-center text-sm text-[var(--text-muted)]">
                  No items yet. Add items manually or use AI to parse from
                  receipt.
                </p>
              )}
            </div>

            <div className="mb-5 grid grid-cols-3 gap-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
                  Material ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={materialAmount}
                  onChange={(e) => setMaterialAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
                  Tool ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={toolAmount}
                  onChange={(e) => setToolAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
                  Misc ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={miscAmount}
                  onChange={(e) => setMiscAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
                Description (optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Wood supplies, Paint, etc."
                className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={
                  uploading || (!toolAmount && !materialAmount && !miscAmount)
                }
                className="flex-1 rounded-lg bg-yellow-500 px-4 py-3 font-medium text-gray-900 transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-yellow-300 dark:hover:bg-yellow-400"
              >
                {uploading ? 'Uploading...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setImageFile(null);
                  setImagePreview(null);
                  setIsPdfFile(false);
                  setToolAmount('');
                  setMaterialAmount('');
                  setMiscAmount('');
                  setDescription('');
                  setFormItems([]);
                  setParseError(null);
                }}
                className="rounded-lg bg-[var(--card-border)] px-6 py-3 text-[var(--text-primary)] transition-colors hover:bg-[var(--nav-hover)]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Receipts List */}
      {receipts.length === 0 ? (
        <p className="text-[var(--text-muted)]">No receipts uploaded yet.</p>
      ) : (
        <div className="space-y-3">
          {receipts.map((receipt) => (
            <div
              key={receipt.id}
              className="flex items-center gap-3 rounded-xl bg-[var(--card-border)] p-3"
            >
              {receipt.imageUrl ? (
                receipt.imageUrl.toLowerCase().endsWith('.pdf') ? (
                  <a
                    href={receipt.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-lg bg-red-500/20 transition-colors hover:bg-red-500/30"
                    title="View PDF Receipt"
                  >
                    <HiOutlineDocumentDownload className="h-6 w-6 text-red-500" />
                  </a>
                ) : (
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
                )
              ) : (
                <div className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-lg bg-[var(--nav-hover)]">
                  <HiOutlineReceiptTax className="h-6 w-6 text-[var(--text-muted)]" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-yellow-500 dark:text-yellow-300">
                    $
                    {(
                      receipt.toolAmount +
                      receipt.materialAmount +
                      (receipt.miscAmount || 0)
                    ).toFixed(2)}
                  </span>
                  {receipt.materialAmount > 0 && (
                    <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-500 dark:text-blue-400">
                      Material: ${receipt.materialAmount.toFixed(2)}
                    </span>
                  )}
                  {receipt.toolAmount > 0 && (
                    <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-500 dark:text-purple-400">
                      Tool: ${receipt.toolAmount.toFixed(2)}
                    </span>
                  )}
                  {(receipt.miscAmount || 0) > 0 && (
                    <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-xs font-medium text-orange-500 dark:text-orange-400">
                      Misc: ${receipt.miscAmount.toFixed(2)}
                    </span>
                  )}
                </div>
                {receipt.description && (
                  <div className="truncate text-sm text-[var(--text-muted)]">
                    {receipt.description}
                  </div>
                )}
                <div className="text-xs text-[var(--text-muted)]">
                  {new Date(receipt.createdAt).toLocaleDateString()}
                </div>
              </div>
              {(!readOnly || allowUpload) && (
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => openEditModal(receipt)}
                    className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-yellow-500/20 hover:text-yellow-500"
                    title="Edit receipt"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(receipt.id)}
                    className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-red-500/20 hover:text-red-400"
                    title="Delete receipt"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Receipt Modal */}
      {editingReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={closeEditModal}
        >
          <form
            onSubmit={handleUpdate}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-[var(--card-bg)] p-6 shadow-2xl"
          >
            <h3 className="mb-6 text-xl font-semibold text-[var(--text-primary)]">
              Edit Receipt
            </h3>

            {/* Line Items Editor */}
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--text-muted)]">
                  Line Items
                </label>
                <button
                  type="button"
                  onClick={addEditItem}
                  className="rounded-md bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-500 transition-colors hover:bg-yellow-500/30 dark:text-yellow-300"
                >
                  + Add Item
                </button>
              </div>
              {editItems.length > 0 ? (
                <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg bg-[var(--input-bg)] p-3">
                  {editItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateEditItem(index, 'name', e.target.value)
                        }
                        placeholder="Item name"
                        className="min-w-0 flex-1 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                      />
                      <div className="relative shrink-0">
                        <span className="absolute top-1/2 left-2 -translate-y-1/2 text-[var(--text-muted)]">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.price || ''}
                          onChange={(e) =>
                            updateEditItem(index, 'price', e.target.value)
                          }
                          placeholder="0.00"
                          className="w-20 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] py-1 pr-2 pl-5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                        />
                      </div>
                      <select
                        value={item.category}
                        onChange={(e) =>
                          updateEditItemCategory(
                            index,
                            e.target.value as 'material' | 'tool' | 'misc'
                          )
                        }
                        className={`shrink-0 rounded-md border-0 px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-yellow-500 focus:outline-none ${
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
                      <button
                        type="button"
                        onClick={() => removeEditItem(index)}
                        className="shrink-0 rounded-md p-1 text-red-400 transition-colors hover:bg-red-500/20"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg bg-[var(--input-bg)] p-3 text-center text-sm text-[var(--text-muted)]">
                  No items. Add items to track individual purchases.
                </p>
              )}
            </div>

            <div className="mb-5 grid grid-cols-3 gap-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
                  Material ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editMaterialAmount}
                  onChange={(e) => setEditMaterialAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
                  Tool ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editToolAmount}
                  onChange={(e) => setEditToolAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
                  Misc ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editMiscAmount}
                  onChange={(e) => setEditMiscAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
                Description
              </label>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="e.g., Wood supplies, Paint, etc."
                className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={
                  isUpdating ||
                  (!editToolAmount && !editMaterialAmount && !editMiscAmount)
                }
                className="flex-1 rounded-lg bg-yellow-500 px-4 py-3 font-medium text-gray-900 transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-yellow-300 dark:hover:bg-yellow-400"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-lg bg-[var(--card-border)] px-6 py-3 text-[var(--text-primary)] transition-colors hover:bg-[var(--nav-hover)]"
              >
                Cancel
              </button>
            </div>
          </form>
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
