import React from 'react';
import './Dashboard.css';
import {
  Header,
  OverallMood,
  MoodTrend,
  LastAnalysis,
  TotalEntries,
  MoodChart,
  RecentActivity,
  ActionButtons
} from './components';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <main className="dashboard-content">
        <div className="top-section">
          <div className="stats-section">
            <div className="stats-grid">
              <OverallMood />
              <MoodTrend />
              <LastAnalysis />
              <TotalEntries />
            </div>
          </div>
        </div>
        
        <div className="middle-section">
          <MoodChart />
        </div>
        
        <div className="bottom-section">
          <div className="activity-column">
            <RecentActivity />
          </div>
          <div className="actions-column">
            <ActionButtons />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;