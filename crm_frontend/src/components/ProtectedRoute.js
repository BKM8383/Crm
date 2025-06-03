import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await checkAuth();
      if (!user) {
        navigate('/');
      } else {
        setChecking(false);
      }
    })();
  }, [navigate]);

  if (checking) {
    return <p> Checking authentication...</p>;
  }
  return children;
};

export default ProtectedRoute;
