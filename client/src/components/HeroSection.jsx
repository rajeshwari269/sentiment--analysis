import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <section className="text-center py-16 bg-gradient-to-r from-blue-100 to-purple-100">
    <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-2">
      <span role="img" aria-label="sparkles">✨</span>
      Track Your Mood. Understand the World.
    </h1>
    <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
      SentiLog helps you monitor your emotions and compare them with news sentiment over time.
    </p>
    <div className="flex flex-col md:flex-row gap-4 justify-center">
      <Link to="/news" className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">Try News Analyzer</Link>
      <Link to="/journal" className="px-6 py-3 bg-green-600 text-white rounded shadow hover:bg-green-700 transition">Log a Mood Entry</Link>
    </div>
  </section>
);

export default HeroSection; 