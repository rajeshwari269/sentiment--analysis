import { useState } from "react";
import api from "../axios";
import Navbar from "../components/Navbar";

export const ContactPage = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    
    message: "",
  });
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, feedbackType, message } = data;

    try {
      const res = await api.post("/api/contact", {
        username,
        email,
        message,
      });

      if (res.status === 200) {
        alert("Form submitted");
        setData({
          username: "",
          email: "",
          
          message: "",
        });
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending message");
    }
  };
const faqData=[
  {
question:"What exactly does SentiLog AI do?",
answer:"SentiLog AI analyzes emotional patterns in personal journals, social media, and news headlines. It transforms raw text into mood insights, helping users spot emotional trends over time.",
  },
  {
question:"Is my personal journal data safe?",
answer:"Absolutely. Your entries are encrypted and stored securely. Only you can access your personal logs — our team cannot read your private journal content.",
  },
  {
question:"Can SentiLog AI detect sarcasm or humor?",
answer:"We’re working on it! Our sentiment engine is trained to pick up subtle tones like sarcasm, but humor can be tricky for any AI. Over time, with more user feedback, it gets better at catching these nuances.",
  },
  {
question:"How accurate is the sentiment detection?",
answer:"Our accuracy rate currently ranges between 85%–92%, depending on the complexity of the text. Emotional nuances, cultural context, and slang can slightly affect results.",
  },
  {
    question:"How can I suggest a new feature?",
    answer:"Simply fill out the feedback form below. We review every submission and prioritize features that enhance user experience and data accuracy."
  },
  {
question:"What’s the best way to get in touch with the team?",
answer:"The feedback form on this page is the fastest way. For business inquiries, you can also email us",
  },
]

  return (
    <>
      <div
        className="min-h-screen px-4 py-10 transition-all duration-300"
        style={{ backgroundColor: "var(--bg)", color: "var(--body-text)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
          {/* Left Content Section */}
          <div className="flex flex-col justify-center gap-6 px-2">
            <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--heading)" }}>
              Connect With SentiLog AI Team
            </h1>
            <p className="text-lg leading-relaxed">
              SentiLog AI empowers users to understand emotional trends across personal journals
              and global news. Whether you're logging moods, analyzing headlines, or exploring patterns —
              your feedback helps us grow.
            </p>
            <p className="text-md leading-relaxed">
              Got a feature suggestion, issue, or general feedback? We'd love to hear from you.
              Fill out the form and our team will get back to you shortly.
            </p>
            <ul className="list-disc pl-6 text-sm mt-2 text-gray-400">
              <li>AI-driven sentiment and emotion detection</li>
              <li>Compare your moods with trending news sentiment</li>
              <li>Track daily emotional patterns effortlessly</li>
            </ul>
          </div>

          {/* Right Form Section */}
          <form
            onSubmit={handleSubmit}
            className="w-full p-8 rounded-xl shadow-md flex flex-col gap-6 transition-all duration-300"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="text-2xl font-bold text-center mb-2"
              style={{ color: "var(--button)" }}
            >
              Send Us Your Feedback
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="font-semibold" style={{ color: "var(--heading)" }}>
                Name
              </label>
              <input
                name="username"
                type="text"
                value={data.username}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="p-3 rounded-lg transition"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  color: "var(--body-text)",
                }}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-semibold" style={{ color: "var(--heading)" }}>
                Email
              </label>
              <input
                name="email"
                type="email"
                value={data.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="p-3 rounded-lg transition"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  color: "var(--body-text)",
                }}
              />
            </div>

          

            {/* Message */}
            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="font-semibold" style={{ color: "var(--heading)" }}>
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                value={data.message}
                onChange={handleChange}
                required
                placeholder="Write your message..."
                className="p-3 rounded-lg transition"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  color: "var(--body-text)",
                }}
              />
            </div>

            <button
  type="submit"
  className="py-3 w-full rounded-lg font-semibold transition"
  style={{
    background: "linear-gradient(to right, #7e5bef, #f857a6)",
    color: "#fff",
  }}
  onMouseOver={(e) =>
    (e.currentTarget.style.background =
      "linear-gradient(to right, #6c4de6, #e4489c)")
  }
  onMouseOut={(e) =>
    (e.currentTarget.style.background =
      "linear-gradient(to right, #7e5bef, #f857a6)")
  }
>
  SUBMIT
</button>

          </form>
        </div>
         {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--heading)" }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full flex justify-between items-center p-4 font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-center py-4 rounded"
                style={{ color: "var(--heading)" }}
              >
                {item.question}
                <span>{openFAQ === index ? "-" : "+"}</span>
              </button>
              {openFAQ === index && (
                <div
                  className="p-4 text-sm"
                  style={{ color: "var(--body-text)" }}
                >
                  {item.answer}
                </div>
              )}
            </div>
          ))} 
          </div>
          </div>
      </div>
    </>
  );
};
