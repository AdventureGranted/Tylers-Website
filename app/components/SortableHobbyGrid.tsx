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
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../lib/animations';
import HobbyCard from './HobbyCard';
import Link from 'next/link';
import { HiPlus, HiPencil, HiCheck } from 'react-icons/hi';
import { GiHandSaw, GiWoodBeam } from 'react-icons/gi';

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

  const [animationDelay] = useState(() => `${Math.random() * 0.2}s`);

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
        animationDelay,
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
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <GiHandSaw className="h-8 w-8 text-yellow-300" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-200">
            Hobbies
          </h1>
          {isAdmin && (
            <>
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
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
                    className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
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
        <div className="mt-2 h-1 w-full rounded-full bg-gradient-to-r from-purple-500 to-yellow-300" />
      </div>

      {/* Woodworking intro */}
      {!isEditing && (
        <motion.div
          className="relative mb-10 max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Blurred gradient orbs */}
          <div className="pointer-events-none absolute -top-24 left-1/3 h-64 w-96 -translate-x-1/2 rounded-full bg-purple-500/15 blur-[100px]" />
          <div className="pointer-events-none absolute -right-1/3 -bottom-20 h-56 w-80 translate-x-1/2 rounded-full bg-yellow-300/15 blur-[100px]" />

          <motion.div
            className="rounded-xl border border-white/5 bg-gradient-to-br from-purple-500/10 to-yellow-300/10 p-6"
            variants={itemVariants}
          >
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Woodworking is where I step away from the screen and build
              something I can hold. There&apos;s a unique satisfaction in
              transforming raw lumber into something functional and beautiful —
              measuring twice, cutting once, and seeing a project come together
              piece by piece. From furniture builds to smaller shop projects, I
              enjoy the entire process: planning the design, choosing the right
              wood, and working through each step by hand and machine.
            </p>
          </motion.div>

          <motion.div className="mx-auto mt-8 w-fit" variants={itemVariants}>
            <div className="flex items-center justify-center gap-2">
              <GiWoodBeam className="h-5 w-5 text-yellow-300" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200">
                Recent Projects
              </h2>
            </div>
            <div className="mt-2 h-0.5 w-full rounded-full bg-gradient-to-r from-purple-500 to-yellow-300" />
          </motion.div>
        </motion.div>
      )}

      {isEditing && (
        <p className="mb-4 text-center text-sm text-gray-700 dark:text-gray-400">
          Drag cards to reorder them
        </p>
      )}

      {/* Grid */}
      {projects.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-400">
          No hobby projects yet.
        </p>
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
            <motion.div
              className="grid w-full max-w-6xl gap-8 md:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {projects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <SortableHobbyCard project={project} isEditing={isEditing} />
                </motion.div>
              ))}
            </motion.div>
          </SortableContext>
        </DndContext>
      )}
    </>
  );
}
