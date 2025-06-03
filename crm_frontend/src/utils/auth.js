import axios from 'axios';

export const checkAuth = async () => {
  try {
    const res = await axios.get('/api/user');
    console.log('Auth check successful:', res.data);
    return res.data;
  } catch (err) {
    console.error('Auth check failed:', err.response?.status, err.response?.data);
    return null;
  }
};
