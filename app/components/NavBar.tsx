'use client';
import { useState, useRef, useEffect, useCallback, RefObject } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoColorPaletteOutline } from 'react-icons/io5';
import { IoIosContact } from 'react-icons/io';
import {
  AiOutlineUser,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineDashboard,
} from 'react-icons/ai';
import { HiOutlineLightBulb, HiOutlineMail } from 'react-icons/hi';
import { UNREAD_COUNT_CHANGED } from '@/app/lib/events';
import Link from 'next/link';
import Image from 'next/image';

// Static nav links - defined outside component to avoid recreation
const NAV_LINKS = [
  { href: '/projects', label: 'Projects', icon: <HiOutlineLightBulb /> },
  { href: '/hobbies', label: 'Hobbies', icon: <IoColorPaletteOutline /> },
  { href: '/contact', label: 'Contact', icon: <IoIosContact /> },
];

// Custom hook for click outside detection
function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, callback]);
}

// Custom hook for scroll state management
function useScrollState(onScroll?: () => void) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      onScroll?.();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onScroll]);

  return isScrolled;
}

// Custom hook for unread count management
function useUnreadCount(isAdmin: boolean) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/contact/unread');
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnread();
    window.addEventListener(UNREAD_COUNT_CHANGED, fetchUnread);
    const interval = setInterval(fetchUnread, 60000);

    return () => {
      clearInterval(interval);
      window.removeEventListener(UNREAD_COUNT_CHANGED, fetchUnread);
    };
  }, [isAdmin]);

  return unreadCount;
}

// Unread badge component
function UnreadBadge({
  count,
  className = '',
}: {
  count: number;
  className?: string;
}) {
  if (count <= 0) return null;
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ${className}`}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}

// Profile avatar component
function ProfileAvatar({
  image,
  name,
  size = 'sm',
}: {
  image?: string | null;
  name?: string | null;
  size?: 'sm' | 'md';
}) {
  const sizeClasses = size === 'sm' ? 'h-8 w-8 text-sm' : 'h-12 w-12 text-lg';

  if (image) {
    return (
      <Image
        src={image}
        alt="Profile"
        width={size === 'sm' ? 32 : 48}
        height={size === 'sm' ? 32 : 48}
        className={`${sizeClasses} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex ${sizeClasses} items-center justify-center rounded-full bg-yellow-300 font-bold text-gray-900`}
    >
      {name?.[0]?.toUpperCase() || 'U'}
    </div>
  );
}

// Nav link component
function NavLink({
  href,
  icon,
  label,
  isActive,
  onClick,
  variant = 'desktop',
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  variant?: 'desktop' | 'mobile';
}) {
  const baseClasses =
    variant === 'desktop'
      ? 'flex items-center px-4 text-2xl transition duration-300 hover:scale-105'
      : 'flex items-center justify-center px-4 text-center text-2xl transition duration-300';

  const activeClasses = isActive
    ? 'font-bold text-yellow-300'
    : 'text-gray-200 hover:text-yellow-300';

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${activeClasses}`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Link>
  );
}

// Logo component
function Logo({ isHome }: { isHome: boolean }) {
  return (
    <div className="px-4">
      <Link href="/" className="group relative flex items-center">
        {isHome ? (
          <Image
            src="/navbar/tyler_grant_merged_logo_yellow.svg"
            alt="Tyler Grant"
            width={180}
            height={60}
            className="h-14 w-auto"
          />
        ) : (
          <>
            <Image
              src="/navbar/tyler_grant_merged_logo.svg"
              alt="Tyler Grant"
              width={180}
              height={60}
              className="h-14 w-auto transition-opacity duration-300 group-hover:opacity-0"
            />
            <Image
              src="/navbar/tyler_grant_merged_logo_yellow.svg"
              alt="Tyler Grant"
              width={180}
              height={60}
              className="absolute left-0 h-14 w-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </>
        )}
      </Link>
    </div>
  );
}

// User dropdown menu component
function UserDropdown({
  session,
  isOpen,
  onToggle,
  onClose,
  unreadCount,
  menuRef,
}: {
  session: NonNullable<ReturnType<typeof useSession>['data']>;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  unreadCount: number;
  menuRef: RefObject<HTMLDivElement | null>;
}) {
  const isAdmin = session.user.role === 'admin';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-lg text-gray-300 transition duration-300 hover:bg-gray-700 hover:text-yellow-300"
      >
        <div className="relative">
          <ProfileAvatar
            image={session.user.profileImage}
            name={session.user.name}
          />
          {isAdmin && (
            <UnreadBadge
              count={unreadCount}
              className="absolute -top-1 -right-1 h-5 w-5"
            />
          )}
        </div>
        <span className="hidden lg:inline">{session.user.name || 'User'}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl bg-gray-700 py-2 shadow-xl">
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center px-4 py-2 text-gray-200 transition-colors hover:bg-gray-600 hover:text-yellow-300"
          >
            <AiOutlineUser className="mr-2" />
            Profile
          </Link>
          {isAdmin && (
            <>
              <Link
                href="/admin/contacts"
                onClick={onClose}
                className="flex items-center justify-between px-4 py-2 text-gray-200 transition-colors hover:bg-gray-600 hover:text-yellow-300"
              >
                <span className="flex items-center">
                  <HiOutlineMail className="mr-2" />
                  Messages
                </span>
                <UnreadBadge count={unreadCount} className="px-2 py-0.5" />
              </Link>
              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center px-4 py-2 text-gray-200 transition-colors hover:bg-gray-600 hover:text-yellow-300"
              >
                <AiOutlineDashboard className="mr-2" />
                Admin Dashboard
              </Link>
            </>
          )}
          <hr className="my-2 border-gray-600" />
          <button
            onClick={() => {
              onClose();
              signOut();
            }}
            className="flex w-full items-center px-4 py-2 text-gray-200 transition-colors hover:bg-gray-600 hover:text-yellow-300"
          >
            <AiOutlineLogout className="mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// Auth links for non-authenticated users
function GuestAuthLinks({ pathname }: { pathname: string }) {
  return (
    <>
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
        className={`flex items-center px-3 text-lg transition duration-300 hover:scale-105 ${
          pathname === '/login'
            ? 'font-bold text-yellow-300'
            : 'text-gray-400 hover:text-yellow-300'
        }`}
      >
        <AiOutlineLogin className="mr-1" />
        Sign In
      </Link>
      <Link
        href={`/register?callbackUrl=${encodeURIComponent(pathname)}`}
        className={`flex items-center px-3 text-lg transition duration-300 hover:scale-105 ${
          pathname === '/register'
            ? 'font-bold text-yellow-300'
            : 'text-gray-400 hover:text-yellow-300'
        }`}
      >
        Register
      </Link>
    </>
  );
}

// Mobile drawer component
function MobileDrawer({
  isOpen,
  onClose,
  session,
  status,
  pathname,
  unreadCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  session: ReturnType<typeof useSession>['data'];
  status: ReturnType<typeof useSession>['status'];
  pathname: string;
  unreadCount: number;
}) {
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div
      className={`absolute top-full right-0 z-50 w-48 space-y-2 overflow-hidden rounded-2xl bg-gray-600 pt-4 pb-4 shadow-2xl transition-all duration-600 ${
        isOpen
          ? 'max-h-[500px] opacity-100'
          : 'pointer-events-none max-h-0 opacity-0'
      }`}
    >
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.label}
          href={link.href}
          icon={link.icon}
          label={link.label}
          isActive={pathname === link.href}
          onClick={onClose}
          variant="mobile"
        />
      ))}

      {status !== 'loading' && (
        <div className="mt-2 border-t border-gray-500 pt-2">
          {session ? (
            <>
              <div className="mb-2 flex flex-col items-center gap-2 px-4">
                <ProfileAvatar
                  image={session.user.profileImage}
                  name={session.user.name}
                  size="md"
                />
                <span className="text-sm text-gray-400">
                  {session.user.name || 'User'}
                </span>
              </div>
              <Link
                onClick={onClose}
                href="/profile"
                className="flex items-center justify-center px-4 py-1 text-center text-xl text-gray-300 transition duration-300 hover:text-yellow-300"
              >
                <AiOutlineUser className="mr-2" />
                Profile
              </Link>
              {isAdmin && (
                <>
                  <Link
                    onClick={onClose}
                    href="/admin/contacts"
                    className="flex items-center justify-center px-4 py-1 text-center text-xl text-gray-300 transition duration-300 hover:text-yellow-300"
                  >
                    <HiOutlineMail className="mr-2" />
                    Messages
                    <UnreadBadge
                      count={unreadCount}
                      className="ml-2 px-2 py-0.5"
                    />
                  </Link>
                  <Link
                    onClick={onClose}
                    href="/admin"
                    className="flex items-center justify-center px-4 py-1 text-center text-xl text-gray-300 transition duration-300 hover:text-yellow-300"
                  >
                    <AiOutlineDashboard className="mr-2" />
                    Admin
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  onClose();
                  signOut();
                }}
                className="flex w-full items-center justify-center px-4 py-1 text-center text-xl text-gray-300 transition duration-300 hover:text-yellow-300"
              >
                <AiOutlineLogout className="mr-2" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                onClick={onClose}
                href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                className={`flex items-center justify-center px-4 text-center text-xl transition duration-300 ${
                  pathname === '/login'
                    ? 'font-bold text-yellow-300'
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
              >
                <AiOutlineLogin className="mr-2" />
                Sign In
              </Link>
              <Link
                onClick={onClose}
                href={`/register?callbackUrl=${encodeURIComponent(pathname)}`}
                className={`flex items-center justify-center px-4 text-center text-xl transition duration-300 ${
                  pathname === '/register'
                    ? 'font-bold text-yellow-300'
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Main Navbar component
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const closeMobileMenu = useCallback(() => setIsOpen(false), []);
  const isScrolled = useScrollState(closeMobileMenu);
  const unreadCount = useUnreadCount(session?.user?.role === 'admin');

  useClickOutside(userMenuRef, () => setUserMenuOpen(false));

  return (
    <nav
      className={`sticky top-2 z-50 mx-6 overflow-visible rounded-2xl shadow-2xl transition-all duration-300 lg:mx-25 ${
        isScrolled ? 'bg-gray-800/80 backdrop-blur-md' : 'bg-gray-800'
      }`}
    >
      <div className="mx-4 flex h-24 items-center justify-between">
        <Logo isHome={pathname === '/'} />

        {/* Desktop Navigation */}
        <div className="ml-auto hidden items-center lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              href={link.href}
              icon={link.icon}
              label={link.label}
              isActive={pathname === link.href}
            />
          ))}

          {status !== 'loading' && (
            <div className="ml-4 flex items-center border-l border-gray-600 pl-4">
              {session ? (
                <UserDropdown
                  session={session}
                  isOpen={userMenuOpen}
                  onToggle={() => setUserMenuOpen(!userMenuOpen)}
                  onClose={() => setUserMenuOpen(false)}
                  unreadCount={unreadCount}
                  menuRef={userMenuRef}
                />
              ) : (
                <GuestAuthLinks pathname={pathname} />
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="relative ml-auto lg:hidden">
          <button
            className="relative px-4 text-2xl text-gray-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <RxHamburgerMenu className="text-4xl text-gray-200 hover:text-yellow-300" />
            {session?.user?.role === 'admin' && (
              <UnreadBadge
                count={unreadCount}
                className="absolute -top-1 right-2 h-5 w-5"
              />
            )}
          </button>

          <MobileDrawer
            isOpen={isOpen}
            onClose={closeMobileMenu}
            session={session}
            status={status}
            pathname={pathname}
            unreadCount={unreadCount}
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
