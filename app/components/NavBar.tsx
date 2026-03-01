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
import {
  HiOutlineLightBulb,
  HiOutlineMail,
  HiOutlineBeaker,
  HiOutlineUser,
} from 'react-icons/hi';
import { UNREAD_COUNT_CHANGED } from '@/app/lib/events';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

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
      ? 'flex items-center px-2 text-xl transition duration-300 hover:scale-105'
      : 'flex items-center justify-center px-4 text-center text-2xl transition duration-300';

  const activeClasses = isActive
    ? 'font-bold text-yellow-300 dark:text-yellow-300'
    : 'text-gray-900 dark:text-gray-200 hover:text-yellow-300';

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${activeClasses}`}
    >
      {icon}
      <span className="ml-1">{label}</span>
    </Link>
  );
}

// Logo component
function Logo() {
  return (
    <div className="px-4">
      <Link href="/" className="group relative flex items-center">
        <Image
          src="/navbar/tyler_grant_merged_logo.svg"
          alt="Tyler Grant"
          width={180}
          height={60}
          className="h-10 w-auto transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(253,224,71,0.8)]"
        />
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
        className="flex items-center gap-1 rounded-lg px-2 py-1 text-lg text-gray-900 transition duration-300 hover:bg-gray-100 hover:text-yellow-300 dark:text-gray-200 dark:hover:bg-gray-700"
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
        <span className="hidden xl:inline">{session.user.name || 'User'}</span>
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
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-300 bg-white py-2 shadow-xl dark:border-gray-600 dark:bg-gray-700">
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center px-4 py-2 text-gray-900 transition-colors hover:bg-gray-100 hover:text-yellow-300 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <AiOutlineUser className="mr-2" />
            Profile
          </Link>
          {isAdmin && (
            <>
              <Link
                href="/admin/contacts"
                onClick={onClose}
                className="flex items-center justify-between px-4 py-2 text-gray-900 transition-colors hover:bg-gray-100 hover:text-yellow-300 dark:text-gray-200 dark:hover:bg-gray-600"
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
                className="flex items-center px-4 py-2 text-gray-900 transition-colors hover:bg-gray-100 hover:text-yellow-300 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <AiOutlineDashboard className="mr-2" />
                Admin Dashboard
              </Link>
            </>
          )}
          <hr className="my-2 border-gray-300 dark:border-gray-600" />
          <button
            onClick={() => {
              onClose();
              signOut();
            }}
            className="flex w-full items-center px-4 py-2 text-gray-900 transition-colors hover:bg-gray-100 hover:text-yellow-300 dark:text-gray-200 dark:hover:bg-gray-600"
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
        className={`flex items-center px-2 text-lg transition duration-300 hover:scale-105 ${
          pathname === '/login'
            ? 'font-bold text-yellow-300'
            : 'text-gray-700 hover:text-yellow-300 dark:text-gray-400'
        }`}
      >
        <AiOutlineLogin className="mr-1" />
        Sign In
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
  navLinks,
}: {
  isOpen: boolean;
  onClose: () => void;
  session: ReturnType<typeof useSession>['data'];
  status: ReturnType<typeof useSession>['status'];
  pathname: string;
  unreadCount: number;
  navLinks: Array<{ href: string; label: string; icon: React.ReactNode }>;
}) {
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div
      className={`absolute top-full right-0 z-50 w-48 space-y-2 overflow-hidden rounded-2xl border border-gray-300 bg-white pt-4 pb-4 shadow-2xl transition-all duration-600 dark:border-gray-600 dark:bg-gray-700 ${
        isOpen
          ? 'max-h-[80vh] opacity-100'
          : 'pointer-events-none max-h-0 opacity-0'
      }`}
    >
      {navLinks.map((link) => (
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

      <div className="flex justify-center py-2">
        <ThemeToggle />
      </div>

      {status !== 'loading' && (
        <div className="mt-2 border-t border-gray-300 pt-2 dark:border-gray-600">
          {session ? (
            <>
              <div className="mb-2 flex flex-col items-center gap-2 px-4">
                <ProfileAvatar
                  image={session.user.profileImage}
                  name={session.user.name}
                  size="md"
                />
                <span className="text-sm text-gray-700 dark:text-gray-400">
                  {session.user.name || 'User'}
                </span>
              </div>
              <Link
                onClick={onClose}
                href="/profile"
                className="flex items-center justify-center px-4 py-1 text-center text-xl text-gray-900 transition duration-300 hover:text-yellow-300 dark:text-gray-200"
              >
                <AiOutlineUser className="mr-2" />
                Profile
              </Link>
              {isAdmin && (
                <>
                  <Link
                    onClick={onClose}
                    href="/admin/contacts"
                    className="flex items-center justify-center px-4 py-1 text-center text-xl text-gray-900 transition duration-300 hover:text-yellow-300 dark:text-gray-200"
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
                    className="flex items-center justify-center px-4 py-1 text-center text-xl text-gray-900 transition duration-300 hover:text-yellow-300 dark:text-gray-200"
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
                className="flex w-full items-center justify-center px-4 py-1 text-center text-xl text-gray-900 transition duration-300 hover:text-yellow-300 dark:text-gray-200"
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
                    : 'text-gray-900 hover:text-yellow-300 dark:text-gray-200'
                }`}
              >
                <AiOutlineLogin className="mr-2" />
                Sign In
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

  // Nav links defined inside component to ensure proper hydration
  const NAV_LINKS = [
    { href: '/about', label: 'About', icon: <HiOutlineUser /> },
    { href: '/projects', label: 'Projects', icon: <HiOutlineLightBulb /> },
    { href: '/hobbies', label: 'Hobbies', icon: <IoColorPaletteOutline /> },
    { href: '/demo/receipt-parser', label: 'Demos', icon: <HiOutlineBeaker /> },
    { href: '/contact', label: 'Contact', icon: <IoIosContact /> },
  ];

  const closeMobileMenu = useCallback(() => setIsOpen(false), []);
  const isScrolled = useScrollState(closeMobileMenu);
  const unreadCount = useUnreadCount(session?.user?.role === 'admin');

  useClickOutside(userMenuRef, () => setUserMenuOpen(false));

  return (
    <nav
      className={`sticky top-2 z-50 mx-6 overflow-visible rounded-2xl border border-gray-300 transition-all duration-300 xl:mx-25 dark:border-gray-700 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md dark:bg-gray-800/80'
          : 'bg-white dark:bg-gray-800'
      } shadow-md dark:shadow-lg`}
    >
      <div className="mx-4 flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <div className="ml-auto hidden items-center xl:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              href={link.href}
              icon={link.icon}
              label={link.label}
              isActive={pathname === link.href}
            />
          ))}

          <div className="ml-2">
            <ThemeToggle />
          </div>

          {status !== 'loading' && (
            <div className="ml-2 flex items-center border-l border-gray-300 pl-2 dark:border-gray-700">
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
        <div className="relative ml-auto xl:hidden">
          <button
            className="relative px-4 text-2xl text-gray-900 dark:text-gray-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <RxHamburgerMenu className="text-4xl text-gray-900 hover:text-yellow-300 dark:text-gray-200" />
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
            navLinks={NAV_LINKS}
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
