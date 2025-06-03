import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CampaignHistory = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate(); 
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('/api/campaigns');
        const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const campaignsWithStats = await Promise.all(
          sorted.map(async (c) => {
            const statsRes = await axios.get(`/api/campaigns/stats/${c.id}`);
            return {
              ...c,
              sent: statsRes.data.sent,
              failed: statsRes.data.failed
            };
          })
        );

        setCampaigns(campaignsWithStats);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Campaign History</h2>
          <div style={styles.icon}>📋</div>
          <button 
          onClick={() => navigate('/')} 
          style={styles.homeButton}
        >
          ← Back to Home
        </button>
        </div>

        {campaigns.length === 0 ? (
          <p style={styles.noData}>No campaigns found</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Created At</th>
                  <th style={styles.th}>Audience Size</th>
                  <th style={styles.th}>Sent</th>
                  <th style={styles.th}>Failed</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} style={styles.row}>
                    <td style={styles.td}>{c.name}</td>
                    <td style={styles.td}>{new Date(c.createdAt).toLocaleString()}</td>
                    <td style={{...styles.td, ...styles.center}}>{c.audienceSize}</td>
                    <td style={{...styles.td, ...styles.center, ...styles.success}}>{c.sent}</td>
                    <td style={{...styles.td, ...styles.center, ...styles.error}}>{c.failed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    background: 'linear-gradient(135deg, #0f0f15 0%, #1a1a2e 100%)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', sans-serif"
  },
  card: {
    background: '#121212',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.36)',
    width: '100%',
    maxWidth: '1200px',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '1rem'
  },
  icon: {
    fontSize: '2rem',
    marginLeft: '12px',
    marginRight: '120px',
    opacity: 0.8
  },
  heading: {
    color: '#e0e0e0',
    fontSize: '1.8rem',
    fontWeight: '600',
    margin: 0,
    letterSpacing: '0.5px'
  },
  tableContainer: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#1a1a1a'
  },
  homeButton: {
    padding: '0.6rem 1.2rem',
    backgroundColor: 'transparent',
    color: '#a0a0ff',
    border: '1px solid #3a3a6a',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    marginLeft: 'auto',
  },
  th: {
    padding: '1.2rem 1.5rem',
    textAlign: 'left',
    background: '#1e1e2a',
    color: '#a0a0c0',
    fontWeight: '500',
    fontSize: '0.95rem',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  td: {
    padding: '1.2rem 1.5rem',
    color: '#d0d0d0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  center: {
    textAlign: 'center'
  },
  success: {
    color: '#4caf50',
    fontWeight: '500'
  },
  error: {
    color: '#f44336',
    fontWeight: '500'
  },
  row: {
    transition: 'background 0.2s ease',
    background: '#1a1a1a',
    '&:hover': {
      background: '#222230'
    },
    '&:last-child td': {
      borderBottom: 'none'
    }
  },
  noData: {
    textAlign: 'center',
    color: '#777',
    fontSize: '1.1rem',
    padding: '3rem',
    background: 'rgba(30, 30, 40, 0.5)',
    borderRadius: '12px',
    margin: '1.5rem 0'
  }
};

export default CampaignHistory;