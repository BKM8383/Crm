import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CampaignHistory = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/campaigns');
        const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Fetch stats for each campaign
        const campaignsWithStats = await Promise.all(
          sorted.map(async (c) => {
            const statsRes = await axios.get(`http://localhost:8080/api/campaigns/stats/${c.id}`);
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
    <div style={{ padding: '2rem' }}>
      <h2>📋 Campaign History</h2>

      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Created At</th>
              <th style={thStyle}>Audience Size</th>
              <th style={thStyle}>Sent</th>
              <th style={thStyle}>Failed</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id}>
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>{new Date(c.createdAt).toLocaleString()}</td>
                <td style={tdStyle}>{c.audienceSize}</td>
                <td style={tdStyle}>{c.sent}</td>
                <td style={tdStyle}>{c.failed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = { borderBottom: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' };
const tdStyle = { borderBottom: '1px solid #eee', padding: '0.5rem' };

export default CampaignHistory;
