import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, Bell, Database, Save, Trash2, Palette, Activity, ChevronDown } from 'lucide-react';

export default function Settings({ theme = 'light', setTheme = () => {} }) {
  const [riskThreshold, setRiskThreshold] = useState(75);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [emailReports, setEmailReports] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const pct = ((riskThreshold - 50) / 50) * 100;

  const handleExportAuditLogs = () => {
    // Generate realistic system audit logs
    const auditLogs = [
      { timestamp: new Date().toISOString(), user: 'Command Officer', action: 'Login', details: 'Successful session initiation from Precinct 1 IP' },
      { timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'System Bot', action: 'Auto-Reroute', details: 'Dispatched Patrol Unit 4 to Vastrapur' },
      { timestamp: new Date(Date.now() - 7200000).toISOString(), user: 'Command Officer', action: 'Route Optimization', details: 'Calculated optimal coverage paths for 8 patrol units' },
      { timestamp: new Date(Date.now() - 10800000).toISOString(), user: 'Cyber Analyst', action: 'Threat Acknowledged', details: 'CYB-772 correlated to physical zone Vastrapur' },
      { timestamp: new Date(Date.now() - 14400000).toISOString(), user: 'System Bot', action: 'Health Check', details: 'Database connection verified' },
      { timestamp: new Date(Date.now() - 18000000).toISOString(), user: 'Patrol Officer', action: 'Alert Dispatched', details: 'Backup request broadcasted to Unit 2' }
    ];

    // Convert logs to CSV string
    const headers = ['Timestamp', 'User', 'Action', 'Details'];
    const csvRows = [
      headers.join(','),
      ...auditLogs.map(log => [
        `"${log.timestamp}"`,
        `"${log.user}"`,
        `"${log.action}"`,
        `"${log.details.replace(/"/g, '""')}"`
      ].join(','))
    ];
    const csvContent = csvRows.join('\n');

    // Trigger file download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `system_audit_logs_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearCache = () => {
    setIsClearing(true);
    setTimeout(() => {
      setIsClearing(false);
      setToastMessage('🗑️ System cache cleared successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    }, 800);
  };

  // Custom Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</span>
      <div 
        onClick={() => onChange(!checked)}
        style={{
          width: '44px',
          height: '22px',
          borderRadius: '11px',
          background: checked ? 'var(--accent-blue)' : '#1e293b',
          border: '1px solid var(--border-color)',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s ease-in-out'
        }}
      >
        <div style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: '#ffffff',
          position: 'absolute',
          top: '1px',
          left: checked ? '23px' : '1px',
          transition: 'left 0.2s ease-in-out',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
        }} />
      </div>
    </div>
  );

  return (
    <div style={{ padding: '1.5rem', height: 'calc(100vh - 64px - 3rem)', overflowY: 'auto', position: 'relative' }}>

      {/* In-App Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1e293b',
          color: '#ffffff',
          padding: '0.75rem 1.5rem',
          borderRadius: '10px',
          border: '1px solid rgba(16, 185, 129, 0.5)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          fontSize: '0.9rem',
          fontWeight: '500',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeSlideUp 0.3s ease'
        }}>
          <span style={{ color: 'var(--accent-green)', fontSize: '1rem' }}>✓</span>
          {toastMessage}
        </div>
      )}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <SettingsIcon /> System Settings
        </h2>

        {/* 2-Column Responsive Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          
          {/* Left Column: Configuration Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Theme Config */}
            <section style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                <Palette size={20} style={{ color: 'var(--accent-cyan)' }} /> Theme Configuration
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Application Interface Theme</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', maxWidth: '320px' }}>
                    <select 
                      value={theme} 
                      onChange={(e) => setTheme(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--topbar-input-bg)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-main)',
                        padding: '0.6rem 2.2rem 0.6rem 1rem',
                        borderRadius: '6px',
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="dark" style={{ background: '#1e293b', color: '#ffffff' }}>Dark Command Center Mode</option>
                      <option value="light" style={{ background: '#f1f5f9', color: '#0f172a' }}>Light Command Center Mode</option>
                    </select>
                    <ChevronDown size={16} style={{
                      position: 'absolute',
                      right: '0.75rem',
                      color: 'var(--accent-cyan)',
                      pointerEvents: 'none'
                    }} />
                  </div>
                </div>
              </div>
            </section>

            {/* Alert Config */}
            <section style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                <Bell size={20} style={{ color: 'var(--accent-cyan)' }} /> Alert Configuration
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Automated Alert Risk Threshold (0-100)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input 
                      type="range" 
                      min="50" max="100" 
                      value={riskThreshold} 
                      onChange={(e) => setRiskThreshold(e.target.value)}
                      style={{ 
                        flex: 1,
                        WebkitAppearance: 'none',
                        appearance: 'none',
                        height: '6px',
                        borderRadius: '3px',
                        background: `linear-gradient(to right, var(--accent-blue) 0%, var(--accent-blue) ${pct}%, #1e293b ${pct}%, #1e293b 100%)`,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ background: 'var(--accent-red)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                      {riskThreshold}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.4' }}>
                    Zones surpassing this predicted risk score will trigger automated system events.
                  </p>
                </div>
              </div>
            </section>

            {/* Notification Channels */}
            <section>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                <Save size={20} style={{ color: 'var(--accent-cyan)' }} /> Notification Channels
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <ToggleSwitch checked={smsAlerts} onChange={setSmsAlerts} label="SMS Alerts to On-Duty Units" />
                <ToggleSwitch checked={soundAlerts} onChange={setSoundAlerts} label="Desktop Sound Notification" />
                <ToggleSwitch checked={emailReports} onChange={setEmailReports} label="Automated Email Reports to Command" />
              </div>
            </section>

          </div>

          {/* Right Column: Roles & Data Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* RBAC */}
            <section style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                <ShieldCheck size={20} style={{ color: 'var(--accent-cyan)' }} /> Role-Based Access
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.35)' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.9rem' }}>Command Officer</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full map & analytics access</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.35)' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.9rem' }}>Patrol Officer</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Route viewing & incident logging</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.35)' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.9rem' }}>Cyber Analyst</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cyber layers & physical correlation</div>
                </div>
              </div>
              <button style={{ marginTop: '1rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                Manage Users
              </button>
            </section>

            {/* Data Management */}
            <section>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                <Database size={20} style={{ color: 'var(--accent-cyan)' }} /> Data Management
              </h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={handleExportAuditLogs}
                  style={{ background: 'var(--accent-blue)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}
                >
                  <Save size={18} /> Export Audit Logs
                </button>
                <button 
                  onClick={handleClearCache}
                  disabled={isClearing}
                  style={{ background: 'var(--accent-red)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', cursor: isClearing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', fontSize: '0.85rem', opacity: isClearing ? 0.7 : 1 }}
                >
                  <Trash2 size={18} /> {isClearing ? 'Clearing...' : 'Clear Cache'}
                </button>
              </div>
            </section>

          </div>

        </div>

        {/* Full-width Footer: Subsystem Health Check Grid */}
        <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1.1rem' }}>
            <Activity size={20} style={{ color: 'var(--accent-cyan)' }} /> Active System Status
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Database</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-green)' }}>
                Connected <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 6px var(--accent-green)' }}></span>
              </span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>GIS Map API</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-green)' }}>
                Operational <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 6px var(--accent-green)' }}></span>
              </span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>NLP Engine</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-green)' }}>
                Processing <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 6px var(--accent-green)' }}></span>
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
