"use client";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { href: "", label: "Home" },
    { href: "", label: "Resume" },
    { href: "", label: "Projects" },
    { href: "", label: "Contact" },
  ];
  return (
    <nav className="bg-gray-800">
      <div className="h-24 items-center flex justify-between">
        {/* Logo Section */}
        <div className="text-gray-200 text-4xl font-bold px-4">
          MyLogo
        </div>` {/* Desktop */}
        <div className="hidden md:block">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-200 text-2xl px-4"
            >
              {link.label}
            </a>
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
          <a
            key={link.label}
            href={link.href}
            className="text-gray-200 text-2xl px-4 block"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
