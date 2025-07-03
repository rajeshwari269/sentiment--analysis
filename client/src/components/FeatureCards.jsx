import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: "📰",
    title: "Analyze News",
    desc: "Get sentiment + emotion from articles",
    link: "/news"
  },
  {
    icon: "😄",
    title: "Log Your Mood",
    desc: "Journal your thoughts and detect mood",
    link: "/journal"
  },
  {
    icon: "📊",
    title: "Track & Compare",
    desc: "See how your mood and news trends align",
    link: "/dashboard"
  }
];

const FeatureCards = () => (
  <section className="max-w-7xl mx-auto px-4 py-12">
    <div className="flex flex-col md:flex-row gap-6 justify-center">
      {features.map((f, i) => (
        <Link to={f.link} key={f.title} className="flex-1 bg-white rounded-xl shadow p-6 text-center hover:scale-105 transition transform cursor-pointer border border-gray-100">
          <div className="text-4xl mb-2">{f.icon}</div>
          <h3 className="text-xl font-semibold mb-1">{f.title}</h3>
          <p className="text-gray-600 mb-2">{f.desc}</p>
        </Link>
      ))}
    </div>
  </section>
);

export default FeatureCards; 