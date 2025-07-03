import React from "react";

const Footer = () => (
  <footer className="bg-gray-100 py-6 mt-8 text-center text-gray-600 text-sm">
    <div className="mb-2">SentiLog AI &copy; {new Date().getFullYear()} &mdash; MIT License</div>
    <div className="flex justify-center gap-4 mb-2">
      <a href="https://github.com/IkkiOcean/SentiLog-AI" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
    </div>
    <div>Built with <span className="text-red-500">❤️</span> for open source</div>
  </footer>
);

export default Footer; 