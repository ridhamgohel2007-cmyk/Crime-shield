import React, { useState, useEffect } from 'react';
import { Shield, Map, Activity, Users, Settings, AlertTriangle, Radio, Sun, Moon, X, ChevronRight, ChevronLeft, Info, List, Download, ChevronDown, Bell } from 'lucide-react';
import { io } from 'socket.io-client';
import GISMap from './components/GISMap';
import Analytics from './components/Analytics';
import Patrols from './components/Patrols';
import CyberIntel from './components/CyberIntel';
import SettingsScreen from './components/Settings';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isBottomLeftPanelOpen, setIsBottomLeftPanelOpen] = useState(true);
  const [bottomLeftActiveTab, setBottomLeftActiveTab] = useState('ai');
  const [isLiveFeedOpen, setIsLiveFeedOpen] = useState(true);
  const [highlightedZone, setHighlightedZone] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [severityFilter, setSeverityFilter] = useState({
    critical: true,
    moderate: true,
    low: true
  });
  const [liveEvents, setLiveEvents] = useState([
    { id: 1, title: 'High Risk Spike: Navrangpura', time: 'Just now', type: 'critical' },
    { id: 2, title: 'Fraud Cluster Detected', time: '2m ago', type: 'warning' },
    { id: 3, title: 'Patrol Unit 4 Rerouted', time: '15m ago', type: 'info' }
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Close export dropdown on click outside
  useEffect(() => {
    if (!isExportDropdownOpen) return;
    const handleOutsideClick = (e) => {
      const exportContainer = document.getElementById('export-container');
      if (exportContainer && !exportContainer.contains(e.target)) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isExportDropdownOpen]);

  const handleExportCSV = () => {
    setIsExportDropdownOpen(false);
    const csvHeaders = "ID,Area,Incident Type,Severity Level,Timestamp,Status\n";
    const csvRows = [
      "1,Navrangpura,Theft,Critical,22:15:30,Under Investigation",
      "2,Vastrapur,Assault,High,22:45:12,Patrol Dispatched",
      "3,Maninagar,Fraud,Moderate,21:10:05,Resolved",
      "4,Satellite,Cyber,Critical,20:05:45,Mitigated",
      "5,Paldi,Vandalism,Low,19:30:20,Report Filed",
      "6,Ghatlodia,Theft,Moderate,18:15:00,Resolved",
      "7,SG Highway,Speeding,Moderate,17:40:11,Warning Issued"
    ];
    const csvString = csvHeaders + csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `crimeshield_incident_briefing_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    setIsExportDropdownOpen(false);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Connect to Flask WebSocket Backend
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('live_event', (event) => {
      setLiveEvents(prev => [{
        id: Date.now(),
        title: event.title,
        time: 'Just now',
        type: event.type
      }, ...prev].slice(0, 8)); // Keep last 8 events
    });

    return () => socket.disconnect();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="logo-container">
          <Shield size={32} className="logo-icon" />
          <span className="logo-text">CrimeShield</span>
        </div>
        
        <nav className="nav-menu">
          <div className={`nav-item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => { setActiveTab('map'); setHighlightedZone(null); }}>
            <div className="nav-item-content">
              <Map size={20} />
              <span>GIS Map</span>
            </div>
          </div>
          <div className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <div className="nav-item-content">
              <Activity size={20} />
              <span>Analytics</span>
            </div>
          </div>
          <div className={`nav-item ${activeTab === 'patrol' ? 'active' : ''}`} onClick={() => setActiveTab('patrol')}>
            <div className="nav-item-content">
              <Users size={20} />
              <span>Patrol Routes</span>
            </div>
          </div>
          <div className={`nav-item ${activeTab === 'cyber' ? 'active' : ''}`} onClick={() => setActiveTab('cyber')}>
            <div className="nav-item-content">
              <Radio size={20} />
              <span>Cyber Intelligence</span>
            </div>
          </div>
          <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <div className="nav-item-content">
              <Settings size={20} />
              <span>Settings</span>
            </div>
          </div>
        </nav>
        
        <div className="nav-item" onClick={toggleTheme} style={{ marginTop: 'auto' }}>
          <div className="nav-item-content">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'map' ? (
          <>
            {/* Top bar */}
            <header className="top-bar glass-panel" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', right: '1.5rem', width: 'auto', zIndex: 1100 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', width: '100%' }}>
                {/* Search box on the left */}
                <div style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="🔍 Search location or incident..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                      setTimeout(() => setIsSearchFocused(false), 200);
                    }}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem 0.75rem 1.5rem', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      background: 'var(--topbar-input-bg)',
                      color: 'var(--text-main)',
                      outline: 'none'
                    }} 
                  />
                  {isSearchFocused && searchQuery === '' && (
                    <div className="glass-panel" style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: '0.5rem',
                      borderRadius: '8px',
                      padding: '1rem',
                      zIndex: 2000,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      pointerEvents: 'auto'
                    }}>
                      {/* Try Asking Section */}
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-cyan)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          ✨ Try Asking (NLP)
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {[
                            "Show theft hotspots in Navrangpura last week",
                            "Identify fraud clusters in Ahmedabad",
                            "Predict high risk zones for tonight"
                          ].map((query, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => setSearchQuery(query)}
                              style={{ 
                                fontSize: '0.85rem', 
                                padding: '0.35rem 0.5rem', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                color: 'var(--text-main)',
                                background: 'rgba(255,255,255,0.02)',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
                              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.02)'}
                            >
                              • "{query}"
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Locations Section */}
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          📍 Recent Locations
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <div 
                            onClick={() => setSearchQuery("Navrangpura")}
                            style={{ 
                              fontSize: '0.85rem', 
                              padding: '0.35rem 0.5rem', 
                              borderRadius: '4px', 
                              cursor: 'pointer',
                              color: 'var(--text-main)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              background: 'transparent',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <span>• Navrangpura</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-red)' }}>High Risk Zone</span>
                          </div>
                          <div 
                            onClick={() => setSearchQuery("Satellite")}
                            style={{ 
                              fontSize: '0.85rem', 
                              padding: '0.35rem 0.5rem', 
                              borderRadius: '4px', 
                              cursor: 'pointer',
                              color: 'var(--text-main)',
                              background: 'transparent',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            • Satellite
                          </div>
                        </div>
                      </div>

                      {/* Suggested Landmarks Section */}
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          🏢 Suggested Landmarks
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {[
                            "Alpha One Mall, Vastrapur",
                            "Shivranjani Cross Roads"
                          ].map((landmark, idx) => (
                            <div 
                              key={idx}
                              onClick={() => setSearchQuery(landmark)}
                              style={{ 
                                fontSize: '0.85rem', 
                                padding: '0.35rem 0.5rem', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                color: 'var(--text-main)',
                                background: 'transparent',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              • {landmark}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* KPIs & System Info in Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Active Alerts */}
                    <div className="header-kpi-badge red">
                      <AlertTriangle size={16} />
                      <span>12<span className="kpi-badge-label"> Alerts</span></span>
                    </div>

                    {/* Active Patrols */}
                    <div className="header-kpi-badge green">
                      <Users size={16} />
                      <span>48<span className="kpi-badge-label"> Patrols</span></span>
                    </div>

                    {/* Cyber Clusters */}
                    <div className="header-kpi-badge yellow">
                      <Radio size={16} />
                      <span>5<span className="kpi-badge-label"> Cyber</span></span>
                    </div>

                    {/* Predicted Risk */}
                    <div className="header-kpi-badge cyan">
                      <Activity size={16} />
                      <span>High<span className="kpi-badge-label"> Risk</span></span>
                    </div>
                  </div>

                  <div style={{ height: '20px', width: '1px', background: 'var(--border-color)' }}></div>

                  {/* System Status */}
                  <div className="header-system-status" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-green)' }}></div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>System Online</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Utility Bar */}
            <div className="glass-panel" style={{
              position: 'absolute',
              top: '6.2rem',
              left: '1.5rem',
              right: '1.5rem',
              height: '48px',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 1.25rem',
              borderRadius: '8px',
              pointerEvents: 'auto'
            }}>
              {/* Left Side: Time Range */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                <span className="utility-bar-label" style={{ color: 'var(--text-muted)', fontWeight: '500' }}>🕒 Time Range:</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <select 
                    value={timeRange} 
                    onChange={(e) => setTimeRange(e.target.value)}
                    style={{
                      background: 'var(--topbar-input-bg)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      padding: '0.3rem 1.75rem 0.3rem 0.6rem',
                      borderRadius: '6px',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="24h" style={{ background: 'var(--bg-dark)', color: 'var(--text-main)' }}>Live (Last 24 Hours)</option>
                    <option value="week" style={{ background: 'var(--bg-dark)', color: 'var(--text-main)' }}>This Week</option>
                    <option value="month" style={{ background: 'var(--bg-dark)', color: 'var(--text-main)' }}>This Month</option>
                    <option value="custom" style={{ background: 'var(--bg-dark)', color: 'var(--text-main)' }}>Custom Range</option>
                  </select>
                  <ChevronDown size={14} style={{
                    position: 'absolute',
                    right: '0.5rem',
                    color: 'var(--accent-cyan)',
                    pointerEvents: 'none'
                  }} />
                </div>
              </div>

              {/* Right Side: Severity Toggles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                <span className="utility-bar-label" style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Severity Filter:</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {/* Critical */}
                  <button 
                    onClick={() => setSeverityFilter(prev => ({ ...prev, critical: !prev.critical }))}
                    style={{
                      background: severityFilter.critical ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.02)',
                      border: severityFilter.critical ? '1px solid var(--accent-red)' : '1px solid var(--border-color)',
                      color: severityFilter.critical ? 'var(--accent-red)' : 'var(--text-muted)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                  >
                    🔴 Critical
                  </button>
                  {/* Moderate */}
                  <button 
                    onClick={() => setSeverityFilter(prev => ({ ...prev, moderate: !prev.moderate }))}
                    style={{
                      background: severityFilter.moderate ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.02)',
                      border: severityFilter.moderate ? '1px solid var(--accent-yellow)' : '1px solid var(--border-color)',
                      color: severityFilter.moderate ? 'var(--accent-yellow)' : 'var(--text-muted)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                  >
                    🟡 Moderate
                  </button>
                  {/* Low */}
                  <button 
                    onClick={() => setSeverityFilter(prev => ({ ...prev, low: !prev.low }))}
                    style={{
                      background: severityFilter.low ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.02)',
                      border: severityFilter.low ? '1px solid var(--accent-green)' : '1px solid var(--border-color)',
                      color: severityFilter.low ? 'var(--accent-green)' : 'var(--text-muted)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                  >
                    🟢 Low
                  </button>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="map-container">
              <GISMap theme={theme} highlightedZone={highlightedZone} severityFilter={severityFilter} />
            </div>

            {/* Unified Bottom-Left Info & Legend Panel */}
            {isBottomLeftPanelOpen ? (
              <div className="glass-panel" style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '1.5rem',
                width: '320px',
                zIndex: 1000,
                padding: '1.25rem',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                border: bottomLeftActiveTab === 'ai' ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid var(--border-color)',
                boxShadow: bottomLeftActiveTab === 'ai' ? '0 8px 32px rgba(6, 182, 212, 0.15)' : '0 8px 32px rgba(0, 0, 0, 0.2)',
                pointerEvents: 'auto',
                transition: 'all 0.3s ease'
              }}>
                {/* Tab Headers */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', alignItems: 'center' }}>
                  <div 
                    onClick={() => setBottomLeftActiveTab('ai')}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '0.5rem 0',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: bottomLeftActiveTab === 'ai' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      opacity: bottomLeftActiveTab === 'ai' ? 1 : 0.6,
                      borderBottom: bottomLeftActiveTab === 'ai' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    🤖 AI Summary
                  </div>
                  <div 
                    onClick={() => setBottomLeftActiveTab('legend')}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '0.5rem 0',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: bottomLeftActiveTab === 'legend' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      opacity: bottomLeftActiveTab === 'legend' ? 1 : 0.6,
                      borderBottom: bottomLeftActiveTab === 'legend' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    📍 Legend
                  </div>
                  <button 
                    onClick={() => setIsBottomLeftPanelOpen(false)} 
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', marginLeft: '0.5rem' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Tab Contents */}
                {bottomLeftActiveTab === 'ai' ? (
                  <p style={{ margin: 0, fontSize: '0.825rem', lineHeight: '1.4', color: 'var(--text-muted)', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
                    <strong style={{ color: 'var(--text-main)' }}>System Insight:</strong> Thefts in Vastrapur have risen by 18% over the last 48 hours, peaking between 6 PM – 9 PM. Recommend redistributing patrol routes from Paldi to Vastrapur for the upcoming night shift.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Crime Incidents (Dots)</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6', border: '1.5px solid white' }}></div>
                          <span>Theft</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', border: '1.5px solid white' }}></div>
                          <span>Assault</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b', border: '1.5px solid white' }}></div>
                          <span>Fraud</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#8b5cf6', border: '1.5px solid white' }}></div>
                          <span>Cyber Threat</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', border: '1.5px solid white' }}></div>
                          <span>Vandalism</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Risk Hotspots (Zones)</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #ef4444', backgroundColor: 'rgba(239, 68, 68, 0.2)' }}></div>
                          <span>High Risk Area</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.2)' }}></div>
                          <span>Medium Risk Area</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="map-legend-toggle" style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', zIndex: 1000, pointerEvents: 'auto', display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => { setIsBottomLeftPanelOpen(true); setBottomLeftActiveTab('ai'); }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    background: 'var(--bg-panel)', 
                    backdropFilter: 'blur(20px)', 
                    border: '1px solid var(--border-color)', 
                    padding: '0.6rem 1rem', 
                    borderRadius: '20px', 
                    color: 'var(--text-main)', 
                    fontSize: '0.85rem', 
                    cursor: 'pointer', 
                    fontWeight: '500', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                  }}
                >
                  <span>🤖 AI Insights</span>
                </button>
                <button 
                  onClick={() => { setIsBottomLeftPanelOpen(true); setBottomLeftActiveTab('legend'); }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    background: 'var(--bg-panel)', 
                    backdropFilter: 'blur(20px)', 
                    border: '1px solid var(--border-color)', 
                    padding: '0.6rem 1rem', 
                    borderRadius: '20px', 
                    color: 'var(--text-main)', 
                    fontSize: '0.85rem', 
                    cursor: 'pointer', 
                    fontWeight: '500', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                  }}
                >
                  <List size={16} />
                  <span>Legend</span>
                </button>
              </div>
            )}

            {/* Live Feed Panel (Collapsible) */}
            {isLiveFeedOpen ? (
              <aside className="live-feed-panel glass-panel" style={{
                position: 'absolute',
                top: '10.5rem',
                right: '1.5rem',
                bottom: '1.5rem',
                width: '320px',
                height: 'auto',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: 'auto'
              }}>
                <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>Live Intelligence <div className="live-dot"></div></h2>
                  <button onClick={() => setIsLiveFeedOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}>
                    <X size={16} />
                  </button>
                </div>
                <div className="feed-list" style={{ flex: 1, overflowY: 'auto', paddingBottom: '1rem' }}>
                  {liveEvents.map(event => (
                    <div key={event.id} className={`feed-item ${event.type}`}>
                      <div className="feed-item-header">
                        <span>{event.time}</span>
                      </div>
                      <div className="feed-item-title">{event.title}</div>
                    </div>
                  ))}
                </div>
              </aside>
              ) : (
                <div className="live-feed-toggle" style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  right: '1.5rem', 
                  transform: 'translateY(-50%)', 
                  zIndex: 1000, 
                  pointerEvents: 'auto' 
                }}>
                  <button 
                    onClick={() => setIsLiveFeedOpen(true)}
                    title="Open Live Feed"
                    className="bell-pulse-button"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'var(--bg-panel)', 
                      backdropFilter: 'blur(20px)', 
                      border: '1.5px solid var(--accent-red)', 
                      color: 'var(--accent-red)', 
                      cursor: 'pointer', 
                      boxShadow: '0 0 12px rgba(239, 68, 68, 0.3)',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = 'var(--bg-panel)';
                    }}
                  >
                    <Bell size={18} className="bell-pulse-icon" />
                    {/* Pulsing indicator badge */}
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '8px',
                      height: '8px',
                      background: 'var(--accent-red)',
                      borderRadius: '50%',
                      border: '1.5px solid var(--bg-dark)',
                      boxShadow: '0 0 6px var(--accent-red)'
                    }} />
                  </button>
                </div>
              )}
          </>
        ) : (
          <div style={{ padding: '1.5rem', width: '100%', height: '100%', overflowY: 'auto', pointerEvents: 'auto' }}>
            {activeTab === 'analytics' && <Analytics onViewOnMap={(zone) => { setActiveTab('map'); setHighlightedZone(zone); }} />}
            {activeTab === 'patrol' && <Patrols onViewRoute={(zone) => { setActiveTab('map'); setHighlightedZone(zone); }} />}
            {activeTab === 'cyber' && <CyberIntel onViewPhysicalZone={(zone) => { setActiveTab('map'); setHighlightedZone(zone); }} />}
            {activeTab === 'settings' && <SettingsScreen theme={theme} setTheme={setTheme} />}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
