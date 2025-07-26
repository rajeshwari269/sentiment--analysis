import React from 'react';

const RecentActivity = () => {
  // This would typically come from your data
  const activities = [
    {
      id: 1,
      type: 'journal',
      title: 'Morning Reflection',
      date: 'July 24, 2023',
      time: '08:30 AM',
      content: 'Started the day feeling motivated after completing my morning workout routine...',
      mood: 'Energetic',
      sentiment: 'positive'
    },
    {
      id: 2,
      type: 'analysis',
      title: 'Weekly Mood Analysis',
      date: 'July 24, 2023',
      time: '09:15 AM',
      insights: ['Positive trend observed', 'More consistent mood patterns', 'Lower stress indicators']
    },
    {
      id: 3,
      type: 'journal',
      title: 'Lunch Break Thoughts',
      date: 'July 23, 2023',
      time: '01:45 PM',
      content: 'Had a productive meeting with the team. We finalized the project timeline...',
      mood: 'Content',
      sentiment: 'positive'
    }
  ];
  
  const getActivityIcon = (type) => {
    switch(type) {
      case 'journal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="activity-icon journal-icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <path d="M14 2v6h6"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
            <path d="M10 9H8"></path>
          </svg>
        );
      case 'analysis':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="activity-icon analysis-icon">
            <path d="M3 3v18h18"></path>
            <path d="m19 9-5 5-4-4-3 3"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="activity-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
        );
    }
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-blue">
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="M7 7h.01"></path>
            <path d="M12 7h.01"></path>
            <path d="M17 7h.01"></path>
            <path d="M7 12h.01"></path>
            <path d="M12 12h.01"></path>
            <path d="M17 12h.01"></path>
            <path d="M7 17h.01"></path>
            <path d="M12 17h.01"></path>
            <path d="M17 17h.01"></path>
          </svg>
          Recent Activity
        </div>
      </div>
      <div className="card-content">
        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-time">
                <div className="activity-icon-container">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="time-label">
                  {activity.time}
                </div>
              </div>
              <div className="activity-details">
                <div className="activity-header">
                  <h3 className="activity-title">{activity.title}</h3>
                  <span className="activity-date">{activity.date}</span>
                </div>
                {activity.type === 'journal' ? (
                  <div className="activity-content">
                    <p className="activity-text">{activity.content}</p>
                    <div className="activity-mood">
                      <span className={`badge ${activity.sentiment === 'positive' ? 'badge-success' : 'badge-warning'}`}>
                        {activity.mood}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="activity-insights">
                    <ul className="insights-list">
                      {activity.insights.map((insight, index) => (
                        <li key={index} className="insight-item">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="insight-icon">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                          </svg>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;