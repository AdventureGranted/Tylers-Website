'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import HobbyCard from './HobbyCard';
import Link from 'next/link';
import { HiPlus, HiPencil, HiCheck } from 'react-icons/hi';

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  beforeImageIndex: number | null;
  afterImageIndex: number | null;
  compareMode: string | null;
  images: { url: string; alt: string | null; type?: string }[];
}

interface SortableHobbyCardProps {
  project: Project;
  isEditing: boolean;
}

function SortableHobbyCard({ project, isEditing }: SortableHobbyCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id, disabled: !isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        animation:
          isEditing && !isDragging
            ? 'wiggle 0.3s ease-in-out infinite'
            : undefined,
        animationDelay: `${Math.random() * 0.2}s`,
      }}
      className={isEditing ? 'cursor-grab active:cursor-grabbing' : ''}
      {...(isEditing ? { ...attributes, ...listeners } : {})}
    >
      <div className={isEditing ? 'pointer-events-none' : ''}>
        <HobbyCard
          slug={project.slug}
          title={project.title}
          description={project.description}
          images={project.images}
          beforeImageIndex={project.beforeImageIndex}
          afterImageIndex={project.afterImageIndex}
          compareMode={project.compareMode}
        />
      </div>
    </div>
  );
}

interface SortableHobbyGridProps {
  projects: Project[];
  isAdmin: boolean;
}

export default function SortableHobbyGrid({
  projects: initialProjects,
  isAdmin,
}: SortableHobbyGridProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);

      const newProjects = arrayMove(projects, oldIndex, newIndex);
      setProjects(newProjects);
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/projects/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectIds: projects.map((p) => p.id),
        }),
      });

      if (!res.ok) {
        console.error('Failed to save order');
      } else {
        setHasChanges(false);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save order:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProjects(initialProjects);
    setHasChanges(false);
    setIsEditing(false);
  };

  return (
    <>
      {/* Header with buttons */}
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-4xl font-bold text-[var(--text-primary)]">
          Hobbies
        </h1>
        {isAdmin && (
          <>
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--nav-hover)]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 disabled:opacity-50"
                >
                  <HiCheck className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--nav-hover)]"
                >
                  <HiPencil className="h-4 w-4" />
                  Edit
                </button>
                <Link
                  href="/admin/projects/new?from=/hobbies"
                  className="flex items-center gap-1 rounded-lg bg-yellow-300 px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-yellow-400"
                >
                  <HiPlus className="h-4 w-4" />
                  Add
                </Link>
              </>
            )}
          </>
        )}
      </div>

      {isEditing && (
        <p className="mb-4 text-center text-sm text-[var(--text-secondary)]">
          Drag cards to reorder them
        </p>
      )}

      {/* Grid */}
      {projects.length === 0 ? (
        <p className="text-[var(--text-secondary)]">No hobby projects yet.</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid w-full max-w-6xl gap-8 md:grid-cols-2">
              {projects.map((project) => (
                <SortableHobbyCard
                  key={project.id}
                  project={project}
                  isEditing={isEditing}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </>
  );
}
