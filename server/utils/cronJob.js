const cron = require("node-cron");
const fetchAndPostNews = require("../services/newsFetcher");
const CRON_TIMINGS = {
  EVERY_MINUTE: "* * * * *",
  EVERY_10_MINUTES: "*/10 * * * *",
  EVERY_HOUR: "0 * * * *",
  EVERY_DAY_MIDNIGHT: "0 0 * * *",
  EVERY_DAY_6AM: "0 6 * * *",
};

cron.schedule(CRON_TIMINGS.EVERY_DAY_6AM, () => {
  console.log("🕒 Running scheduled news fetch...");
  fetchAndPostNews();
});


cron.schedule(CRON_TIMINGS.EVERY_HOUR, async() => {
  try {
    console.log("🔁 Pinging ML API to keep it alive...");
    await axios.get("https://sentilog-ai-1.onrender.com/ml-api"); // Replace with your actual ML API URL
    console.log("✅ ML API pinged successfully.");
  } catch (error) {
    console.error("⚠️ Failed to ping ML API:", error.message);
  }
});

