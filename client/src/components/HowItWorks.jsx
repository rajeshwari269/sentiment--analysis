import React from "react";

const steps = [
  {
    icon: "📰",
    title: "Analyze",
    desc: "Paste a news article → See how it feels"
  },
  {
    icon: "✍️",
    title: "Journal",
    desc: "Write your journal entry → Reflect on your mood"
  },
  {
    icon: "📈",
    title: "Track",
    desc: "Compare and track → Discover patterns over time"
  }
];

const HowItWorks = () => (
  <section className="max-w-5xl mx-auto px-4 py-12">
    <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
    <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
      {steps.map((s, i) => (
        <div key={s.title} className="flex-1 bg-white rounded-xl shadow p-6 text-center border border-gray-100">
          <div className="text-4xl mb-2">{s.icon}</div>
          <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
          <p className="text-gray-600">{s.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorks; 