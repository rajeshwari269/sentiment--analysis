import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-gray-800 text-white p-4 flex gap-4">
    <Link to="/dashboard">Dashboard</Link>
    <Link to="/journal">Journal</Link>
    <Link to="/news">News</Link>
  </nav>
);

export default Navbar; 