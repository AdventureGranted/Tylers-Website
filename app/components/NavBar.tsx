'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoHomeOutline, IoColorPaletteOutline } from 'react-icons/io5';
import { IoIosContact } from 'react-icons/io';
import { AiOutlineUser } from 'react-icons/ai';
import { HiOutlineLightBulb } from 'react-icons/hi';
import Link from 'next/link';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
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
        <div className="ml-auto hidden md:flex">
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
                ? 'max-h-96 opacity-100'
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
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
