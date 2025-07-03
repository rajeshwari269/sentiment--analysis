import React from "react";
import LineChart from "./LineChart";

const SentimentChartPreview = () => (
  <section className="max-w-4xl mx-auto px-4 py-8">
    <h2 className="text-xl font-semibold mb-4">Mood & News Sentiment (Last 7 Days)</h2>
    <div className="bg-white rounded-xl shadow p-6">
      <LineChart />
    </div>
  </section>
);

export default SentimentChartPreview; 