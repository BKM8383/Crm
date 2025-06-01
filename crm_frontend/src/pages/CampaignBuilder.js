import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CampaignBuilder = () => {
  const [rules, setRules] = useState([
    { field: 'totalSpend', operator: '>', value: '', condition: 'AND' }
  ]);
  const [audienceSize, setAudienceSize] = useState(null);
  const [campaignName, setCampaignName] = useState('');
  const navigate = useNavigate();

  const handleRuleChange = (index, field, newValue) => {
    const updated = [...rules];
    updated[index][field] = newValue;
    setRules(updated);
  };

  const addRule = () => {
    setRules([...rules, { field: 'totalSpend', operator: '>', value: '', condition: 'AND' }]);
  };

  const removeRule = (index) => {
    const updated = [...rules];
    updated.splice(index, 1);
    setRules(updated);
  };

const fetchAudienceSize = async () => {
  try {
    const processedRules = rules.map(rule => ({
      ...rule,
      value: Number(rule.value)
    }));

    const response = await axios.post('http://localhost:8080/api/customers/filter', processedRules);
    setAudienceSize(response.data);
  } catch (error) {
    console.error('Error fetching audience size:', error);
  }
};


  const saveCampaign = async () => {
  try {
    const payload = {
      name: campaignName,
      rules: rules,
      audienceSize: audienceSize || 0
    };

    const saveRes = await axios.post('http://localhost:8080/api/campaigns', payload);

    // Trigger delivery simulation
    await axios.post('http://localhost:8080/api/campaigns/deliver', {
      campaignId: saveRes.data.id,
      rules: rules
    });

    navigate('/campaigns/history');
  } catch (error) {
    console.error('Error saving campaign:', error);
  }
};

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Create New Campaign</h2>

      <input
        type="text"
        value={campaignName}
        onChange={(e) => setCampaignName(e.target.value)}
        placeholder="Campaign Name"
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
      />

      {rules.map((rule, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          {index > 0 && (
            <select
              value={rule.condition}
              onChange={(e) => handleRuleChange(index, 'condition', e.target.value)}
              style={{ marginRight: '0.5rem' }}
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          )}
          <select
            value={rule.field}
            onChange={(e) => handleRuleChange(index, 'field', e.target.value)}
          >
            <option value="totalSpend">Total Spend</option>
            <option value="visits">Visits</option>
            <option value="inactivity">Inactivity (days)</option>
          </select>

          <select
            value={rule.operator}
            onChange={(e) => handleRuleChange(index, 'operator', e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value=">">{'>'}</option>
            <option value="<">{'<'}</option>
            <option value="=">{'='}</option>
          </select>

          <input
            type="number"
            value={rule.value}
            onChange={(e) => handleRuleChange(index, 'value', e.target.value)}
            placeholder="Value"
            style={{ marginLeft: '0.5rem', width: '100px' }}
          />

          <button onClick={() => removeRule(index)} style={{ marginLeft: '0.5rem' }}>❌</button>
        </div>
      ))}

      <div style={{ marginTop: '1rem' }}>
        <button onClick={addRule} style={{ marginRight: '1rem' }}>+ Add Rule</button>
        <button onClick={fetchAudienceSize}>🔍 Preview Audience</button>
        <button
          onClick={saveCampaign}
          disabled={!campaignName || audienceSize === null}
          style={{ marginLeft: '1rem' }}
        >
          💾 Save Campaign
        </button>
      </div>

      {audienceSize !== null && (
        <p style={{ marginTop: '1rem' }}>
          🔔 Estimated Audience Size: <strong>{audienceSize}</strong>
        </p>
      )}
    </div>
  );
};

export default CampaignBuilder;
