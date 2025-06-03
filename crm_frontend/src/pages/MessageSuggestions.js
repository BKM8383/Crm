import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const MessageSuggestions = () => {
  const navigate = useNavigate(); 
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/ai/suggest-messages', {
        prompt: prompt.trim()
      });
      setMessages(response.data);
    } catch (err) {
      console.error('AI error:', err);
      setMessages(['❌ Error generating suggestions']);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      getSuggestions();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.header}>🤖 AI Message Suggestions</h2>
        <button 
          onClick={() => navigate('/')} 
          style={styles.homeButton}
        >
          ← Back to Home
        </button>
      </div>
      
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g. bring back inactive users"
          style={styles.input}
          disabled={loading}
        />
        <button 
          onClick={getSuggestions} 
          disabled={loading}
          style={loading ? styles.buttonDisabled : styles.button}
        >
          <span style={styles.buttonContent}>
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Generating...
              </>
            ) : (
              '🎯 Get Suggestions'
            )}
          </span>
        </button>
      </div>

      {messages.length > 0 && (
        <div style={styles.resultsContainer}>
          <h4 style={styles.subheader}>Suggested Messages:</h4>
          <ul style={styles.list}>
            {messages.map((msg, index) => (
              <li key={index} style={styles.listItem}>
                <div style={styles.messageCard}>
                  <span style={styles.messageText}>{msg}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#121212',
    color: '#e0e0e0',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative'
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
    gap: '1rem',
    borderBottom: '1px solid #333',
    paddingBottom: '1rem'
  },
  header: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0
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
  },
  inputContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    maxWidth: '800px'
  },
  input: {
    padding: '0.8rem 1rem',
    flex: '1',
    border: '1px solid #333',
    borderRadius: '8px',
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  button: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#4b5563',
    color: '#9ca3af',
    border: 'none',
    borderRadius: '8px',
    cursor: 'not-allowed',
    fontSize: '1rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  spinner: {
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTop: '2px solid #fff',
    width: '16px',
    height: '16px',
    animation: 'spin 1s linear infinite',
  },
  resultsContainer: {
    marginTop: '2rem',
    maxWidth: '800px'
  },
  subheader: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    fontWeight: '500',
    color: '#d1d5db'
  },
  list: {
    listStyleType: 'none',
    padding: '0',
    margin: '0'
  },
  listItem: {
    marginBottom: '1rem',
    animation: 'fadeIn 0.3s ease-out'
  },
  messageCard: {
    backgroundColor: '#1f2937',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    borderLeft: '3px solid #6366f1',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)'
    }
  },
  messageText: {
    lineHeight: '1.5',
    fontSize: '1rem'
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(10px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' }
  }
};

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`);
styleSheet.insertRule(`
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`);

export default MessageSuggestions;