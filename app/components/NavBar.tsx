'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoHomeOutline, IoColorPaletteOutline } from 'react-icons/io5';
import { IoIosContact } from 'react-icons/io';
import { AiOutlineUser, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai';
import { HiOutlineLightBulb } from 'react-icons/hi';
import Link from 'next/link';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const links = [
    { href: '/about', label: 'About  Me', icon: <AiOutlineUser /> },
    { href: '/projects', label: 'Projects', icon: <HiOutlineLightBulb /> },
    { href: '/hobbies', label: 'Hobbies', icon: <IoColorPaletteOutline /> },
    { href: '/contact', label: 'Contact', icon: <IoIosContact /> },
  ];
  return (
    <nav className="mx-6 rounded-b-2xl bg-gray-800 shadow-2xl md:mx-25">
      <div className="mx-4 flex h-24 items-center justify-between">
        {/* Logo Section */}
        <div className="px-4 text-4xl font-bold text-gray-200">
          <Link
            href="/"
            className="flex items-center transition duration-300 hover:scale-105 hover:text-yellow-300"
          >
            <IoHomeOutline />
          </Link>
        </div>
        {/* Desktop */}
        <div className="ml-auto hidden items-center md:flex">
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
                <button
                  onClick={() => signOut()}
                  className="flex items-center px-3 text-lg text-gray-400 transition duration-300 hover:text-yellow-300"
                >
                  <AiOutlineLogout className="mr-1" />
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
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
                    href="/register"
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
        <div className="relative ml-auto md:hidden">
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
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center justify-center px-4 text-center text-xl text-gray-300 transition duration-300 hover:text-yellow-300"
                  >
                    <AiOutlineLogout className="mr-2" />
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link
                      onClick={() => setIsOpen(false)}
                      href="/login"
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
                      href="/register"
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
