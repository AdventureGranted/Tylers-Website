"use client";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosDocument, IoIosContact } from "react-icons/io";
import { FaProjectDiagram } from "react-icons/fa";
import Link from "next/link";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { href: "", label: "Resume", icon: <IoIosDocument /> },
    { href: "", label: "Projects", icon: <FaProjectDiagram /> },
    { href: "", label: "Contact", icon: <IoIosContact /> },
  ];
  return (
    <nav className="bg-gray-800">
      <div className="h-24 items-center flex justify-between">
        {/* Logo Section */}
        <div className="text-gray-200 text-4xl font-bold px-4">
          <Link
            href="/"
            className="flex items-center hover:text-gray-400 transition duration-300"
          >
            <IoHomeOutline />
            <span className="ml-2">Home</span>
          </Link>
        </div>
        {/* Desktop */}
        <div className="hidden md:flex ml-auto">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center text-gray-200 text-2xl px-4 hover:text-gray-400 transition duration-300"
            >
              {link.icon}
              <span className="ml-2">{link.label}</span>
            </Link>
          ))}
        </div>
        <button
          className="md:hidden text-gray-200 text-2xl px-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <RxHamburgerMenu className="text-4xl text-gray-200" />
        </button>
      </div>
      {/* mobile */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-gray-600 space-y-2 pb-2 pt-2`}
      >
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="flex items-center text-gray-200 text-2xl px-4 hover:text-gray-400 transition duration-300"
          >
            {link.icon}
            <span className="ml-2">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
