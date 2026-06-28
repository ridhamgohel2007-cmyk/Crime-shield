import React, { useState } from 'react';
import { Users, Navigation, Loader2 } from 'lucide-react';

const initialMockPatrols = [
  { id: 'P-042', zone: 'Navrangpura', officer: 'Sgt. R. Patel', shift: '08:00 - 16:00', status: 'Active', riskScore: 88 },
  { id: 'P-018', zone: 'Maninagar', officer: 'Insp. V. Desai', shift: '16:00 - 00:00', status: 'Standby', riskScore: 65 },
  { id: 'P-091', zone: 'Bapunagar', officer: 'Const. A. Shah', shift: '00:00 - 08:00', status: 'Active', riskScore: 94 },
  { id: 'P-033', zone: 'Vastrapur', officer: 'Sgt. M. Kumar', shift: '08:00 - 16:00', status: 'Active', riskScore: 78 },
];

export default function Patrols({ onViewRoute }) {
  const [patrols, setPatrols] = useState(initialMockPatrols);
  const [loading, setLoading] = useState(false);

  const generateOptimalRoutes = () => {
    setLoading(true);
    const fetchPromise = fetch('http://localhost:5000/api/routes/optimize')
      .then(res => res.json());
    
    const delayPromise = new Promise(resolve => setTimeout(resolve, 1200));

    Promise.all([fetchPromise, delayPromise])
      .then(([routePlan]) => {
        // Find a standby or active unit to assign this route
        setPatrols(prev => prev.map(p => {
          if (p.id === 'P-033') { // Mock assignment logic
            return { ...p, status: 'Rerouted', zone: routePlan.waypoints[0].zone, riskScore: routePlan.waypoints[0].risk };
          }
          return p;
        }));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ height: 'calc(100vh - 3rem)', display: 'flex', flexDirection: 'column' }}>
      <div className="glass-panel" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexShrink: 0 }}>
          <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users /> Active Patrol Units
          </h2>
          <button onClick={generateOptimalRoutes} disabled={loading} style={{ 
            background: loading ? 'rgba(59, 130, 246, 0.5)' : 'var(--accent-blue)', 
            color: 'white', 
            border: 'none', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600',
            transition: 'background 0.2s'
          }}>
            {loading ? (
              <Loader2 size={18} className="spin" />
            ) : (
              <Navigation size={18} />
            )}
            {loading ? 'Optimizing Routes...' : 'Generate Optimal Routes'}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Unit ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Assigned Zone</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Officer</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Shift</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Zone Risk Score</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patrols.map((patrol) => (
              <tr key={patrol.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem', fontWeight: '600', whiteSpace: 'nowrap' }}>{patrol.id}</td>
                <td style={{ padding: '1rem' }}>{patrol.zone}</td>
                <td style={{ padding: '1rem' }}>{patrol.officer}</td>
                <td style={{ padding: '1rem' }}>{patrol.shift}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.875rem',
                    background: patrol.status === 'Active' ? 'rgba(16,185,129,0.2)' : patrol.status === 'Rerouted' ? 'rgba(245,158,11,0.2)' : 'rgba(148,163,184,0.2)',
                    color: patrol.status === 'Active' ? 'var(--accent-green)' : patrol.status === 'Rerouted' ? 'var(--accent-yellow)' : 'var(--text-muted)'
                  }}>
                    {patrol.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px' }}>
                      <div style={{ 
                        width: `${patrol.riskScore}%`, 
                        height: '100%', 
                        background: patrol.riskScore > 80 ? 'var(--accent-red)' : patrol.riskScore > 60 ? 'var(--accent-yellow)' : 'var(--accent-green)', 
                        borderRadius: '3px' 
                      }}></div>
                    </div>
                    <span style={{ fontSize: '0.875rem' }}>{patrol.riskScore}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => onViewRoute && onViewRoute(patrol.zone)}
                      title={`View ${patrol.zone} Route`}
                      style={{
                        background: 'rgba(6, 182, 212, 0.1)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        color: 'var(--accent-cyan)',
                        padding: '0.35rem 0.6rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--accent-cyan)';
                        e.currentTarget.style.color = '#000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)';
                        e.currentTarget.style.color = 'var(--accent-cyan)';
                      }}
                    >
                      📍 Route
                    </button>
                    <button 
                      onClick={() => alert(`Backup request & dispatch alert successfully transmitted to ${patrol.officer} (Unit ${patrol.id}). Status: Pending response.`)}
                      title="Dispatch Backup Alert"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: 'var(--accent-red)',
                        padding: '0.35rem 0.6rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--accent-red)';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.color = 'var(--accent-red)';
                      }}
                    >
                      ✉️ Alert
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
