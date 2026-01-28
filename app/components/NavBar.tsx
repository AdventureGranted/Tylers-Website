'use client';
import { useState, useRef, useEffect } from 'react';
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
import { HiOutlineLightBulb } from 'react-icons/hi';
import Link from 'next/link';
import Image from 'next/image';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const links = [
    { href: '/about', label: 'About  Me', icon: <AiOutlineUser /> },
    { href: '/projects', label: 'Projects', icon: <HiOutlineLightBulb /> },
    { href: '/hobbies', label: 'Hobbies', icon: <IoColorPaletteOutline /> },
    { href: '/contact', label: 'Contact', icon: <IoIosContact /> },
  ];
  return (
    <nav
      className={`sticky top-0 z-50 mx-6 overflow-visible shadow-2xl transition-all duration-300 lg:mx-25 ${isScrolled ? 'rounded-2xl bg-gray-800/95 backdrop-blur-sm' : 'rounded-b-2xl bg-gray-800'}`}
    >
      <div className="mx-4 flex h-24 items-center justify-between">
        {/* Logo Section */}
        <div className="px-4">
          <Link href="/" className="group relative flex items-center">
            {pathname === '/' ? (
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
        {/* Desktop */}
        <div className="ml-auto hidden items-center lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center px-4 text-2xl transition duration-300 hover:scale-105 ${
                pathname === link.href
                  ? 'font-bold text-yellow-300'
                  : 'text-gray-200 hover:text-yellow-300'
              }`}
            >
              {link.icon}
              <span className="ml-2">{link.label}</span>
            </Link>
          ))}
          {/* Auth Links */}
          {status !== 'loading' && (
            <div className="ml-4 flex items-center border-l border-gray-600 pl-4">
              {session ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-lg text-gray-300 transition duration-300 hover:bg-gray-700 hover:text-yellow-300"
                  >
                    {session.user.profileImage ? (
                      <Image
                        src={session.user.profileImage}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300 text-sm font-bold text-gray-900">
                        {session.user.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="hidden lg:inline">
                      {session.user.name || 'User'}
                    </span>
                    <svg
                      className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
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
                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl bg-gray-700 py-2 shadow-xl">
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-200 transition-colors hover:bg-gray-600 hover:text-yellow-300"
                      >
                        <AiOutlineUser className="mr-2" />
                        Profile
                      </Link>
                      {session.user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-200 transition-colors hover:bg-gray-600 hover:text-yellow-300"
                        >
                          <AiOutlineDashboard className="mr-2" />
                          Admin Dashboard
                        </Link>
                      )}
                      <hr className="my-2 border-gray-600" />
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
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
              ) : (
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
              )}
            </div>
          )}
        </div>
        {/* Mobile */}
        <div className="relative ml-auto lg:hidden">
          <button
            className="px-4 text-2xl text-gray-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <RxHamburgerMenu className="text-4xl text-gray-200 hover:text-yellow-300" />
          </button>
          {/* Mobile Dropdown Drawer */}
          <div
            className={`absolute top-full right-0 z-50 w-48 space-y-2 overflow-hidden rounded-2xl bg-gray-600 pt-4 pb-4 shadow-2xl transition-all duration-600 ${
              isOpen
                ? 'max-h-[500px] opacity-100'
                : 'pointer-events-none max-h-0 opacity-0'
            }`}
          >
            {links.map((link) => (
              <Link
                onClick={() => setIsOpen(false)}
                key={link.label}
                href={link.href}
                className={`flex items-center justify-center px-4 text-center text-2xl transition duration-300 ${
                  pathname === link.href
                    ? 'font-bold text-yellow-300'
                    : 'text-gray-200 hover:text-yellow-300'
                }`}
              >
                {link.icon}
                <span className="ml-2">{link.label}</span>
              </Link>
            ))}
            {/* Mobile Auth Links */}
            {status !== 'loading' && (
              <div className="mt-2 border-t border-gray-500 pt-2">
                {session ? (
                  <>
                    <div className="mb-2 flex flex-col items-center gap-2 px-4">
                      {session.user.profileImage ? (
                        <Image
                          src={session.user.profileImage}
                          alt="Profile"
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-300 text-lg font-bold text-gray-900">
                          {session.user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <span className="text-sm text-gray-400">
                        {session.user.name || 'User'}
                      </span>
                    </div>
                    <Link
                      onClick={() => setIsOpen(false)}
                      href="/profile"
                      className="flex items-center justify-center px-4 py-1 text-center text-xl text-gray-300 transition duration-300 hover:text-yellow-300"
                    >
                      <AiOutlineUser className="mr-2" />
                      Profile
                    </Link>
                    {session.user.role === 'admin' && (
                      <Link
                        onClick={() => setIsOpen(false)}
                        href="/admin"
                        className="flex items-center justify-center px-4 py-1 text-center text-xl text-gray-300 transition duration-300 hover:text-yellow-300"
                      >
                        <AiOutlineDashboard className="mr-2" />
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsOpen(false);
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
                      onClick={() => setIsOpen(false)}
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
                      onClick={() => setIsOpen(false)}
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
