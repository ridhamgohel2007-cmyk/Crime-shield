import React, { useState } from 'react';
import { Radio, AlertCircle, MapPin, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockCyberThreats = [
  { id: 'CYB-772', type: 'Phishing Cluster', origin: 'Vastrapur', targets: 'Senior Citizens', status: 'High Alert', mappedToPhysical: true, timestamp: '12m ago' },
  { id: 'CYB-891', type: 'ATM Skimming', origin: 'Maninagar', targets: 'Bank Kiosks', status: 'Investigating', mappedToPhysical: true, timestamp: '2h ago' },
  { id: 'CYB-904', type: 'Crypto Fraud', origin: 'Unknown IP', targets: 'Students', status: 'Monitoring', mappedToPhysical: false, timestamp: '4h ago' },
];

const cyberDistributionData = [
  { name: 'Phishing', value: 45, color: '#06b6d4' },
  { name: 'ATM Skimming', value: 30, color: '#f59e0b' },
  { name: 'Crypto Fraud', value: 15, color: '#ef4444' },
  { name: 'Ransomware', value: 10, color: '#3b82f6' }
];

export default function CyberIntel({ onViewPhysicalZone }) {
  const [selectedThreatCategory, setSelectedThreatCategory] = useState(null);

  const handleCategoryToggle = (categoryName) => {
    if (selectedThreatCategory === categoryName) {
      setSelectedThreatCategory(null);
    } else {
      setSelectedThreatCategory(categoryName);
    }
  };

  const filteredThreats = selectedThreatCategory
    ? mockCyberThreats.filter(t => t.type.toLowerCase().includes(selectedThreatCategory.split(' ')[0].toLowerCase()))
    : mockCyberThreats;

  const totalAlerts = cyberDistributionData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ padding: '1.5rem 1.5rem 3.5rem 1.5rem', height: 'calc(100vh - 64px - 3rem)', overflowY: 'auto' }}>
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Radio /> Cyber Intelligence Hub
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Active Cyber Threats</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-red)' }}>14</p>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Mapped to Physical Zones</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>8</p>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Recent Takedowns</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>5</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem', marginTop: '1.5rem' }}>
          {/* Left Column (60%): Threat Clusters Feed */}
          <div>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Emerging Cyber Threat Clusters</span>
              {selectedThreatCategory && (
                <span 
                  onClick={() => setSelectedThreatCategory(null)}
                  style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 'normal' }}
                >
                  Clear Filter ✕
                </span>
              )}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '1.5rem', paddingBottom: '1.5rem' }}>
              {filteredThreats.length > 0 ? (
                filteredThreats.map((threat) => (
                  <div key={threat.id} style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--border-color)', 
                    padding: '1.5rem', 
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    minHeight: '110px'
                  }}>
                    {/* Timestamp */}
                    <span style={{ 
                      position: 'absolute', 
                      top: '1rem', 
                      right: '1.5rem', 
                      fontSize: '0.75rem', 
                      color: 'var(--text-muted)', 
                      opacity: 0.65,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}>
                      ⏱️ Detected {threat.timestamp}
                    </span>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', height: '32px' }}>
                        <span style={{ 
                          fontWeight: 'bold', 
                          color: 'var(--accent-cyan)',
                          background: 'rgba(6, 182, 212, 0.12)',
                          border: '1px solid rgba(6, 182, 212, 0.25)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontFamily: 'monospace',
                          whiteSpace: 'nowrap'
                        }}>{threat.id}</span>
                        <span style={{ fontSize: '1.125rem', color: 'var(--text-main)' }}>{threat.type}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={16} /> Origin: {threat.origin}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={16} /> Targets: {threat.targets}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', marginTop: '0.8rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.875rem',
                        background: threat.status === 'High Alert' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                        color: threat.status === 'High Alert' ? 'var(--accent-red)' : 'var(--accent-yellow)'
                      }}>
                        {threat.status}
                      </span>
                      {threat.mappedToPhysical && (
                        <button 
                          onClick={() => onViewPhysicalZone && onViewPhysicalZone(threat.origin)}
                          title={`Locate ${threat.origin} physical correlation on map`}
                          style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            color: 'var(--accent-blue)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--accent-blue)';
                            e.currentTarget.style.color = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                            e.currentTarget.style.color = 'var(--accent-blue)';
                          }}
                        >
                          <Activity size={12} /> 🔗 Correlated to Physical Map 🗺️
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px dashed var(--border-color)', 
                  padding: '3.5rem 2rem', 
                  borderRadius: '12px', 
                  textAlign: 'center', 
                  color: 'var(--text-muted)' 
                }}>
                  No active emerging threats detected under <strong>{selectedThreatCategory}</strong>.
                  <button 
                    onClick={() => setSelectedThreatCategory(null)}
                    style={{
                      display: 'block',
                      margin: '1rem auto 0 auto',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      padding: '0.35rem 0.8rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (40%): Threat Distribution Graphic */}
          <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.125rem' }}>Attack Vector Distribution</h3>
            <div style={{ height: '240px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={cyberDistributionData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {cyberDistributionData.map((entry, index) => {
                      const isDimmed = selectedThreatCategory && entry.name !== selectedThreatCategory;
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          opacity={isDimmed ? 0.35 : 1}
                          style={{ cursor: 'pointer', outline: 'none' }}
                          onClick={() => handleCategoryToggle(entry.name)}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    onClick={(data) => handleCategoryToggle(data.value)}
                    formatter={(value) => {
                      const isSelected = selectedThreatCategory === value;
                      return (
                        <span style={{ 
                          color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)', 
                          fontWeight: isSelected ? 'bold' : 'normal',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}>
                          {value} {isSelected ? '✓' : ''}
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Dead Center Counter */}
              <div style={{
                position: 'absolute',
                top: '41%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main)', lineHeight: '1' }}>
                  {selectedThreatCategory 
                    ? cyberDistributionData.find(c => c.name === selectedThreatCategory)?.value 
                    : totalAlerts}
                </div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {selectedThreatCategory ? 'Alerts' : 'Total Alerts'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Users(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>; }
