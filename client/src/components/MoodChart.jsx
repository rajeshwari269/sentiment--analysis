import React, { useState } from 'react';

const MoodChart = () => {
  const [activeTab, setActiveTab] = useState("Weekly");
  const tabs = ["Weekly", "Monthly", "All Time"];
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-purple">
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M9 21V9"></path>
          </svg>
          Mood Over Time
        </div>
        <div className="chart-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`button button-sm ${activeTab === tab ? 'button-secondary' : 'button-ghost'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="card-content">
        <div className="chart-container">
          {/* Y axis labels */}
          <div className="chart-y-labels">
            <span>High</span>
            <span>Neutral</span>
            <span>Low</span>
          </div>
          
          {/* Chart area */}
          <div className="chart-area">
            {/* Horizontal guidelines */}
            <div className="chart-guidelines">
              <div className="chart-guideline"></div>
              <div className="chart-guideline"></div>
              <div className="chart-guideline"></div>
            </div>
            
            {/* Chart line */}
            <svg className="chart-svg" preserveAspectRatio="none">
              <path 
                d="M0,80 C20,70 40,50 60,60 C80,70 100,20 120,10 C140,0 160,20 180,30 C200,40 220,20 240,30 C260,40 280,50 300,40 C320,30 340,40 360,30 C380,20 400,30 420,20" 
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                className="chart-line"
              />
              <path 
                d="M0,80 C20,70 40,50 60,60 C80,70 100,20 120,10 C140,0 160,20 180,30 C200,40 220,20 240,30 C260,40 280,50 300,40 C320,30 340,40 360,30 C380,20 400,30 420,20 L420,180 L0,180 Z" 
                fill="url(#areaGradient)"
                opacity="0.3"
                className="chart-area-fill"
              />
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* X axis labels */}
          <div className="chart-x-labels">
            <span>Jul 18</span>
            <span>Jul 19</span>
            <span>Jul 20</span>
            <span>Jul 21</span>
            <span>Jul 22</span>
            <span>Jul 23</span>
            <span>Jul 24</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodChart;