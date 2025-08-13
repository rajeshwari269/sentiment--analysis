import React from 'react';
import { motion } from 'framer-motion';
import ActionButtons from '../components/dashboard/ActionButtons';
import LastAnalysis from '../components/dashboard/LastAnalysis';
import MoodChart from '../components/dashboard/MoodChart';
import MoodTrend from '../components/dashboard/MoodTrend';
import OverallMood from '../components/dashboard/OverallMood';
import RecentActivity from '../components/dashboard/RecentActivity';
import TotalEntries from '../components/dashboard/TotalEntries';

const Dashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 10, stiffness: 100 }
    },
    hover: {
      scale: 1.03,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  return (
    <div
      className="
        font-sans w-full min-h-screen
        bg-gradient-to-br from-white to-gray-100 text-black
        dark:from-[#0f172a] dark:to-[#1e293b] dark:text-gray-200
      "
    >
      <main className="w-full px-0">
        {/* Top Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full px-4 md:px-6 py-6"
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[OverallMood, MoodTrend, LastAnalysis, TotalEntries].map(
              (Component, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover="hover"
                  className="
                    bg-white border border-gray-300 text-black
                    dark:bg-gray-800 dark:border-gray-700 dark:text-white
                    p-5 rounded-xl shadow-lg backdrop-blur-sm
                  "
                >
                  <div className="text-blue-700 dark:text-blue-400">
                    <Component />
                  </div>
                </motion.div>
              )
            )}
          </div>
        </motion.div>

        {/* Middle Section - Chart */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={chartVariants}
          className="w-full px-4 md:px-6 py-5"
        >
          <div
            className="
              bg-white text-black border border-gray-300
              dark:bg-gray-800 dark:text-white dark:border-gray-700
              p-5 rounded-xl shadow-lg backdrop-blur-sm
            "
          >
            <MoodChart />
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full px-4 md:px-6 py-5 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="
                bg-white border border-gray-300 text-black
                dark:bg-gray-800 dark:border-gray-700 dark:text-white
                p-5 rounded-xl shadow-lg backdrop-blur-sm
              "
            >
              <RecentActivity />
            </motion.div>
          </div>
          <div className="lg:col-span-1">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="
                bg-white border border-gray-300 text-black
                dark:bg-gray-800 dark:border-gray-700 dark:text-white
                p-5 rounded-xl shadow-lg backdrop-blur-sm
              "
            >
              <ActionButtons />
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
