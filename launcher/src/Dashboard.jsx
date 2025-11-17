import React from 'react';
import './Dashboard.css';

function Dashboard({ apps, onLaunch, onFocus, onReload, onClose, onToggleFullscreen }) {
  
  const getStatusColor = (app) => {
    return app.isOpen ? '#10b981' : '#6b7280';
  };

  const getStatusText = (app) => {
    return app.isOpen ? 'Running' : 'Not launched';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Launcher Dashboard</h2>
        <div className="dashboard-actions">
          <button className="btn-primary" onClick={() => onLaunch('all')}>
            Launch All
          </button>
          <button className="btn-secondary" onClick={() => onClose('all')}>
            Close All
          </button>
        </div>
      </div>
      
      <div className="app-grid">
        {apps.map((app) => (
          <div key={app.name} className="app-card">
            <div className="app-card-header">
              <div className="app-info">
                <div className="app-icon">{app.name.charAt(0)}</div>
                <div className="app-details">
                  <h3 className="app-name">{app.name}</h3>
                  <div className="app-status">
                    <span 
                      className="status-dot" 
                      style={{ backgroundColor: getStatusColor(app) }}
                    ></span>
                    <span className="status-text">{getStatusText(app)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="app-url">
              <a href={app.url} target="_blank" rel="noopener noreferrer">
                {app.url}
              </a>
            </div>
            
            <div className="app-actions">
              {!app.isOpen ? (
                <button 
                  className="btn-launch"
                  onClick={() => onLaunch(app.name)}
                >
                  Launch
                </button>
              ) : (
                <>
                  <button 
                    className="btn-action"
                    onClick={() => onFocus(app.name)}
                    title="Focus window"
                  >
                    Focus
                  </button>
                  <button 
                    className="btn-action"
                    onClick={() => onReload(app.name)}
                    title="Reload"
                  >
                    ↻
                  </button>
                  <button 
                    className="btn-action"
                    onClick={() => onToggleFullscreen(app.name)}
                    title="Toggle fullscreen"
                  >
                    ⛶
                  </button>
                  <button 
                    className="btn-action btn-close"
                    onClick={() => onClose(app.name)}
                    title="Close window"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
