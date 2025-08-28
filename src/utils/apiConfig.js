// Global API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://fistgym-v2.onrender.com'
  : 'http://localhost:3001';

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// For backward compatibility, export the base URL
export { API_BASE_URL };

// Override fetch to automatically use the correct base URL
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (typeof url === 'string') {
    // Replace any hardcoded localhost base
    if (url.includes('http://localhost:3001')) {
      url = url.replace('http://localhost:3001', API_BASE_URL);
    }
    // If URL starts with known backend routes, prepend the base URL
    const shouldPrepend = (
      url.startsWith('/api') ||
      url.startsWith('/login') ||
      url.startsWith('/verify-password') ||
      url.startsWith('/register') ||
      url.startsWith('/logout')
    );
    if (shouldPrepend) {
      url = `${API_BASE_URL}${url}`;
    }
  }
  return originalFetch.call(this, url, options);
};

export default API_BASE_URL;
