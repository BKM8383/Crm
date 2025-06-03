import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CampaignBuilder = () => {
  const [rules, setRules] = useState([
    { field: 'totalSpend', operator: '>', value: '', condition: 'AND' }
  ]);
  const [audienceSize, setAudienceSize] = useState(null);
  const [campaignName, setCampaignName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRuleChange = (index, field, newValue) => {
    const updated = [...rules];
    updated[index][field] = newValue;
    setRules(updated);
  };

  const addRule = () => {
    setRules([
      ...rules,
      { field: 'totalSpend', operator: '>', value: '', condition: 'AND' }
    ]);
  };

  const removeRule = (index) => {
    const updated = [...rules];
    updated.splice(index, 1);
    setRules(updated);
  };

  const fetchAudienceSize = async () => {
    try {
      setIsLoading(true);
      const processedRules = rules.map(rule => ({
        ...rule,
        value: rule.value === '' ? '' : Number(rule.value)
      }));

      const response = await axios.post(
        '/api/customers/filter',
        processedRules
      );

      setAudienceSize(response.data);
    } catch (error) {
      console.error('Error fetching audience size:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCampaign = async () => {
    try {
      setIsLoading(true);
      const payload = {
        name: campaignName.trim(),
        rules: rules.map(rule => ({
          ...rule,
          value: rule.value === '' ? '' : Number(rule.value)
        })),
        audienceSize: audienceSize || 0
      };

      const saveRes = await axios.post('/api/campaigns', payload);
      await axios.post('/api/campaigns/deliver', {
        campaignId: saveRes.data.id,
        rules: payload.rules
      });

      navigate('/campaigns/history');
    } catch (error) {
      console.error('Error saving campaign:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <div style={styles.icon}>📢</div>
          </div>
          <div>
            <h2 style={styles.title}>Create a New Campaign</h2>
            <p style={styles.subtitle}>Define your audience with rules and launch your campaign</p>
          </div>
          <button 
          onClick={() => navigate('/')} 
          style={styles.homeButton}
        >
          ← Back to Home
        </button>
        </div>

        <div style={styles.formSection}>
          <label style={styles.label}>Campaign Name</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="Enter a descriptive campaign name"
            style={styles.input}
          />
        </div>

        <div style={styles.formSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Audience Rules</h3>
            <div style={styles.tooltip}>ℹ️
              <span style={styles.tooltipText}>Define rules to segment your audience</span>
            </div>
          </div>
          
          <div style={styles.rulesContainer}>
            {rules.map((rule, index) => (
              <div key={index} style={styles.ruleBlock}>
                {index > 0 && (
                  <div style={styles.conditionContainer}>
                    <select
                      value={rule.condition}
                      onChange={(e) =>
                        handleRuleChange(index, 'condition', e.target.value)
                      }
                      style={styles.conditionSelect}
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  </div>
                )}

                <div style={styles.ruleControls}>
                  <div style={styles.fieldGroup}>
                    <select
                      value={rule.field}
                      onChange={(e) =>
                        handleRuleChange(index, 'field', e.target.value)
                      }
                      style={styles.select}
                    >
                      <option value="totalSpend">Total Spend</option>
                      <option value="visits">Visits</option>
                      <option value="inactivity">Inactivity (days)</option>
                    </select>
                    
                    <select
                      value={rule.operator}
                      onChange={(e) =>
                        handleRuleChange(index, 'operator', e.target.value)
                      }
                      style={styles.operatorSelect}
                    >
                      <option value=">">&gt; (greater than)</option>
                      <option value="<">&lt; (less than)</option>
                      <option value="=">= (equal to)</option>
                    </select>
                  </div>
                  
                  <div style={styles.valueContainer}>
                    <input
                      type="number"
                      value={rule.value}
                      onChange={(e) =>
                        handleRuleChange(index, 'value', e.target.value)
                      }
                      placeholder="Value"
                      style={styles.inputSmall}
                    />
                    <button
                      onClick={() => removeRule(index)}
                      style={styles.removeBtn}
                      title="Remove rule"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#F87171"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={addRule} style={styles.addBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#60A5FA"/>
            </svg>
            Add Rule
          </button>
        </div>

        <div style={styles.actions}>
          <button 
            onClick={fetchAudienceSize} 
            style={styles.previewBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <div style={styles.spinner}></div>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#60A5FA"/>
                </svg>
                Preview Audience
              </>
            )}
          </button>
          
          {audienceSize !== null && (
            <div style={styles.audiencePreview}>
              <div style={styles.audienceStat}>
                <div style={styles.statValue}>{audienceSize}</div>
                <div style={styles.statLabel}>Estimated Audience Size</div>
              </div>
            </div>
          )}
        </div>

        <div style={styles.saveContainer}>
          <button
            onClick={saveCampaign}
            disabled={!campaignName.trim() || audienceSize === null || isLoading}
            style={{
              ...styles.saveBtn,
              opacity: (!campaignName.trim() || audienceSize === null) ? 0.6 : 1
            }}
          >
            {isLoading ? (
              <div style={styles.spinner}></div>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
                  <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM12 19C10.34 19 9 17.66 9 16C9 14.34 10.34 13 12 13C13.66 13 15 14.34 15 16C15 17.66 13.66 19 12 19ZM15 9H5V5H15V9Z" fill="#34D399"/>
                </svg>
                Save Campaign
              </>
            )}
          </button>
          
          <div style={styles.requirements}>
            {!campaignName.trim() && (
              <div style={styles.requirementItem}>⚠️ Campaign name is required</div>
            )}
            {audienceSize === null && (
              <div style={styles.requirementItem}>⚠️ Preview audience size first</div>
            )}
          </div>
        </div>
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
    maxWidth: '800px',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  iconContainer: {
    background: 'rgba(96, 165, 250, 0.15)',
    borderRadius: '12px',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1.5rem'
  },
  icon: {
    fontSize: '2.2rem',
    opacity: 0.9
  },
  title: {
    color: '#e0e0e0',
    fontSize: '1.8rem',
    fontWeight: '600',
    margin: 0,
    letterSpacing: '0.5px'
  },
  subtitle: {
    color: '#a0a0c0',
    margin: '0.5rem 0 0 0',
    fontSize: '0.95rem'
  },
  formSection: {
    marginBottom: '2rem',
    padding: '1.5rem',
    background: 'rgba(30, 30, 40, 0.4)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  sectionTitle: {
    color: '#e0e0e0',
    fontSize: '1.2rem',
    fontWeight: '500',
    margin: 0
  },
  tooltip: {
    position: 'relative',
    marginLeft: '10px',
    cursor: 'pointer',
    color: '#60A5FA'
  },
  tooltipText: {
    visibility: 'hidden',
    width: '200px',
    backgroundColor: '#1e1e2a',
    color: '#d0d0d0',
    textAlign: 'center',
    borderRadius: '6px',
    padding: '8px',
    position: 'absolute',
    zIndex: 1,
    bottom: '125%',
    left: '50%',
    marginLeft: '-100px',
    opacity: 0,
    transition: 'opacity 0.3s',
    fontSize: '0.85rem',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  label: {
    display: 'block',
    marginBottom: '0.8rem',
    color: '#a0a0c0',
    fontWeight: '500',
    fontSize: '0.95rem'
  },
  input: {
    width: '100%',
    padding: '0.9rem 1.2rem',
    background: 'rgba(30, 30, 40, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#f0f0f0',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  rulesContainer: {
    marginBottom: '1.5rem'
  },
  ruleBlock: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    background: 'rgba(26, 26, 35, 0.6)',
    borderRadius: '8px',
    padding: '0.8rem',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  conditionContainer: {
    marginRight: '0.8rem',
    width: '80px'
  },
  conditionSelect: {
    width: '100%',
    padding: '0.6rem',
    background: 'rgba(96, 165, 250, 0.15)',
    border: '1px solid rgba(96, 165, 250, 0.3)',
    borderRadius: '6px',
    color: '#60A5FA',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  ruleControls: {
    display: 'flex',
    flex: 1,
    gap: '0.8rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  fieldGroup: {
    display: 'flex',
    gap: '0.8rem',
    flex: 1
  },
  select: {
    flex: 1,
    padding: '0.6rem 0.8rem',
    background: 'rgba(30, 30, 40, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    color: '#f0f0f0',
    fontSize: '0.9rem',
    minWidth: '150px'
  },
  operatorSelect: {
    flex: 1,
    padding: '0.6rem 0.8rem',
    background: 'rgba(30, 30, 40, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    color: '#f0f0f0',
    fontSize: '0.9rem',
    minWidth: '180px'
  },
  valueContainer: {
    display: 'flex',
    gap: '0.8rem',
    alignItems: 'center'
  },
  inputSmall: {
    padding: '0.6rem 0.8rem',
    background: 'rgba(30, 30, 40, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    color: '#f0f0f0',
    fontSize: '0.9rem',
    width: '120px'
  },
  removeBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    transition: 'background 0.2s',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(96, 165, 250, 0.1)',
    color: '#60A5FA',
    border: '1px dashed rgba(96, 165, 250, 0.4)',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  previewBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(96, 165, 250, 0.15)',
    color: '#60A5FA',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '200px'
  },
  audiencePreview: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(30, 30, 40, 0.6)',
    borderRadius: '8px',
    padding: '0.8rem 1.2rem',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  audienceStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statValue: {
    color: '#34D399',
    fontSize: '1.4rem',
    fontWeight: '600'
  },
  statLabel: {
    color: '#a0a0c0',
    fontSize: '0.85rem'
  },
  saveContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1rem'
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(52, 211, 153, 0.15)',
    color: '#34D399',
    border: 'none',
    padding: '0.9rem 1.8rem',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: '500'
  },
  requirements: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },homeButton: {
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
    marginLeft: 'auto', // Aligns the button to the right
  },
  requirementItem: {
    color: '#F87171',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  spinner: {
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    borderTop: '3px solid #60A5FA',
    width: '20px',
    height: '20px',
    animation: 'spin 1s linear infinite',
  }
};

const animationStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
  
  input:focus, select:focus {
    border-color: #60A5FA !important;
  }
  
  button:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }
  
  .addBtn:hover {
    background: rgba(96, 165, 250, 0.2) !important;
  }
  
  .previewBtn:hover {
    background: rgba(96, 165, 250, 0.25) !important;
  }
  
  .saveBtn:hover {
    background: rgba(52, 211, 153, 0.25) !important;
  }
`;

// Inject the animation styles
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = animationStyles;
document.head.appendChild(styleSheet);

export default CampaignBuilder;