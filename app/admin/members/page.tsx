'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineArrowLeft } from 'react-icons/ai';
import { HiOutlineUserGroup } from 'react-icons/hi';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  profileImage: string | null;
  createdAt: string;
  _count: {
    comments: number;
  };
}

export default function MembersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch all users once on mount
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/members');
      return;
    }
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
      return;
    }
    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users?limit=1000');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAllUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users client-side
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const matchesSearch =
        !search ||
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !roleFilter || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [allUsers, search, roleFilter]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (
      !confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      return;
    }

    setUpdating(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update');
      }

      // Update local state
      setAllUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (userId: string, userName: string | null) => {
    if (
      !confirm(
        `Are you sure you want to delete ${userName || 'this user'}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setUpdating(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      // Remove from local state
      setAllUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setUpdating(null);
    }
  };

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-[var(--text-muted)] transition-colors hover:text-yellow-500 dark:hover:text-yellow-300"
          >
            <AiOutlineArrowLeft />
            Back
          </Link>
        </div>

        <div className="mb-8 flex items-center gap-3">
          <HiOutlineUserGroup className="text-3xl text-yellow-500 dark:text-yellow-300" />
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Members
          </h1>
          <span className="text-[var(--text-muted)]">
            ({allUsers.length} total)
          </span>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <AiOutlineSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] py-2 pr-4 pl-10 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-yellow-500 focus:outline-none dark:focus:border-yellow-300"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%239ca3af%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat py-2 pr-10 pl-4 text-[var(--text-primary)] focus:border-yellow-500 focus:outline-none dark:focus:border-yellow-300"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--card-border)] text-left">
                  <th className="px-4 py-3 text-sm font-semibold text-[var(--text-muted)]">
                    User
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-[var(--text-muted)]">
                    Role
                  </th>
                  <th className="hidden px-4 py-3 text-sm font-semibold text-[var(--text-muted)] sm:table-cell">
                    Comments
                  </th>
                  <th className="hidden px-4 py-3 text-sm font-semibold text-[var(--text-muted)] md:table-cell">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-[var(--text-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[var(--card-border)]/50 transition-colors hover:bg-[var(--nav-hover)]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.profileImage ? (
                          <Image
                            src={user.profileImage}
                            alt=""
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 font-bold text-gray-900 dark:bg-yellow-300">
                            {user.name?.[0]?.toUpperCase() ||
                              user.email[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">
                            {user.name || 'No name'}
                          </div>
                          <div className="text-sm text-[var(--text-muted)]">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-yellow-500/20 text-yellow-600 dark:bg-yellow-300/20 dark:text-yellow-300'
                            : 'bg-[var(--card-border)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-[var(--text-muted)] sm:table-cell">
                      {user._count.comments}
                    </td>
                    <td className="hidden px-4 py-3 text-[var(--text-muted)] md:table-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          disabled={
                            updating === user.id || user.id === session.user.id
                          }
                          className="rounded border border-[var(--card-border)] bg-[var(--input-bg)] px-2 py-1 text-sm text-[var(--text-primary)] disabled:opacity-50"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        {user.id !== session.user.id && (
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            disabled={updating === user.id}
                            className="rounded px-2 py-1 text-sm text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-[var(--text-muted)]"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Results count */}
          {(search || roleFilter) && (
            <div className="border-t border-[var(--card-border)] px-4 py-3 text-sm text-[var(--text-muted)]">
              Showing {filteredUsers.length} of {allUsers.length} members
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
