'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  HiOutlineCurrencyDollar,
  HiOutlinePencil,
  HiOutlineCheck,
} from 'react-icons/hi';

interface BudgetTrackerProps {
  projectId: string;
  actualCost?: number; // Now optional, will fetch if not provided
  readOnly?: boolean;
}

export default function BudgetTracker({
  projectId,
  actualCost: initialActualCost,
  readOnly = false,
}: BudgetTrackerProps) {
  const [estimatedBudget, setEstimatedBudget] = useState<number | null>(null);
  const [actualCost, setActualCost] = useState(initialActualCost ?? 0);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      // Fetch both budget metadata and receipt totals
      const [metadataRes, receiptsRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/metadata`),
        fetch(`/api/projects/${projectId}/receipts`),
      ]);

      if (metadataRes.ok) {
        const data = await metadataRes.json();
        setEstimatedBudget(data.estimatedBudget);
        setInputValue(data.estimatedBudget?.toString() || '');
      }

      if (receiptsRes.ok) {
        const data = await receiptsRes.json();
        setActualCost(data.total ?? 0);
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();

    // Listen for receipt updates
    const handleReceiptUpdate = () => {
      fetchData();
    };

    window.addEventListener('receipt-updated', handleReceiptUpdate);
    return () => {
      window.removeEventListener('receipt-updated', handleReceiptUpdate);
    };
  }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/metadata`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estimatedBudget: inputValue ? parseFloat(inputValue) : null,
        }),
      });
      if (res.ok) {
        setEstimatedBudget(inputValue ? parseFloat(inputValue) : null);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error saving budget:', error);
    } finally {
      setSaving(false);
    }
  };

  const difference = estimatedBudget ? actualCost - estimatedBudget : 0;
  const percentUsed = estimatedBudget
    ? (actualCost / estimatedBudget) * 100
    : 0;

  if (loading) {
    return (
      <div className="rounded-2xl bg-[var(--input-bg)] p-4">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--card-border)] border-t-yellow-500 dark:border-t-yellow-300" />
          Loading...
        </div>
      </div>
    );
  }

  // Hide if readOnly and no meaningful data
  if (readOnly && !estimatedBudget && actualCost === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-[var(--input-bg)] p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <HiOutlineCurrencyDollar className="text-yellow-500 dark:text-yellow-300" />
        Budget vs Actual
      </h3>

      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-[var(--text-muted)]">
          Estimated Budget
        </span>
        {readOnly ? (
          <span className="text-sm text-[var(--text-secondary)]">
            {estimatedBudget ? `$${estimatedBudget.toFixed(2)}` : '—'}
          </span>
        ) : editing ? (
          <div className="flex items-center gap-1">
            <span className="text-[var(--text-muted)]">$</span>
            <input
              type="number"
              step="0.01"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-20 rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-sm text-[var(--text-primary)] focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded p-1 text-green-400 hover:bg-[var(--nav-hover)]"
            >
              <HiOutlineCheck />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-yellow-500 dark:hover:text-yellow-300"
          >
            {estimatedBudget ? `$${estimatedBudget.toFixed(2)}` : 'Set budget'}
            <HiOutlinePencil className="text-xs" />
          </button>
        )}
      </div>

      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-[var(--text-muted)]">Actual Spent</span>
        <span className="text-sm font-medium text-yellow-500 dark:text-yellow-300">
          ${actualCost.toFixed(2)}
        </span>
      </div>

      {estimatedBudget && (
        <>
          <div className="mb-2 h-2 overflow-hidden rounded-full bg-[var(--card-border)]">
            <div
              className={`h-full transition-all ${
                percentUsed > 100
                  ? 'bg-red-500'
                  : percentUsed > 80
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">
              {percentUsed.toFixed(0)}% used
            </span>
            <span
              className={difference > 0 ? 'text-red-400' : 'text-green-400'}
            >
              {difference > 0 ? '+' : ''}${difference.toFixed(2)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
