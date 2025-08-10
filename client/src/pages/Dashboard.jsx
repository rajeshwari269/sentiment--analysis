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
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 100
      }
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
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="font-sans w-full text-gray-200 bg-gradient-to-br from-[#0f172a] to-[#1e293b] min-h-screen">
      <main className="w-full px-0">
        {/* Top Section - Stats Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full px-4 md:px-6 py-6"
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[OverallMood, MoodTrend, LastAnalysis, TotalEntries].map((Component, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50"
              >
                <Component />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Middle Section - Chart */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={chartVariants}
          className="w-full px-4 md:px-6 py-5"
        >
          <div className="bg-gray-800/70 p-5 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50">
            <MoodChart />
          </div>
        </motion.div>

        {/* Bottom Section - Activity and Actions */}
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
              className="bg-gray-800/70 p-5 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50"
            >
              <RecentActivity />
            </motion.div>
          </div>
          <div className="lg:col-span-1">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="bg-gray-800/70 p-5 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50"
            >
              <ActionButtons />
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-500/20 rounded-full"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, 100],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
