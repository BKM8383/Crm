
import { useEffect } from 'react';

const LoginPage = () => {
  useEffect(() => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }, []);

  return <p>Redirecting to Google login...</p>;
};

export default LoginPage;
