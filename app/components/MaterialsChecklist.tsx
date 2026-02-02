'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  HiOutlineClipboardList,
  HiOutlineTrash,
  HiOutlinePlus,
} from 'react-icons/hi';

interface MaterialItem {
  id: string;
  name: string;
  acquired: boolean;
  quantity: number | null;
  notes: string | null;
}

interface MaterialsChecklistProps {
  projectId: string;
  readOnly?: boolean;
}

export default function MaterialsChecklist({
  projectId,
  readOnly = false,
}: MaterialsChecklistProps) {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchMaterials = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/materials`);
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.materials);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          quantity: newQuantity ? parseInt(newQuantity) : null,
        }),
      });
      if (res.ok) {
        setNewName('');
        setNewQuantity('');
        setShowForm(false);
        fetchMaterials();
      }
    } catch (error) {
      console.error('Error adding material:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, acquired: boolean) => {
    try {
      await fetch(`/api/materials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acquired: !acquired }),
      });
      setMaterials(
        materials.map((m) => (m.id === id ? { ...m, acquired: !acquired } : m))
      );
    } catch (error) {
      console.error('Error toggling material:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/materials/${id}`, { method: 'DELETE' });
      setMaterials(materials.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const acquiredCount = materials.filter((m) => m.acquired).length;

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

  // Hide if readOnly and no materials
  if (readOnly && materials.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-[var(--input-bg)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <HiOutlineClipboardList className="text-yellow-500 dark:text-yellow-300" />
          Materials
        </h3>
        {materials.length > 0 && (
          <span className="text-xs text-[var(--text-muted)]">
            {acquiredCount}/{materials.length}
          </span>
        )}
      </div>

      {!readOnly && (
        <>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="mb-3 flex w-full items-center justify-center gap-1 rounded-lg bg-[var(--card-border)] py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--nav-hover)]"
            >
              <HiOutlinePlus /> Add Item
            </button>
          ) : (
            <div className="mb-3 space-y-2 rounded-lg bg-[var(--card-border)] p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Item name"
                  className="flex-1 rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-sm text-[var(--text-primary)] focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
                  autoFocus
                />
                <input
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  placeholder="Qty"
                  className="w-16 rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-sm text-[var(--text-primary)] focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={saving || !newName.trim()}
                  className="flex-1 rounded bg-yellow-500 py-1 text-sm font-medium text-gray-900 hover:bg-yellow-600 disabled:opacity-50 dark:bg-yellow-300 dark:hover:bg-yellow-400"
                >
                  {saving ? 'Adding...' : 'Add'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded bg-[var(--nav-hover)] px-3 py-1 text-sm text-[var(--text-secondary)] hover:bg-[var(--card-border)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {materials.length > 0 && (
        <div className="max-h-48 space-y-1 overflow-y-auto">
          {materials.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded bg-[var(--card-border)] px-2 py-1.5 text-sm"
            >
              {readOnly ? (
                <span
                  className={`text-lg ${item.acquired ? 'text-green-400' : 'text-[var(--text-muted)]'}`}
                >
                  {item.acquired ? '✓' : '○'}
                </span>
              ) : (
                <input
                  type="checkbox"
                  checked={item.acquired}
                  onChange={() => handleToggle(item.id, item.acquired)}
                  className="h-4 w-4 rounded border-[var(--card-border)] bg-[var(--card-bg)] text-yellow-500 focus:ring-yellow-500 dark:text-yellow-300 dark:focus:ring-yellow-300"
                />
              )}
              <span
                className={`flex-1 ${item.acquired ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}
              >
                {item.quantity && (
                  <span className="mr-1 text-[var(--text-muted)]">
                    {item.quantity}x
                  </span>
                )}
                {item.name}
              </span>
              {!readOnly && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-[var(--text-muted)] hover:text-red-400"
                >
                  <HiOutlineTrash className="text-sm" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
