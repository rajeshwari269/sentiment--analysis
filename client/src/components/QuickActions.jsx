import React, { useState } from "react";
import SentimentCard from "./SentimentCard";
import { Link } from "react-router-dom";

const QuickActions = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/api/news/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to analyze sentiment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold mb-2">Try Sentiment Detection</h2>
        <input
          className="border p-2 rounded w-full"
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste a sentence or news excerpt…"
        />
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
          <Link to="/journal" className="px-4 py-2 bg-green-600 text-white rounded">Go to Mood Journal</Link>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {result && <SentimentCard sentiment={result.sentiment} emotion={result.emotion} />}
      </div>
    </section>
  );
};

export default QuickActions; 