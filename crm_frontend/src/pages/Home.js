import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../utils/auth';

const Home = () => {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const userInfo = await checkAuth();
      if (!userInfo) {
        const redirectUri = encodeURIComponent(window.location.href);
        window.location.href = `http://localhost:8080/oauth2/authorization/google?redirect_uri=${redirectUri}`;
      } else {
        setUser(userInfo);
        setChecking(false);
      }
    })();
  }, []);

  const logout = () => {
    window.location.href = 'http://localhost:8080/logout';
  };

  if (checking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f0f15 0%, #1a1a2e 100%)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid rgba(255,255,255,0.1)',
            borderTop: '5px solid #60A5FA',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            color: '#e0e0e0',
            fontSize: '1.2rem',
            fontWeight: '500'
          }}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>Mini-CRM</div>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userEmail}>{user.email}</div>
          </div>
          <button onClick={logout} style={styles.logoutButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="#F87171"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div style={styles.content}>
        <h1 style={styles.welcomeTitle}>Welcome to Mini-CRM</h1>
        <p style={styles.subtitle}>Manage your marketing campaigns with ease</p>
        
        <div style={styles.cardsContainer}>
          <div style={styles.card} onClick={() => navigate('/campaigns/new')}>
            <div style={styles.cardIcon} className="create-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#60A5FA"/>
              </svg>
            </div>
            <h3 style={styles.cardTitle}>Create New Campaign</h3>
            <p style={styles.cardText}>Build targeted campaigns with custom audience rules</p>
          </div>
          
          <div style={styles.card} onClick={() => navigate('/campaigns/history')}>
            <div style={styles.cardIcon} className="history-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 15.08L12.5 12.25V7Z" fill="#34D399"/>
              </svg>
            </div>
            <h3 style={styles.cardTitle}>Campaign History</h3>
            <p style={styles.cardText}>View past campaign performance and analytics</p>
          </div>
          
          <div style={styles.card} onClick={() => navigate('/ai/messages')}>
            <div style={styles.cardIcon} className="ai-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 11.5C21 12.29 20.92 13.05 20.77 13.8C19.82 13.27 18.73 13 17.5 13C14.52 13 12 15.02 12 17.5C12 18.73 12.27 19.82 12.8 20.77C12.2 20.92 11.4 21 10.5 21C5.5 21 1.5 17 1.5 12C1.5 7 5.5 3 10.5 3C15.5 3 19.5 7 19.5 12V12.5C20.17 12.5 20.83 12.5 21 12.5V11.5Z" fill="#A78BFA"/>
              </svg>
            </div>
            <h3 style={styles.cardTitle}>Message Suggestions</h3>
            <p style={styles.cardText}>Get AI-powered messaging recommendations</p>
          </div>
        </div>
        
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>12</div>
            <div style={styles.statLabel}>Active Campaigns</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>24,589</div>
            <div style={styles.statLabel}>Total Audience</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>92.4%</div>
            <div style={styles.statLabel}>Avg. Delivery Rate</div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f15 0%, #1a1a2e 100%)',
    fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', sans-serif",
    color: '#e0e0e0'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    background: 'rgba(18, 18, 24, 0.8)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)'
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: '700',
    background: 'linear-gradient(90deg, #60A5FA, #A78BFA)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #60A5FA, #34D399)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#121212'
  },
  userName: {
    fontWeight: '600',
    fontSize: '1.1rem'
  },
  userEmail: {
    fontSize: '0.9rem',
    color: '#a0a0c0'
  },
  logoutButton: {
    background: 'rgba(248, 113, 113, 0.15)',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '1rem',
    transition: 'all 0.2s ease'
  },
  content: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  welcomeTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    background: 'linear-gradient(90deg, #e0e0e0, #a0a0c0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#a0a0c0',
    marginBottom: '3rem'
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  },
  card: {
    background: 'rgba(26, 26, 35, 0.6)',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  cardIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    background: 'rgba(30, 30, 40, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0.8rem'
  },
  cardText: {
    color: '#a0a0c0',
    lineHeight: '1.6'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem'
  },
  statCard: {
    background: 'rgba(26, 26, 35, 0.6)',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center'
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    background: 'linear-gradient(90deg, #60A5FA, #34D399)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  statLabel: {
    fontSize: '1rem',
    color: '#a0a0c0'
  },
  footer: {
    padding: '1.5rem 2rem',
    background: 'rgba(18, 18, 24, 0.8)',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    marginTop: '3rem'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: '#a0a0c0'
  },
  footerLinks: {
    display: 'flex',
    gap: '1.5rem'
  },
  footerLink: {
    color: '#a0a0c0',
    textDecoration: 'none',
    transition: 'color 0.2s ease'
  }
};

const animationStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    border-color: rgba(96, 165, 250, 0.3);
  }
  
  .create-icon {
    background: rgba(96, 165, 250, 0.1) !important;
  }
  
  .history-icon {
    background: rgba(52, 211, 153, 0.1) !important;
  }
  
  .ai-icon {
    background: rgba(167, 139, 250, 0.1) !important;
  }
  
  .logoutButton:hover {
    background: rgba(248, 113, 113, 0.25) !important;
    transform: scale(1.05);
  }
  
  .footerLink:hover {
    color: #60A5FA;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = animationStyles;
document.head.appendChild(styleSheet);

export default Home;