"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosContact } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineLightBulb } from "react-icons/hi";
import Link from "next/link";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const links = [
    { href: "/about", label: "About  Me", icon: <AiOutlineUser /> },
    { href: "/projects", label: "Projects", icon: <HiOutlineLightBulb /> },
    { href: "/contact", label: "Contact", icon: <IoIosContact /> },
  ];
  return (
    <nav className="bg-gray-800 mx-6 md:mx-25 rounded-b-2xl shadow-2xl">
      <div className="mx-4 h-24 items-center flex justify-between">
        {/* Logo Section */}
        <div className="text-gray-200 text-4xl font-bold px-4">
          <Link
            href="/"
            className="flex items-center hover:text-yellow-300  hover:scale-105 transition duration-300"
          >
            <IoHomeOutline />
          </Link>
        </div>
        {/* Desktop */}
        <div className="hidden md:flex ml-auto">
          {links.map((link) =>
            pathname === link.href ? null : (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center text-gray-200 text-2xl px-4 hover:text-yellow-300 transition duration-300 hover:scale-105"
              >
                {link.icon}
                <span className="ml-2">{link.label}</span>
              </Link>
            )
          )}
        </div>
        {/* Mobile */}
        <div className="relative md:hidden ml-auto">
          <button
            className="text-gray-200 text-2xl px-4"
            onClick={() => setIsOpen(!isOpen)}
          >
            <RxHamburgerMenu className="text-4xl text-gray-200 hover:text-yellow-300" />
          </button>
          {/* Mobile Dropdown Drawer */}
          <div
            className={`absolute right-0 top-full w-48 bg-gray-600 space-y-2 pb-4 pt-4 overflow-hidden transition-all duration-600 rounded-2xl shadow-2xl z-50 ${
              isOpen
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            {links.map((link) =>
              pathname === link.href ? null : (
                <Link
                  onClick={() => setIsOpen(false)}
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-center text-center text-gray-200 text-2xl px-4 hover:text-yellow-300 transition duration-300"
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
