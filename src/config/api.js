const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://fist-gym-website.onrender.com'
  : 'http://localhost:3001';

export { API_BASE_URL };
