import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/journal", label: "Journal" },
  { to: "/news", label: "News" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white shadow flex items-center justify-between px-4 py-3 md:px-8">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-blue-700">🧠 SentiLog AI</span>
      </div>
      <div className="hidden md:flex gap-6">
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `font-medium hover:text-blue-600 transition ${isActive ? "text-blue-600 underline" : "text-gray-700"}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {open ? "✖️" : "☰"}
      </button>
      {open && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center md:hidden animate-fade-in">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block w-full text-center py-3 font-medium border-b border-gray-100 hover:text-blue-600 transition ${isActive ? "text-blue-600 underline" : "text-gray-700"}`
              }
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 