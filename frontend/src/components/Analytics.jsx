import React, { useState, useEffect } from 'react';
import { BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, X } from 'lucide-react';

export default function Analytics({ onViewOnMap }) {
  const [zoneData, setZoneData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarZone, setSelectedBarZone] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Close export dropdown on click outside
  useEffect(() => {
    if (!isExportOpen) return;
    const handleOutsideClick = (e) => {
      const exportContainer = document.getElementById('analytics-export-container');
      if (exportContainer && !exportContainer.contains(e.target)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isExportOpen]);

  const handleExportCSV = () => {
    setIsExportOpen(false);
    const csvHeaders = "ID,Zone,Predicted Risk Score,Status\n";
    let csvRows = [];
    zoneData.forEach((item, index) => {
      const status = item.crimes > 70 ? "Critical" : (item.crimes >= 50 ? "Moderate" : "Low");
      csvRows.push(`${index + 1},${item.name},${item.crimes},${status}`);
    });
    const csvString = csvHeaders + csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `crimeshield_analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    setIsExportOpen(false);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  useEffect(() => {
    // Fetch live risk predictions from backend
    fetch('http://localhost:5000/api/predict/hotspots')
      .then(res => res.json())
      .then(data => {
          if (data.predictions && data.predictions.length > 0) {
            // Format for Recharts
            const formatted = data.predictions.map(p => ({
              name: p.zone,
              crimes: p.risk_score // Displaying risk score as the bar height
            }));
            setZoneData(formatted);
            setSelectedBarZone(formatted[0].name); // Select highest risk zone by default
          }
      })
      .catch(err => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const getDynamicWeeklyData = () => {
    const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay();
    
    const baseStats = {
      'Mon': { theft: 12, cyber: 5, assault: 2 },
      'Tue': { theft: 15, cyber: 8, assault: 1 },
      'Wed': { theft: 9, cyber: 12, assault: 4 },
      'Thu': { theft: 18, cyber: 4, assault: 3 },
      'Fri': { theft: 22, cyber: 15, assault: 6 },
      'Sat': { theft: 30, cyber: 20, assault: 10 },
      'Sun': { theft: 25, cyber: 18, assault: 8 }
    };
    
    const rotatedData = [];
    for (let i = 6; i >= 0; i--) {
      const targetIndex = (todayIndex - i + 7) % 7;
      const dayName = DAYS_OF_WEEK[targetIndex];
      const label = i === 0 ? `${dayName} (Today)` : dayName;
      rotatedData.push({
        day: label,
        ...baseStats[dayName]
      });
    }
    return rotatedData;
  };

  const mockTimeData = getDynamicWeeklyData();

  const getBarColor = (score) => {
    if (score > 70) return '#ef4444'; // Soft Red
    if (score >= 50) return '#f59e0b'; // Amber/Orange
    return '#10b981'; // Green
  };

  return (
    <div style={{ padding: '1.5rem', height: 'calc(100vh - 64px - 3rem)', overflowY: 'auto' }}>
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.5rem' }}>Crime Analytics Overview</h2>
          
          {/* Export Button & Dropdown */}
          <div id="analytics-export-container" style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <Download size={16} />
              <span>Export</span>
            </button>

            {isExportOpen && (
              <div className="glass-panel" style={{
                position: 'absolute',
                top: '2.5rem',
                right: 0,
                width: '180px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-panel)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                zIndex: 2000,
                padding: '0.5rem 0',
                animation: 'slideIn 0.2s ease-out'
              }}>
                <div 
                  onClick={handleExportPDF}
                  style={{
                    padding: '0.6rem 1rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span>📄 Download PDF Report</span>
                </div>
                <div 
                  onClick={handleExportCSV}
                  style={{
                    padding: '0.6rem 1rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span>📊 Export CSV Data</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
          
          {/* Bar Chart */}
          <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem' }}>Live Predicted Risk by Zone</h3>
              {onViewOnMap && (
                <button 
                  onClick={() => onViewOnMap(selectedBarZone)}
                  style={{
                    background: 'rgba(6, 182, 212, 0.2)',
                    border: '1px solid var(--accent-cyan)',
                    color: 'var(--accent-cyan)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent-cyan)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)';
                    e.currentTarget.style.color = 'var(--accent-cyan)';
                  }}
                >
                  View {selectedBarZone} on Map 🗺️
                </button>
              )}
            </div>
            <ResponsiveContainer width="100%" height={320}>
              {loading ? (
                <div style={{ color: 'var(--text-main)' }}>Loading predictions from AI...</div>
              ) : (
                <BarChart data={zoneData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" angle={-45} textAnchor="end" height={70} interval={0} />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '8px' }} 
                    formatter={(value) => [`${value}`, 'Risk Score']}
                  />
                  <Bar dataKey="crimes" name="Risk Score" radius={[4, 4, 0, 0]} onClick={(data) => { if (data && data.name) setSelectedBarZone(data.name); }} style={{ cursor: 'pointer' }}>
                    {zoneData.map((entry, index) => {
                      const isSelected = entry.name === selectedBarZone;
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getBarColor(entry.crimes)}
                          fillOpacity={isSelected ? 1.0 : 0.5}
                          stroke={isSelected ? 'var(--accent-cyan)' : 'transparent'}
                          strokeWidth={isSelected ? 2 : 0}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Weekly Trends by Crime Type</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={mockTimeData} margin={{ left: 25, right: 5, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" interval={0} />
                <YAxis 
                  stroke="var(--text-muted)" 
                  label={{ value: 'Number of Incidents', angle: -90, position: 'insideLeft', offset: -10, style: { fill: 'var(--text-muted)', textAnchor: 'middle', fontSize: '0.85rem' } }} 
                />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '8px' }} 
                  formatter={(value, name) => [`${value} incidents`, name]}
                />
                <Legend />
                <Line type="monotone" dataKey="theft" name="Thefts" stroke="var(--accent-cyan)" strokeWidth={3} />
                <Line type="monotone" dataKey="cyber" name="Cyber Crimes" stroke="var(--accent-yellow)" strokeWidth={3} />
                <Line type="monotone" dataKey="assault" name="Assaults" stroke="var(--accent-red)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}
