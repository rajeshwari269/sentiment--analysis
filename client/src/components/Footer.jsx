import React from "react";

const Footer = () => (
  <footer className="bg-gray-100 py-6 mt-8 text-center text-gray-600 text-sm">
    <div className="mb-2">SentiLog AI &copy; {new Date().getFullYear()} &mdash; Open Source Project</div>
    <div className="flex justify-center gap-4 mb-2">
      <a href="https://github.com/your-org/SentiLogAI" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
      <a href="mailto:contact@sentilog.ai" className="hover:underline">Contact</a>
      <a href="/privacy" className="hover:underline">Privacy</a>
      <a href="https://github.com/your-org/SentiLogAI#credits" target="_blank" rel="noopener noreferrer" className="hover:underline">Credits</a>
    </div>
    <div>ML models: HuggingFace, VADER &mdash; Icons: Heroicons, Lucide</div>
  </footer>
);

export default Footer; 