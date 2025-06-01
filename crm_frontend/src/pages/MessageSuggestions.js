import React, { useState } from 'react';
import axios from 'axios';

const MessageSuggestions = () => {
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

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🤖 AI Message Suggestions</h2>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. bring back inactive users"
        style={{ padding: '0.5rem', width: '60%', marginBottom: '1rem' }}
      />
      <br />
      <button onClick={getSuggestions} disabled={loading}>
        {loading ? 'Generating...' : '🎯 Get Suggestions'}
      </button>

      {messages.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h4>Suggested Messages:</h4>
          <ul>
            {messages.map((msg, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MessageSuggestions;
